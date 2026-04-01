# 02 · ARCHITECTURE CONTEXT

> ⚠️ **INI ADALAH TEMPLATE** — bukan context file project aktual.
> Isi semua bagian yang ditandai `[CUSTOMIZE]`. Hapus blok ini setelah selesai.

> **Baca saat:** membuat file baru, menentukan di mana kode harus diletakkan, atau mereview PR.
> **Ini adalah sumber kebenaran tunggal** untuk struktur, pola kode, dan arsitektur aplikasi.
> **Stack:** Next.js 15 · TypeScript · Tailwind CSS 4 · Prisma · [Auth Library]

---

## 1. PRINSIP ARSITEKTUR

1. **Feature-based + Layered (Hybrid)** — kode dikelompokkan per domain bisnis, namun tetap mengikuti lapisan teknis yang ketat (Schema → Query → Service → Action → Component).
2. **Server-first** — Server Component adalah default. Client Component hanya di leaf nodes yang butuh interaktivitas browser.
3. **Unidirectional data flow** — satu arah: DB → Query → Service → Action → Component. Tidak ada shortcut.
4. **Thin routes, fat services** — `app/` hanya routing. Actions hanya middleware. Business logic selalu di service layer.
5. **Colocate by domain** — logic yang hanya relevan ke satu domain tinggal di `features/{domain}/`. Logic yang dipakai 2+ domain naik ke `services/`.
6. **Atomic UI Hierarchy** — komponen UI mengikuti granularitas Atom → Molecule → Organism. Setiap komponen hanya boleh berada di satu tempat yang sesuai level-nya.

> Data flow overview: lihat `00-master-context.md` Section Data Flow.
> Domain list dan glossary: lihat `01-product-context.md` Section Domain Model.

---

## 2. DIRECTORY STRUCTURE

**AI RULE:** Follow this structure exactly. Do not invent new top-level folders.

> Untuk folder structure aktual project (file-file spesifik): lihat `00-master-context.md` Section Struktur Folder.
> Di sini hanya pattern dan aturan penempatan.

```
src/
├── app/                              # Next.js App Router — ROUTING ONLY
│   ├── (auth)/                       # Route group: halaman publik auth
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/                  # Route group: layout dengan sidebar + auth guard
│   │   ├── layout.tsx                # Dashboard shell (Sidebar, Header, auth check)
│   │   ├── page.tsx                  # /dashboard (overview/home)
│   │   └── [feature]/
│   │       ├── page.tsx              # List/index page
│   │       └── [id]/page.tsx         # Detail page
│   ├── api/                          # API Routes — HANYA untuk webhook & third-party callback
│   │   └── [...]/route.ts
│   ├── layout.tsx                    # Root layout: font, global providers, metadata
│   ├── not-found.tsx
│   └── globals.css                   # Tailwind 4 entry point + design tokens
│
├── features/                         # DOMAIN LOGIC — satu folder per domain bisnis
│   └── [domain]/                     # Contoh: users, products, billing, notifications
│       ├── components/               # Smart components — tahu konteks domain ini
│       │   └── [Domain]Card.tsx
│       ├── hooks/                    # Client-side hooks spesifik domain ini
│       │   └── use-[domain].ts
│       ├── queries.ts                # Database queries via Prisma — HANYA untuk domain ini
│       ├── services.ts               # Business logic — HANYA untuk domain ini
│       ├── actions.ts                # Server Actions — jembatan client ↔ server
│       ├── schemas.ts                # Zod schemas — single source of truth untuk types
│       └── types.ts                  # TypeScript types spesifik domain ini
│
├── services/                         # SHARED SERVICES — logic yang dipakai 2+ domain
│   ├── email.service.ts              # Email sending (dipakai auth, billing, notifications)
│   ├── storage.service.ts            # File upload/management
│   ├── analytics.service.ts          # Event tracking
│   └── [shared-concern].service.ts   # Tambahkan sesuai kebutuhan project
│
├── components/                       # SHARED UI — bukan milik domain manapun
│   ├── ui/                           # ATOM: primitif terkecil, tidak bisa dipecah lagi
│   │   ├── button.tsx                # Wajib CVA untuk semua komponen di sini
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── spinner.tsx
│   │   ├── dialog.tsx
│   │   ├── tooltip.tsx
│   │   └── index.ts                  # Barrel export
│   ├── shared/                       # MOLECULE: gabungan atom, belum tahu konteks bisnis
│   │   ├── page-header.tsx           # Menerima data via props, tidak fetch sendiri
│   │   ├── data-table.tsx
│   │   ├── empty-state.tsx
│   │   ├── confirm-dialog.tsx
│   │   └── index.ts
│   └── layout/                       # TEMPLATE: struktur halaman persisten
│       ├── header.tsx
│       ├── sidebar.tsx
│       └── footer.tsx
│
├── lib/                              # Singleton & konfigurasi — murni agnostik
│   ├── db.ts                         # Prisma client (singleton)
│   ├── auth.ts                       # Auth library config
│   ├── env.ts                        # Environment variable validation (T3 Env / Zod)
│   └── utils.ts                      # cn(), formatDate(), formatCurrency(), dll.
│
├── hooks/                            # SHARED HOOKS — lintas domain, lintas fitur
│   ├── use-media-query.ts
│   ├── use-debounce.ts
│   └── use-local-storage.ts
│
├── types/                            # GLOBAL TYPES — tidak spesifik ke satu domain
│   └── index.ts
│
└── middleware.ts                     # Auth guard, redirect, role-based protection
```

---

## 3. ATOMIC DESIGN TAXONOMY

**AI GUIDE:** Gunakan taxonomy ini setiap kali membuat atau memindahkan komponen.

### Atom → `components/ui/`

- Unit terkecil yang tidak bisa dipecah lagi
- Zero business logic, zero data fetching
- Props hanya untuk konfigurasi visual: `variant`, `size`, `disabled`, `className`
- **Wajib CVA** jika punya 2+ variant atau 2+ ukuran
- Contoh: `Button`, `Input`, `Badge`, `Avatar`, `Spinner`, `Checkbox`, `Tooltip`, `Switch`

### Molecule → `components/shared/`

- Gabungan 2+ Atom yang membentuk unit fungsional
- Tidak tahu konteks bisnis — hanya menerima data generik via props
- Boleh punya internal UI state ringan (open/close, hover)
- Tidak boleh fetch data sendiri
- Contoh: `PageHeader`, `DataTable`, `EmptyState`, `SearchBar`, `ConfirmDialog`, `Pagination`, `StatCard`

### Organism → `features/{domain}/components/`

- Komponen yang sudah tahu konteks bisnis spesifik
- Boleh fetch data, connect ke hooks domain, punya server/client logic
- Menggunakan Atom dan Molecule sebagai building blocks
- Contoh: `UserTable`, `BillingCard`, `ProductGrid`, `NotificationList`

### Template → `components/layout/` + `app/*/layout.tsx`

- Struktur halaman persisten yang tidak re-render saat navigasi
- Boleh fetch global data (session, user profile)
- Contoh: `Header`, `Sidebar`, `DashboardLayout`

### Page → `app/*/page.tsx`

- Template + data nyata dari service
- Harus sangat tipis: fetch data → pass ke Organism
- Tidak ada logic kompleks di sini

> Daftar halaman dan route groups: lihat `01-product-context.md` Section Halaman & Routes.

---

## 4. COMPONENT DECISION TREE

**AI GUIDE:** Jalankan decision tree ini setiap kali membuat komponen baru.

```
Komponen ini fetch data sendiri atau punya business logic domain tertentu?
│
├── YA → features/{domain}/components/        (Organism — Smart Component)
│
└── TIDAK → Apakah ini struktur layout halaman? (Header, Sidebar, Footer)
            │
            ├── YA → components/layout/        (Template)
            │
            └── TIDAK → Apakah ini primitif terkecil? (Button, Input, Icon)
                        │
                        ├── YA → components/ui/      (Atom — wajib CVA)
                        │
                        └── TIDAK → components/shared/  (Molecule)
```

---

## 5. HYBRID SERVICE RULE

**AI GUIDE:** Gunakan rule ini untuk memutuskan di mana logic harus tinggal.

```
Logic ini hanya relevan untuk satu domain bisnis?
│
├── YA → features/{domain}/services.ts        (Colocated Service)
│         Contoh: user validation, product stock check
│
└── TIDAK (dipakai 2+ domain) → services/{name}.service.ts  (Shared Service)
          Contoh: email (dipakai auth + billing), storage (dipakai products + avatars)
```

### Contoh Konkret

```
features/auth/services.ts       ← validatePassword(), hashPassword()  [hanya auth]
features/billing/services.ts    ← calculateProration(), applyDiscount() [hanya billing]

services/email.service.ts       ← sendEmail()         [auth + billing + notifications]
services/storage.service.ts     ← uploadFile()        [products + users + posts]
services/analytics.service.ts   ← trackEvent()        [semua domain]
```

---

## 6. ATURAN IMPORT

```
✅ BOLEH:
  app/                    → features/, components/, lib/, services/, hooks/
  features/{domain}/      → components/, lib/, hooks/, services/, types/
  services/               → lib/, types/
  components/shared/      → components/ui/, lib/, hooks/
  components/layout/      → components/ui/, components/shared/, lib/, hooks/
  components/ui/          → lib/ SAJA

❌ DILARANG:
  components/ui/          → features/, services/, components/shared/  (atom harus agnostik)
  components/shared/      → features/, services/                      (molecule harus agnostik)
  features/A              → features/B secara langsung                (gunakan services/ sebagai mediator)
  lib/                    → features/, services/                      (lib harus agnostik)
  services/A              → services/B                                (gunakan callback/event jika perlu coupling)
```

**Ketika `features/A` butuh sesuatu dari `features/B`:**

1. Jika itu utility → pindahkan ke `lib/`
2. Jika itu UI → pindahkan ke `components/`
3. Jika itu shared logic → pindahkan ke `services/`
4. Jika benar-benar perlu coupling → gunakan event/callback pattern

---

## 7. POLA PER LAYER

> Setiap layer punya tanggung jawab yang jelas. Jangan skip layer.
> Testing per layer: lihat `05-testing-qa-context.md`.

### Layer 1: Schema (`features/{domain}/schemas.ts`)

```typescript
import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100),
  email: z.string().email("Email tidak valid"),
  role: z.enum(["user", "admin"]).default("user"),
});

// Schema adalah single source of truth — type diturunkan dari schema, bukan sebaliknya
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### Layer 2: Query (`features/{domain}/queries.ts`)

```typescript
// Hanya berisi database queries — tidak ada business logic
import { db } from "@/lib/db";

export const userQueries = {
  findById: (id: string) => db.user.findUnique({ where: { id } }),

  findAll: (filters?: { role?: string }) =>
    db.user.findMany({
      where: filters?.role ? { role: filters.role } : undefined,
      orderBy: { createdAt: "desc" },
    }),

  create: (data: CreateUserInput) => db.user.create({ data }),
};
```

### Layer 3: Service (`features/{domain}/services.ts`)

```typescript
// Business logic murni — tidak tahu tentang HTTP, UI, atau framework
import { userQueries } from "./queries";
import type { CreateUserInput } from "./schemas";

export const userService = {
  async create(input: CreateUserInput) {
    const existing = await userQueries.findByEmail(input.email);
    if (existing) throw new Error("Email sudah terdaftar");
    return userQueries.create(input);
  },

  async getAll() {
    return userQueries.findAll();
  },
};
```

### Layer 3b: Shared Service (`services/{name}.service.ts`)

```typescript
// Dipakai oleh lebih dari satu domain — tidak import dari features/
import { db } from "@/lib/db";

export const emailService = {
  async sendWelcome(to: string, name: string) {
    /* ... */
  },
  async sendPasswordReset(to: string, token: string) {
    /* ... */
  },
  async sendInvoice(to: string, invoiceId: string) {
    /* ... */
  },
};
```

### Layer 4: Action (`features/{domain}/actions.ts`)

> Detail auth & role guard pattern: lihat `03-security-context.md`.

```typescript
"use server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { createUserSchema } from "./schemas";
import { userService } from "./services";

export async function createUserAction(formData: FormData) {
  // 1. Auth & role check
  const session = await auth.getSession();
  if (!session) return { error: "Unauthorized" };
  if (session.user.role !== "admin") return { error: "Forbidden" };

  // 2. Parse & validasi input
  const parsed = createUserSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };

  // 3. Delegate ke service — tidak ada logic bisnis di sini
  try {
    const user = await userService.create(parsed.data);
    revalidatePath("/dashboard/users");
    return { data: user };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Terjadi kesalahan" };
  }
}
```

### Layer 5: Page (`app/(dashboard)/[feature]/page.tsx`)

```typescript
// Server Component — fetch langsung ke service, tidak lewat /api/
import { userService } from '@/features/users/services'
import { UserTable } from '@/features/users/components/UserTable'

export default async function UsersPage() {
  const users = await userService.getAll()
  return <UserTable users={users} />
}
```

---

## 8. CVA PATTERN — STANDARD UNTUK SEMUA ATOM

**AI RULE:** Semua komponen di `components/ui/` wajib menggunakan pola ini jika punya variants.

> Design tokens dan color system: lihat `00-master-context.md` Section Design System.

### Setup di `lib/utils.ts`

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Pola CVA Lengkap

```typescript
// components/ui/button.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// 1. Definisikan variants
const buttonVariants = cva(
  // Base styles — selalu applied
  'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:     'bg-brand-500 text-white hover:bg-brand-600',
        secondary:   'bg-zinc-100 text-zinc-900 hover:bg-zinc-200',
        outline:     'border border-zinc-300 bg-transparent hover:bg-zinc-100',
        ghost:       'hover:bg-zinc-100 hover:text-zinc-900',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link:        'text-brand-500 underline-offset-4 hover:underline',
      },
      size: {
        sm:   'h-8 px-3 text-xs',
        md:   'h-10 px-4 text-sm',
        lg:   'h-12 px-6 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)

// 2. Props menggabungkan HTML attributes + CVA variants
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

// 3. Implementasi — cn() wajib agar className prop bisa override dengan aman
export function Button({ variant, size, className, isLoading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}

// 4. Export variants untuk komposisi di komponen lain
export { buttonVariants }
```

### Kapan Wajib CVA vs Tidak

| Kondisi                          | Keputusan                                      |
| -------------------------------- | ---------------------------------------------- |
| Komponen punya 2+ variant visual | ✅ Wajib CVA                                   |
| Komponen punya 2+ ukuran         | ✅ Wajib CVA                                   |
| Komponen hanya satu tampilan     | ❌ Tailwind langsung                           |
| Molecule/Organism kompleks       | ⚠️ Opsional, pertimbangkan props boolean biasa |

---

## 9. TAILWIND 4 CONVENTIONS

> Color tokens dan font tokens aktual project: lihat `00-master-context.md` Section Design System.
> Di sini hanya pattern dan aturan styling.

### `globals.css`

```css
@import "tailwindcss";

@theme {
  /* Design tokens — definisikan di sini sebagai single source of truth */
  --color-brand-50: oklch(97% 0.02 250);
  --color-brand-100: oklch(93% 0.05 250);
  --color-brand-500: oklch(55% 0.22 250);
  --color-brand-600: oklch(48% 0.22 250);
  --color-brand-700: oklch(40% 0.22 250);

  --font-sans: "Inter Variable", sans-serif;

  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
}

@layer components {
  /* HANYA untuk structural pattern yang muncul 3x+, selebihnya gunakan utility langsung */
  .card {
    @apply rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900;
  }
}
```

### Hierarki Styling (Prioritas Berurutan)

1. **Tailwind utilities** → default untuk semua komponen
2. **CVA** → untuk Atom dengan 2+ variants
3. **`cn()` + `className` prop** → selalu expose agar komponen bisa di-override dari luar
4. **`@layer components`** → hanya untuk structural pattern yang muncul 3x+
5. **❌ Dilarang:** `style={{}}` inline, magic numbers, arbitrary values tidak konsisten

---

## 10. AUTH & ROLE PATTERN

> Detail lengkap auth, authorization, dan security: lihat `03-security-context.md`.
> Di sini hanya pattern implementasi dasar.

### Middleware (`middleware.ts`)

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
});

export const config = { matcher: ["/dashboard/:path*", "/api/:path*"] };
```

### Role Guard di Server Action

```typescript
// Pattern standar untuk semua actions yang butuh role check
const session = await auth.getSession();
if (!session) return { error: "Unauthorized" }; // Belum login
if (session.user.role !== "admin") return { error: "Forbidden" }; // Salah role
```

### Role Guard di Server Component (Page)

```typescript
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminPage() {
  const session = await auth.getSession();
  if (!session || session.user.role !== "admin") redirect("/dashboard");
  // ...
}
```

---

## 11. API ROUTE CONVENTIONS

API Routes (`app/api/`) **hanya** untuk:

- Webhook dari third-party (Stripe, GitHub, dll.)
- OAuth callback
- Endpoint yang dikonsumsi aplikasi eksternal

**Jangan gunakan `/api/` untuk data fetching internal** — gunakan Server Component + service langsung.

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from "@/lib/stripe";
import { billingService } from "@/features/billing/services";

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
    await billingService.handleWebhookEvent(event);
    return Response.json({ received: true });
  } catch (err) {
    return Response.json({ error: "Webhook failed" }, { status: 400 });
  }
}
```

---

## 12. NAMING CONVENTIONS

> Konvensi tambahan (commit message, branch naming, error messages): lihat `00-master-context.md` Section Conventions.

| Jenis                     | Convention                   | Contoh                                 |
| ------------------------- | ---------------------------- | -------------------------------------- |
| File React Component      | PascalCase                   | `UserCard.tsx`, `DataTable.tsx`        |
| File non-komponen         | kebab-case                   | `user-queries.ts`, `email.service.ts`  |
| Folder                    | kebab-case                   | `features/user-profile/`               |
| React Component function  | PascalCase                   | `function UserCard()`                  |
| Hook                      | camelCase +`use` prefix      | `useCurrentUser`, `useMediaQuery`      |
| Server Action             | camelCase +`Action` suffix   | `createUserAction`, `deletePostAction` |
| Service method            | camelCase                    | `userService.create()`                 |
| Zod schema                | camelCase +`Schema` suffix   | `createUserSchema`                     |
| CVA variant function      | camelCase +`Variants` suffix | `buttonVariants`, `badgeVariants`      |
| TypeScript type/interface | PascalCase                   | `User`, `CreateUserInput`              |
| Environment variable      | SCREAMING_SNAKE_CASE         | `DATABASE_URL`, `NEXT_PUBLIC_API_URL`  |

---

## 13. SERVER VS CLIENT COMPONENT

```
Butuh useState / useReducer?                → 'use client'
Butuh useEffect / lifecycle?                → 'use client'
Butuh event handler (onClick, onChange)?    → 'use client'
Butuh browser API (window, localStorage)?  → 'use client'
Butuh third-party library yang butuh DOM?  → 'use client'

Semua kondisi di atas TIDAK ada?           → Server Component (default)
```

**Golden rule:** Push `'use client'` ke leaf node serendah mungkin. Parent tree harus tetap Server Component.

---

## 14. ANTI-PATTERNS

> **AI RULE:** Jangan generate kode yang mengikuti pola di bawah ini.

```typescript
// ❌ Business logic di Server Action
export async function createUserAction(data: FormData) {
  const email = data.get('email')
  const existing = await db.user.findFirst({ where: { email } }) // → harusnya di services.ts
  if (existing) throw new Error('...')
}

// ❌ Fetch data di Client Component
'use client'
export function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => { fetch('/api/users').then(/*...*/) }, []) // → gunakan Server Component
}

// ❌ Fetch internal via /api/ route
// app/(dashboard)/users/page.tsx
const res = await fetch('/api/users') // → panggil userService.getAll() langsung

// ❌ Import antar features langsung
// features/products/services.ts
import { userService } from '@/features/users/services' // → gunakan services/ sebagai mediator

// ❌ Atom import dari domain logic
// components/ui/button.tsx
import { useCart } from '@/features/cart/hooks/useCart' // → atom harus agnostik

// ❌ Tipe any
const data: any = await fetchSomething() // → selalu define type eksplisit

// ❌ Inline style / magic number
<div style={{ marginTop: '17px' }}> // → gunakan Tailwind: mt-4 atau custom token
```

## 15. FILE SIZE & COMPLEXITY LIMITS

Untuk benar-benar menerapkan **Atomic Design** dan **Single Responsibility Principle**, diberlakukan batasan ukuran file:

- **Max 300 - 400 baris per file** untuk React Components (baik Atom, Molecule, Organism, maupun Page). Jika sebuah file UI melebihi batas ini, itu pertanda komponen tersebut melakukan terlalu banyak hal dan harus dipecah menjadi sub-komponen yang lebih kecil, atau logic-nya di-ekstrak ke custom hook.
- **Max 200 - 300 baris per file** untuk file logic di `lib/` (Engines). Jika lebih panjang, pecah menjadi pure functions di file helper yang terpisah.

---
