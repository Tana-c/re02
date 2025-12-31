# Deployment Checklist

## ก่อน Deploy

- [ ] Clone repository เรียบร้อย
- [ ] สร้างไฟล์ `.env` จาก `env.example`
- [ ] ใส่ OpenAI API Key ใน `.env`
- [ ] ตรวจสอบว่า `interview_data.db` มีอยู่
- [ ] Docker และ Docker Compose ติดตั้งแล้ว
- [ ] Port 80 และ 8000 เปิดใช้งาน

## หลัง Deploy

### ตรวจสอบ Services

```bash
# ตรวจสอบ containers ทำงาน
docker ps

# ควรเห็น:
# - ai-interviewer-backend (port 8000)
# - ai-interviewer-frontend (port 80)
```

### ตรวจสอบ URLs

- [ ] Frontend: http://72.61.120.205/demodashbord
- [ ] Backend API: http://72.61.120.205:8000
- [ ] API Docs: http://72.61.120.205:8000/docs
- [ ] Health Check Backend: http://72.61.120.205:8000/health
- [ ] Health Check Frontend: http://72.61.120.205/health

### ตรวจสอบ Functionality

- [ ] Frontend โหลดได้และแสดงหน้า Dashboard
- [ ] API ทำงานได้ (ทดสอบที่ /docs)
- [ ] ข้อมูล Persona แสดงเป็นภาษาไทย
- [ ] การค้นหาใน Insights Tab ทำงาน
- [ ] Transcripts Tab แสดงข้อมูลได้
- [ ] Charts และ Analytics แสดงผลได้

### ตรวจสอบ Logs

```bash
# Backend logs
docker-compose -f docker-compose.production.yml logs backend

# Frontend logs  
docker-compose -f docker-compose.production.yml logs frontend

# ทั้งหมด
docker-compose -f docker-compose.production.yml logs
```

### ตรวจสอบ Network

```bash
# ตรวจสอบ network
docker network inspect ai-interviewer-network

# ตรวจสอบว่า containers เชื่อมต่อกันได้
docker exec ai-interviewer-frontend ping -c 2 backend
```

### ตรวจสอบ Database

```bash
# ตรวจสอบว่า database มีข้อมูล
docker exec ai-interviewer-backend python -c "import sqlite3; conn = sqlite3.connect('/app/interview_data.db'); print('Tables:', [row[0] for row in conn.execute(\"SELECT name FROM sqlite_master WHERE type='table'\").fetchall()])"

# ตรวจสอบข้อมูล Persona
docker exec ai-interviewer-backend python -c "import sqlite3; conn = sqlite3.connect('/app/interview_data.db'); print('Personas:', len(conn.execute('SELECT * FROM personas').fetchall()))"
```

## Troubleshooting

### ถ้า Frontend ไม่แสดง

1. ตรวจสอบ logs: `docker-compose -f docker-compose.production.yml logs frontend`
2. ตรวจสอบว่า build สำเร็จ: `docker images | grep ai-interviewer-frontend`
3. ตรวจสอบ nginx config: `docker exec ai-interviewer-frontend cat /etc/nginx/conf.d/default.conf`

### ถ้า API ไม่ทำงาน

1. ตรวจสอบ logs: `docker-compose -f docker-compose.production.yml logs backend`
2. ตรวจสอบ database: `ls -lh database_generate/interview_data.db`
3. ทดสอบ API โดยตรง: `curl http://72.61.120.205:8000/health`

### ถ้า Database ไม่พบ

```bash
# สร้าง database ใหม่
cd database_generate
python3 init_database.py
python3 update_personas_thai.py
cd ..

# Restart backend
docker-compose -f docker-compose.production.yml restart backend
```

## คำสั่งสำหรับตรวจสอบ

```bash
# Status ทั้งหมด
docker-compose -f docker-compose.production.yml ps

# Resource usage
docker stats

# Network connectivity
docker exec ai-interviewer-frontend curl -s http://backend:8000/health
```

