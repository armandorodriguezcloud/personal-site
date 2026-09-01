# armandorodriguez.cloud — personal site

Single-page résumé/portfolio site plus a Markdown-powered blog.
Deploys to Azure Static Web Apps (GitHub Actions builds the blog, then uploads).

## Blog — how to add a post

1. Create a Markdown file in `blog/posts/`, named `YYYY-MM-DD-slug.md`, e.g.
   `blog/posts/2026-07-10-building-my-edge-ai-lab.md`.
2. Start it with frontmatter, then write the body in Markdown:

   ```
   ---
   title: Building My Edge AI Lab
   date: 2026-07-10
   excerpt: One or two sentences shown on the card and blog index.
   tags: Edge AI, NVIDIA, Homelab
   ---

   Your post content here. Headings, **bold**, `code`, lists, links, images all work.
   ```
3. Commit and push. The GitHub Action runs `npm run build`, which renders the post to
   `blog/<slug>.html`, rebuilds `blog/index.html`, and updates `blog/posts.json`
   (the homepage "Writing" section reads the latest 3 from that file).

Preview locally before pushing: `npm install` once, then `npm run build` and open the site
(`python -m http.server` in this folder). Generated files (`blog/*.html`, `blog/posts.json`)
are git-ignored and produced fresh by CI.

## Files
- `index.html` — the whole site
- `staticwebapp.config.json` — Azure Static Web Apps config (routing, headers, PDF mime type)
- `resume.pdf` — **you add this** (the "Download Résumé" buttons link to it). Export your
  `Armando Rodriguez Resume 2026.docx` from Word → Save As → PDF, name it `resume.pdf`,
  and drop it in this folder.

---

## Recommended setup: Azure Static Web Apps + Cloudflare DNS/email

### 1. Register the domain
Buy `armandorodriguez.cloud` (Cloudflare Registrar, Namecheap, Porkbun, etc. — ~$10–20/yr).
Easiest path: register it **at Cloudflare** so DNS + email are in one place.

### 2. Put the site in a GitHub repo
```bash
cd "C:/Users/arman/personal-site"
git init
git add .
git commit -m "Personal site"
# create an empty repo on github.com, then:
git remote add origin https://github.com/<you>/personal-site.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Azure Static Web Apps (free tier)
1. Azure Portal → **Create a resource** → **Static Web App**.
2. Plan type: **Free**.
3. Source: **GitHub** → authorize → pick your `personal-site` repo, branch `main`.
4. Build presets: **Custom**. App location: `/`. Api location: *(blank)*. Output location: `/`.
5. Create. Azure adds a GitHub Action and deploys on every push. You get a URL like
   `https://nice-name-123.azurestaticapps.net`.

### 4. Custom domain
1. In the Static Web App → **Custom domains** → **Add** → `www.armandorodriguez.cloud`.
2. Azure shows a **CNAME** target. In Cloudflare DNS, add:
   - `CNAME  www  <your-app>.azurestaticapps.net`  (DNS only / grey cloud during validation)
   - Apex `armandorodriguez.cloud` → use a Cloudflare **CNAME flattening** record to the same target,
     or set up an Azure apex (TXT validation). Easiest: redirect apex → www via a Cloudflare Redirect Rule.
3. Validate in Azure. SSL is automatic and free.

### 5. Professional email (armando@armandorodriguez.cloud)
**Cloudflare Email Routing (free, receive-only forwarding):**
1. Cloudflare dashboard → your domain → **Email** → **Email Routing** → enable.
2. It auto-adds the MX/TXT records.
3. Create address `armando@armandorodriguez.cloud` → forward to your Gmail.

To **send** from that address too: either reply via Gmail "Send mail as" (with an SMTP relay),
or upgrade to **Google Workspace** (~$6/user/mo) / **Microsoft 365** for a real mailbox.

---

## Alternative hosts (same files, simpler)
- **Cloudflare Pages** — one provider for DNS + email + hosting. Connect the GitHub repo, framework
  preset "None", build output `/`. Add the custom domain in Pages.
- **GitHub Pages** — repo Settings → Pages → deploy from `main` / root. Add a `CNAME` file with
  `armandorodriguez.cloud` and point DNS to GitHub's IPs.

## Local preview
Just open `index.html` in a browser, or:
```bash
cd "C:/Users/arman/personal-site" && python -m http.server 8080
# visit http://localhost:8080
```
