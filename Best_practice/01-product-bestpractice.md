# 01 · PRODUCT CONTEXT

> ⚠️ **INI ADALAH TEMPLATE** — bukan context file project aktual.
> Isi semua bagian yang ditandai `[CUSTOMIZE]`. Hapus blok ini setelah selesai.

> **Baca saat:** membuat fitur baru, mendesain alur user, atau memutuskan scope pekerjaan.

---

## 1. PRODUCT VISION

```
Untuk    : [CUSTOMIZE — target user]
Yang     : [CUSTOMIZE — masalah yang mereka hadapi]
Produk ini adalah : [CUSTOMIZE — kategori produk]
Yang     : [CUSTOMIZE — benefit utama / value proposition]
Tidak seperti : [CUSTOMIZE — alternatif kompetitor]
Produk ini : [CUSTOMIZE — differentiator utama]
```

---

## 2. DOMAIN MODEL

> Entitas-entitas utama dan "kosakata" yang harus konsisten di seluruh codebase.
> **AI RULE:** Gunakan nama entitas ini persis seperti tertulis. Jangan buat sinonim.
>
> Untuk naming conventions dan aturan folder: lihat `02-architecture-context.md` Section Naming Conventions.

### Glossary

| Entitas | Definisi Bisnis | Folder `features/` |
|---------|----------------|---------------------|
| `[CUSTOMIZE]` | `[CUSTOMIZE]` — satu kalimat, bukan teknis | `features/[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `features/[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `features/[CUSTOMIZE]` |

**Aturan naming**: Gunakan nama entitas ini secara konsisten di:
- Nama tabel database
- Nama folder di `features/`
- Nama variable dan prop
- Nama endpoint API (jika ada)
- Copy di UI

### Relasi & Fields

```
[CUSTOMIZE — definisikan fields dan relasi antar entitas. Contoh:]

User
  - id: string (cuid2)
  - email: string (unique)
  - name: string
  - role: enum (user, admin)
  - relasi: has many Order

Order
  - id: string
  - userId: string
  - status: enum (pending, paid, cancelled)
  - relasi: belongs to User, has many OrderItem
```

---

## 3. USER ROLES & PERMISSIONS

| Role | Deskripsi | Akses |
|------|-----------|-------|
| `guest` | Belum login | Halaman publik saja |
| `user` | User terdaftar | Dashboard, fitur dasar |
| `admin` | Admin aplikasi | Semua fitur + manajemen user |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |

> Tambahkan role sesuai kebutuhan domain.
> Detail implementasi auth & authorization: lihat `03-security-context.md`.

---

## 4. FITUR INTI

> List fitur yang harus ada di MVP. Setiap fitur punya deskripsi singkat dan status.

| Fitur | Deskripsi | Status |
|-------|-----------|--------|
| Auth | Register, login, reset password | `[CUSTOMIZE]` — planned / in-progress / done |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |

> Detail user flow per fitur: dokumentasikan di Section 5 jika flow-nya non-obvious.

---

## 5. USER FLOWS

> Dokumentasikan di sini **HANYA** untuk flow yang non-obvious atau multi-step.
> Flow sederhana (CRUD standar) tidak perlu didokumentasikan.
> **AI RULE:** Jika flow sudah didefinisikan di sini, ikuti urutan langkahnya — jangan skip atau tambah langkah tanpa diskusi.

### [CUSTOMIZE — nama flow]

```
1. [CUSTOMIZE]
2. [CUSTOMIZE]
3. [CUSTOMIZE]
```

> Tambahkan flow tambahan sesuai kebutuhan. Hapus section ini jika semua fitur adalah CRUD standar.

---

## 6. HALAMAN & ROUTES

| Route | Route Group | Akses | Deskripsi |
|-------|-------------|-------|-----------|
| `/` | — | Public | Landing page |
| `/login` | `(auth)` | Guest only | Form login |
| `/register` | `(auth)` | Guest only | Form registrasi |
| `/dashboard` | `(dashboard)` | Auth required | Overview user |
| `/dashboard/[feature]` | `(dashboard)` | Auth required | `[CUSTOMIZE]` |
| `/admin` | `(admin)` | Admin only | Panel admin |
| `/api/[...]` | — | Varies | Webhook & third-party only |
| `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` | `[CUSTOMIZE]` |

> Untuk folder structure dan route group pattern: lihat `02-architecture-context.md`.

---

## 7. OUT OF SCOPE (MVP)

> Fitur-fitur ini **TIDAK** dibangun sekarang. Catat di sini supaya tidak melebar.
> **AI RULE:** Jangan suggest atau implement fitur yang ada di list ini.
>
> Untuk alasan kenapa fitur tertentu di-exclude: lihat `00-master-context.md` Section Decisions Log.

- [ ] `[CUSTOMIZE]`
- [ ] `[CUSTOMIZE]`
- [ ] `[CUSTOMIZE]`

---

## 8. DEFINITION OF DONE

> Sebuah fitur dianggap selesai jika:

- [ ] Tidak ada TypeScript error
- [ ] Error state di-handle dan ditampilkan ke user
- [ ] Loading state ada
- [ ] Mobile-responsive
- [ ] Unit test untuk service/business logic
- [ ] E2E test untuk flow utama (jika applicable)
- [ ] `[CUSTOMIZE]` — tambahkan sesuai standar project

> Detail testing strategy per layer: lihat `05-testing-qa-context.md`.
