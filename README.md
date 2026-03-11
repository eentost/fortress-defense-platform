# Fortress Defense Platform

🛡️ **Enterprise-Grade Full-Stack Threat Defense Platform**

Go Backend | React Frontend | PostgreSQL | Docker Compose

## Overview

Fortress is a production-ready, full-stack cybersecurity platform designed to detect and prevent internal system threats. Built with modern technologies (Go, React, PostgreSQL), it implements OpenClaw Ecosystem's kill chain methodology for comprehensive threat detection and mitigation.

## Tech Stack

### Backend
- **Language**: Go 1.21+
- **Framework**: Gin, GORM
- **Database**: PostgreSQL
- **Message Queue**: Redis
- **Deployment**: Docker

### Frontend
- **Framework**: React 18+
- **State Management**: Redux Toolkit
- **UI**: Material-UI (MUI)
- **Charts**: Recharts
- **Build**: Vite

### Infrastructure
- **Container**: Docker & Docker Compose
- **Orchestration**: Docker Compose
- **Networking**: Custom bridge network

## Project Structure

```
fortress-defense-platform/
├── backend/                    # Go backend service
│   ├── cmd/
│   │   └── server/            # Main application entry
│   ├── internal/
│   │   ├── api/               # API endpoints
│   │   ├── models/            # Data models
│   │   ├── repository/        # Database layer
│   │   ├── service/           # Business logic
│   │   ├── threat/            # Threat detection engine
│   │   └── middleware/        # HTTP middleware
│   ├── migrations/            # Database migrations
│   ├── go.mod
│   └── Dockerfile
│
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Dashboard/     # Main dashboard
│   │   │   ├── ThreatList/    # Threats listing
│   │   │   ├── Controls/      # Defense controls
│   │   │   └── Common/        # Shared components
│   │   ├── pages/             # Page components
│   │   ├── store/             # Redux store
│   │   ├── services/          # API services
│   │   ├── hooks/             # Custom React hooks
│   │   └── App.tsx            # Main app component
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml         # Multi-container orchestration
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/eentost/fortress-defense-platform.git
cd fortress-defense-platform

# Copy environment file
cp .env.example .env

# Start the entire stack
docker-compose up -d

# Wait for services to be ready
sleep 10

# View logs
docker-compose logs -f
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs**: http://localhost:8080/swagger
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Features

### 🔍 Threat Detection
- **Kill Chain Analysis**: Detects threats across all 6 stages
  - Reconnaissance
  - Initial Access
  - Execution
  - Persistence
  - Privilege Escalation
  - Impact
- **Pattern Matching**: Regex-based threat pattern detection
- **Behavioral Analysis**: Anomaly detection
- **Real-Time Processing**: Immediate threat response

### 🛡️ Multi-Layer Defense
- **Input Validation**: Prompt filtering & content validation
- **Sandboxing**: Isolated execution environments
- **Access Control**: Capability scoping & least privilege
- **Supply Chain**: Package verification & dependency scanning
- **Network Protection**: Egress control & DLP
- **Secrets Management**: Encrypted credential storage

### 📊 Dashboard
- **Real-Time Metrics**: Active threats, detection rate
- **Threat Visualization**: Charts and graphs
- **Alert Management**: Threat notifications
- **Control Status**: Defense mechanism health

### 🔌 API
- **RESTful Endpoints**: Full CRUD operations
- **Swagger Documentation**: Interactive API explorer
- **Authentication**: JWT-based auth
- **Pagination**: Efficient data retrieval

## API Endpoints

### Threats
- `GET /api/v1/threats` - List all threats
- `POST /api/v1/threats/analyze` - Analyze payload for threats
- `GET /api/v1/threats/{id}` - Get threat details
- `PUT /api/v1/threats/{id}/status` - Update threat status

### Controls
- `GET /api/v1/controls` - List defense controls
- `POST /api/v1/controls/apply` - Apply control
- `GET /api/v1/controls/{id}` - Get control details

### Monitoring
- `GET /api/v1/events` - Get security events log
- `GET /api/v1/metrics` - Get system metrics
- `GET /api/v1/health` - Health check

## Environment Variables

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=fortress_db
DB_USER=fortress
DB_PASSWORD=changeme123

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Server
SERVER_PORT=8080
SERVER_ENV=production

# JWT
JWT_SECRET=your-secret-key-change-this
JWT_EXPIRY=24h
```

## Docker Deployment

### Build Individual Services

```bash
# Build backend
docker build -t fortress-backend:latest ./backend

# Build frontend
docker build -t fortress-frontend:latest ./frontend
```

### Deploy with Compose

```bash
# Build and start all services
docker-compose build
docker-compose up -d

# View running services
docker-compose ps

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]
```

## Database Migrations

```bash
# Run migrations in backend container
docker exec fortress-backend-1 ./backend migrate up

# Rollback migrations
docker exec fortress-backend-1 ./backend migrate down
```

## Development

### Backend Development

```bash
cd backend

# Install dependencies
go mod download

# Run locally (requires PostgreSQL & Redis)
go run cmd/server/main.go

# Run tests
go test ./...

# Build
go build -o fortress-backend cmd/server/main.go
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build production
npm run build

# Run tests
npm test
```

## Threat Model

Based on OpenClaw Ecosystem's comprehensive threat catalog:

- **Prompt Injection** (CRITICAL)
- **Indirect Prompt Injection** (CRITICAL)
- **Remote Code Execution** (CRITICAL)
- **Data Exfiltration** (CRITICAL)
- **Credential Theft** (CRITICAL)
- **Supply-chain Attack** (CRITICAL)
- **Data Poisoning** (HIGH)
- **Knowledge Manipulation** (HIGH)
- **Privilege Escalation** (HIGH)
- **User Manipulation** (MEDIUM)

## Security Features

✅ Database encryption
✅ Encrypted secrets management
✅ JWT authentication
✅ HTTPS support
✅ SQL injection prevention (GORM ORM)
✅ XSS protection (React)
✅ CORS configuration
✅ Rate limiting
✅ Request validation
✅ Audit logging

## Performance

- **Backend Response**: < 100ms (p99)
- **Threat Detection**: Real-time (< 1s)
- **Database Queries**: Optimized indexes
- **Caching**: Redis-backed
- **Horizontal Scaling**: Ready for Kubernetes

## Monitoring & Logging

- **Structured Logging**: JSON format
- **Log Aggregation**: Ready for ELK/Loki
- **Metrics**: Prometheus-compatible
- **Tracing**: OpenTelemetry ready

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs -f [service-name]

# Verify ports are not in use
lsof -i :3000  # Frontend
lsof -i :8080  # Backend
lsof -i :5432  # PostgreSQL
```

### Database connection issues
```bash
# Test PostgreSQL connectivity
psql -h localhost -U fortress -d fortress_db

# Run migrations
docker exec fortress-backend-1 go run cmd/migrate/main.go
```

### API not responding
```bash
# Check backend health
curl http://localhost:8080/health

# View backend logs
docker logs fortress-backend-1
```

## License

MIT License - See LICENSE file for details

## Support

- 📧 Email: support@fortressdefense.local
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📚 Docs: https://docs.fortressdefense.local

## References

- [OpenClaw Dashboard](https://hollobit.github.io/clawdash/)
- [MITRE ATT&CK](https://attack.mitre.org/)
- [ATLAS ML Security](https://atlas.mitre.org/)
- [Go Documentation](https://golang.org/doc/)
- [React Documentation](https://react.dev/)
- [Docker Documentation](https://docs.docker.com/)

---

**Version**: 1.0.0  
**Last Updated**: 2026-03-11  
**Status**: Production Ready
