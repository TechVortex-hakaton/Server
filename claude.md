CLAUDE.md — SERVER
1. LOYIHA
Bu repository Sog‘liq, sport va tibbiyot platformasining asosiy backend serveridir.
Repository:
Server
Server quyidagi frontendlar uchun umumiy API beradi:
Doctor
Admin
Kelajakda bemor/User frontend ham shu API bilan ishlashi mumkin.
Arxitektura:
Doctor Frontend
       │
       ├──────────────┐
       │              │
       ▼              ▼
                 Node.js Server
                      │
                      ▼
                  Database
                      │
                      ▼
                  PostgreSQL
                      │
                      ▼
                    Prisma

Admin Frontend
       │
       └───────────────► Server
2. ASOSIY VAZIFA
Server quyidagilarni boshqaradi:
Authentication
Users
Doctors
Admins
Patients
Appointments
Medical records
Health information
Sports information
Articles
Categories
Notifications
Statistics
Backend hech qachon frontendga bog‘lanib qolmasin.
Frontend faqat REST API orqali server bilan ishlaydi.
3. TEXNOLOGIYALAR
Quyidagi stackdan foydalan:
Node.js
Express.js
TypeScript
PostgreSQL
Prisma ORM
JWT
bcrypt
Zod
Helmet
CORS
Morgan yoki Pino
dotenv
4. PAPKA STRUKTURASI
Server/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── services/
│   ├── routes/
│   ├── middleware/
│   ├── validators/
│   ├── utils/
│   ├── types/
│   └── server.ts
│
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
5. USER ROLES
Systemda:
ADMIN
DOCTOR
PATIENT
bo‘ladi.
Har bir role o‘z endpointlariga ega.
Admin:
/admin/*
Doctor:
/doctor/*
Patient:
/patient/*
6. AUTHENTICATION
Endpoints:
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
Login response:
{
  "success": true,
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "1",
      "fullName": "Ali Valiyev",
      "email": "user@example.com",
      "role": "DOCTOR"
    }
  }
}
Password:
bcrypt bilan hash qilinsin
plaintext password databasega yozilmasin
password API response'da qaytarilmasin
7. DOCTOR
Doctor modeli:
Doctor
Fields:
id
userId
fullName
specialization
experience
phone
email
bio
avatar
isActive
createdAt
updatedAt
Specialization misollar:
Cardiologist
Therapist
Neurologist
Pediatrician
Dentist
Dermatologist
Orthopedist
8. PATIENT
Patient modeli:
Patient
Fields:
id
userId
fullName
birthDate
gender
phone
address
createdAt
updatedAt
9. APPOINTMENTS
Doctor va patient o‘rtasidagi uchrashuvlar.
Model:
Appointment
Fields:
id
doctorId
patientId
date
time
status
reason
notes
createdAt
updatedAt
Status:
PENDING
CONFIRMED
COMPLETED
CANCELLED
API:
GET    /api/appointments
POST   /api/appointments
GET    /api/appointments/:id
PUT    /api/appointments/:id
DELETE /api/appointments/:id
Doctor faqat o‘z appointmentlarini boshqara olishi kerak.
10. MEDICAL RECORDS
Model:
MedicalRecord
Fields:
id
patientId
doctorId
diagnosis
notes
recommendations
createdAt
updatedAt
Doctor patient bilan bog‘liq medical recordni ko‘rishi mumkin.
Admin umumiy statistik ma'lumotlarni ko‘rishi mumkin, lekin keraksiz shaxsiy tibbiy ma'lumotlarni ochib bermaslik kerak.
11. HEALTH CONTENT
Model:
Article
Category
Article:
id
title
slug
description
content
image
categoryId
authorId
isPublished
createdAt
updatedAt
Categories:
Health
Sport
Sleep
Nutrition
Prevention
Wellbeing
12. SPORT
Sport ma'lumotlari:
Sport
Fields:
id
title
description
category
duration
difficulty
calories
image
isActive
13. ADMIN API
GET    /api/admin/dashboard
GET    /api/admin/users
GET    /api/admin/doctors
GET    /api/admin/patients
GET    /api/admin/appointments

POST   /api/admin/doctors
PUT    /api/admin/doctors/:id
DELETE /api/admin/doctors/:id

POST   /api/admin/articles
PUT    /api/admin/articles/:id
DELETE /api/admin/articles/:id
Admin endpointlari:
authMiddleware
        ↓
adminMiddleware
        ↓
controller
ketma-ketligida ishlasin.
14. DOCTOR API
GET /api/doctor/profile
PUT /api/doctor/profile

GET /api/doctor/appointments
GET /api/doctor/patients

GET /api/doctor/patients/:id
GET /api/doctor/patients/:id/records

POST /api/doctor/records
PUT /api/doctor/records/:id

PUT /api/doctor/appointments/:id/status
Doctor boshqa doctorning private ma'lumotlariga kira olmasin.
15. DASHBOARD API
Admin:
GET /api/admin/dashboard
Response:
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "totalDoctors": 42,
    "totalPatients": 1208,
    "totalAppointments": 350,
    "todayAppointments": 24
  }
}
Doctor:
GET /api/doctor/dashboard
Response:
{
  "success": true,
  "data": {
    "todayAppointments": 8,
    "totalPatients": 120,
    "completedAppointments": 85
  }
}
16. RESPONSE FORMAT
Barcha API response bir xil formatda bo‘lsin.
Success:
{
  "success": true,
  "message": "Success",
  "data": {}
}
Error:
{
  "success": false,
  "message": "Something went wrong"
}
17. SECURITY
Majburiy:
JWT authentication
bcrypt
Helmet
CORS
Zod validation
environment variables
rate limiting
authorization middleware
error middleware
passwordlarni log qilmaslik
.env GitHubga yuborilmasin.
18. DATABASE
Prisma ishlat.
Asosiy modellar:
User
Doctor
Patient
Appointment
MedicalRecord
Article
Category
Sport
Notification
Relationshiplarni to‘g‘ri tashkil qil.
19. SEED DATA
Development uchun:
1 ADMIN
5 DOCTORS
10 PATIENTS
20 APPOINTMENTS
10 ARTICLES
8 SPORTS
6 CATEGORIES
yarat.
Demo accountlar:
ADMIN
admin@healthy.uz
Admin123!

DOCTOR
doctor@healthy.uz
Doctor123!
20. MEDICAL SAFETY
Backend:
avtomatik tashxis bermasin
shifokor o‘rniga qaror chiqarmasin
xavfli individual davolash tavsiyalarini generatsiya qilmasin
Tibbiy ma'lumotlar faqat authorized userlarga qaytarilsin.
21. FRONTEND COMPATIBILITY
Doctor va Admin repositorylari ushbu server bilan ishlashi kerak.
Base URL:
http://localhost:5000/api
Production URL environment orqali berilsin.
API contract o‘zboshimchalik bilan o‘zgartirilmasin.
Agar endpoint o‘zgarsa:
Server CLAUDE.md
Doctor CLAUDE.md
Admin CLAUDE.md
birgalikda yangilansin.
22. ACCEPTANCE CRITERIA
Server ishga tushadi
Database ulanadi
Prisma ishlaydi
Register ishlaydi
Login ishlaydi
JWT ishlaydi
Admin authorization ishlaydi
Doctor authorization ishlaydi
Doctor API ishlaydi
Admin API ishlaydi
Appointment API ishlaydi
Medical records ishlaydi
Articles ishlaydi
Sport API ishlaydi
Dashboard statistics ishlaydi
Validation ishlaydi
Error handling ishlaydi
Seed ishlaydi