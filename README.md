# Smart Surgident — Ecommerce Platform

React + Express + TypeScript + MongoDB, with orders auto-routed to the
sub-dealer in the customer's city.

## Structure
```
backend/    Express + TS + MongoDB API
frontend/   React + Vite + TS + Tailwind
```

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB Atlas connection string (see note below)
- `JWT_SECRET` — any long random string
- `CLIENT_URL` — http://localhost:5173 (for local dev)

Getting a MONGO_URI: create a free cluster at mongodb.com/cloud/atlas,
create a database user, allow your IP (or 0.0.0.0/0 for now), then
"Connect" → "Drivers" → copy the connection string and swap in your
password and database name.

Run it:
```bash
npm run dev       # starts on http://localhost:5002
npm run seed      # optional: adds 5 cities + 1 sample brand/product
```

Onboard your 5 dealers (one per city) — you'll need this before checkout
works, since an order can't route to a city with no dealer:
```bash
curl -X POST http://localhost:5002/api/dealers \
  -H "Content-Type: application/json" \
  -d '{"name":"KTM Dealer","city":"<city_id_from_seed_output>","phone":"98XXXXXXXX","email":"ktm@smartsurgident.com","password":"changeme123"}'
```
(This endpoint currently has no auth guard bypass — you'll want to create
your first admin user via the `/api/auth/register` endpoint with
`role: "admin"` set directly in MongoDB the first time, since there's no
signup flow for admins by design.)

## 2. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev       # starts on http://localhost:5173
```

## What's built vs what's next

**Built:** product catalog, product detail/e-library page, cart, checkout
with city selection, order creation with automatic dealer routing and
stock decrement, dealer/admin/customer auth scaffolding, brand listing API.

**Not yet built (next steps):**
- Dealer dashboard UI (backend routes exist: `GET /api/orders/dealer`,
  `PATCH /api/orders/:id/status` — just needs a frontend page + dealer login form)
- Admin dashboard UI (backend routes exist for products/brands/cities/dealers/orders)
- Real-time notifications to dealers (currently just a console.log —
  swap in Twilio/SMS, email, or a WebSocket event)
- Payment gateway (eSewa/Khalti) — currently orders are created directly,
  no payment step
- Image upload (Cloudinary, like your Om Satyam project) — currently
  `images` is just a string array you'd populate manually or via an
  upload endpoint you add later
# smartsurgident
