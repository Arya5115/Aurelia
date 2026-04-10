# Aurelia Spa - Django Backend

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Payment setup now uses Razorpay for online checkout. Add your test or live keys in `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=your_secret_here
RAZORPAY_CURRENCY=INR
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser (admin):
```bash
python manage.py createsuperuser
```

6. Run the server:
```bash
python manage.py runserver
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/login/` | Login (get JWT tokens) | No |
| POST | `/api/auth/refresh/` | Refresh JWT token | No |
| GET | `/api/auth/me/` | Get current user profile | Yes |
| GET | `/api/services/` | List all services | No |
| POST | `/api/services/` | Create service | Admin |
| GET | `/api/bookings/` | List user bookings | Yes |
| POST | `/api/bookings/` | Create booking | Yes |
| POST | `/api/contact/` | Submit contact form | No |
| GET | `/api/contact/list/` | List contact messages | Admin |

## Database

Uses SQLite by default. For production, switch to PostgreSQL by updating `DATABASES` in `settings.py`.

## Render Deployment

Recommended Render settings:

- Root Directory: `backend`
- Build Command: `bash build.sh`
- Start Command: `gunicorn aurelia_backend.wsgi:application`

Recommended environment variables:

```env
DEBUG=False
DJANGO_SECRET_KEY=replace-this-with-a-long-random-secret
FRONTEND_BASE_URL=https://your-frontend-domain.vercel.app
ALLOWED_HOSTS=your-backend-name.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.vercel.app
DATABASE_URL=<render-postgres-internal-database-url>
```
