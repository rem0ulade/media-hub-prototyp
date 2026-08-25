# Management Hub — Referenz-App

**Muster und Live-Demo** für das SaaS-Angebot: maßgeschneiderte Web-Apps, die Rohdaten in übersichtliche Management-Oberflächen verwandeln. Der Fokus liegt aktuell auf **Excel** als Datenquelle — Upload im Browser, sofortige Auswertung, ohne Backend.

Die Demo zeigt einen typischen Anwendungsfall (Partner-Reporting mit Umsätzen, Pacing, Verträgen und Score Cards). Struktur, UI und Datenmodell lassen sich für beliebige Branchen und Kennzahlen anpassen.

---

## Was diese App leistet

| Bereich | Beschreibung |
|--------|----------------|
| **Dashboard** | Management-Übersicht mit KPI-Karten, Umsatz-Charts (CY vs. PY), Top-Partner, Pacing, Scorecard-Snapshot und Vertragshinweisen |
| **Partner** | Detailansicht: klassische Umsätze, Trading, Partner-Fee, Zusatzleistungen, Notizen — Tabellen auf Desktop, Karten auf Mobile |
| **Vertragsmanagement** | Digitale Vertragsübersicht mit Suche, Status- und Typ-Filtern, aufklappbaren Detailkarten |
| **Partner Scorecard** | Bewertung mit Gesamtscore (0–100) und 6 Kategorien (Umsatzentwicklung, Pacing, Marge, Zusatzleistungen, Trading, Vertrags-Compliance) |
| **Archiv & Export** | Vertragsarchiv mit Suche/Filter sowie CSV- und JSON-Export |

**Datenfluss:** Beim Start werden Demo-Daten geladen. Über **Upload Excel** im Header können Zahlen aus einer `.xlsx`-Datei eingelesen werden; Dashboard und Partner reagieren live darauf. Verträge und Score Cards nutzen in der Demo Beispieldaten (erweiterbar).

---

## Für wen ist das gedacht?

- **Potenzielle Kunden** — sehen Funktionsumfang, UX und „Excel → Dashboard“-Workflow
- **Intern** — als Startpunkt für kundenspezifische Hubs (Branding, KPIs, Sheets)
- **Entwicklung** — als White-Label-Basis: eine zentrale Brand-Config, austauschbare Demo-Daten, vorbereiteter Excel-Parser

---

## Tech Stack

| Technologie | Einsatz |
|-------------|---------|
| **Vite** + **React 19** + **TypeScript** | SPA, schneller Build |
| **Tailwind CSS v4** + **shadcn/ui** | Dark Executive UI, responsive |
| **React Router** | Multi-Page-Navigation |
| **Recharts** | Diagramme (Balken, Fläche, Donut) |
| **SheetJS (`xlsx`)** | Excel-Import im Browser |
| **Biome** | Lint & Format |

**Architektur:** React-SPA + lokale API (Hono + SQLite). Self-Hosted per Docker beim Kunden. Excel-Parsing im Browser; persistierte JSON-Daten auf dem Server.

Siehe [`docs/INSTALL.md`](docs/INSTALL.md), [`docs/DEPLOY_GITHUB_PAGES.md`](docs/DEPLOY_GITHUB_PAGES.md), [`docs/BRANDING.md`](docs/BRANDING.md), [`docs/SECURITY.md`](docs/SECURITY.md), [`docs/LICENSE.md`](docs/LICENSE.md).

### GitHub Pages (Demo / Sales)

Push auf `main` → GitHub Actions baut die App und veröffentlicht sie auf GitHub Pages:

| Variante | URL | Beschreibung |
|----------|-----|--------------|
| **MediaHub** | https://rem0ulade.github.io/media-hub-prototyp/ | White-Label-Referenz mit Demo-Banner |

Details: [`docs/DEPLOY_GITHUB_PAGES.md`](docs/DEPLOY_GITHUB_PAGES.md)

### Self-Host (Kunden mit Lizenz)

Docker beim Kunden — persistente Daten, siehe [`docs/INSTALL.md`](docs/INSTALL.md).

---

## Getting Started (Desktop)

```bash
npm install
npm run dev
```

- **Web:** http://127.0.0.1:5173/media-hub-prototyp/  
- **API:** http://localhost:3001 (SQLite unter `./data/hub.db`)  
- **Login:** `demo@mediahub.preview` / `MediaHub-Demo-7xK2mQ`

Einzeln starten: `npm run dev:web` oder `npm run dev:api`

Weitere Scripts:

```bash
npm run build      # Production-Build
npm run preview    # Build lokal testen
npm run check      # Biome (Lint + Format)
npm run typecheck  # TypeScript ohne Emit
```

---

## Excel-Upload

Unterstützte Formate: `.xlsx`, `.xls`, `.csv`

Der Parser sucht Sheets anhand von Namen (Groß-/Kleinschreibung egal):

| Sheet (Suchbegriffe) | Inhalt |
|----------------------|--------|
| `Classic`, `IO & PC`, `IO` | Klassische Umsätze + Trading (Hauptblatt) |
| `Programmatic`, `PC` | Trading Programmatic (optional) |
| `Fee`, `Partner-Fee` | Partner-Fee (optional) |
| `Zusatzleistungen`, `Extras` | Zusatzleistungen (optional) |

**Erwartete Spalten (Beispiele)** — flexible Aliase in Klammern:

- **Klassisch:** `Network`, `Brutto PY`, `Netto PY`, `Marge PY`, `Brutto CY`, `Netto CY`, `Marge CY`
- **Trading:** `Tr Brutto PY`, `Tr Netto PY`, `Plan Brutto`, `Plan Netto`, `IST Brutto`, `IST Netto`
- **Partner-Fee:** `Netto CY`, `Fee`, `Fee-Art`
- **Zusatzleistungen:** `Events`, `Promotion`, `Research`, `Sonstiges`

Zeilen mit `Gesamt` / `Total` werden ignoriert. Fehlen Sheets oder Spalten, bleiben die jeweiligen Demo-Daten aktiv.

---

## Projektstruktur

```
src/
├── config/brand.ts          # White-Label: Name, Tagline, Export-Dateiname, …
├── contexts/
│   └── DashboardDataContext.tsx   # State, Excel-Upload, Totals
├── data/
│   ├── networkData.ts       # Demo-Netzwerkdaten (12 Partner)
│   ├── contractData.ts      # Demo-Verträge
│   ├── scorecardData.ts     # Demo-Score Cards
│   └── excelSync.ts         # Typen, Totals-Berechnung, Sync-Stubs
├── pages/                   # Dashboard, Networks, Contracts, Scorecard, Backup
├── components/              # Layout, Header, Sidebar, UI (shadcn)
└── lib/                     # Formatter, Utils
```

---

## Anpassung für Kunden (White-Label)

1. **`src/config/presets/`** — Brand-Presets (MediaHub, weitere Kunden)
2. **`src/index.css`** — Farben
3. **`src/data/*.ts`** — Demo-Daten und ggf. Score-Card-Kategorien
4. **`DashboardDataContext.tsx`** — Spalten-Mapping für kundenspezifische Excel-Layouts

Logo, Sidebar und Texte ziehen aus dem aktiven Brand-Preset. Details: [`docs/BRANDING.md`](docs/BRANDING.md).

---

## Demo vs. Produktion

| Feature | Demo (dieses Repo) | Produktions-Hub |
|---------|-------------------|-----------------|
| Zahlen-Dashboard & Partner | Excel-Upload + Demo-Fallback | Excel, API oder geplanter Auto-Sync |
| Verträge & Score Card | Statische JSON-Daten | CRM, DMS oder eigene API |
| Auth & Multi-User | Demo-Logins | nach Bedarf |
| Hosting | Statisch | wie vereinbart |

Die Datei `excelSync.ts` enthält bereits Interfaces und Stubs für späteren Datei-/Interval-Sync — die aktive Logik liegt in `DashboardDataContext`.

---

## Lizenz & Hinweis

Dieses Repository ist eine **Referenz-Implementierung** für das kommerzielle SaaS-Angebot. Inhalte und Kennzahlen in der Demo sind fiktive Beispieldaten und lassen sich nicht auf reale Kundenwerte zurückrechnen.
