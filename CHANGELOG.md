# Changelog

## [1.1.0] - 2026-05-24

### Added

- Auth mit Rollen (admin, editor, viewer) und Login-Seite
- API + SQLite-Persistenz (Uploads, Verträge, Score Cards, Branding)
- Lizenz-/Wartungsprüfung mit Schreibschutz bei Ablauf
- Admin-Einstellungen: Benutzer, Branding, Upload-Historie, Audit-Log
- Excel-Validierungsreport und konfigurierbares Spalten-Mapping
- Docker Compose für Self-Hosted Deployment
- Desktop-Dev: `npm run dev` startet Web + API parallel
- AI-Config: Default `gemini-2.5-flash` (kein OpenRouter/Free-Tier)

### Changed

- Verträge und Score Cards aus Datenbank statt nur statische TS-Dateien

## [1.0.0] - Initial

- Referenz-Demo: Dashboard, Networks, Contracts, Score Card, Archive
