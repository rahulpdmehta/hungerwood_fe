# HungerWood Frontend e2e (Playwright)

End-to-end tests run a Vite preview build of the frontend against a real
backend and a real (test) MongoDB. The harness does not mock the API.

## Prerequisites

- Node 20+
- Mongo running locally on `mongodb://localhost:27017`
- Backend running with `MONGO_URI=mongodb://localhost:27017/hungerwood_e2e`
  and `E2E_BYPASS_OTP=true` so the suite can sign in test users with
  the canonical OTP `000000`
- Run the seed script before each suite run (it wipes `hungerwood_e2e`
  and recreates fixtures):

  ```bash
  cd backend
  MONGO_URI=mongodb://localhost:27017/hungerwood_e2e node scripts/seed-e2e.js
  ```

  (TBD — seed script lands with the customer-grocery-cart spec.)

## Running

```bash
cd frontend
npm run e2e          # full suite, headless
npm run e2e:headed   # interactive with browser visible
```

Skip starting the preview server (e.g. when using `npm run dev`):

```bash
E2E_NO_SERVER=1 E2E_BASE_URL=http://localhost:3000 npm run e2e
```

## Spec coverage roadmap

The following specs make up the v1 suite. ✅ = shipped; 🚧 = in progress;
⏳ = planned (covered by this skeleton; awaits seed-e2e.js and OTP bypass).

| File                                       | Status |
|--------------------------------------------|--------|
| `customer-grocery-discovery.spec.ts`       | ⏳     |
| `customer-grocery-cart.spec.ts`            | ⏳     |
| `customer-grocery-checkout-cod.spec.ts`    | ⏳     |
| `customer-grocery-checkout-razorpay.spec.ts` | ⏳   |
| `customer-grocery-pickup.spec.ts`          | ⏳     |
| `customer-grocery-coupon.spec.ts`          | ⏳     |
| `customer-grocery-bundle.spec.ts`          | ⏳     |
| `customer-grocery-cancel-rate.spec.ts`     | ⏳     |
| `customer-grocery-reorder.spec.ts`         | ⏳     |
| `customer-cross-section.spec.ts`           | ⏳     |
| `admin-grocery-product-crud.spec.ts`       | ⏳     |
| `admin-grocery-order-flow.spec.ts`         | ⏳     |
| `admin-super-user-mgmt.spec.ts`            | ⏳     |
| `admin-coupon-bundle-crud.spec.ts`         | ⏳     |
| `smoke.spec.ts`                            | ✅     |

## Helpers

- `fixtures/auth.ts` — `loginAs(page, role)` using OTP bypass
- `fixtures/cart.ts` — `addGroceryProductToCart(page, name)`
- `fixtures/seed.ts` — fixed phone numbers and known product names

(Helpers are added incrementally as specs land.)
