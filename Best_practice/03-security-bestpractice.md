# 03 · SECURITY CONTEXT

> ⚠️ **INI ADALAH TEMPLATE** — bukan context file project aktual.
> Isi semua bagian yang ditandai `[CUSTOMIZE]`. Hapus blok ini setelah selesai.

> **Baca saat:** membuat API route, Server Action, form input, auth flow, atau fitur yang melibatkan data sensitif.
> Security bukan fitur tambahan — ini built-in dari awal.

---

## 1. PRINSIP KEAMANAN

1. **Never trust the client** — selalu validasi ulang di server, tidak peduli validasi di frontend
2. **Least privilege** — setiap user hanya punya akses ke apa yang mereka butuhkan
3. **Defense in depth** — jangan andalkan satu layer keamanan saja
4. **Fail secure** — saat ragu, tolak akses
5. **Audit everything** — setiap aksi sensitif harus tercatat

---

## 2. AUTHENTICATION

> **AI RULE:** Auth pattern di bawah ini adalah referensi implementasi.
> Sesuaikan dengan auth library yang dipilih di `00-master-context.md` Section Tech Stack.
> Pattern implementasi middleware: lihat `02-architecture-context.md` Section Auth & Role Pattern.

### Pattern Wajib (berlaku di semua auth library)

1. **Session check di server** — jangan pernah trust client-side auth state saja
2. **Helper functions** — buat `getSession()`, `requireAuth()`, `requireRole()` di `lib/auth.ts`
3. **Fail secure** — kalau session check gagal, default ke "tidak punya akses"
4. **Session expiry** — selalu set expiration, jangan biarkan session hidup selamanya
5. **Rate limit auth endpoints** — login, register, reset password wajib di-rate-limit

### Referensi Implementasi: `[CUSTOMIZE — nama auth library]`

```typescript
// lib/auth.ts
// [CUSTOMIZE — config auth library yang dipilih. Contoh di bawah menggunakan Better Auth + Prisma]

import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { db } from './db'

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,          // 7 hari
    updateAge: 60 * 60 * 24,              // refresh setiap 24 jam
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
})

export type Session = typeof auth.$Infer.Session
```

### Helper: Get Session di Server

```typescript
// lib/auth.ts (tambahan)
// [CUSTOMIZE — sesuaikan dengan auth library]

import { headers } from 'next/headers'

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) throw new Error('UNAUTHORIZED')
  return session
}

export async function requireRole(role: 'admin' | 'user') {
  const session = await requireAuth()
  if (session.user.role !== role) throw new Error('FORBIDDEN')
  return session
}
```

---

## 3. AUTHORIZATION — ROLE-BASED ACCESS CONTROL (RBAC)

> Daftar roles dan permissions: lihat `01-product-context.md` Section User Roles & Permissions.

### Middleware (Route Protection)

```typescript
// middleware.ts
// [CUSTOMIZE — sesuaikan routes dan cookie name dengan auth library]

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/api/auth']
const ADMIN_ROUTES = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get('better-auth.session_token') // [CUSTOMIZE — cookie name]
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

### Permission Check di Server Action

```typescript
// Selalu check permission di Server Action, bukan hanya di middleware
export async function deleteProductAction(id: string) {
  // 1. Cek auth
  const session = await requireAuth()

  // 2. Cek role
  if (session.user.role !== 'admin') {
    return { error: 'Tidak punya izin' }
  }

  // 3. Cek ownership (kalau relevan)
  const product = await productQueries.findById(id)
  if (!product) return { error: 'Data tidak ditemukan' }

  // 4. Baru eksekusi
  await productService.delete(id)
  revalidatePath('/products')
  return { success: true }
}
```

---

## 4. INPUT VALIDATION — ZOD

> Schema patterns dan layer rules: lihat `02-architecture-context.md` Section Pola Per Layer (Layer 1: Schema).

### Aturan Validasi

```typescript
// Selalu gunakan .safeParse(), bukan .parse()
// .parse() throw error; .safeParse() return { success, data, error }

// ✅ Benar
const parsed = schema.safeParse(input)
if (!parsed.success) return { error: parsed.error.flatten() }
const safeData = parsed.data

// ❌ Salah — error tidak tertangkap dengan baik
const data = schema.parse(input) // bisa throw unhandled exception
```

### Schema Patterns Penting

```typescript
import { z } from 'zod'

// String sanitization
const nameSchema = z.string()
  .min(1, 'Tidak boleh kosong')
  .max(100, 'Maksimal 100 karakter')
  .trim()
  .regex(/^[a-zA-Z\s]+$/, 'Hanya huruf dan spasi')

// ID validation (hindari injection via ID manipulation)
const idSchema = z.string().cuid2()   // atau .uuid() — [CUSTOMIZE]

// File upload validation
const fileSchema = z.object({
  size: z.number().max(5 * 1024 * 1024, 'Maksimal 5MB'),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})

// Pagination (hindari abuse)
const paginationSchema = z.object({
  page: z.number().int().min(1).max(1000).default(1),
  limit: z.number().int().min(1).max(100).default(20),
})
```

---

## 5. ERROR MESSAGE SECURITY

> **AI RULE:** Error messages yang dikirim ke client TIDAK BOLEH mengekspos detail internal.

### Aturan

| Situasi | ❌ Jangan | ✅ Gunakan |
|---------|-----------|-----------|
| Login gagal | "Email tidak ditemukan" / "Password salah" | "Email atau password salah" |
| Register duplicate | "Email sudah terdaftar" | "Tidak dapat membuat akun. Coba email lain" |
| Resource not found | "Product with ID abc123 not found in table products" | "Data tidak ditemukan" |
| Server error | Stack trace / SQL error | "Terjadi kesalahan. Coba lagi nanti" |
| Permission denied | "User role 'user' cannot access admin panel" | "Tidak punya akses" |

### Pattern di Action Layer

```typescript
try {
  const result = await service.doSomething(data)
  return { data: result }
} catch (err) {
  // Log detail lengkap untuk debugging (server-side only)
  console.error('[ActionName]', err)

  // Return pesan generik ke client
  return { error: 'Terjadi kesalahan. Coba lagi nanti.' }
}
```

---

## 6. OWASP TOP 10 — MITIGASI

### 1. Broken Access Control

**Aturan:** Selalu cek ownership — user hanya bisa akses data miliknya. Jangan hanya cek "sudah login."

```typescript
// [CUSTOMIZE — sesuaikan dengan ORM/database yang dipakai]

// ❌ Salah: hanya cek login, tidak cek ownership
const product = await db.product.findUnique({ where: { id } })

// ✅ Benar: cek login DAN ownership
const product = await db.product.findUnique({
  where: { id, userId: session.user.id }
})
```

### 2. Injection (SQL, XSS)

**Aturan:** Jangan pernah string interpolation di query. Jangan render HTML dari user tanpa sanitasi.

```typescript
// [CUSTOMIZE — sesuaikan dengan ORM/database]

// SQL Injection — Prisma otomatis parameterized queries, tapi hindari queryRaw dengan interpolation:
// ❌ Salah
await db.$queryRaw`SELECT * FROM users WHERE email = '${email}'`

// ✅ Benar
await db.$queryRaw`SELECT * FROM users WHERE email = ${email}`

// XSS — React otomatis escape JSX, tapi hati-hati dengan dangerouslySetInnerHTML:
// ❌ Jangan pernah render HTML dari user input tanpa sanitasi
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// ✅ Gunakan library sanitizer
import DOMPurify from 'dompurify'
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userContent) }} />
```

### 3. Sensitive Data Exposure

**Aturan:** Jangan pernah return seluruh row ke client. Select hanya field yang diperlukan.

```typescript
// [CUSTOMIZE — sesuaikan dengan ORM/database]

// ❌ Salah
const user = await db.user.findUnique({ where: { id } })
return user // includes passwordHash, resetToken, dll.!

// ✅ Benar
const user = await db.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true, role: true }
})
```

### 4. CSRF

```
Server Actions Next.js sudah include CSRF protection built-in.
Untuk API routes yang menerima state-changing requests:
- Gunakan SameSite cookie
- Validasi Origin header
- Kebanyakan auth library handle ini secara otomatis
```

### 5. Security Headers

```typescript
// next.config.ts
// [CUSTOMIZE — sesuaikan CSP dengan kebutuhan project]

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // sesuaikan
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
    ].join('; ')
  },
]
```

---

## 7. ENVIRONMENT VARIABLES — SECRETS MANAGEMENT

> Daftar env vars aktual project: lihat `00-master-context.md` Section Environment & Deployment.

```typescript
// lib/env.ts — validasi semua env vars di sini
// [CUSTOMIZE — sesuaikan dengan env vars project]

import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_SECRET: z.string().min(32),
    // [CUSTOMIZE — tambahkan server env vars]
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    // [CUSTOMIZE — tambahkan client env vars]
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    // [CUSTOMIZE — mapping semua env vars]
  },
})
```

**Aturan secrets:**
- ❌ Tidak pernah commit `.env` (ada di `.gitignore`)
- ❌ Tidak pernah log secrets ke console
- ❌ `NEXT_PUBLIC_` prefix hanya untuk yang benar-benar perlu di client (non-secret)
- ✅ Secrets disimpan di Vercel Environment Variables / vault
- ✅ Rotasi secrets secara berkala
- ✅ Semua env vars harus terdaftar di `lib/env.ts` dan `.env.example`

---

## 8. RATE LIMITING

> **Aturan:** Endpoint sensitif (login, register, reset password, payment) WAJIB punya rate limiting.
> Pilih implementasi sesuai skala project.

### `[CUSTOMIZE — pilih salah satu atau sesuaikan]`

**Opsi 1: Auth library built-in** — jika auth library sudah include rate limiting (Better Auth, dll.)
**Opsi 2: Redis-based** — Upstash / Redis untuk distributed rate limiting (multi-instance)
**Opsi 3: In-memory** — untuk MVP / single-instance deployment

```typescript
// [CUSTOMIZE — implementasi rate limiting sesuai opsi yang dipilih]
// Contoh: Upstash Redis

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  prefix: 'app:ratelimit',
})

// Gunakan di Server Action atau API Route
export async function sensitiveAction() {
  const ip = headers().get('x-forwarded-for') ?? 'unknown'
  const { success } = await rateLimiter.limit(ip)

  if (!success) {
    return { error: 'Terlalu banyak request. Coba lagi nanti.' }
  }

  // ... lanjutkan
}
```

---

## 9. SECURITY RULES PER LAYER

> **AI RULE:** Terapkan rules ini SETIAP KALI menulis kode di layer yang bersangkutan.
> Ini bukan opsional — ini wajib.
> Testing per layer harus cover security cases: lihat `05-testing-qa-context.md`.

### Schema Layer (`schemas.ts`)

- ✅ Semua input dari user WAJIB punya Zod schema
- ✅ String: selalu `.trim()`, selalu `.max()` — tidak ada string tanpa batas panjang
- ✅ ID: selalu `.cuid2()` atau `.uuid()` — jangan terima string bebas sebagai ID
- ✅ File upload: validasi `size` dan `type`
- ❌ Jangan pernah pakai `.parse()` — selalu `.safeParse()`

### Query Layer (`queries.ts`)

- ✅ Selalu `select` field yang diperlukan saja — jangan return seluruh row
- ✅ Ownership scope: sertakan `userId` atau `tenantId` di WHERE clause
- ✅ Pagination: selalu limit results — jangan pernah `findMany()` tanpa `take`
- ❌ Jangan pernah string interpolation di raw query

### Service Layer (`services.ts`)

- ✅ Validasi business rules sebelum mutasi (duplicate check, permission, dll.)
- ✅ Error messages: jangan expose detail internal ke user
- ❌ Jangan pernah trust input tanpa validasi meskipun "sudah divalidasi di action"

### Action Layer (`actions.ts`)

- ✅ SETIAP action yang mutasi data: `requireAuth()` di baris pertama
- ✅ Role check setelah auth check jika action butuh permission khusus
- ✅ Rate limiting untuk action sensitif (login, register, reset password, payment)
- ❌ Jangan pernah return error stack trace ke client

### API Routes (`app/api/`)

- ✅ Validasi webhook signature sebelum proses payload
- ✅ Return response generic untuk error — jangan expose internal state
- ❌ Jangan pernah trust request body tanpa validasi

---

## 10. CHECKLIST SECURITY REVIEW

> Gunakan checklist ini sebelum merge PR yang menyentuh auth/data sensitif.
> Ini adalah final safety net — rules per layer di Section 9 adalah lini pertama.
> Lihat juga: `01-product-context.md` Section Definition of Done.

- [ ] Semua input divalidasi dengan Zod di server (`.safeParse()`)
- [ ] Auth check ada di setiap Server Action yang butuh login
- [ ] Role check ada untuk aksi yang butuh permission khusus
- [ ] Ownership check ada (user tidak bisa akses data user lain)
- [ ] Field sensitif tidak dikirim ke client (gunakan `select`)
- [ ] Tidak ada secret di client-side code
- [ ] Rate limiting ada untuk endpoint sensitif
- [ ] Error message tidak expose internal detail ke user
- [ ] Security headers sudah di-set di `next.config.ts`
- [ ] Environment variables tervalidasi via `lib/env.ts`
