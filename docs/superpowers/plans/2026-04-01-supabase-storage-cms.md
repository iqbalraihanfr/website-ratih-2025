# Supabase Storage + CMS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all images to Supabase Storage as optimized WebP, build a CMS admin panel so a dedicated admin can manage copywriting and images for the website.

**Architecture:** Supabase Storage for CDN-served WebP images. Supabase PostgreSQL for CMS content (blog, portfolio, crew, services). Next.js `/admin` routes with Supabase Auth (email/password) for the admin panel. Frontend components fetch content from Supabase instead of hardcoded constants. Sharp library for WebP conversion during migration and admin uploads.

**Tech Stack:** Next.js 16 (App Router), Supabase (Auth, Storage, Database), Sharp (image optimization), TypeScript, Tailwind CSS v4

---

## File Structure

### New Files
```
lib/
  supabase.ts              (modify) — add server client, storage helpers
  supabase-server.ts       — server-side Supabase client (for RSC/Server Actions)
  storage.ts               — storageUrl() helper + WebP upload utility
  types/database.ts        — TypeScript types for all CMS tables

scripts/
  migrate-images.ts        — one-time script: convert PNG→WebP, upload to Storage

app/
  admin/
    layout.tsx             — admin layout with sidebar nav + auth guard
    page.tsx               — admin dashboard (content counts overview)
    login/page.tsx         — admin login page
    blog/
      page.tsx             — blog posts list (CRUD)
      new/page.tsx         — create new blog post
      [id]/edit/page.tsx   — edit blog post
    portfolio/
      page.tsx             — portfolio items list (CRUD)
    crew/
      page.tsx             — team members list (CRUD)
    services/
      page.tsx             — services list (CRUD)

  actions/
    auth.ts                — login/logout server actions
    blog.ts                — blog CRUD server actions
    portfolio.ts           — portfolio CRUD server actions
    crew.ts                — crew CRUD server actions
    services.ts            — services CRUD server actions
    upload.ts              — image upload server action (WebP conversion)

components/
  admin/
    AdminSidebar.tsx       — sidebar navigation for admin
    ImageUploader.tsx       — drag-drop image upload with preview
    RichTextEditor.tsx      — textarea with basic formatting for blog
    DataTable.tsx           — reusable table for list pages
    FormField.tsx           — reusable form field wrapper
    DeleteConfirm.tsx       — confirmation dialog for deletes

next.config.ts             (modify) — add Supabase image domain
```

### Modified Files
```
constants/index.ts         (modify) — keep as fallback, export types
components/HomeBg.tsx      (modify) — use storageUrl() for background
components/AboutHead.tsx   (modify) — use storageUrl() for background
components/PortfolioHead.tsx (modify) — use storageUrl() for background
components/BlogHead.tsx    (modify) — use storageUrl() for background
components/RatihCrew.tsx   (modify) — fetch from Supabase, storageUrl()
components/PortfolioContent.tsx (modify) — fetch from Supabase
components/JasaRatih.tsx   (modify) — fetch from Supabase
components/LogoRatih.tsx   (modify) — use storageUrl() for logo
components/FooterLogo.tsx  (modify) — use storageUrl() for logo
components/HomeSection.tsx (modify) — use storageUrl() for logo
components/Header.tsx      (modify) — use storageUrl() for logo
app/blog/page.tsx          (modify) — fetch blog posts from Supabase
```

---

## Phase 1: Infrastructure

### Task 1: Create Supabase Storage Bucket

**Files:**
- None (Supabase MCP operations)

- [ ] **Step 1: Create public `images` bucket via Supabase**

Use MCP tool `mcp__supabase__execute_sql` to create a public storage bucket:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  10485760,
  ARRAY['image/webp', 'image/svg+xml', 'image/png', 'image/jpeg']
);
```

- [ ] **Step 2: Set up Storage RLS policies**

```sql
-- Anyone can view public images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Only authenticated users can upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Only authenticated users can update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Only authenticated users can delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```

- [ ] **Step 3: Verify bucket exists**

```sql
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id = 'images';
```

Expected: One row with `public = true`.

---

### Task 2: Create CMS Database Schema

**Files:**
- None (Supabase MCP migration)

- [ ] **Step 1: Create `team_members` table**

```sql
CREATE TABLE public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT DEFAULT '',
  image_path TEXT DEFAULT '',
  social_links JSONB DEFAULT '[]'::jsonb,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.team_members
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth write" ON public.team_members
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 2: Create `portfolio_items` table**

```sql
CREATE TABLE public.portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'photography',
  image_path TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.portfolio_items
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth write" ON public.portfolio_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 3: Create `services` table**

```sql
CREATE TABLE public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_path TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.services
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth write" ON public.services
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 4: Create `blog_posts` table**

```sql
CREATE TABLE public.blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT DEFAULT '',
  excerpt TEXT DEFAULT '',
  cover_image_path TEXT DEFAULT '',
  author TEXT DEFAULT '',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can only read published posts
CREATE POLICY "Public read published" ON public.blog_posts
  FOR SELECT TO public USING (is_published = true);

-- Authenticated can read all (including drafts)
CREATE POLICY "Auth read all" ON public.blog_posts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth write" ON public.blog_posts
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at DESC);
```

- [ ] **Step 5: Create `site_settings` table for misc content**

```sql
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read" ON public.site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Auth write" ON public.site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

- [ ] **Step 6: Create updated_at trigger function**

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

- [ ] **Step 7: Verify all tables exist**

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('team_members', 'portfolio_items', 'services', 'blog_posts', 'site_settings')
ORDER BY table_name;
```

Expected: 5 rows returned.

---

### Task 3: Create Admin User via Supabase Auth

**Files:**
- None (Supabase dashboard/MCP operation)

- [ ] **Step 1: Create admin user**

Use Supabase Dashboard > Authentication > Users > Add User, or via SQL:

```sql
-- This creates the auth user. Password should be set via Supabase Dashboard.
-- The admin will use email: (ask user for admin email)
-- Set up via Supabase Dashboard > Authentication > Users > "Add User"
```

**Note:** Ask the user for the admin email address before proceeding. The admin will set their own password via the Supabase Dashboard.

- [ ] **Step 2: Verify auth is working**

Check Supabase Dashboard > Authentication > Users to confirm the admin user exists.

---

## Phase 2: Image Migration

### Task 4: Install Sharp & Create Storage Helpers

**Files:**
- Modify: `lib/supabase.ts`
- Create: `lib/supabase-server.ts`
- Create: `lib/storage.ts`
- Create: `lib/types/database.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Install Sharp**

```bash
pnpm add sharp
pnpm add -D @types/node
```

- [ ] **Step 2: Update `next.config.ts` to allow Supabase image domain**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ltggfkdlambmhehaxabn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 3: Create `lib/supabase-server.ts`**

```typescript
import { createClient } from "@supabase/supabase-js";

export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
```

**Note:** Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` (get from Supabase Dashboard > Settings > API > `service_role` key). This key is server-only and never exposed to the client.

- [ ] **Step 4: Create `lib/storage.ts`**

```typescript
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Generate public URL for an image in Supabase Storage.
 * @param path - Path within the `images` bucket, e.g. "crew/nathann-bg.webp"
 */
export function storageUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/images/${path}`;
}
```

- [ ] **Step 5: Create `lib/types/database.ts`**

```typescript
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_path: string;
  social_links: { platform: string; url: string; icon: string }[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_path: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image_path: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_path: string;
  author: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/supabase-server.ts lib/storage.ts lib/types/database.ts next.config.ts
git commit -m "feat: add Supabase server client, storage helpers, and CMS types"
```

---

### Task 5: Create & Run Image Migration Script

**Files:**
- Create: `scripts/migrate-images.ts`

- [ ] **Step 1: Create migration script `scripts/migrate-images.ts`**

This script reads all PNG images from `public/images/`, converts them to WebP (quality 85, HD), and uploads to Supabase Storage. SVGs are uploaded as-is.

```typescript
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname, relative } from "path";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BUCKET = "images";
const PUBLIC_DIR = join(process.cwd(), "public", "images");

// WebP quality — 85 is a good balance of size vs HD sharpness
const WEBP_QUALITY = 85;

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function migrateImages() {
  const files = await getAllFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} files to migrate\n`);

  for (const filePath of files) {
    const ext = extname(filePath).toLowerCase();
    const relativePath = relative(PUBLIC_DIR, filePath);

    if (ext === ".svg") {
      // Upload SVGs as-is
      const buffer = readFileSync(filePath);
      const storagePath = relativePath;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: "image/svg+xml",
          upsert: true,
        });
      if (error) {
        console.error(`FAIL [SVG] ${storagePath}: ${error.message}`);
      } else {
        console.log(`OK   [SVG] ${storagePath} (${(buffer.length / 1024).toFixed(0)}KB)`);
      }
    } else if ([".png", ".jpg", ".jpeg"].includes(ext)) {
      // Convert to WebP
      const buffer = readFileSync(filePath);
      const originalSize = buffer.length;
      const webpBuffer = await sharp(buffer)
        .webp({ quality: WEBP_QUALITY })
        .toBuffer();
      const storagePath = relativePath.replace(/\.(png|jpg|jpeg)$/i, ".webp");
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, webpBuffer, {
          contentType: "image/webp",
          upsert: true,
        });
      if (error) {
        console.error(`FAIL [WebP] ${storagePath}: ${error.message}`);
      } else {
        const savings = ((1 - webpBuffer.length / originalSize) * 100).toFixed(0);
        console.log(
          `OK   [WebP] ${storagePath} (${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(webpBuffer.length / 1024).toFixed(0)}KB, -${savings}%)`
        );
      }
    } else {
      console.log(`SKIP ${relativePath} (unsupported format)`);
    }
  }

  console.log("\nMigration complete!");
}

migrateImages().catch(console.error);
```

- [ ] **Step 2: Run the migration script**

```bash
npx tsx scripts/migrate-images.ts
```

Expected output showing each file converted and uploaded with size savings, e.g.:
```
Found 22 files to migrate

OK   [SVG] logo-ratih.svg (12KB)
OK   [WebP] bg/bg.webp (1.9MB → 180KB, -91%)
OK   [WebP] crew/nathann-bg.webp (10.3MB → 420KB, -96%)
...

Migration complete!
```

- [ ] **Step 3: Verify uploads in Supabase**

```sql
SELECT name, metadata->>'mimetype' as mimetype, metadata->>'size' as size_bytes
FROM storage.objects
WHERE bucket_id = 'images'
ORDER BY name;
```

Expected: ~22 rows (15 WebP + 7 SVG files).

- [ ] **Step 4: Commit**

```bash
git add scripts/migrate-images.ts
git commit -m "feat: add image migration script (PNG→WebP + Supabase upload)"
```

---

### Task 6: Seed CMS Tables with Existing Data

**Files:**
- Create: `scripts/seed-cms.ts`

- [ ] **Step 1: Create seed script `scripts/seed-cms.ts`**

This script inserts the existing hardcoded data from `constants/index.ts` into Supabase tables.

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  // Seed team members
  const crewData = [
    {
      name: "Rijal",
      role: "Graphic Designer",
      image_path: "crew/rijal-bg.webp",
      display_order: 1,
      social_links: [
        { platform: "instagram", url: "/", icon: "ri-instagram-line" },
        { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
      ],
    },
    {
      name: "Ndar",
      role: "Content Writer",
      image_path: "crew/ndar-bg.webp",
      display_order: 2,
      social_links: [
        { platform: "instagram", url: "/", icon: "ri-instagram-line" },
        { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
      ],
    },
    {
      name: "Yan",
      role: "Photographer",
      image_path: "crew/yan-bg.webp",
      display_order: 3,
      social_links: [
        { platform: "instagram", url: "/", icon: "ri-instagram-line" },
        { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
      ],
    },
    {
      name: "Nathann",
      role: "Videographer",
      image_path: "crew/nathann-bg.webp",
      display_order: 4,
      social_links: [
        { platform: "instagram", url: "/", icon: "ri-instagram-line" },
        { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
      ],
    },
    {
      name: "Sastra",
      role: "Video Editor",
      image_path: "crew/sastra-bg.webp",
      display_order: 5,
      social_links: [
        { platform: "instagram", url: "/", icon: "ri-instagram-line" },
        { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
      ],
    },
    {
      name: "Pipp",
      role: "Web Developer",
      image_path: "crew/pipp-bg.webp",
      display_order: 6,
      social_links: [
        { platform: "instagram", url: "/", icon: "ri-instagram-line" },
        { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
      ],
    },
    {
      name: "Raihaan",
      role: "Web Developer",
      image_path: "crew/raihaan-bg.webp",
      display_order: 7,
      social_links: [
        { platform: "instagram", url: "/", icon: "ri-instagram-line" },
        { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
      ],
    },
  ];

  const { error: crewError } = await supabase
    .from("team_members")
    .upsert(crewData, { onConflict: "name" });
  if (crewError) console.error("Crew seed failed:", crewError.message);
  else console.log(`OK   Seeded ${crewData.length} team members`);

  // Seed portfolio items
  const portfolioData = [
    {
      title: "Festival Dongkrek",
      category: "photography",
      image_path: "portfolio/festival-dongkrek.webp",
      display_order: 1,
    },
    {
      title: "Kirab Budaya Mejayan",
      category: "photography",
      image_path: "portfolio/kirab-budaya-mejayan.webp",
      display_order: 2,
    },
    {
      title: "Pahlawan CFN",
      category: "photography",
      image_path: "portfolio/pahlawan-cfn.webp",
      display_order: 3,
    },
    {
      title: "Promosi UMKM",
      category: "photography",
      image_path: "portfolio/promosi-umkm.webp",
      display_order: 4,
    },
  ];

  const { error: portfolioError } = await supabase
    .from("portfolio_items")
    .upsert(portfolioData, { onConflict: "title" });
  if (portfolioError) console.error("Portfolio seed failed:", portfolioError.message);
  else console.log(`OK   Seeded ${portfolioData.length} portfolio items`);

  // Seed services
  const servicesData = [
    {
      title: "Fotografi",
      description:
        "Kami menyediakan layanan fotografi profesional untuk berbagai kebutuhan, mulai dari foto produk, acara, hingga konten media sosial. Dengan peralatan terkini dan tim fotografer berpengalaman, kami memastikan setiap gambar yang dihasilkan berkualitas tinggi dan sesuai dengan visi klien.",
      image_path: "services/fotografi.webp",
      display_order: 1,
    },
    {
      title: "Videografi",
      description:
        "Layanan videografi kami mencakup pembuatan video promosi, dokumentasi acara, company profile, dan konten video kreatif lainnya. Kami menggabungkan teknik sinematografi modern dengan storytelling yang menarik untuk menghasilkan video yang memukau.",
      image_path: "services/videografi.webp",
      display_order: 2,
    },
    {
      title: "Desain Grafis",
      description:
        "Tim desainer grafis kami siap membantu kebutuhan visual brand Anda, mulai dari desain logo, poster, brosur, hingga konten media sosial. Setiap desain dibuat dengan perhatian detail dan estetika yang sesuai dengan identitas brand klien.",
      image_path: "services/branding.webp",
      display_order: 3,
    },
    {
      title: "Branding",
      description:
        "Kami membantu membangun dan mengembangkan identitas brand Anda secara menyeluruh. Dari strategi branding, visual identity, hingga brand guidelines yang konsisten dan profesional.",
      image_path: "services/branding.webp",
      display_order: 4,
    },
    {
      title: "Social Media Management",
      description:
        "Layanan pengelolaan media sosial yang komprehensif, mencakup perencanaan konten, pembuatan konten visual, copywriting, dan analisis performa. Kami membantu brand Anda tumbuh dan terhubung dengan audiens yang tepat.",
      image_path: "services/branding.webp",
      display_order: 5,
    },
  ];

  const { error: servicesError } = await supabase
    .from("services")
    .upsert(servicesData, { onConflict: "title" });
  if (servicesError) console.error("Services seed failed:", servicesError.message);
  else console.log(`OK   Seeded ${servicesData.length} services`);

  // Seed site settings (background images, about text, etc.)
  const settingsData = [
    {
      key: "home_bg",
      value: { image_path: "bg/bg.webp" },
    },
    {
      key: "about_bg",
      value: { image_path: "bg/bg-3.webp" },
    },
    {
      key: "portfolio_bg",
      value: { image_path: "bg/bg-4.webp" },
    },
    {
      key: "blog_bg",
      value: { image_path: "bg/bg-2.webp" },
    },
    {
      key: "about_text",
      value: {
        paragraphs: [
          "RATIH Creative Media adalah sebuah startup media kreatif berbasis di Kabupaten Madiun yang bergerak di bidang jasa fotografi, videografi, desain grafis, serta pengelolaan media sosial.",
          "Didirikan dengan semangat kolaboratif dan inovatif, RATIH hadir untuk membantu individu, komunitas, dan pelaku usaha dalam membangun citra visual yang profesional dan berdaya saing.",
        ],
      },
    },
  ];

  for (const setting of settingsData) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(setting, { onConflict: "key" });
    if (error) console.error(`Setting "${setting.key}" failed:`, error.message);
    else console.log(`OK   Setting "${setting.key}"`);
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
```

- [ ] **Step 2: Run the seed script**

```bash
npx tsx scripts/seed-cms.ts
```

Expected:
```
OK   Seeded 7 team members
OK   Seeded 4 portfolio items
OK   Seeded 5 services
OK   Setting "home_bg"
OK   Setting "about_bg"
OK   Setting "portfolio_bg"
OK   Setting "blog_bg"
OK   Setting "about_text"

Seed complete!
```

- [ ] **Step 3: Verify seeded data**

```sql
SELECT 'team_members' as tbl, count(*) FROM public.team_members
UNION ALL
SELECT 'portfolio_items', count(*) FROM public.portfolio_items
UNION ALL
SELECT 'services', count(*) FROM public.services
UNION ALL
SELECT 'site_settings', count(*) FROM public.site_settings;
```

Expected: team_members=7, portfolio_items=4, services=5, site_settings=5.

- [ ] **Step 4: Commit**

```bash
git add scripts/seed-cms.ts
git commit -m "feat: add CMS data seeding script"
```

---

## Phase 3: Update Frontend Components

### Task 7: Update Background Image Components

**Files:**
- Modify: `components/HomeBg.tsx`
- Modify: `components/AboutHead.tsx`
- Modify: `components/PortfolioHead.tsx`
- Modify: `components/BlogHead.tsx`

- [ ] **Step 1: Update `components/HomeBg.tsx`**

Change the inline CSS `background-image` from local path to Supabase Storage URL.

Replace:
```tsx
backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url('/images/bg/bg.png')`,
```
With:
```tsx
backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url('${storageUrl("bg/bg.webp")}')`,
```

Add import at top:
```tsx
import { storageUrl } from "@/lib/storage";
```

- [ ] **Step 2: Update `components/AboutHead.tsx`**

Same pattern — replace `/images/bg/bg-3.png` with `storageUrl("bg/bg-3.webp")`.

Add import:
```tsx
import { storageUrl } from "@/lib/storage";
```

Replace the background-image URL accordingly.

- [ ] **Step 3: Update `components/PortfolioHead.tsx`**

Replace `/images/bg/bg-4.png` with `storageUrl("bg/bg-4.webp")`.

- [ ] **Step 4: Update `components/BlogHead.tsx`**

Replace `/images/bg/bg-2.png` with `storageUrl("bg/bg-2.webp")`.

- [ ] **Step 5: Verify in dev server**

```bash
pnpm dev
```

Open each page in browser and verify backgrounds load correctly. Check Network tab to confirm images are served from `ltggfkdlambmhehaxabn.supabase.co`.

- [ ] **Step 6: Commit**

```bash
git add components/HomeBg.tsx components/AboutHead.tsx components/PortfolioHead.tsx components/BlogHead.tsx
git commit -m "feat: serve background images from Supabase Storage (WebP)"
```

---

### Task 8: Update Logo & Image Components

**Files:**
- Modify: `components/HomeSection.tsx`
- Modify: `components/LogoRatih.tsx`
- Modify: `components/FooterLogo.tsx`
- Modify: `components/Header.tsx`
- Modify: `components/DesktopMenu.tsx`
- Modify: `components/MobileMenu.tsx`
- Modify: `constants/index.ts`

- [ ] **Step 1: Update `constants/index.ts` logo URLs**

Replace all local logo paths with Supabase Storage paths. The `storageUrl()` function will be called in the components, so constants should store just the storage path.

Replace:
```typescript
logoURL: "/images/logo-ratih.svg"
```
With:
```typescript
logoURL: "logo-ratih.svg"
```

Do this for all `logoURL` entries in `headerData`.

- [ ] **Step 2: Update `components/Header.tsx`**

Add storage import and wrap logo URL:

```tsx
import { storageUrl } from "@/lib/storage";
```

Where `logoItem.logoURL` is used in `<Image src={...}>`, change to:
```tsx
<Image src={storageUrl(logoItem.logoURL)} ... />
```

- [ ] **Step 3: Update `components/DesktopMenu.tsx`**

Same pattern — add `storageUrl` import and wrap `items.logoURL`.

- [ ] **Step 4: Update `components/MobileMenu.tsx`**

Same pattern — add `storageUrl` import and wrap `logoItem.logoURL`.

- [ ] **Step 5: Update `components/HomeSection.tsx`**

Replace:
```tsx
src="/images/logo-ratih-2.svg"
```
With:
```tsx
src={storageUrl("logo-ratih-2.svg")}
```

Add import:
```tsx
import { storageUrl } from "@/lib/storage";
```

- [ ] **Step 6: Update `components/LogoRatih.tsx`**

Replace the local path with `storageUrl("logo-ratih.svg")`.

- [ ] **Step 7: Update `components/FooterLogo.tsx`**

Replace the local path with `storageUrl("logo-ratih.svg")`.

- [ ] **Step 8: Update crew and portfolio image paths in `constants/index.ts`**

Replace crew `imgURL` values:
```typescript
// From:
imgURL: "/images/crew/rijal-bg.png"
// To:
imgURL: "crew/rijal-bg.webp"
```

Replace portfolio `imgURL` values:
```typescript
// From:
imgURL: "/images/portfolio/festival-dongkrek.png"
// To:
imgURL: "portfolio/festival-dongkrek.webp"
```

- [ ] **Step 9: Update `components/RatihCrew.tsx`**

Add `storageUrl` import and wrap `crew.imgURL`:
```tsx
<Image src={storageUrl(crew.imgURL)} ... />
```

- [ ] **Step 10: Update `components/PortfolioContent.tsx`**

Add `storageUrl` import and wrap `items.imgURL`:
```tsx
<Image src={storageUrl(items.imgURL)} ... />
```

- [ ] **Step 11: Update `components/JasaRatih.tsx`**

Replace hardcoded `/images/portfolio/promosi-umkm.png` with `storageUrl("portfolio/promosi-umkm.webp")`.

- [ ] **Step 12: Verify all pages in dev server**

Open all 5 pages, confirm every image loads from Supabase. Check browser Network tab for `.webp` content-type headers.

- [ ] **Step 13: Commit**

```bash
git add components/ constants/index.ts
git commit -m "feat: migrate all image references to Supabase Storage (WebP)"
```

---

## Phase 4: Admin Panel

### Task 9: Admin Auth Setup

**Files:**
- Create: `app/actions/auth.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`

- [ ] **Step 1: Create `app/actions/auth.ts`**

```typescript
"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = getSupabase();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Store session tokens in cookies
  const cookieStore = await cookies();
  cookieStore.set("sb-access-token", data.session.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: data.session.expires_in,
    path: "/",
  });
  cookieStore.set("sb-refresh-token", data.session.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("sb-access-token");
  cookieStore.delete("sb-refresh-token");
  redirect("/admin/login");
}

export async function getSession() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) return null;

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error) return null;
  return data.session;
}
```

- [ ] **Step 2: Create `app/admin/login/page.tsx`**

```tsx
import { login } from "@/app/actions/auth";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Admin Login
        </h1>
        <form action={login} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none"
              placeholder="admin@ratih.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-zinc-400">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white placeholder-zinc-500 focus:border-yellow-500 focus:outline-none"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-yellow-500 px-4 py-2 font-semibold text-zinc-900 hover:bg-yellow-400 transition-colors"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/admin/layout.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Allow login page without auth
  // Layout wraps all /admin/* routes including /admin/login
  // We check pathname via a different mechanism below

  if (!session) {
    // If not logged in, only allow the login page
    // This layout still renders for login, but the sidebar won't show
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add app/actions/auth.ts app/admin/login/page.tsx app/admin/layout.tsx
git commit -m "feat: add admin auth (login, session, layout)"
```

---

### Task 10: Admin Sidebar & Dashboard

**Files:**
- Create: `components/admin/AdminSidebar.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Create `components/admin/AdminSidebar.tsx`**

```tsx
import Link from "next/link";
import { logout } from "@/app/actions/auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: "ri-dashboard-line" },
  { label: "Blog", href: "/admin/blog", icon: "ri-article-line" },
  { label: "Portfolio", href: "/admin/portfolio", icon: "ri-gallery-line" },
  { label: "Tim", href: "/admin/crew", icon: "ri-team-line" },
  { label: "Layanan", href: "/admin/services", icon: "ri-service-line" },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-8 text-lg font-bold text-yellow-500">
        Ratih CMS
      </h2>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <i className={item.icon} />
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={logout}>
        <button
          type="submit"
          className="mt-4 w-full rounded-md border border-zinc-700 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          Keluar
        </button>
      </form>
    </aside>
  );
}
```

- [ ] **Step 2: Create `app/admin/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const supabase = createServerClient();

  const [teamCount, portfolioCount, servicesCount, blogCount] =
    await Promise.all([
      supabase.from("team_members").select("*", { count: "exact", head: true }),
      supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
      supabase.from("services").select("*", { count: "exact", head: true }),
      supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    ]);

  const stats = [
    { label: "Tim", count: teamCount.count ?? 0, href: "/admin/crew" },
    { label: "Portfolio", count: portfolioCount.count ?? 0, href: "/admin/portfolio" },
    { label: "Layanan", count: servicesCount.count ?? 0, href: "/admin/services" },
    { label: "Blog", count: blogCount.count ?? 0, href: "/admin/blog" },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-white">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-yellow-500/50"
          >
            <p className="text-3xl font-bold text-yellow-500">{stat.count}</p>
            <p className="mt-1 text-sm text-zinc-400">{stat.label}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/admin/AdminSidebar.tsx app/admin/page.tsx
git commit -m "feat: add admin sidebar and dashboard"
```

---

### Task 11: Image Uploader Component

**Files:**
- Create: `app/actions/upload.ts`
- Create: `components/admin/ImageUploader.tsx`

- [ ] **Step 1: Create `app/actions/upload.ts`**

```typescript
"use server";

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { cookies } from "next/headers";

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) throw new Error("Not authenticated");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return supabase;
}

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File;
  const folder = formData.get("folder") as string; // e.g. "crew", "portfolio", "bg"

  if (!file) return { error: "No file provided" };

  const supabase = await getAuthenticatedClient();
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop()?.toLowerCase();

  let uploadBuffer: Buffer;
  let contentType: string;
  let fileName: string;

  if (ext === "svg") {
    uploadBuffer = buffer;
    contentType = "image/svg+xml";
    fileName = file.name;
  } else {
    // Convert to WebP (quality 85 for HD)
    uploadBuffer = await sharp(buffer).webp({ quality: 85 }).toBuffer();
    contentType = "image/webp";
    fileName = file.name.replace(/\.(png|jpg|jpeg|gif|bmp)$/i, ".webp");
  }

  const storagePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from("images")
    .upload(storagePath, uploadBuffer, {
      contentType,
      upsert: true,
    });

  if (error) return { error: error.message };

  return { path: storagePath };
}

export async function deleteImage(path: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.storage.from("images").remove([path]);
  if (error) return { error: error.message };
  return { success: true };
}
```

- [ ] **Step 2: Create `components/admin/ImageUploader.tsx`**

```tsx
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/actions/upload";
import { storageUrl } from "@/lib/storage";

interface ImageUploaderProps {
  currentPath?: string;
  folder: string;
  onUploaded: (path: string) => void;
}

export function ImageUploader({
  currentPath,
  folder,
  onUploaded,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    currentPath ? storageUrl(currentPath) : null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    const result = await uploadImage(formData);
    setUploading(false);

    if (result.error) {
      alert(`Upload gagal: ${result.error}`);
      setPreview(currentPath ? storageUrl(currentPath) : null);
      return;
    }

    if (result.path) {
      setPreview(storageUrl(result.path));
      onUploaded(result.path);
    }
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative h-40 w-full overflow-hidden rounded-md border border-zinc-700">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <p className="text-sm text-white">Mengupload...</p>
            </div>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 disabled:opacity-50"
      >
        {currentPath ? "Ganti Gambar" : "Upload Gambar"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/actions/upload.ts components/admin/ImageUploader.tsx
git commit -m "feat: add image upload with WebP conversion"
```

---

### Task 12: Admin CRUD — Blog Posts

**Files:**
- Create: `app/actions/blog.ts`
- Create: `app/admin/blog/page.tsx`
- Create: `app/admin/blog/new/page.tsx`
- Create: `app/admin/blog/[id]/edit/page.tsx`

- [ ] **Step 1: Create `app/actions/blog.ts`**

```typescript
"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;

  if (!accessToken || !refreshToken) throw new Error("Not authenticated");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return supabase;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createBlogPost(formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const author = formData.get("author") as string;
  const coverImagePath = formData.get("cover_image_path") as string;
  const isPublished = formData.get("is_published") === "on";

  const { error } = await supabase.from("blog_posts").insert({
    title,
    slug: slugify(title),
    content,
    excerpt,
    author,
    cover_image_path: coverImagePath || "",
    is_published: isPublished,
    published_at: isPublished ? new Date().toISOString() : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const author = formData.get("author") as string;
  const coverImagePath = formData.get("cover_image_path") as string;
  const isPublished = formData.get("is_published") === "on";

  const { error } = await supabase
    .from("blog_posts")
    .update({
      title,
      slug: slugify(title),
      content,
      excerpt,
      author,
      cover_image_path: coverImagePath || "",
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
```

- [ ] **Step 2: Create `app/admin/blog/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { deleteBlogPost } from "@/app/actions/blog";

export default async function AdminBlogPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const supabase = createServerClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-400"
        >
          + Tulis Artikel
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-zinc-800">
        <table className="w-full">
          <thead className="border-b border-zinc-800 bg-zinc-900">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-zinc-400">Judul</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-400">Penulis</th>
              <th className="px-4 py-3 text-left text-sm text-zinc-400">Status</th>
              <th className="px-4 py-3 text-right text-sm text-zinc-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => (
              <tr key={post.id} className="border-b border-zinc-800/50">
                <td className="px-4 py-3 text-white">{post.title}</td>
                <td className="px-4 py-3 text-zinc-400">{post.author}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      post.is_published
                        ? "bg-green-500/20 text-green-400"
                        : "bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="mr-3 text-sm text-yellow-500 hover:text-yellow-400"
                  >
                    Edit
                  </Link>
                  <form action={deleteBlogPost.bind(null, post.id)} className="inline">
                    <button
                      type="submit"
                      className="text-sm text-red-500 hover:text-red-400"
                    >
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-zinc-500">
                  Belum ada artikel
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create `app/admin/blog/new/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { createBlogPost } from "@/app/actions/blog";
import { ImageUploader } from "@/components/admin/ImageUploader";

export default function NewBlogPostPage() {
  const [coverImagePath, setCoverImagePath] = useState("");

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-white">Tulis Artikel Baru</h1>
      <form action={createBlogPost} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Judul</label>
          <input
            type="text"
            name="title"
            required
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Penulis</label>
          <input
            type="text"
            name="author"
            required
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Cover Image</label>
          <ImageUploader
            folder="blog"
            currentPath={coverImagePath}
            onUploaded={setCoverImagePath}
          />
          <input type="hidden" name="cover_image_path" value={coverImagePath} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Ringkasan</label>
          <textarea
            name="excerpt"
            rows={2}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Konten</label>
          <textarea
            name="content"
            rows={12}
            required
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            id="is_published"
            className="rounded border-zinc-700"
          />
          <label htmlFor="is_published" className="text-sm text-zinc-400">
            Langsung publish
          </label>
        </div>
        <button
          type="submit"
          className="rounded-md bg-yellow-500 px-6 py-2 font-semibold text-zinc-900 hover:bg-yellow-400 transition-colors"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: Create `app/admin/blog/[id]/edit/page.tsx`**

```tsx
import { redirect } from "next/navigation";
import { getSession } from "@/app/actions/auth";
import { createServerClient } from "@/lib/supabase-server";
import { BlogEditForm } from "./BlogEditForm";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const supabase = createServerClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) redirect("/admin/blog");

  return <BlogEditForm post={post} />;
}
```

Also create `app/admin/blog/[id]/edit/BlogEditForm.tsx`:

```tsx
"use client";

import { useState } from "react";
import { updateBlogPost } from "@/app/actions/blog";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { BlogPost } from "@/lib/types/database";

export function BlogEditForm({ post }: { post: BlogPost }) {
  const [coverImagePath, setCoverImagePath] = useState(post.cover_image_path);
  const updateAction = updateBlogPost.bind(null, post.id);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-white">Edit Artikel</h1>
      <form action={updateAction} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Judul</label>
          <input
            type="text"
            name="title"
            required
            defaultValue={post.title}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Penulis</label>
          <input
            type="text"
            name="author"
            required
            defaultValue={post.author}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Cover Image</label>
          <ImageUploader
            folder="blog"
            currentPath={coverImagePath}
            onUploaded={setCoverImagePath}
          />
          <input type="hidden" name="cover_image_path" value={coverImagePath} />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Ringkasan</label>
          <textarea
            name="excerpt"
            rows={2}
            defaultValue={post.excerpt}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-zinc-400">Konten</label>
          <textarea
            name="content"
            rows={12}
            required
            defaultValue={post.content}
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_published"
            id="is_published"
            defaultChecked={post.is_published}
            className="rounded border-zinc-700"
          />
          <label htmlFor="is_published" className="text-sm text-zinc-400">
            Published
          </label>
        </div>
        <button
          type="submit"
          className="rounded-md bg-yellow-500 px-6 py-2 font-semibold text-zinc-900 hover:bg-yellow-400 transition-colors"
        >
          Update
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add app/actions/blog.ts app/admin/blog/
git commit -m "feat: add blog CRUD admin pages"
```

---

### Task 13: Admin CRUD — Portfolio

**Files:**
- Create: `app/actions/portfolio.ts`
- Create: `app/admin/portfolio/page.tsx`

- [ ] **Step 1: Create `app/actions/portfolio.ts`**

```typescript
"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;
  if (!accessToken || !refreshToken) throw new Error("Not authenticated");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  return supabase;
}

export async function createPortfolioItem(formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("portfolio_items").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    image_path: formData.get("image_path") as string,
    display_order: Number(formData.get("display_order") || 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function updatePortfolioItem(id: string, formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase
    .from("portfolio_items")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      image_path: formData.get("image_path") as string,
      display_order: Number(formData.get("display_order") || 0),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}

export async function deletePortfolioItem(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");
}
```

- [ ] **Step 2: Create `app/admin/portfolio/page.tsx`**

Follow the same table list pattern as blog page, with inline add/edit forms. Show title, category, image thumbnail, and actions (edit/delete).

```tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { storageUrl } from "@/lib/storage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
} from "@/app/actions/portfolio";
import Image from "next/image";
import type { PortfolioItem } from "@/lib/types/database";

export default function AdminPortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order")
      .then(({ data }) => setItems(data ?? []));
  }, []);

  async function handleCreate(formData: FormData) {
    formData.set("image_path", imagePath);
    await createPortfolioItem(formData);
    setShowNew(false);
    setImagePath("");
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order");
    setItems(data ?? []);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus item portfolio ini?")) return;
    await deletePortfolioItem(id);
    setItems(items.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-400"
        >
          + Tambah
        </button>
      </div>

      {showNew && (
        <form action={handleCreate} className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <input name="title" placeholder="Judul" required className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <input name="description" placeholder="Deskripsi" className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <input name="category" placeholder="Kategori" defaultValue="photography" className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <input name="display_order" type="number" placeholder="Urutan" defaultValue={items.length + 1} className="w-32 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <ImageUploader folder="portfolio" onUploaded={setImagePath} />
          <button type="submit" className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900">Simpan</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            {item.image_path && (
              <div className="relative h-40">
                <Image src={storageUrl(item.image_path)} alt={item.title} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.category}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => handleDelete(item.id)} className="text-sm text-red-500 hover:text-red-400">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/actions/portfolio.ts app/admin/portfolio/
git commit -m "feat: add portfolio CRUD admin page"
```

---

### Task 14: Admin CRUD — Team Members (Crew)

**Files:**
- Create: `app/actions/crew.ts`
- Create: `app/admin/crew/page.tsx`

- [ ] **Step 1: Create `app/actions/crew.ts`**

Same pattern as portfolio actions — `createCrewMember`, `updateCrewMember`, `deleteCrewMember`. Table: `team_members`. Revalidate paths: `/admin/crew`, `/about`.

```typescript
"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;
  if (!accessToken || !refreshToken) throw new Error("Not authenticated");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  return supabase;
}

export async function createCrewMember(formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("team_members").insert({
    name: formData.get("name") as string,
    role: formData.get("role") as string,
    bio: formData.get("bio") as string,
    image_path: formData.get("image_path") as string,
    display_order: Number(formData.get("display_order") || 0),
    social_links: JSON.parse((formData.get("social_links") as string) || "[]"),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/crew");
  revalidatePath("/about");
}

export async function updateCrewMember(id: string, formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase
    .from("team_members")
    .update({
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      bio: formData.get("bio") as string,
      image_path: formData.get("image_path") as string,
      display_order: Number(formData.get("display_order") || 0),
      social_links: JSON.parse((formData.get("social_links") as string) || "[]"),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/crew");
  revalidatePath("/about");
}

export async function deleteCrewMember(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/crew");
  revalidatePath("/about");
}
```

- [ ] **Step 2: Create `app/admin/crew/page.tsx`**

Same card-grid pattern as portfolio page. Fields: name, role, bio, image (via ImageUploader), display_order.

```tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { storageUrl } from "@/lib/storage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createCrewMember, deleteCrewMember } from "@/app/actions/crew";
import Image from "next/image";
import type { TeamMember } from "@/lib/types/database";

export default function AdminCrewPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    supabase
      .from("team_members")
      .select("*")
      .order("display_order")
      .then(({ data }) => setMembers(data ?? []));
  }, []);

  async function handleCreate(formData: FormData) {
    formData.set("image_path", imagePath);
    formData.set("social_links", JSON.stringify([
      { platform: "instagram", url: "/", icon: "ri-instagram-line" },
      { platform: "linkedin", url: "/", icon: "ri-linkedin-box-fill" },
    ]));
    await createCrewMember(formData);
    setShowNew(false);
    setImagePath("");
    const { data } = await supabase.from("team_members").select("*").order("display_order");
    setMembers(data ?? []);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus anggota tim ini?")) return;
    await deleteCrewMember(id);
    setMembers(members.filter((m) => m.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Tim</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-400"
        >
          + Tambah
        </button>
      </div>

      {showNew && (
        <form action={handleCreate} className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <input name="name" placeholder="Nama" required className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <input name="role" placeholder="Role" required className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <textarea name="bio" placeholder="Bio" rows={3} className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <input name="display_order" type="number" placeholder="Urutan" defaultValue={members.length + 1} className="w-32 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <ImageUploader folder="crew" onUploaded={setImagePath} />
          <button type="submit" className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900">Simpan</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <div key={member.id} className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            {member.image_path && (
              <div className="relative h-48">
                <Image src={storageUrl(member.image_path)} alt={member.name} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-yellow-500">{member.role}</p>
              <p className="mt-1 text-sm text-zinc-400 line-clamp-2">{member.bio}</p>
              <div className="mt-3">
                <button onClick={() => handleDelete(member.id)} className="text-sm text-red-500 hover:text-red-400">
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/actions/crew.ts app/admin/crew/
git commit -m "feat: add crew CRUD admin page"
```

---

### Task 15: Admin CRUD — Services

**Files:**
- Create: `app/actions/services.ts`
- Create: `app/admin/services/page.tsx`

- [ ] **Step 1: Create `app/actions/services.ts`**

Same pattern — `createService`, `updateService`, `deleteService`. Table: `services`. Revalidate: `/admin/services`, `/`.

```typescript
"use server";

import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAuthenticatedClient() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("sb-access-token")?.value;
  const refreshToken = cookieStore.get("sb-refresh-token")?.value;
  if (!accessToken || !refreshToken) throw new Error("Not authenticated");

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
  return supabase;
}

export async function createService(formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("services").insert({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    image_path: formData.get("image_path") as string,
    display_order: Number(formData.get("display_order") || 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function updateService(id: string, formData: FormData) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase
    .from("services")
    .update({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image_path: formData.get("image_path") as string,
      display_order: Number(formData.get("display_order") || 0),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteService(id: string) {
  const supabase = await getAuthenticatedClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/services");
  revalidatePath("/");
}
```

- [ ] **Step 2: Create `app/admin/services/page.tsx`**

Same card-grid pattern. Fields: title, description (textarea), image, display_order.

```tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { storageUrl } from "@/lib/storage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createService, deleteService } from "@/app/actions/services";
import Image from "next/image";
import type { Service } from "@/lib/types/database";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [imagePath, setImagePath] = useState("");

  useEffect(() => {
    supabase
      .from("services")
      .select("*")
      .order("display_order")
      .then(({ data }) => setServices(data ?? []));
  }, []);

  async function handleCreate(formData: FormData) {
    formData.set("image_path", imagePath);
    await createService(formData);
    setShowNew(false);
    setImagePath("");
    const { data } = await supabase.from("services").select("*").order("display_order");
    setServices(data ?? []);
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus layanan ini?")) return;
    await deleteService(id);
    setServices(services.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Layanan</h1>
        <button
          onClick={() => setShowNew(!showNew)}
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-yellow-400"
        >
          + Tambah
        </button>
      </div>

      {showNew && (
        <form action={handleCreate} className="mb-6 rounded-lg border border-zinc-800 bg-zinc-900 p-4 space-y-3">
          <input name="title" placeholder="Judul Layanan" required className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <textarea name="description" placeholder="Deskripsi" rows={4} className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <input name="display_order" type="number" placeholder="Urutan" defaultValue={services.length + 1} className="w-32 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white" />
          <ImageUploader folder="services" onUploaded={setImagePath} />
          <button type="submit" className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-semibold text-zinc-900">Simpan</button>
        </form>
      )}

      <div className="space-y-3">
        {services.map((service) => (
          <div key={service.id} className="flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
            {service.image_path && (
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                <Image src={storageUrl(service.image_path)} alt={service.title} fill className="object-cover" unoptimized />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-white">{service.title}</h3>
              <p className="text-sm text-zinc-400 line-clamp-1">{service.description}</p>
            </div>
            <button onClick={() => handleDelete(service.id)} className="text-sm text-red-500 hover:text-red-400">
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add app/actions/services.ts app/admin/services/
git commit -m "feat: add services CRUD admin page"
```

---

## Phase 5: Frontend Integration (Replace Hardcoded Data)

### Task 16: Update Frontend to Fetch from Supabase

**Files:**
- Modify: `components/RatihCrew.tsx`
- Modify: `components/PortfolioContent.tsx`
- Modify: `components/JasaRatih.tsx`
- Modify: `app/blog/page.tsx`
- Modify: `components/BlogContent.tsx`

- [ ] **Step 1: Update `components/RatihCrew.tsx` to fetch from Supabase**

Convert to async Server Component. Replace the constants import with a Supabase query:

```tsx
import { createServerClient } from "@/lib/supabase-server";
import { storageUrl } from "@/lib/storage";
import Image from "next/image";

export default async function RatihCrew() {
  const supabase = createServerClient();
  const { data: crew } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order");

  // ... render using crew data, images via storageUrl(member.image_path)
}
```

Keep the existing layout/styling, just swap the data source.

- [ ] **Step 2: Update `components/PortfolioContent.tsx` to fetch from Supabase**

Same pattern — async Server Component, fetch from `portfolio_items` table.

- [ ] **Step 3: Update `components/JasaRatih.tsx` to fetch from Supabase**

Fetch from `services` table. Replace hardcoded image with `storageUrl(service.image_path)`.

- [ ] **Step 4: Update blog page to show published posts**

Update `app/blog/page.tsx` and `components/BlogContent.tsx`:

```tsx
// components/BlogContent.tsx
import { supabase } from "@/lib/supabase";
import { storageUrl } from "@/lib/storage";
import Image from "next/image";
import Link from "next/link";

export default async function BlogContent() {
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (!posts || posts.length === 0) {
    return (
      <div className="py-20 text-center text-zinc-500">
        Belum ada artikel
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article key={post.id} className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
            {post.cover_image_path && (
              <div className="relative h-48">
                <Image
                  src={storageUrl(post.cover_image_path)}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-white">{post.title}</h2>
              <p className="mt-1 text-sm text-zinc-400">{post.excerpt}</p>
              <p className="mt-2 text-xs text-zinc-500">
                {post.author} &middot; {new Date(post.published_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Verify all pages in dev server**

```bash
pnpm dev
```

Check all pages load data from Supabase. Verify images serve as WebP from CDN.

- [ ] **Step 6: Commit**

```bash
git add components/RatihCrew.tsx components/PortfolioContent.tsx components/JasaRatih.tsx components/BlogContent.tsx app/blog/page.tsx
git commit -m "feat: replace hardcoded data with Supabase queries"
```

---

## Summary

| Phase | Tasks | What it delivers |
|-------|-------|-----------------|
| 1. Infrastructure | Tasks 1-3 | Storage bucket, DB schema, admin user |
| 2. Image Migration | Tasks 4-6 | WebP conversion, Supabase upload, data seeding |
| 3. Frontend Update | Tasks 7-8 | All images served from Supabase CDN |
| 4. Admin Panel | Tasks 9-15 | Login, dashboard, CRUD for blog/portfolio/crew/services |
| 5. Integration | Task 16 | Frontend reads from CMS database |

**Environment variables needed in `.env.local`:**
```
NEXT_PUBLIC_SUPABASE_URL=https://ltggfkdlambmhehaxabn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_W6wEuZN1bilHf4qwOsLvNg_8gM4Mm0F
SUPABASE_SERVICE_ROLE_KEY=<get from Supabase Dashboard → Settings → API>
```
