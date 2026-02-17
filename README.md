# DevOps Tools Portfolio

A static portfolio page showcasing DevOps tools knowledge, designed to be shared with international recruiters.

## 🚀 Live Demo

Once deployed, your portfolio will be available at:
`https://<your-username>.github.io/<repository-name>/`

## 📦 Setup — Deploy to GitHub Pages

### Step 1: Create a new GitHub repository

Create a new **public** repository on GitHub (e.g. `devops-tools-portfolio`).

### Step 2: Push this project

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **GitHub Actions**
4. Click **Save**

### Step 4: Trigger the workflow

The workflow runs automatically on every push to `main`.
You can also trigger it manually: **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

That's it! Your portfolio will be live in ~1 minute. ✅

---

## 🛠️ Customising Your Tools

All tool data is embedded directly in `index.html` inside the `TOOLS` array (JavaScript).

Each tool entry looks like this:

```js
{ name:"Git", logo:"https://...", status:"comfortable", category:"Version Control & Collaboration" }
```

### Status values

| Status | Meaning |
|---|---|
| `comfortable` | I've used this in production and feel confident |
| `used` | I've worked with it but want more depth |
| `plan` | I plan to learn / study this tool |

### Adding a new tool

Just add a new object to the `TOOLS` array in `index.html`:

```js
{ name:"My Tool", logo:"https://link-to-logo.png", status:"plan", category:"CI/CD & Deploy Automation" }
```

### Available categories

- Version Control & Collaboration
- Operating Systems & Automation
- Containers & Orchestration
- CI/CD & Deploy Automation
- Storage & Volumes
- Cluster Management Platforms
- Monitoring & Observability
- Cloud Providers
- Compliance & Security

---

## ✨ Features

- Fully static — no backend, no JSON files to serve
- Filter by status (Comfortable / Learning / Planned)
- Live stats counters
- Dark theme with subtle grid background
- Responsive — works on mobile, tablet, desktop
- Auto-deploys via GitHub Actions on every push to `main`
