# 🧰 DevOps Tooling Portfolio (GitHub Pages)

A lightweight, **static** web app to showcase your DevOps tooling experience as a portfolio.

It is **local-first**:
- The app ships as plain HTML/CSS/JS
- Your edits are saved in your browser using **localStorage**
- You can **export/import JSON** at any time for backups or migration

> Why not persist to a JSON file on GitHub Pages?  
> GitHub Pages is static hosting: it can **serve** files, but it cannot **write** or **save** changes back to the repo from the browser.  
> So persistence is handled client-side (localStorage), and export/import is used for portability.

---

## ✅ Statuses

This version uses 3 portfolio-focused statuses:

- ✅ **Comfortable** (I’ve worked with it and feel confident)
- 🧪 **Used but not comfortable** (I’ve touched it, but I’m not confident yet)
- 🌱 **Plan to learn** (I want to study / gain experience)

You can rename them in `seed-tools.js` if you prefer alternatives like:
- Confident / Familiar / Learning
- Strong / Working knowledge / Next up

---

## 🚀 Run locally

Open `index.html` in your browser.

---

## ✏️ Edit and manage tools

Open `editor.html`:
- Add, edit, delete tools
- Import JSON (adds tools to your current list)
- Export JSON (downloads your current list)
- Reset to defaults (overwrite your list with the seeded data)

---

## 🌍 Deploy to GitHub Pages via GitHub Actions

This repo includes a ready-to-use workflow:

- `.github/workflows/deploy.yml`

### Steps

1. Push the project to a GitHub repository
2. In your repo: **Settings → Pages**
3. Under **Build and deployment**, set **Source** to **GitHub Actions**
4. Push to the `main` branch (or run the workflow manually)

After the workflow finishes, your site will be published.

---

## 🧩 Seed data

- `seed-tools.js` contains `DEFAULT_TOOLS` and the status emojis/labels.
- `tools.seed.json` is included as a readable copy of the default data (the app does not need it).

---

## Tech stack

- HTML + TailwindCSS (CDN)
- Vanilla JavaScript
- localStorage
