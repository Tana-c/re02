# Production Deployment Guide

คู่มือการ deploy AI Interviewer Dashboard บน server 72.61.120.205

## Prerequisites

- Server: 72.61.120.205
- Docker และ Docker Compose ติดตั้งแล้ว
- Git ติดตั้งแล้ว
- Port 80 และ 8835 เปิดใช้งาน

## ขั้นตอนการ Deploy

### 1. Clone Repository

```bash
git clone <repository-url>
cd all_ai_interview-main
```

### 2. สร้างไฟล์ Environment Variables

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env` และใส่ค่า:

```env
OPENAI_API_KEY=your_actual_openai_api_key
OPENAI_MODEL=gpt-4o
OPENAI_TEMPERATURE=0.1
VITE_API_URL=http://72.61.120.205:8835
```

### 3. ตรวจสอบ Database

ตรวจสอบว่ามีไฟล์ `database_generate/interview_data.db` อยู่:

```bash
ls -lh database_generate/interview_data.db
```

ถ้ายังไม่มี ให้รันสคริปต์สร้าง database:

```bash
cd database_generate
python init_database.py
python update_personas_thai.py
cd ..
```

### 4. Build และ Run Docker Containers

```bash
# Build และ start services
docker-compose -f docker-compose.production.yml up -d --build

# ตรวจสอบ logs
docker-compose -f docker-compose.production.yml logs -f
```

### 5. ตรวจสอบการทำงาน

- **Frontend**: http://72.61.120.205/demodashbord
- **Backend API**: http://72.61.120.205:8835
- **API Documentation**: http://72.61.120.205:8835/docs
- **Health Check**: 
  - Frontend: http://72.61.120.205/health
  - Backend: http://72.61.120.205:8835/health

## คำสั่งที่ใช้บ่อย

### ดู Logs

```bash
# ทั้งหมด
docker-compose -f docker-compose.production.yml logs -f

# เฉพาะ backend
docker-compose -f docker-compose.production.yml logs -f backend

# เฉพาะ frontend
docker-compose -f docker-compose.production.yml logs -f frontend
```

### Restart Services

```bash
# Restart ทั้งหมด
docker-compose -f docker-compose.production.yml restart

# Restart เฉพาะ service
docker-compose -f docker-compose.production.yml restart backend
docker-compose -f docker-compose.production.yml restart frontend
```

### Stop Services

```bash
docker-compose -f docker-compose.production.yml down
```

### Rebuild หลังจากแก้ไขโค้ด

```bash
# Rebuild และ restart
docker-compose -f docker-compose.production.yml up -d --build

# Rebuild เฉพาะ service
docker-compose -f docker-compose.production.yml build backend
docker-compose -f docker-compose.production.yml build frontend
```

### ตรวจสอบ Status

```bash
docker-compose -f docker-compose.production.yml ps
```

## การอัปเดต Database

ถ้าต้องการอัปเดตข้อมูลใน database:

```bash
# เข้าไปใน container
docker exec -it ai-interviewer-backend bash

# รันสคริปต์อัปเดต
python update_personas_thai.py

# หรือรันจาก host
docker exec ai-interviewer-backend python update_personas_thai.py
```

## Troubleshooting

### Port ถูกใช้งานแล้ว

```bash
# ตรวจสอบ port ที่ใช้งาน
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8835

# หรือใช้
sudo lsof -i :80
sudo lsof -i :8835
```

### Container ไม่ start

```bash
# ดู logs
docker-compose -f docker-compose.production.yml logs backend
docker-compose -f docker-compose.production.yml logs frontend

# ตรวจสอบ container status
docker ps -a
```

### Database ไม่พบ

```bash
# ตรวจสอบว่าไฟล์ database อยู่
ls -lh database_generate/interview_data.db

# ถ้ายังไม่มี ให้สร้างใหม่
cd database_generate
python init_database.py
cd ..
```

### Frontend ไม่สามารถเชื่อมต่อ API

ตรวจสอบว่า:
1. `VITE_API_URL` ใน `.env` ถูกต้อง
2. Backend service ทำงานอยู่ (`docker ps`)
3. Network ถูกต้อง (`docker network ls`)

### Permission Issues

```bash
# ตรวจสอบ permission ของ database file
chmod 644 database_generate/interview_data.db

# ตรวจสอบ permission ของ volumes
ls -la database_generate/
```

## Security Considerations

1. **เปลี่ยน OpenAI API Key** ใน `.env` ให้เป็น key จริง
2. **ตั้งค่า Firewall** ให้เปิดเฉพาะ port ที่จำเป็น (80, 8835)
3. **ใช้ HTTPS** ใน production (แนะนำให้ใช้ reverse proxy เช่น nginx หรือ traefik)
4. **Backup Database** เป็นประจำ

## Backup Database

```bash
# Backup database
cp database_generate/interview_data.db database_generate/interview_data.db.backup.$(date +%Y%m%d_%H%M%S)
```

## Monitoring

ตรวจสอบ health status:

```bash
# Backend health
curl http://72.61.120.205:8835/health

# Frontend health
curl http://72.61.120.205/health
```

## การอัปเดต Code

```bash
# Pull latest code
git pull

# Rebuild และ restart
docker-compose -f docker-compose.production.yml up -d --build
```

## Network Configuration

ถ้า server อยู่หลัง firewall หรือ reverse proxy:

1. ตั้งค่า `VITE_API_URL` ให้ชี้ไปที่ public URL
2. ตรวจสอบ CORS settings ใน `database_generate/app/main.py`
3. ตั้งค่า nginx reverse proxy ถ้าจำเป็น

## Support

ถ้ามีปัญหา:
1. ตรวจสอบ logs: `docker-compose -f docker-compose.production.yml logs`
2. ตรวจสอบ container status: `docker ps -a`
3. ตรวจสอบ network: `docker network inspect ai-interviewer-network`

