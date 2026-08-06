#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const skillsDir = path.join(__dirname, "..", "skills", "composio");
const skillFile = path.join(skillsDir, "SKILL.md");
const outputFile = path.join(skillsDir, "AGENTS.md");

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return { frontmatter: {}, body: content };

  const frontmatter = {};
  for (const line of match[1].split("\n")) {
    const [key, ...valueParts] = line.split(":");
    if (key && valueParts.length > 0) {
      frontmatter[key.trim()] = valueParts.join(":").trim();
    }
  }

  return {
    frontmatter,
    body: content.slice(match[0].length).trim(),
  };
}

function collectReferences(body) {
  const references = [];
  const seen = new Set();
  const referencePattern =
    /\[([^\]]+)\]\(((?:references|rules)\/[^)]+\.md)\)/g;
  let match;

  while ((match = referencePattern.exec(body)) !== null) {
    const [, title, relativePath] = match;
    if (!seen.has(relativePath)) {
      seen.add(relativePath);
      references.push({ title, relativePath });
    }
  }

  return references;
}

function buildAgents() {
  const source = fs.readFileSync(skillFile, "utf8");
  const { frontmatter, body } = parseFrontmatter(source);
  const references = collectReferences(body);

  let output = "---\n";
  for (const [key, value] of Object.entries(frontmatter)) {
    output += `${key}: ${value}\n`;
  }
  output += "---\n\n";
  output += `${body}\n`;

  if (references.length > 0) {
    output += "\n---\n\n## Bundled references\n";
  }

  for (const reference of references) {
    const referenceFile = path.join(skillsDir, reference.relativePath);
    if (!fs.existsSync(referenceFile)) {
      throw new Error(`Missing referenced file: ${reference.relativePath}`);
    }

    const parsed = parseFrontmatter(fs.readFileSync(referenceFile, "utf8"));
    const referenceBody = parsed.body.replace(/^# .+\n+/, "");
    output += `\n### ${reference.title}\n\n${referenceBody.trim()}\n`;
  }

  fs.writeFileSync(outputFile, `${output.trim()}\n`);
  console.log(`Built ${path.relative(process.cwd(), outputFile)}`);
  console.log(`Bundled ${references.length} referenced files`);
}

buildAgents();
