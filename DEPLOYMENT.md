# Deployment Guide

## Quick Start

### Build and Run
```bash
docker-compose up -d
```

The app will be available at `http://localhost:8080` (or `http://your-server-ip:8080`).

### Stop the App
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## Configuration

### Change Port
Edit `docker-compose.yml` and modify the port mapping:
```yaml
ports:
  - "3001:3000"  # Maps port 3001 on host to port 3000 in container
```

Default is `8080:3000`.

### Database Persistence
The SQLite database is stored in `./data/database.db` on your host machine. This directory is automatically created and mounted to the container.

To backup your data:
```bash
cp ./data/database.db ./data/database.db.backup
```

### Environment Variables
You can modify these in `docker-compose.yml`:
- `NODE_ENV`: Set to `production` (default)
- `PORT`: Internal container port (default: 3000)
- `CORS_ORIGIN`: Set to `*` to allow all origins, or specify your domain

## Health Check
The container includes a Node-based health check that queries `/health` every 30 seconds. Check container health:
```bash
docker-compose ps
```

Status should show "(healthy)" after ~40 seconds startup period.

## Updating the Application

1. Pull latest code
2. Rebuild and restart:
```bash
docker-compose up -d --build
```

Your database will persist across updates.

## Troubleshooting

### Container won't start
```bash
docker-compose logs
```

### Database permissions
If you see database errors, ensure the `./data` directory has proper permissions:
```bash
chmod -R 755 ./data
```

### Port already in use
Change the host port in `docker-compose.yml` from `8080:3000` to something else like `3001:3000` or `9000:3000`.

## Reverse Proxy Setup (Optional)

For HTTPS and custom domain, use a reverse proxy like Nginx Proxy Manager or Traefik:

### Example Nginx Proxy Manager Config
- Scheme: `http`
- Forward Hostname / IP: `simple-todo` (container name)
- Forward Port: `3000`
- Enable SSL and configure your domain

### Example Traefik Labels
Add to `docker-compose.yml`:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.todo.rule=Host(`todo.yourdomain.com`)"
  - "traefik.http.routers.todo.entrypoints=websecure"
  - "traefik.http.routers.todo.tls.certresolver=letsencrypt"
```
