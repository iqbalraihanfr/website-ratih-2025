# Next Phase

Laporan pengembangan lanjutan untuk `website-ratih-2025` setelah implementasi design system v2.

---

## 1. Portfolio Kategori — Saran Layout

Kategori baru: **Foto, Video, Social Media Management, Website**.

### Opsi A — Filter chip + mixed grid (rekomendasi sekarang)

- Strip filter sticky di atas grid: `All · Foto · Video · SMM · Website`
- Style chip: italic uppercase, `text-xs tracking-[0.2em]`, hover `text-yellow-500`, active = yellow underline
- Grid existing (mixed 16:9 + 4:5) tetap, ratio per item adaptif per kategori
- Crossfade animasi saat filter berubah
- URL state: `/portfolio?cat=video` (gampang share, SEO-friendly)
- Pro: minimal nav, scan cepat, satu page
- Con: kurang ideal kalau item ratusan

### Opsi B — Index "lihat semua" + section per kategori

- Page panjang scrollable
- Tiap kategori = eyebrow + h2 italic + grid 2-3 item + CTA "Lihat semua Foto →" ke sub-route
- Pro: storytelling, variety langsung terlihat
- Con: scroll panjang, repetitif

### Opsi C — Tabbed pages dengan sub-route

- `/portfolio/foto`, `/portfolio/video`, `/portfolio/social-media`, `/portfolio/website`
- Tab italic uppercase di bawah `PageHero`, pola Overcrank
- Tiap kategori layout optimal sendiri
- Pro: SEO per kategori, layout per-medium optimal
- Con: lebih banyak file, duplicate chrome

### Opsi D — Hybrid (rekomendasi saat skala naik)

- Landing `/portfolio` = filter chip + grid (Opsi A)
- Klik item → detail `/portfolio/[slug]` (gallery, brief, role, year, link demo/IG)
- Migrasi dari A ke D saat item >20 atau saat butuh case study detail

### Pembedaan visual per kategori dalam grid

| Kategori | Ratio | Overlay |
|---|---|---|
| **Foto** | 4:5 + 16:9 mix | Title + year |
| **Video** | 16:9 | Play icon center, hover autoplay muted clip |
| **Website** | 16:10 (browser frame mock) | Client + stack tags (Next.js, WP, dll) |
| **SMM** | 1:1 atau 4:5 | Handle `@brand` + reach/engagement metric |

**Rekomendasi**: mulai Opsi A sekarang, siapkan migrasi ke D saat butuh detail per project.

---

## 2. Database Status

**Status: belum terhubung. Page statis 100%.**

### Bukti

- `constants/index.ts` hardcoded semua (portfolio, crew, services, socialMedia)
- `BlogContent.tsx` posts hardcoded inline
- `@supabase/supabase-js` ada di `node_modules` (orphan, tidak terdaftar di `package.json` deps)
- `.env.local` punya `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAILS` → disiapkan, **belum dipakai**
- `lib/` cuma `utils.ts` (cn helper). Tidak ada `supabase/client.ts`
- Folder `Best_practice/` kosong (hanya `.DS_Store`)
- `public/images/{bg,crew,portfolio}/` semua aset lokal, bukan storage URL

### Saran Pengembangan DB — Supabase

Key Supabase sudah ada di `.env.local`. Design system bundle juga mengasumsikan Supabase. Stack pas.

#### Schema minimum

```sql
-- portfolio
create table portfolio (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null check (category in ('foto','video','smm','website')),
  client text,
  year int,
  cover_url text not null,
  gallery jsonb default '[]',
  description text,
  tags text[] default '{}',
  featured boolean default false,
  published boolean default true,
  created_at timestamptz default now()
);

-- crew
create table crew (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  photo_url text not null,
  socials jsonb default '{}',
  sort_order int default 0
);

-- services
create table services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tags text[] default '{}',
  sort_order int default 0
);

-- blog
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  body_md text,
  cover_url text,
  author_id uuid references crew(id),
  published_at timestamptz,
  featured boolean default false
);

-- contact_messages (opsional)
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz default now()
);
```

#### Setup steps

1. `pnpm add @supabase/supabase-js @supabase/ssr` (resmi masuk ke deps)
2. Buat `lib/supabase/server.ts` (Server Components) + `lib/supabase/client.ts` (Client Components)
3. Storage bucket: `portfolio/`, `crew/`, `posts/`, `bg/`
4. RLS policy: public `select` for `published=true`, service-role only untuk write
5. Migrasi `constants/index.ts` → server-side fetch per page (Server Component default di App Router)
6. Admin CMS minimal: `/admin/*` protected via `ADMIN_EMAILS` allowlist + Supabase Auth magic link
7. Revalidate via `revalidateTag()` saat admin update content

---

## 3. Architecture Scalability Audit

**Skor: 4/10.** Cukup untuk brochure 1-page. Bermasalah saat mau jadi CMS-driven dan multi-kategori.

### Issues

#### Struktur folder
- `components/` flat — 31 file campur (chrome, page-section, primitive, page-specific)
- Saran restruktur:
  ```
  components/
    layout/      (Header, Footer, ScrollLabel)
    sections/    (Hero, WhyRatih, JasaRatih)
    ui/          (Button, Marquee, StalkRail, Tag, SectionTag)
  app/
    portfolio/
      _components/   (PortfolioGrid, FilterChips)
      page.tsx
  ```
- Pola Next 16: co-locate page-specific di `app/<route>/_components/`

#### Data layer
- Zero abstraction. `constants/index.ts` di-import langsung di komponen
- Tidak ada `lib/data/` atau repository layer
- Tidak ada types (`types/portfolio.ts`)
- Saat pindah ke Supabase, banyak file harus di-refactor

#### TypeScript hygiene
- 4 pre-existing TS error (`Header.tsx`, `Client.tsx`)
- `id: string` di constants tapi di-cast `number` di komponen → type safety bocor
- Tidak ada Zod/Valibot untuk runtime validation (penting saat data dari DB)

#### Komponen design
- Banyak komponen berlapis tipis hanya 1 div: `AllAboutRatih`, `ClientRatih`, `FooterLogo`, `HubungiKami` (0 bytes!)
- Indikasi over-decomposition tanpa alasan
- Tidak ada primitive: pola eyebrow `inline-flex items-center gap-3 text-[11px] ...` di-repeat di 5+ tempat

#### Styling
- Tailwind v4 dipakai → bagus
- `globals.css` punya token shadcn tapi shadcn tidak terpakai
- Deps orphan: `class-variance-authority`, `tailwind-merge`, `tailwindcss-animate`
- Token Ratih (yellow brand, fg-1/2/3) tidak masuk `@theme` Tailwind v4 → tiap komponen literal `text-white/55`, `text-yellow-500`. Susah re-skin.

#### Routing & rendering
- Semua page Server Component default → bagus
- Belum ada `loading.tsx`, `error.tsx`, `not-found.tsx`
- `metadata` cuma generic di root layout. Tiap page perlu sendiri (SEO)
- Tidak ada `sitemap.ts`, `robots.ts`, OG image generator

#### Performance
- `next/image` dipakai → bagus
- Tidak ada `next.config.ts` image domain whitelist (penting saat Supabase storage)
- Tidak ada caching strategy (`revalidate`, `cacheTag`, `unstable_cache`)
- Bundle bloat: `@ionic/react`, `ionicons` di deps tapi tidak dipakai

#### Quality gates
- Tidak ada Prettier config
- Tidak ada Husky / lint-staged
- Tidak ada test (unit/e2e)
- Tidak ada CI workflow (`.github/workflows/`)
- `eslint.config.mjs` ada tapi belum strict

#### Forms & backend
- Contact form pakai `mailto:` (oke untuk MVP)
- Belum ada Server Action atau API route untuk persist message
- Belum ada rate limit / spam protection (Turnstile/hCaptcha)

#### Deployment
- Tidak ada `vercel.json` / `vercel.ts`
- Tidak terlihat env split (preview/prod)

### Rekomendasi prioritas

1. **Bersihkan deps**: hapus `@ionic/react`, `ionicons` jika tidak terpakai. Tambah `@supabase/supabase-js` + `@supabase/ssr` resmi
2. **Hapus dead components**: `HubungiKami.tsx` (kosong), `FooterMenu.tsx` (unused), `ClientRatih.tsx` + `Client.tsx` (broken motion import, tidak dipakai), `AllAboutRatih.tsx` (wrapper 1-liner)
3. **Folder restruktur**: `components/{layout,sections,ui}` + colocate page-specific di `app/<route>/_components/`
4. **`lib/supabase/{server,client}.ts`** + `types/`. Migrasi `constants` jadi DB query
5. **Primitive ekstraksi**: `SectionTag`, `EyebrowLabel`, `Container`, `Button` di `components/ui/`
6. **Tailwind theme tokens**: pindah `--ratih-yellow`, `--fg-2`, `--fg-3` ke `@theme` di `globals.css`. Pakai `text-fg-muted` dst.
7. **SEO**: `metadata` per page + `app/sitemap.ts` + `app/robots.ts` + OG image route
8. **`loading.tsx` + `error.tsx`** per route segment
9. **Admin CMS** sederhana di `/admin/*` (auth allowlist `ADMIN_EMAILS`)
10. **CI**: GitHub Actions → typecheck + lint + build on PR
11. **Quality**: Prettier + Husky + commitlint

### Migrasi tanpa downtime

Tahap aman: bikin `lib/data/portfolio.ts` yang sekarang return `constants.portfolio`. Komponen baca dari sana. Saat DB siap, swap implementasi `lib/data/*` saja — komponen tak berubah.

```ts
// lib/data/portfolio.ts (sekarang)
import { portfolio as staticPortfolio } from "@/constants";
export async function getPortfolio() {
  return staticPortfolio;
}

// lib/data/portfolio.ts (nanti, setelah DB siap)
import { supabase } from "@/lib/supabase/server";
export async function getPortfolio() {
  const { data } = await supabase
    .from("portfolio")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return data ?? [];
}
```

---

## Catatan

Folder `Best_practice/` di root saat ini kosong (hanya `.DS_Store`). Mohon tempel atau drop konten rules best practice, supaya rekomendasi di atas bisa di-align sebelum eksekusi.
