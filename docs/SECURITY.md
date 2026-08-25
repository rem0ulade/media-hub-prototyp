# Security

## Authentication

- Session-Cookies: `HttpOnly`, `SameSite=Lax`, in Produktion `Secure`
- Passwörter: bcrypt (Cost 10)
- Rollen: `admin`, `editor`, `viewer`

## Empfehlungen für Kunden-IT

- TLS via Reverse-Proxy (nginx, Traefik, Caddy)
- API nicht öffentlich ohne Auth exponieren
- Regelmäßige Backups von `data/hub.db`
- Starke Passwörter; Demo-Zugänge in Produktion löschen oder ändern

## Daten

- Alle Kundendaten liegen in der lokalen SQLite-Datei (Self-Host)
- Kein Telemetrie-Upload ohne explizite Konfiguration
- Excel-Parsing erfolgt im Browser; nur JSON-Ergebnisse werden an die API gesendet

## SSO

Endpoint `GET /api/auth/sso` — derzeit deaktiviert. SAML/OIDC kann pro Kundenprojekt aktiviert werden.
