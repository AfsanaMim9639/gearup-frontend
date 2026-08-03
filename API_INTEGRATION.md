# API Integration — GearUp Frontend

This document maps frontend routes/components to the backend API endpoints they consume.

**Backend base URL:** `https://gearup-virid.vercel.app/api`

---

## Authentication

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| `/auth/register` | `app/auth/register/page.tsx` | `POST /api/auth/register` |
| `/auth/login` | `app/auth/login/page.tsx` | `POST /api/auth/login` |
| Auth state (all pages) | `context/AuthContext.tsx` | Uses token/user from `POST /api/auth/login` response; stores in `localStorage` + cookies for middleware |

## Public Gear Browsing

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| `/` | `app/page.tsx` (Featured Gear, Categories) | `GET /api/gear`, `GET /api/categories` |
| `/gear` | `app/gear/page.tsx` via `hooks/useGear.ts` (`useGearList`) | `GET /api/gear` (supports `category`, `brand`, `minPrice`, `maxPrice`, `available` query params) |
| `/gear/[id]` | `app/gear/[id]/page.tsx` via `useGearDetails` | `GET /api/gear/:id` |

## Rental Orders (Customer)

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| Rent Now form (gear details page) | `components/rent-now-form.tsx` via `useCreateRental` | `POST /api/rentals` |
| `/dashboard/customer` | `app/dashboard/customer/page.tsx` via `useMyRentals` | `GET /api/rentals` |
| Rental detail (payment page) | `useRentalDetails` | `GET /api/rentals/:id` |

## Payments (Stripe)

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| `/dashboard/customer/orders/[id]/pay` | Page + `useCreatePaymentIntent` | `POST /api/payments/create` |
| Stripe card confirmation | `components/stripe-payment-form.tsx` via `useConfirmPayment` | `POST /api/payments/confirm` |
| `/payment/success`, `/payment/cancel` | Redirect targets after Stripe confirmation | — (reads `orderId` from query params) |

## Reviews (Customer)

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| "Leave Review" dialog (returned orders) | `components/review-dialog.tsx` via `useCreateReview` | `POST /api/reviews` |

## Provider

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| `/dashboard/provider` | `app/dashboard/provider/page.tsx` via `useProviderGear` | `GET /api/provider/gear` |
| `/dashboard/provider/gear/new` | Add Gear form via `useCreateGear` | `POST /api/provider/gear` |
| `/dashboard/provider/orders` | `app/dashboard/provider/orders/page.tsx` via `useProviderOrders` | `GET /api/provider/orders` |
| Order status actions (Confirm / Mark Picked Up / Mark Returned) | `useUpdateOrderStatus` | `PATCH /api/provider/orders/:id` |

## Admin

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| `/dashboard/admin` (User Management table) | `app/dashboard/admin/page.tsx` via `useAdminUsers` | `GET /api/admin/users` |
| Suspend / Activate action | `useUpdateUserStatus` | `PATCH /api/admin/users/:id` |
| Overview stats (gear count) | `useAdminGear` | `GET /api/admin/gear` |
| Overview stats (rentals count) | `useAdminRentals` | `GET /api/admin/rentals` |

## Categories

| Frontend | Component/Hook | Backend Endpoint |
|---|---|---|
| Gear filters, Add Gear form, Home page categories | `useCategories` | `GET /api/categories` |

---

## Authentication & Route Protection

- JWT token is returned from `POST /api/auth/login` and stored in both `localStorage` (for API request headers) and cookies (`token`, `role`) so that `proxy.ts` (Next.js Middleware) can protect routes server-side.
- All authenticated API requests attach `Authorization: Bearer <token>` via `lib/api-client.ts`.
- `proxy.ts` protects `/dashboard/customer/*`, `/dashboard/provider/*`, and `/dashboard/admin/*` based on the `role` cookie, redirecting unauthenticated users to `/auth/login` and mismatched roles to their own dashboard.

## Error Handling

- All API errors are thrown as a typed `ApiError` (see `lib/api-client.ts`) and caught in each form/mutation, surfaced via `sonner` toast notifications.
- Global unexpected errors are caught by `app/error.tsx` (Error Boundary) and `app/loading.tsx` provides a global loading fallback for suspended route segments.

## Mock Data

No mock data is used — all endpoints above are consumed live from the deployed backend at `https://gearup-virid.vercel.app`.