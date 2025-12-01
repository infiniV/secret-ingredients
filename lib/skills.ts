import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  content: string;
  files: string[];
}

export interface SkillFrontmatter {
  name: string;
  description: string;
  category?: string;
  icon?: string;
}

const SKILLS_DIR = path.join(process.cwd(), "skills");

export function getSkillSlugs(): string[] {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }
  return fs.readdirSync(SKILLS_DIR).filter((name) => {
    const skillPath = path.join(SKILLS_DIR, name);
    return (
      fs.statSync(skillPath).isDirectory() &&
      fs.existsSync(path.join(skillPath, "SKILL.md"))
    );
  });
}

export function getSkillBySlug(slug: string): Skill | null {
  const skillDir = path.join(SKILLS_DIR, slug);
  const skillFile = path.join(skillDir, "SKILL.md");

  if (!fs.existsSync(skillFile)) {
    return null;
  }

  const fileContents = fs.readFileSync(skillFile, "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as SkillFrontmatter;

  const files = getSkillFiles(skillDir);

  return {
    slug,
    name: frontmatter.name,
    description: frontmatter.description,
    category: frontmatter.category || "general",
    icon: frontmatter.icon || "file-text",
    content,
    files,
  };
}

function getSkillFiles(skillDir: string): string[] {
  const files: string[] = [];

  function walkDir(dir: string, prefix = "") {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const relativePath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name), relativePath);
      } else {
        files.push(relativePath);
      }
    }
  }

  walkDir(skillDir);
  return files;
}

export function getAllSkills(): Skill[] {
  const slugs = getSkillSlugs();
  return slugs
    .map((slug) => getSkillBySlug(slug))
    .filter((skill): skill is Skill => skill !== null);
}
