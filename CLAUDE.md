# CLAUDE.md — armandorodriguez.cloud (portfolio site + blog)

Context for Claude Code working in this repo. Read this first. (Writing rule: never use em-dashes here or anywhere.)

## What this is
Armando Rodriguez's portfolio site plus a Markdown blog, live at https://armandorodriguez.cloud.
Framework-free static HTML/CSS/JS (a single `index.html`) plus a small Node build for the blog.
Repo: `github.com/armandorodriguezcloud/personal-site` (GitHub account: `armandorodriguezcloud`).

## How it deploys (it is simple, do not overthink it)
- Host: Azure Static Web Apps, Free tier. Resource group `rg-personal-site`, app `armando-portfolio`, region eastus2.
- DNS: Cloudflare (domain `armandorodriguez.cloud`). Apex is validated via a TXT token plus a flattened CNAME, DNS only (grey cloud).
- CI/CD: pushing to `main` triggers `.github/workflows/azure-static-web-apps-*.yml`, which runs the blog build (`npm install && npm run build`) then uploads. Live in about 1 to 2 minutes.
- Workflow you use: edit, `git add`/`commit`/`push`, it auto-deploys. Verify with a hard refresh; browsers cache `index.html` and `resume.pdf` aggressively (use Ctrl+Shift+R or an incognito window).
- Commit identity: author as `Armando Rodriguez <armando@armandorodriguez.cloud>` (set `git config` locally, below).

## Repo layout
- `index.html` — the entire site: hero, stats, about, expertise, experience timeline, labs, blog teaser ("Writing"), education, certifications, personal, contact. The experience timeline and the labs cards are data-driven inline JS arrays near the bottom of the file.
- `resume.pdf` — the downloadable resume the "Resume" button links to. It is a hand-built PDF the user supplies. To update it, copy a new PDF over `resume.pdf` and push. Do NOT rebuild it from any `build_resume.js`; that script lives elsewhere and produces a different, wrong-looking resume.
- `staticwebapp.config.json` — SWA routing, headers, PDF mime type.
- `blog/blog.css` — blog styles. `blog/posts/*.md` — Markdown post sources.
- `scripts/build-blog.js` + `package.json` — the blog build (one dependency: `marked`). Run `npm run build`.
- Generated `blog/*.html` and `blog/posts.json` are git-ignored and produced by CI (and by `npm run build` locally).

## Blog: how to add a post
1. Create `blog/posts/YYYY-MM-DD-slug.md` with frontmatter, then Markdown body:
   ```
   ---
   title: My Post
   date: 2026-09-10
   excerpt: One or two sentences for the card and index.
   tags: Edge AI, NVIDIA, Homelab
   ---
   Body in Markdown. Headings, bold, code, lists, links, images all work.
   ```
2. Commit and push. CI renders `/blog/<slug>.html`, rebuilds `/blog/index.html`, and updates `posts.json` (the homepage "Writing" section shows the latest 3).
3. Local preview: `npm install` once, then `npm run build`, then serve the folder (`python3 -m http.server 8000`) and open it.

## Writing rules (the user cares about these; follow them)
- NEVER use em-dashes or en-dashes. Use commas, colons, periods, or parentheses; for ranges use "to". Applies to site copy, blog posts, README, and commit messages.
- Every "major accomplishment" on the site or resume must be a real, defensible interview talking point. No padding, no invented metrics. If a card is thin, cut it or ask for the real story.
- Home labs are personal TEST environments, not production and not replicas of production. Never frame them as production.
- Tone: confident but not cocky. He has rejected lines like "the engineer teams call" and "problems everyone else gave up on". Keep it grounded and specific.

## Positioning (2026)
"Solutions Architect | Edge AI & Cloud Infrastructure", Active Secret clearance, DoD. Infrastructure and solutions/problem-solving engineer first, NOT an IaC (Terraform/Bicep) or Sentinel specialist; keep those as supporting detail only, never headline strengths. Leaning into edge AI. Open to Solutions Architect, Cloud Engineer, and Sales Engineer roles.

## Current state (as of 2026-09)
- Flagship lab, Project 01 in Labs: GPU AI Inference Lab (bare-metal Ubuntu, RTX 4090 / i9 / 32GB; NVIDIA driver + CUDA, NVIDIA Container Toolkit, DCGM, NVIDIA NIM on Triton Inference Server, Kubernetes GPU scheduling). Repo `gpu-ai-inference-lab`. Framed present-tense/"building"; upgrade to concrete results (validated driver/CUDA versions, live metrics, serving benchmarks like tokens/sec and latency) as each step lands.
- Cert added: NVIDIA NCA-AIIO (in the Certifications grid and a hero badge).
- Blog is live; first real post: "Building a GPU AI Inference Lab".
- Lab repos, each under `armandorodriguezcloud`: gpu-ai-inference-lab, selfhosted-linux-stack, hybrid-identity-lab, powershell-graph-toolkit, vmware-homelab, cloud-media-server, network-firewall-lab, soc-siem-homelab, observability-stack, backup-dr-lab, ansible-config-management, mcp-ai-automation, personal-site.

## Links used on the site
- Email `armando@armandorodriguez.cloud` (Cloudflare routing to Gmail). Phone (956) 223-8863 (the user wants it kept, including on the public resume).
- LinkedIn `linkedin.com/in/armandorodriguez-sys`. GitHub `github.com/armandorodriguezcloud`.
