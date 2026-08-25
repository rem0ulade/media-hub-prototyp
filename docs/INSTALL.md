# Installation (Self-Hosted)

## Desktop-Entwicklung (schnellster Start)

```bash
npm install
npm run dev
```

- Web: http://localhost:5173  
- API: http://localhost:3001  
- Login: **demo@mediahub.preview** / **MediaHub-Demo-7xK2mQ**

Die SQLite-Datenbank wird automatisch unter `./data/hub.db` angelegt.

## Docker (Produktion beim Kunden)

```bash
cp .env.example .env
# LICENSE_EXPIRES anpassen
docker compose up -d --build
```

- Web: http://localhost:8080  
- API: intern über Nginx-Proxy `/api`

## Backup

```bash
docker compose exec api sh -c 'cp /app/data/hub.db /app/data/hub.db.backup'
```

Oder lokal: `cp data/hub.db data/hub.db.backup`

## Update

1. Neues Release-Image/ZIP entpacken  
2. `docker compose pull && docker compose up -d`  
3. Daten-Volume bleibt erhalten (`hub_data`)

## Ports

| Service | Port |
|---------|------|
| Vite (dev) | 5173 |
| API | 3001 |
| Docker Web | 8080 |
