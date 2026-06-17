-- SUPABASE SCHEMA INITIALIZATION FOR WEBSITE RATIH 2025
-- This script sets up tables, enables Row Level Security (RLS), configures access control policies, and seeds initial data.

-- =========================================================================
-- 1. DROP EXISTENT TABLES (FOR RESET PURPOSES, ORDER MATTERS FOR FOREIGN KEYS)
-- =========================================================================
DROP TABLE IF EXISTS public.contact_messages;
DROP TABLE IF EXISTS public.posts;
DROP TABLE IF EXISTS public.social_media;
DROP TABLE IF EXISTS public.services;
DROP TABLE IF EXISTS public.portfolio;
DROP TABLE IF EXISTS public.crew;

-- =========================================================================
-- 2. CREATE TABLES
-- =========================================================================

-- Table: CREW (Creative Team)
CREATE TABLE public.crew (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    img_url TEXT NOT NULL,
    alt_img TEXT,
    description TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    whatsapp_url TEXT,
    x_url TEXT,
    linkedin_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: PORTFOLIO
CREATE TABLE public.portfolio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    img_url TEXT NOT NULL,
    category TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: SERVICES (Layanan)
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    img_url TEXT NOT NULL,
    alt_img TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: SOCIAL_MEDIA
CREATE TABLE public.social_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    logo TEXT NOT NULL,
    href TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: POSTS (Blog)
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    body TEXT,
    img_url TEXT,
    alt_img TEXT,
    author_id UUID REFERENCES public.crew(id) ON DELETE SET NULL,
    published_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: CONTACT_MESSAGES
CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE public.crew ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Crew Policies
CREATE POLICY "Allow public read access on crew" ON public.crew
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin to modify crew" ON public.crew
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Portfolio Policies
CREATE POLICY "Allow public read access on portfolio" ON public.portfolio
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin to modify portfolio" ON public.portfolio
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Services Policies
CREATE POLICY "Allow public read access on services" ON public.services
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin to modify services" ON public.services
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Social Media Policies
CREATE POLICY "Allow public read access on social_media" ON public.social_media
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin to modify social_media" ON public.social_media
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Posts (Blog) Policies
CREATE POLICY "Allow public read access on posts" ON public.posts
    FOR SELECT USING (true);
CREATE POLICY "Allow authenticated admin to modify posts" ON public.posts
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Contact Messages Policies
CREATE POLICY "Allow anyone to insert contact messages" ON public.contact_messages
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated admin to view contact messages" ON public.contact_messages
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated admin to modify contact messages" ON public.contact_messages
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =========================================================================
-- 4. SEED INITIAL DATA (FROM STATICS)
-- =========================================================================

-- Crew Seed Data (Custom static UUIDs to allow deterministic relationships)
INSERT INTO public.crew (id, name, role, img_url, alt_img, description) VALUES
('e6c71be3-12e0-47de-8bde-0d2a095a43ee', 'Afrizal Ahmad', 'Graphic Designer', '/images/crew/rijal-bg.png', 'Foto Rijal', ''),
('34c11b15-99d7-466d-8ad1-6f77341e97d1', 'Andra Ariloka', 'Content Writer', '/images/crew/ndar-bg.png', 'Foto Andra', ''),
('b5a947d2-7c87-4b77-8c34-ff574889c2ea', 'Favian Rifqi', 'Photographer', '/images/crew/yan-bg.png', 'Foto Pap', ''),
('f8d5cf96-a077-4fb7-87cf-435728d7a12b', 'Valentinus Nathanael', 'Videographer', '/images/crew/nathann-bg.png', 'Foto Nathan', ''),
('cb9e0d1f-829d-4767-a068-d05528246cb5', 'Jiersa Hilal', 'Video Editor', '/images/crew/sastra-bg.png', 'Foto Jiersa', ''),
('2a291cf5-85f2-4ad6-ac7e-c80b271d49e1', 'Afif Satrio', 'Web Developer', '/images/crew/pipp-bg.png', 'Foto Apip', ''),
('1a432df6-e7e2-4bd5-b56e-820d912d78df', 'Iqbal Raihan', 'Web Developer', '/images/crew/raihaan-bg.png', 'Foto Iqbal', '');

-- Portfolio Seed Data
INSERT INTO public.portfolio (title, img_url, category, sort_order) VALUES
('Gebyar Festival Dongkrek', '/images/portfolio/festival-dongkrek.png', 'photography', 1),
('Kirab Budaya Mejayan', '/images/portfolio/kirab-budaya-mejayan.png', 'photography', 2),
('Pahlawan Car Free Night', '/images/portfolio/pahlawan-cfn.png', 'photography', 3),
('Promosi UMKM', '/images/portfolio/promosi-umkm.png', 'photography', 4);

-- Services Seed Data
INSERT INTO public.services (title, description, img_url, alt_img, sort_order) VALUES
('Fotografi', 'Layanan fotografi yang fokus pada visual yang kuat, detail yang rapi, dan mood yang sesuai karakter brand. Cocok untuk kebutuhan produk, campaign, company profile, hingga dokumentasi event sampai acara penting seperti wisuda dan acara pernikahan dengan tampilan yang lebih estetik, rapi dan tetap standout.', '/images/services/fotografi.png', 'Layanan Fotografi', 1),
('Videografi', 'Produksi video dengan pendekatan visual yang cinematic dan storytelling yang relevan. Mulai dari video branding, company video, creative video, hingga short cinematic clip. Semuanya dirancang untuk ningkatin persepsi dan daya tarik brand di mata audiens.', '/images/services/videografi.png', 'Layanan Videografi', 2),
('Branding & Visual Identity', 'Ngebangun identitas brand dari dasar lewat logo, warna, tipografi, dan brand guideline yang terstruktur. Fokus kami adalah menciptakan identitas yang jelas, terstruktur, dan punya karakter yang kuat tapi mudah diingat, sehingga brand kalian tampil lebih baik dan profesional.', '/images/services/branding.png', 'Layanan Branding', 3),
('Graphic Design', 'Desain visual untuk kebutuhan brand seperti poster, banner, feed, layout, dan kebutuhan promosi lainnya. Setiap desain dibuat dengan gaya modern dan komposisi yang bersih, biar pesan brand tersampaikan dengan kuat dan estetik.', '/images/services/branding.png', 'Layanan Branding', 4),
('Short Movie Production', 'Produksi short movie dengan kualitas visual yang cinematic dan konsep cerita yang matang. Cocok untuk karya kreatif, campaign story, maupun konten yang butuh pendekatan storytelling yang lebih dalam dan emosional.', '/images/services/branding.png', 'Layanan Branding', 5);

-- Social Media Seed Data
INSERT INTO public.social_media (logo, href, sort_order) VALUES
('ri-instagram-line', '/', 1),
('ri-facebook-fill', '/', 2),
('ri-whatsapp-line', '/', 3),
('ri-twitter-x-fill', '/', 4),
('ri-linkedin-box-fill', '/', 5);
