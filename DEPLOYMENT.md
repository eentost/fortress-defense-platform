# Fortress Defense Platform - Deployment Guide

## Quick Start

```bash
# Clone the repository
git clone https://github.com/eentost/fortress-defense-platform.git
cd fortress-defense-platform

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
vim .env

# Build and start services
docker-compose up --build

# Access the platform
# Frontend: http://localhost:3000
# API: http://localhost:8080
```

---

## Production Deployment

### 1. Prerequisites

```bash
# Required software
- Docker 24.0+
- Docker Compose 2.20+
- Git
- Minimum 4GB RAM
- Minimum 20GB disk space
```

### 2. Environment Configuration

```bash
# Generate secure secrets
openssl rand -hex 32  # For SECRET_KEY
openssl rand -hex 32  # For JWT_SECRET

# Update .env
DB_PASSWORD=$(openssl rand -hex 16)
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
```

### 3. Database Setup

```bash
# Start PostgreSQL only
docker-compose up -d postgres

# Wait for database to be ready
docker-compose exec postgres pg_isready

# Initialize schema
docker-compose run --rm backend ./fortress-api migrate
```

### 4. Build & Deploy

```bash
# Build all services
docker-compose build

# Start in production mode
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### 5. Verify Deployment

```bash
# Health checks
curl http://localhost:8080/health
curl http://localhost:3000

# API test
curl -X GET http://localhost:8080/api/threats
```

---

## Kubernetes Deployment

### Prerequisites

```bash
- Kubernetes 1.28+
- kubectl configured
- Helm 3.12+
```

### Deploy to Kubernetes

```bash
# Create namespace
kubectl create namespace fortress-defense

# Create secrets
kubectl create secret generic fortress-secrets \
  --from-literal=db-password=$(openssl rand -hex 16) \
  --from-literal=secret-key=$(openssl rand -hex 32) \
  --from-literal=jwt-secret=$(openssl rand -hex 32) \
  -n fortress-defense

# Apply manifests
kubectl apply -f k8s/ -n fortress-defense

# Check deployment
kubectl get pods -n fortress-defense
kubectl get svc -n fortress-defense
```

---

## Security Hardening

### 1. TLS/SSL Configuration

```nginx
# nginx.conf (reverse proxy)
server {
    listen 443 ssl http2;
    server_name fortress.example.com;

    ssl_certificate /etc/ssl/certs/fortress.crt;
    ssl_certificate_key /etc/ssl/private/fortress.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. Firewall Rules

```bash
# Allow only necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 3000/tcp   # Block direct frontend access
sudo ufw deny 8080/tcp   # Block direct API access
sudo ufw deny 5432/tcp   # Block direct database access
sudo ufw enable
```

### 3. Docker Security

```yaml
# docker-compose.yml security enhancements
services:
  backend:
    security_opt:
      - no-new-privileges:true
      - seccomp:unconfined
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
    read_only: true
    user: "1000:1000"
```

---

## Monitoring & Logging

### Prometheus Integration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'fortress-api'
    static_configs:
      - targets: ['backend:8080']
    metrics_path: '/metrics'
```

### Grafana Dashboards

```bash
# Import pre-built dashboard
curl -X POST http://grafana:3000/api/dashboards/db \
  -H "Content-Type: application/json" \
  -d @grafana/fortress-dashboard.json
```

### Centralized Logging

```bash
# Fluentd configuration
docker-compose logs --follow | fluentd -c /etc/fluentd/fluent.conf
```

---

## Backup & Recovery

### Database Backup

```bash
# Automated daily backups
0 2 * * * docker-compose exec -T postgres pg_dump -U fortress_user fortress_db | gzip > /backups/fortress_$(date +\%Y\%m\%d).sql.gz

# Manual backup
docker-compose exec postgres pg_dump -U fortress_user fortress_db > backup.sql
```

### Restore from Backup

```bash
# Stop services
docker-compose down

# Restore database
gunzip < /backups/fortress_20260311.sql.gz | docker-compose exec -T postgres psql -U fortress_user fortress_db

# Restart services
docker-compose up -d
```

---

## Scaling

### Horizontal Scaling

```bash
# Scale API backend
docker-compose up -d --scale backend=3

# Load balancer required (nginx/HAProxy)
```

### Database Replication

```yaml
# PostgreSQL master-slave setup
services:
  postgres-master:
    image: postgres:15
    environment:
      POSTGRES_REPLICATION_MODE: master
  
  postgres-replica:
    image: postgres:15
    environment:
      POSTGRES_REPLICATION_MODE: slave
      POSTGRES_MASTER_HOST: postgres-master
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check postgres is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Test connection
docker-compose exec postgres psql -U fortress_user -d fortress_db
```

#### 2. API Health Check Failing

```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check environment variables
docker-compose exec backend env | grep DB_
```

#### 3. Frontend Not Loading

```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

#### 4. High Memory Usage

```bash
# Check container resource usage
docker stats

# Limit container memory
docker-compose.yml:
  backend:
    mem_limit: 512m
```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=debug
docker-compose up

# Go backend debug
GIN_MODE=debug docker-compose up backend
```

---

## Performance Tuning

### Database Optimization

```sql
-- PostgreSQL tuning
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';

-- Reload configuration
SELECT pg_reload_conf();
```

### API Caching

```go
// Redis caching for threat intelligence
import "github.com/go-redis/redis/v8"

rdb := redis.NewClient(&redis.Options{
    Addr: "redis:6379",
})
```

---

## Maintenance

### Update Procedure

```bash
# 1. Backup database
docker-compose exec postgres pg_dump -U fortress_user fortress_db > pre-update-backup.sql

# 2. Pull latest changes
git pull origin main

# 3. Rebuild containers
docker-compose build

# 4. Rolling restart
docker-compose up -d --no-deps backend
docker-compose up -d --no-deps frontend

# 5. Verify health
curl http://localhost:8080/health
```

### Clean Up

```bash
# Remove old images
docker image prune -a

# Remove old logs
docker-compose logs --tail=0 > /dev/null

# Vacuum database
docker-compose exec postgres vacuumdb -U fortress_user -d fortress_db --analyze
```

---

## Security Checklist

- [ ] Change all default passwords
- [ ] Enable TLS/SSL
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set resource limits
- [ ] Enable RBAC
- [ ] Scan containers for vulnerabilities
- [ ] Review security posture monthly

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/eentost/fortress-defense-platform/issues
- Documentation: See ARCHITECTURE.md and THREAT_MODEL.md
