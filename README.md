# The Peninsula Pickup

Production recovery and customer acquisition platform for **Peninsula Pick Ups**, a licensed junk removal and hauling business based in San Carlos, CA.

**Live domain:** thepeninsulapickup.com

---

## Project Purpose

Peninsula Pick Ups (owned by Don and Melissa, established 2021) needed a fast, high-trust web platform to reclaim its online presence, restore customer confidence, and outperform competing web presences through superior design, verified local identity, and a real operational backend.

This platform serves three goals:

1. Capture and convert leads from search traffic directly to the business
2. Establish verified local identity with schema markup, consistent NAP data, and city-level SEO pages
3. Provide an operational backend CRM to manage incoming quote requests and job history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, TailwindCSS, Framer Motion |
| 3D / Canvas | React Three Fiber, @react-three/drei |
| Backend | Django 5, Django REST Framework |
| Database | SQLite (dev), PostgreSQL (production) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker and Docker Compose (optional, for containerized setup)

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs at: http://localhost:3000

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend runs at: http://localhost:8000

Admin panel: http://localhost:8000/admin/

### Docker (full stack)

```bash
cp .env.example .env
docker-compose up --build
```

---

## Environment Variables

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=https://thepeninsulapickup.com
```

### Backend (.env)

```
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_ENGINE=django.db.backends.sqlite3
DB_NAME=db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000
CSRF_TRUSTED_ORIGINS=http://localhost:3000
```

---

## Backend Overview

**Django apps:**

- `apps/api` - Health check and root API routing
- `apps/leads` - Lead/quote CRM: capture, status tracking, admin pipeline
- `apps/fleet` - Equipment and vehicle structure (scaffolded for future expansion)
- `apps/accounts` - User and client profile management

**Key endpoints:**

```
GET  /api/health/
POST /api/leads/
GET  /api/service-areas/
GET  /api/service-areas/:slug/
GET  /api/testimonials/
GET  /api/job-photos/
```

---

## Frontend Overview

**Pages:**

- `/` - Main landing page with hero, trust strip, service grid, quote selector, gallery, service areas, testimonials, and contact form
- `/[location]` - Dynamic SEO landing pages for each service area city
- `/dashboard` - Client portal (scaffolded, auth integration pending)

**Component structure:**

- `components/shared/` - Layout, Header, Footer, Button, ServiceCard, SEOMeta
- `components/motion/` - All major homepage sections with Framer Motion animations
- `components/canvas/` - React Three Fiber visual components
- `hooks/` - API integration hooks (useLeadForm, useServiceAreas)
- `lib/` - API client, SEO utilities, service area data, schema helpers

---

## Deployment Notes

**Frontend (Vercel recommended):**

1. Connect GitHub repository to Vercel
2. Set root directory to `frontend`
3. Add environment variables
4. Deploy

**Backend (Railway, Render, or VPS):**

1. Set `DEBUG=False` in production
2. Configure PostgreSQL database variables
3. Run `python manage.py collectstatic`
4. Use gunicorn or uvicorn as the WSGI/ASGI server
5. Configure Nginx reverse proxy

**Domain:**

Point `thepeninsulapickup.com` to the frontend deployment. Point `api.thepeninsulapickup.com` to the backend deployment. Update CORS and CSRF origins accordingly.

---

## Contributors

- [DanielMinton](https://github.com/DanielMinton)
- [TheModernOpossum](https://github.com/TheModernOpossum)

---

## License

Copyright 2026 Peninsula Pick Ups. All rights reserved.
