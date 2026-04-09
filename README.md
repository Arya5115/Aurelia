# Aurelia Beauty & Spa

Full-stack salon and spa booking platform with a React frontend and Django REST backend.

## Project Structure

```text
aurelia-complete/
|-- frontend/   React + Vite + TypeScript client
|-- backend/    Django REST Framework API
`-- README.md
```

## Run Locally

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:8080`.

Backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The backend runs on `http://localhost:8000`.

## Frontend Environment

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:8000/api
```

## Core Features

- JWT auth with username or email login
- Role-aware access for users and admins
- Protected booking flow for signed-in users only
- User dashboard with reschedule and cancel actions
- Admin dashboard with booking approval and status controls
- Profile management from the frontend
- Booking conflict validation in the backend
- Contact form submission to Django
- Console email notifications in local development

## Main API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register/` | POST | Create a user account |
| `/api/auth/login/` | POST | Get JWT tokens |
| `/api/auth/refresh/` | POST | Refresh access token |
| `/api/auth/me/` | GET, PATCH | Read or update current account |
| `/api/services/` | GET | List services |
| `/api/bookings/` | GET, POST | List or create bookings |
| `/api/bookings/{id}/` | GET, PATCH | View or update a booking |
| `/api/contact/` | POST | Submit contact form |
| `/api/contact/list/` | GET | Admin-only contact inbox |
