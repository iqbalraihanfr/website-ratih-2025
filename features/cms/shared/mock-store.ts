import { promises as fs } from "node:fs";
import type {
  BlogPost,
  PortfolioItem,
  Service,
  TeamMember,
} from "@/lib/types/database";

const MOCK_STORE_PATH = "/tmp/website-ratih-2025-cms-test-store.json";

interface CmsMockStore {
  blogPosts: BlogPost[];
  portfolioItems: PortfolioItem[];
  teamMembers: TeamMember[];
  services: Service[];
}

type CmsMockCollection = keyof CmsMockStore;
type CmsMockItem<K extends CmsMockCollection> = CmsMockStore[K][number];

function timestamp() {
  return new Date().toISOString();
}

function createSeedStore(): CmsMockStore {
  const createdAt = timestamp();

  return {
    blogPosts: [
      {
        id: "blog-seed-1",
        title: "Seed Blog Post",
        slug: "seed-blog-post",
        content: "Konten seed untuk verifikasi admin.",
        excerpt: "Ringkasan seed blog post.",
        cover_image_path: "blog/seed-cover.webp",
        author: "Ratih QA",
        is_published: true,
        published_at: createdAt,
        created_at: createdAt,
        updated_at: createdAt,
      },
    ],
    portfolioItems: [
      {
        id: "portfolio-seed-1",
        title: "Seed Portfolio",
        description: "Project awal untuk verifikasi QA admin.",
        category: "Campaign",
        image_path: "portfolio/seed-cover.webp",
        display_order: 1,
        created_at: createdAt,
        updated_at: createdAt,
      },
    ],
    teamMembers: [
      {
        id: "crew-seed-1",
        name: "Seed Crew",
        role: "Photographer",
        bio: "Anggota tim awal untuk verifikasi admin.",
        image_path: "crew/seed-cover.webp",
        social_links: [],
        display_order: 1,
        created_at: createdAt,
        updated_at: createdAt,
      },
    ],
    services: [
      {
        id: "service-seed-1",
        title: "Seed Service",
        description: "Layanan awal untuk verifikasi admin.",
        image_path: "services/seed-cover.webp",
        display_order: 1,
        created_at: createdAt,
        updated_at: createdAt,
      },
    ],
  };
}

async function writeMockStore(store: CmsMockStore) {
  await fs.writeFile(MOCK_STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

async function ensureMockStore() {
  try {
    const raw = await fs.readFile(MOCK_STORE_PATH, "utf8");
    return JSON.parse(raw) as CmsMockStore;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      const store = createSeedStore();
      await writeMockStore(store);
      return store;
    }

    throw error;
  }
}

export async function resetMockCmsStore() {
  const store = createSeedStore();
  await writeMockStore(store);
  return store;
}

export async function listMockRecords<K extends CmsMockCollection>(
  collection: K
): Promise<Array<CmsMockItem<K>>> {
  const store = await ensureMockStore();
  return [...store[collection]] as Array<CmsMockItem<K>>;
}

export async function getMockRecordById<K extends CmsMockCollection>(
  collection: K,
  id: string
): Promise<CmsMockItem<K> | null> {
  const items = await listMockRecords(collection);
  return (items.find((item) => item.id === id) ?? null) as CmsMockItem<K> | null;
}

export async function countMockRecords<K extends CmsMockCollection>(
  collection: K
) {
  const items = await listMockRecords(collection);
  return items.length;
}

export async function createMockRecord<K extends CmsMockCollection>(
  collection: K,
  record: CmsMockItem<K>
) {
  const store = await ensureMockStore();
  store[collection] = [...store[collection], record] as CmsMockStore[K];
  await writeMockStore(store);
  return record;
}

export async function updateMockRecord<K extends CmsMockCollection>(
  collection: K,
  id: string,
  updater: (item: CmsMockItem<K>) => CmsMockItem<K>
) {
  const store = await ensureMockStore();
  const current = store[collection].find(
    (item) => item.id === id
  ) as CmsMockItem<K> | undefined;

  if (!current) {
    throw new Error(`Record ${id} not found in ${collection}.`);
  }

  const updated = updater(current);
  store[collection] = store[collection].map((item) =>
    item.id === id ? updated : item
  ) as CmsMockStore[K];

  await writeMockStore(store);
  return updated;
}

export async function deleteMockRecord<K extends CmsMockCollection>(
  collection: K,
  id: string
) {
  const store = await ensureMockStore();
  store[collection] = store[collection].filter(
    (item) => item.id !== id
  ) as CmsMockStore[K];
  await writeMockStore(store);
}
