# 00 · MASTER CONTEXT

> ⚠️ **INI ADALAH TEMPLATE** — bukan context file project aktual.
>
> Cara pakai:
> 1. Duplikat semua file `0X-*-context.md` ke project baru
> 2. Isi semua bagian yang ditandai `[CUSTOMIZE]`
> 3. Hapus blok ini setelah semua `[CUSTOMIZE]` sudah terisi
> 4. Bagian tanpa tanda `[CUSTOMIZE]` adalah pattern standar — jangan ubah kecuali ada alasan

> **Baca file ini PERTAMA KALI sebelum melakukan apapun.**
> File ini adalah orchestrator — pointer ke semua konteks yang kamu butuhkan.

---

## 1. IDENTITAS PROYEK

| Key | Value |
|-----|-------|
| **Nama Aplikasi** | `[CUSTOMIZE]` |
| **Deskripsi Singkat** | `[CUSTOMIZE]` |
| **Tipe Aplikasi** | `[CUSTOMIZE]` — contoh: Full-stack SaaS, Dashboard + API, Content site + CMS |
| **Target User** | `[CUSTOMIZE]` |
| **Stage** | `[CUSTOMIZE]` — contoh: MVP, v2, production |
| **Domain / URL** | `[CUSTOMIZE]` |
| **Author** | `[CUSTOMIZE]` |
| **Contact / Links** | `[CUSTOMIZE]` — email, GitHub, LinkedIn, dll. |

---

## 2. TECH STACK

> **AI RULE:** Jangan tambahkan dependency baru tanpa diskusi eksplisit dengan developer.

```
[CUSTOMIZE — isi sesuai stack aktual project. Contoh format:]

Frontend    : Next.js 15 (App Router) + TypeScript 5
Styling     : Tailwind CSS 4 + CSS Custom Properties
Validation  : Zod
ORM/DB      : Prisma + PostgreSQL
Auth        : NextAuth.js v5
Deploy      : Vercel
```

### Dependency Rules

- ❌ Jangan tambah dependency baru tanpa diskusi
- ❌ Jangan suggest migrasi database, auth, atau framework
- ❌ Jangan buat folder top-level baru di luar yang sudah didefinisikan di `02-architecture-context.md`
- ✅ Boleh suggest improvement dalam batasan stack yang sudah ada

---

## 3. CONVENTIONS

| Aspek | Aturan | Contoh |
|-------|--------|--------|
| Code comments | `[CUSTOMIZE]` — EN / ID / bilingual | `// Validate before save` |
| Commit message | `[CUSTOMIZE]` — conventional commits, dll. | `feat(notes): add slug generation` |
| Branch naming | `[CUSTOMIZE]` | `feat/add-note-editor`, `fix/auth-redirect` |
| Error messages (user-facing) | `[CUSTOMIZE]` — EN / ID / bilingual | `"Email tidak valid"` |
| Error messages (developer/log) | `[CUSTOMIZE]` | `"Failed to fetch user"` |
| Env variable naming | SCREAMING_SNAKE_CASE | `DATABASE_URL` |

> Untuk naming conventions kode (file, komponen, fungsi): lihat `02-architecture-context.md` Section Naming Conventions.

---

## 4. DECISIONS LOG

> Catat keputusan arsitektur penting di sini.
> Format: Keputusan → Alasan → Alternatif yang dipertimbangkan.
> Ini bukan changelog — hanya keputusan yang **MENGAPA**, bukan APA.
>
> **AI RULE:** Jangan suggest perubahan yang bertentangan dengan keputusan di tabel ini tanpa konfirmasi eksplisit.

| Keputusan | Alasan | Alternatif Ditolak |
|-----------|--------|--------------------|
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |

---

## 5. DATA FLOW

> Gambarkan jalur data utama di aplikasi ini.
> **AI RULE:** Gunakan pattern ini saat menentukan di mana logic harus ditaruh.

### Read Path (user melihat data)

```
[CUSTOMIZE — contoh:]
Server Component → service → query → DB → return ke component
```

### Write Path (user mengubah data)

```
[CUSTOMIZE — contoh:]
Form submit → Server Action → schema validation → service → query → DB
```

### Auth Flow

```
[CUSTOMIZE — contoh:]
Login form → auth provider → set session/cookie → redirect
```

> Detail implementasi per layer: lihat `02-architecture-context.md` Section Pola Per Layer.
> Detail security & auth: lihat `03-security-context.md`.

---

## 6. STRUKTUR FOLDER

> Update tree ini setiap kali ada perubahan struktur signifikan.
> Untuk pattern dan aturan penempatan file: lihat `02-architecture-context.md`.

```
src/
├── app/                    # Routing only
│   ├── (auth)/             # [CUSTOMIZE] — route group publik
│   ├── (dashboard)/        # [CUSTOMIZE] — route group authenticated
│   ├── api/                # Webhook & third-party callback only
│   └── layout.tsx
├── features/               # Domain logic — satu folder per domain
│   └── [domain]/           # [CUSTOMIZE] — list domain aktual di bawah
├── services/               # Shared services (dipakai 2+ domain)
├── components/
│   ├── ui/                 # Atom (CVA)
│   ├── shared/             # Molecule
│   └── layout/             # Template (header, sidebar, footer)
├── lib/                    # Singleton & config
├── hooks/                  # Shared hooks
├── types/                  # Global types
└── middleware.ts
```

### Domain Aktual

```
[CUSTOMIZE — list features/ yang ada di project ini. Contoh:]

features/
├── auth/
├── users/
├── billing/
└── notifications/
```

---

## 7. DESIGN SYSTEM

> Definisikan tokens utama di `globals.css` sebagai CSS custom properties.
> Detail lengkap styling conventions: lihat `02-architecture-context.md` Section Tailwind Conventions.

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |

### Font Tokens

| Tailwind Class | Font | Usage |
|---------------|------|-------|
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` — heading / body / accent / mono |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |

---

## 8. ATURAN DASAR

### Universal (berlaku di semua project)

1. **TypeScript strict** — tidak ada `any`, selalu define type eksplisit
2. **Feature-based** — kode dikelompokkan per domain di `src/features/[domain]/`
3. **Server-first** — Server Component default; `'use client'` hanya di leaf nodes yang butuh interaktivitas browser
4. **No shortcut imports** — ikuti import rules di `02-architecture-context.md`
5. **Single source of truth untuk types** — Zod schema → `z.infer` → TypeScript type. Bukan sebaliknya

### Project-specific

> `[CUSTOMIZE]` — tambahkan aturan yang hanya berlaku di project ini.

1. `[CUSTOMIZE]`
2. `[CUSTOMIZE]`
3. `[CUSTOMIZE]`

---

## 9. ENVIRONMENT & DEPLOYMENT

### Environment Variables

> **AI RULE:** Jangan hardcode value. Jangan invent env var baru tanpa menambahkannya di sini dan di `.env.example`.

| Variable | Scope | Deskripsi |
|----------|-------|-----------|
| `[CUSTOMIZE]` | server / client | `[CUSTOMIZE]` |
| `[CUSTOMIZE]` | server / client | `[CUSTOMIZE]` |

> **Konvensi:**
> - Client-accessible: prefix `NEXT_PUBLIC_`
> - Server-only: tanpa prefix — JANGAN expose ke client
> - Semua env var harus terdaftar di tabel ini dan di `.env.example`

### Deployment

| Key | Value |
|-----|-------|
| **Platform** | `[CUSTOMIZE]` — contoh: Vercel, Railway, AWS |
| **Branch strategy** | `[CUSTOMIZE]` — contoh: `main` = production, `dev` = preview |
| **Build command** | `[CUSTOMIZE]` |
| **Preview URL pattern** | `[CUSTOMIZE]` |

> Detail CI/CD pipeline: lihat `08-devops-context.md`.

---

## 10. STRUKTUR CONTEXT FILES

> **AI RULE:** Ketika kamu menemukan topik yang overlap dengan context file lain,
> sebutkan file mana yang harus dibaca untuk detail lengkap.
> Jangan assume informasi di satu file sudah cukup jika tabel di bawah menunjukkan
> ada file lain yang lebih spesifik untuk topik tersebut.

| File | Scope | Baca Saat |
|------|-------|-----------|
| `00-master-context.md` | Overview, data flow, identity | Selalu, di awal — **wajib** |
| `01-product-context.md` | Halaman, fitur, content structure | Saat tambah halaman/fitur baru |
| `02-architecture-context.md` | Folder structure, pola kode, import rules | Saat buat/edit file apapun |
| `03-security-context.md` | Auth, authorization, data protection | Saat edit auth/middleware/role |
| `04-sre-perf-context.md` | Caching, performance, monitoring | Saat optimasi performa |
| `05-testing-qa-context.md` | Test strategy, coverage, CI | Saat menulis/review test |
| `06-seo-tech-context.md` | Metadata, sitemap, structured data | Saat edit metadata/SEO |
| `07-content-context.md` | Copywriting, tone, voice | Saat tulis/edit copy UI |
| `08-devops-context.md` | CI/CD, env management, deployment | Saat deploy atau setup pipeline |

---

## 11. CARA BEKERJA DENGAN AI

### Setup prompt yang efektif

```
Baca 00-master-context.md.
[Tambahkan context file yang relevan — lihat tabel di Section 10]
Tugas: [deskripsi spesifik]
```

### Contoh per skenario

**Tambah fitur baru:**
> "Baca 00-master-context.md dan 02-architecture-context.md.
> Buat feature [nama domain] dengan schema, query, service, action, dan komponen."

**Edit UI / styling:**
> "Baca 00-master-context.md (Section Design System) dan 02-architecture-context.md (Section Tailwind + CVA).
> Edit komponen X."

**Setup auth / security:**
> "Baca 00-master-context.md dan 03-security-context.md.
> Implementasi [deskripsi]."

**Menulis test:**
> "Baca 00-master-context.md dan 05-testing-qa-context.md.
> Tulis test untuk [fitur]."

**Deploy / CI:**
> "Baca 00-master-context.md dan 08-devops-context.md.
> [Deskripsi task]."

### AI Behavior Rules

> **AI RULE:** Ikuti aturan ini di setiap interaksi.

**JANGAN:**
- Jangan refactor atau rename file/fungsi yang sudah ada kecuali diminta
- Jangan suggest migrasi stack, library, atau arsitektur kecuali diminta
- Jangan tambah dependency baru tanpa diskusi
- Jangan ubah code style (formatting, naming) yang sudah konsisten di codebase
- Jangan berikan penjelasan panjang jika yang diminta hanya kode
- Jangan assume context dari file yang belum kamu baca — minta developer load file yang relevan

**SELALU:**
- Selalu tanya jika instruksi ambigu, jangan assume
- Selalu sebutkan file mana yang kamu edit/buat dan kenapa
- Selalu ikuti pattern yang sudah ada di codebase, bukan pattern "ideal" versimu
- Selalu rujuk context file yang relevan sebelum mulai coding
