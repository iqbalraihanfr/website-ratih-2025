import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

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

  const { error: crewError } = await supabase.from("team_members").upsert(crewData);
  if (crewError) console.error("Crew seed failed:", crewError.message);
  else console.log(`OK   Seeded ${crewData.length} team members`);

  // Seed portfolio items
  const portfolioData = [
    { title: "Festival Dongkrek", category: "photography", image_path: "portfolio/festival-dongkrek.webp", display_order: 1 },
    { title: "Kirab Budaya Mejayan", category: "photography", image_path: "portfolio/kirab-budaya-mejayan.webp", display_order: 2 },
    { title: "Pahlawan CFN", category: "photography", image_path: "portfolio/pahlawan-cfn.webp", display_order: 3 },
    { title: "Promosi UMKM", category: "photography", image_path: "portfolio/promosi-umkm.webp", display_order: 4 },
  ];

  const { error: portfolioError } = await supabase.from("portfolio_items").upsert(portfolioData);
  if (portfolioError) console.error("Portfolio seed failed:", portfolioError.message);
  else console.log(`OK   Seeded ${portfolioData.length} portfolio items`);

  // Seed services
  const servicesData = [
    {
      title: "Fotografi",
      description: "Kami menyediakan layanan fotografi profesional untuk berbagai kebutuhan, mulai dari foto produk, acara, hingga konten media sosial. Dengan peralatan terkini dan tim fotografer berpengalaman, kami memastikan setiap gambar yang dihasilkan berkualitas tinggi dan sesuai dengan visi klien.",
      image_path: "portfolio/promosi-umkm.webp",
      display_order: 1,
    },
    {
      title: "Videografi",
      description: "Layanan videografi kami mencakup pembuatan video promosi, dokumentasi acara, company profile, dan konten video kreatif lainnya. Kami menggabungkan teknik sinematografi modern dengan storytelling yang menarik untuk menghasilkan video yang memukau.",
      image_path: "portfolio/promosi-umkm.webp",
      display_order: 2,
    },
    {
      title: "Desain Grafis",
      description: "Tim desainer grafis kami siap membantu kebutuhan visual brand Anda, mulai dari desain logo, poster, brosur, hingga konten media sosial. Setiap desain dibuat dengan perhatian detail dan estetika yang sesuai dengan identitas brand klien.",
      image_path: "portfolio/promosi-umkm.webp",
      display_order: 3,
    },
    {
      title: "Branding",
      description: "Kami membantu membangun dan mengembangkan identitas brand Anda secara menyeluruh. Dari strategi branding, visual identity, hingga brand guidelines yang konsisten dan profesional.",
      image_path: "portfolio/promosi-umkm.webp",
      display_order: 4,
    },
    {
      title: "Social Media Management",
      description: "Layanan pengelolaan media sosial yang komprehensif, mencakup perencanaan konten, pembuatan konten visual, copywriting, dan analisis performa. Kami membantu brand Anda tumbuh dan terhubung dengan audiens yang tepat.",
      image_path: "portfolio/promosi-umkm.webp",
      display_order: 5,
    },
  ];

  const { error: servicesError } = await supabase.from("services").upsert(servicesData);
  if (servicesError) console.error("Services seed failed:", servicesError.message);
  else console.log(`OK   Seeded ${servicesData.length} services`);

  // Seed site settings
  const settingsData = [
    { key: "home_bg", value: { image_path: "bg/bg.webp" } },
    { key: "about_bg", value: { image_path: "bg/bg-3.webp" } },
    { key: "portfolio_bg", value: { image_path: "bg/bg-4.webp" } },
    { key: "blog_bg", value: { image_path: "bg/bg-2.webp" } },
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
    const { error } = await supabase.from("site_settings").upsert(setting, { onConflict: "key" });
    if (error) console.error(`Setting "${setting.key}" failed:`, error.message);
    else console.log(`OK   Setting "${setting.key}"`);
  }

  console.log("\nSeed complete!");
}

seed().catch(console.error);
