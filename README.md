# Valentine Website

This repo contains a small Vite + React Valentine website with an interactive landing, countdown, and unlockable letters.

Quick local dev

```powershell
npm install
npm run dev -- --port 5175
# open http://localhost:5175
```

Force-unlock for testing

Open the site with `?forceUnlock=true` to immediately reveal letters and the celebration overlay (useful for testing before Feb 14):

```
http://localhost:5175/?forceUnlock=true
```

How to push and deploy to GitHub (one-time setup)

1. Create a GitHub repository (on github.com).
2. From your project root run:

```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
# replace with your repo HTTPS or SSH URL
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. The included GitHub Actions workflow will automatically build and publish the `dist` folder to GitHub Pages on pushes to `main`.

After deploy your site will be available at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO/
```

Alternatives
- Vercel or Netlify: connect your GitHub repo in their UI; set build command `npm run build` and publish directory `dist`.
- Quick share: run the dev server and expose it with `ngrok`:

```powershell
npm run dev -- --port 5175
npx ngrok http 5175
# share the public ngrok URL
```

Notes
- The repo includes a test flag `?forceUnlock=true` for QA. Remove any dev-only flags before sharing if you want the real date-based unlocking behavior.
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
