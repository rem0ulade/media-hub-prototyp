# Branding — MediaHub

Die öffentliche Demo nutzt **ein Build** mit dem MediaHub-Preset.

| Variante | URL-Pfad | Theme |
|----------|----------|-------|
| MediaHub (Basis) | `/` | Blau (`src/index.css`) |

## Preset

Konfiguration in `src/config/presets/base.ts`.

Wichtige Felder in `BrandPreset`:

| Feld | Beschreibung |
|------|--------------|
| `companyName` | Anzeigename in Sidebar & Header |
| `tagline` | Untertitel auf Login |
| `platformLabel` | Plattform-Badge im Dashboard |
| `pageTitle` | Browser-Titel (wenn kein Demo-Banner) |
| `showDemoChrome` | Demo-Banner in der App + ausführlicher Login-Hinweis |
| `demoAccounts` | Zugangsdaten für statische Demo |
| `theme` | CSS `data-brand` Attribut |

## Theme-Tokens

MediaHub mappt `burgundy-*` auf **Blau**. Charts nutzen `var(--chart-1)` etc.

## Login-Verhalten

| Brand | Demo-Banner | Zugangsdaten auf Login |
|-------|-------------|------------------------|
| MediaHub | Ja (ausführlich) | Ja |

## Favicon

- MediaHub: `public/favicon.svg` (blau)

## Neue Kunden-Variante anlegen

1. Preset in `src/config/presets/<kunde>.ts` anlegen
2. In `presets/index.ts` und `BrandPresetContext` registrieren
3. Route in `App.tsx` hinzufügen (z. B. `/Kunde/*`)
4. Optional: eigenes Theme in `src/themes/<kunde>.css`
5. Demo-Accounts in `shared/demo-credentials.ts`

## GitHub Pages

Ein Build, eine URL — siehe [`DEPLOY_GITHUB_PAGES.md`](./DEPLOY_GITHUB_PAGES.md).
