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

This project is configured for the repository name `kindred-calender`.

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
git remote add origin https://github.com/<your-username>/kindred-calender.git
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

`https://<your-username>.github.io/kindred-calender/`

## Notes

- If your repository name changes, update `base` in `vite.config.ts`.
- If `npm run deploy` fails first time, run `npm install` again and retry.
