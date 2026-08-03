# GearUp 🏋️ — Frontend

**"Rent Sports & Outdoor Gear Instantly"**

A modern, responsive Next.js frontend for the GearUp sports and outdoor gear rental platform. Customers browse gear, place rental orders, and pay via Stripe. Providers manage inventory and fulfill orders. Admins oversee the platform.

---

## 🔗 Links

| Resource            | Link |
|---------------------|------|
| Frontend Repo       | https://github.com/AfsanaMim9639/gearup-frontend.git |
| Live App            | https://gearup-frontend-five.vercel.app/ |
| Backend Repo        | https://github.com/AfsanaMim9639/gearup.git |
| Backend Live API    | https://gearup-virid.vercel.app/ |

**Admin Credentials (for testing the deployed app)**
- Email: `admin@gearup.com`
- Password: `admin123`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js (App Router) | React framework, routing, server components |
| TypeScript | Type safety |
| Tailwind CSS + Shadcn UI | Styling and UI components |
| React Hook Form + Zod | Form state and validation |
| TanStack Query | Server state management / data fetching |
| Custom JWT (via cookies + localStorage) | Authentication, protected via Next.js Middleware |
| Stripe.js | Frontend payment flow |

---

## 👥 Roles

- **Customer** — Browse gear, rent, pay via Stripe, track orders, leave reviews
- **Provider** — Manage gear inventory (CRUD), manage incoming orders
- **Admin** — Manage users, view all gear/rentals platform-wide

Role is selected during registration and drives which dashboard/UI is shown.

---

## ⚙️ Setup Instructions

1. Clone the repo

   git clone https://github.com/AfsanaMim9639/gearup-frontend.git
   cd gearup-frontend

2. Install dependencies

   npm install

3. Create a `.env.local` file in the root:

   NEXT_PUBLIC_API_URL=https://gearup-virid.vercel.app/api
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

4. Run the development server

   npm run dev

App runs on `http://localhost:3000`

---

## 📋 Routes

| Route | Description |
|-------|--------------|
| `/` | Homepage with featured gear |
| `/gear` | Browse & filter gear |
| `/gear/[id]` | Gear details & rent CTA |
| `/auth/register` | Registration form |
| `/auth/login` | Login form |
| `/dashboard/customer` | Customer overview, orders, payments |
| `/dashboard/customer/orders/[id]/pay` | Payment initiation |
| `/payment/success` | Stripe payment success page |
| `/payment/cancel` | Stripe payment cancel page |
| `/dashboard/provider` | Provider overview & inventory |
| `/dashboard/provider/gear/new` | Add gear form |
| `/dashboard/provider/orders` | Manage incoming orders |
| `/dashboard/admin` | Admin overview & user management |

All `/dashboard/*` routes are protected via Next.js Middleware and require the correct role.

---

## Key Features

- Role-based authentication with JWT (cookie + localStorage), protected routes via Middleware
- Client-side form validation (Zod + React Hook Form) with inline error messages
- Consistent UI error handling — toast notifications, inline errors, error boundaries
- Real Stripe payment flow with dedicated success/cancel pages
- Optimistic UI updates via TanStack Query for order status changes
- Skeleton loaders and error fallbacks on key routes
- Dark mode UI built with Tailwind CSS + shadcn/ui

See `API_INTEGRATION.md` for the full mapping between frontend components and backend endpoints.