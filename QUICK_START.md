# Quick Start Guide - Server Deployment

## สำหรับ Server: 72.61.120.205

### 1. Clone และ Setup

```bash
git clone <repository-url>
cd all_ai_interview-main

# สร้างไฟล์ .env
cp env.example .env
# แก้ไข .env และใส่ OpenAI API Key
nano .env
```

### 2. ตรวจสอบ Database

```bash
# ตรวจสอบว่ามี database
ls -lh database_generate/interview_data.db

# ถ้ายังไม่มี ให้สร้าง
cd database_generate
python3 init_database.py
python3 update_personas_thai.py
cd ..
```

### 3. Deploy ด้วย Docker

```bash
# Build และ start services
docker-compose -f docker-compose.production.yml up -d --build

# ตรวจสอบ logs
docker-compose -f docker-compose.production.yml logs -f
```

### 4. ตรวจสอบการทำงาน

- Frontend: http://72.61.120.205/demodashbord
- Backend API: http://72.61.120.205:8835
- API Docs: http://72.61.120.205:8835/docs

### 5. คำสั่งที่ใช้บ่อย

```bash
# ดู logs
docker-compose -f docker-compose.production.yml logs -f

# Restart
docker-compose -f docker-compose.production.yml restart

# Stop
docker-compose -f docker-compose.production.yml down

# Rebuild
docker-compose -f docker-compose.production.yml up -d --build
```

ดูรายละเอียดเพิ่มเติมใน `DEPLOY.md`

