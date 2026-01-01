# Server Deployment - 72.61.120.205

## ไฟล์ที่เตรียมไว้แล้ว

### Docker Files
- `docker-compose.production.yml` - Production Docker Compose configuration
- `dashboard/frontend/Dockerfile.production` - Frontend production build
- `database_generate/Dockerfile.production` - Backend production build
- `dashboard/frontend/nginx.conf` - Nginx configuration สำหรับ base path `/demodashbord`

### Configuration Files
- `env.example` - ตัวอย่าง environment variables
- `.gitignore` - Git ignore rules

### Documentation
- `DEPLOY.md` - คู่มือการ deploy แบบละเอียด
- `QUICK_START.md` - คู่มือเริ่มต้นแบบเร็ว
- `CHECKLIST.md` - Checklist สำหรับตรวจสอบหลัง deploy

## ขั้นตอนการ Deploy

### 1. Clone Repository (ทำเอง)

```bash
git clone <repository-url>
cd all_ai_interview-main
```

### 2. Setup Environment

```bash
# สร้างไฟล์ .env
cp env.example .env

# แก้ไข .env และใส่ OpenAI API Key
nano .env
```

### 3. ตรวจสอบ Database

```bash
# ตรวจสอบว่ามี database
ls -lh database_generate/interview_data.db

# ถ้ายังไม่มี ให้สร้าง
cd database_generate
python3 init_database.py
python3 update_personas_thai.py
cd ..
```

### 4. Deploy

```bash
# Build และ start services
docker-compose -f docker-compose.production.yml up -d --build

# ตรวจสอบ logs
docker-compose -f docker-compose.production.yml logs -f
```

### 5. ตรวจสอบ

- Frontend: http://72.61.120.205/demodashbord
- Backend: http://72.61.120.205:8835
- API Docs: http://72.61.120.205:8835/docs

## URLs หลัง Deploy

- **Frontend Dashboard**: http://72.61.120.205/demodashbord
- **Backend API**: http://72.61.120.205:8835
- **API Documentation**: http://72.61.120.205:8835/docs
- **Health Check (Backend)**: http://72.61.120.205:8835/health
- **Health Check (Frontend)**: http://72.61.120.205/health

## คำสั่งที่ใช้บ่อย

```bash
# ดู logs
docker-compose -f docker-compose.production.yml logs -f

# Restart
docker-compose -f docker-compose.production.yml restart

# Stop
docker-compose -f docker-compose.production.yml down

# Rebuild
docker-compose -f docker-compose.production.yml up -d --build

# ตรวจสอบ status
docker-compose -f docker-compose.production.yml ps
```

## ตรวจสอบหลัง Deploy

ดูรายละเอียดใน `CHECKLIST.md`

## Troubleshooting

ดูรายละเอียดใน `DEPLOY.md`

