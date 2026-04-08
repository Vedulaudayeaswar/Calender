# Kindred Calendar

Interactive seasonal calendar built with React, Vite, Tailwind CSS, Framer Motion, and Three.js.

Author: Vedula Uday Easwar

## Local Development

Run these commands in Git Bash:

```bash
cd /c/Users/padma/Downloads/kindred-calender/kindred-calender
npm install
npm run dev
```

## Deploy to GitHub Pages

This project is configured for the repository name `Calender`.

### 1. One-time setup

```bash
cd /c/Users/padma/Downloads/kindred-calender/kindred-calender
npm install
```

### 2. Push source code to GitHub

If this is the first push and remote is not set yet:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Vedulaudayeaswar/Calender.git
git push -u origin main
```

For later updates:

```bash
git add .
git commit -m "Update calendar"
git push
```

### 3. Publish website

```bash
npm run deploy
```

This publishes the built app from `dist` to the `gh-pages` branch.

### 4. Enable GitHub Pages

In your GitHub repository settings:

1. Go to Settings -> Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` and folder `/ (root)`
4. Save

Your live URL will be:

`https://Vedulaudayeaswar.github.io/Calender/`

## Notes

- `npm run build` now generates output for root hosting (`/`) which is ideal for Render.
- `npm run deploy` builds in `gh-pages` mode and publishes with `/Calender/` base path.
- If `npm run deploy` fails first time, run `npm install` again and retry.

## Deploy to Render (Static Site)

Render works well for this project.

### 1. Push latest code to GitHub

```bash
git add .
git commit -m "Prepare Render deployment"
git push
```

### 2. Create a Static Site in Render

1. Open Render Dashboard -> New -> Static Site
2. Connect repository: `Vedulaudayeaswar/Calender`
3. Use these settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`

### 3. Deploy

Click Create Static Site. Render gives you a live URL like:

`https://your-app-name.onrender.com`
