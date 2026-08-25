# Lizenz & Wartung

## Modell

- **Bau-Fee:** Einmalige Individualisierung (Branding, Excel-Mapping, Module)
- **Wartungslizenz:** Updates, Support, technische Freischaltung

## Technische Durchsetzung

Die Wartungslizenz wird in `app_settings` (Key `license`) gespeichert:

- `expiresAt` — Ablaufdatum
- `maintenanceActive` — Wartung aktiv/inaktiv

Bei abgelaufener Lizenz:

- Lesen: erlaubt
- Schreiben (Upload, Verträge, Einstellungen): gesperrt
- Banner in der App

## Konfiguration

`.env`:

```
LICENSE_EXPIRES=2027-12-31T23:59:59.000Z
```

Oder im Admin unter **Einstellungen → Lizenz**.

## Key-Rotation

Neues Ablaufdatum setzen und API neu starten (Docker: `docker compose restart api`).
