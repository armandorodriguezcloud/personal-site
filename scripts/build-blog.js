/*
 * build-blog.js
 * Renders Markdown posts in blog/posts/*.md into styled static HTML pages,
 * a blog index page, and blog/posts.json (consumed by the homepage).
 * No framework. Run: npm run build
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { marked } from "marked";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const postsDir = path.join(root, "blog", "posts");
const blogDir = path.join(root, "blog");

marked.setOptions({ mangle: false, headerIds: true, gfm: true, breaks: false });

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const FAVICON =
  "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='22' fill='%230b1220'/><text x='50' y='68' font-size='52' font-family='Arial' font-weight='bold' fill='%2338bdf8' text-anchor='middle'>AR</text></svg>";

const FONTS =
  '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">';

function parseFrontmatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    const key = line.slice(0, i).trim();
    const val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    data[key] = val;
  }
  return { data, body: m[2] };
}

function fmtDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return d || "";
  return dt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function readPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), "utf8");
      const { data, body } = parseFrontmatter(raw);
      const slug = (data.slug || file.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "")).trim();
      const date = data.date || (file.match(/^(\d{4}-\d{2}-\d{2})/) || [])[1] || "";
      const tags = (data.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
      return {
        slug,
        title: data.title || slug,
        date,
        excerpt: data.excerpt || "",
        tags,
        html: marked.parse(body),
        url: `/blog/${slug}.html`,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function pageShell({ title, description, body }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="icon" href="${FAVICON}">
${FONTS}
<link rel="stylesheet" href="/blog/blog.css">
</head>
<body>
<header class="bhead"><div class="bwrap">
  <a class="bback" href="/">&larr; Armando Rodriguez</a>
  <a class="bback" href="/blog/">All posts</a>
</div></header>
${body}
<footer class="bfoot"><div class="bwrap">&copy; ${new Date().getFullYear()} Armando Rodriguez &middot; <a href="/">armandorodriguez.cloud</a></div></footer>
</body>
</html>`;
}

function postPage(p) {
  const tags = p.tags.map((t) => `<span class="ptag">${esc(t)}</span>`).join("");
  const body = `<main class="bwrap article">
  <a class="bkicker" href="/blog/">Writing</a>
  <h1>${esc(p.title)}</h1>
  <div class="bmeta">${esc(fmtDate(p.date))}</div>
  <div class="btags">${tags}</div>
  <article class="prose">${p.html}</article>
</main>`;
  return pageShell({ title: `${p.title} — Armando Rodriguez`, description: p.excerpt || p.title, body });
}

function indexPage(posts) {
  const cards = posts
    .map(
      (p) => `    <a class="bcard" href="${p.url}">
      <div class="bcard-date">${esc(fmtDate(p.date))}</div>
      <h2>${esc(p.title)}</h2>
      <p>${esc(p.excerpt)}</p>
      <div class="btags">${p.tags.map((t) => `<span class="ptag">${esc(t)}</span>`).join("")}</div>
    </a>`
    )
    .join("\n");
  const body = `<main class="bwrap blist">
  <div class="bkicker">Writing</div>
  <h1>Blog</h1>
  <p class="bintro">Notes on cloud, edge AI, infrastructure, and what I'm building in the lab.</p>
  <div class="bcards">
${cards || '<p class="bintro">First post coming soon.</p>'}
  </div>
</main>`;
  return pageShell({ title: "Blog — Armando Rodriguez", description: "Writing on cloud, edge AI, and infrastructure by Armando Rodriguez.", body });
}

function build() {
  fs.mkdirSync(postsDir, { recursive: true });
  const posts = readPosts();

  for (const p of posts) {
    fs.writeFileSync(path.join(blogDir, `${p.slug}.html`), postPage(p));
  }
  fs.writeFileSync(path.join(blogDir, "index.html"), indexPage(posts));
  fs.writeFileSync(
    path.join(blogDir, "posts.json"),
    JSON.stringify(
      posts.map(({ slug, title, date, excerpt, tags, url }) => ({
        slug,
        title,
        date: fmtDate(date),
        excerpt,
        tags,
        url,
      })),
      null,
      2
    )
  );
  console.log(`Built ${posts.length} post(s) -> ${path.relative(root, blogDir)}`);
}

build();
