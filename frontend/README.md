# Aurelia Frontend

React + Vite frontend for the Aurelia Beauty & Spa booking platform.

## Commands

```bash
npm install
npm run dev
npm run build
```

## Local Environment

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000/api
```

## Notes

- Dev server runs on port `8080`
- Auth uses JWT tokens from the Django backend
- Booking, profile, dashboard, and admin flows all depend on the backend API
- Online booking checkout opens Razorpay from the frontend and verifies payment through the Django backend
