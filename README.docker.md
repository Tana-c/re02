# Docker Setup Guide

This guide explains how to run both the frontend and backend services using Docker.

## Prerequisites

- Docker Desktop installed
- Docker Compose installed (included with Docker Desktop)

## Quick Start

### 1. Configure Environment Variables

Copy the example environment file and add your API key:

```bash
copy .env.docker.example .env
```

Then edit `.env` and replace `your_openai_api_key_here` with your actual OpenAI API key.

### 2. Build and Run

```bash
# Build and start both services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 3. Access the Applications

- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Docker Commands

### Start Services
```bash
# Start in foreground (see logs)
docker-compose up

# Start in background
docker-compose up -d
```

### Stop Services
```bash
# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Rebuild Services
```bash
# Rebuild after code changes
docker-compose up --build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

## Project Structure

```
AIInterviewer/
├── docker-compose.yml          # Orchestrates both services
├── .env                        # Environment variables (create from .env.docker.example)
├── .env.docker.example         # Example environment file
├── database_generate/          # Backend (FastAPI)
│   ├── Dockerfile
│   ├── .dockerignore
│   └── ...
└── dashboard/frontend/         # Frontend (React + Vite)
    ├── Dockerfile
    ├── .dockerignore
    └── ...
```

## Services

### Backend (FastAPI)
- **Port**: 8000
- **Hot Reload**: Enabled via volume mounting
- **Base Image**: python:3.11-slim

### Frontend (React + Vite)
- **Port**: 5173
- **Hot Reload**: Enabled via volume mounting
- **Base Image**: node:18-alpine

## Networking

Both services run on a shared Docker network (`ai-interviewer-network`) allowing them to communicate with each other.

## Development Workflow

1. Make code changes in your local files
2. Changes are automatically reflected in containers via volume mounts
3. Both services support hot reload for development

## Troubleshooting

### Port Already in Use
If ports 8000 or 5173 are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Change host port (left side)
```

### Container Won't Start
Check logs:
```bash
docker-compose logs backend
docker-compose logs frontend
```

### Database Not Found
Ensure the database file exists in `database_generate/interview_data.db`

### Clean Rebuild
```bash
docker-compose down -v
docker-compose up --build
```

## Production Deployment

For production, modify the Dockerfiles to:
1. Use multi-stage builds
2. Build frontend assets (not dev server)
3. Use production-grade web servers (nginx for frontend, gunicorn for backend)
4. Remove volume mounts
5. Set proper environment variables
