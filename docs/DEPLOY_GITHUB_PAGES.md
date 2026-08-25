# Deployment auf GitHub Pages

Statische MediaHub-Demo auf GitHub Pages — ohne Backend.

| Variante | URL |
|----------|-----|
| **MediaHub** | https://rem0ulade.github.io/media-hub-prototyp/ |

## Login

`demo@mediahub.preview` / `MediaHub-Demo-7xK2mQ`

Weitere Rollen: `editor@mediahub.preview`, `viewer@mediahub.preview` (Passwörter analog im Login-Hinweis).

## Build & Deploy

```bash
npm ci
npm run build
cp dist/index.html dist/404.html
```

Preset: `src/config/presets/base.ts`
