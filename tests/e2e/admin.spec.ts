import path from "node:path";
import {
  expect,
  test,
  type APIRequestContext,
  type Page,
} from "@playwright/test";

const uploadFixturePath = path.join(
  process.cwd(),
  "public/images/portfolio/promosi-umkm.png"
);
const CMS_TEST_PASSWORD = "ratih-admin-test-password";

async function resetCmsState(request: APIRequestContext) {
  const response = await request.post("/api/test/cms/reset");
  expect(response.ok()).toBeTruthy();
}

async function loginAs(page: Page, role: "owner" | "editor" = "owner") {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill(`${role}@ratih.test`);
  await page.getByLabel("Password").fill(CMS_TEST_PASSWORD);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

async function uploadImage(page: Page) {
  await page.locator('input[type="file"]').setInputFiles(uploadFixturePath);
  await page.getByRole("button", { name: "Upload Gambar" }).click();
  await expect(
    page.getByText("Gambar berhasil diupload dan dioptimalkan.")
  ).toBeVisible();
}

test.beforeEach(async ({ request, page }) => {
  await resetCmsState(request);
  await page.context().clearCookies();
});

test("editor only sees permitted admin sections", async ({ page }) => {
  await loginAs(page, "editor");

  await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Portfolio" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Layanan" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Tim" })).toHaveCount(0);

  await page.goto("/admin/crew");
  await expect(page).toHaveURL(/\/admin$/);
});

test("blog admin can create, edit, and delete a post", async ({ page }) => {
  await loginAs(page);

  await page.goto("/admin/blog");
  await page.getByRole("link", { name: "Tambah Post" }).click();

  await page.getByLabel("Judul").fill("QA Blog Post");
  await page.getByLabel("Excerpt").fill("Excerpt untuk QA.");
  await page.getByLabel("Konten").fill("Konten blog untuk verifikasi admin.");
  await page.getByLabel("Author").fill("QA Owner");
  await uploadImage(page);
  await page.getByLabel("Publish sekarang").check();
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page).toHaveURL(/\/admin\/blog$/);
  await expect(page.getByText("QA Blog Post")).toBeVisible();

  await page
    .getByRole("link", { name: "Edit blog post QA Blog Post" })
    .click();
  await page.getByLabel("Judul").fill("QA Blog Post Updated");
  await page.getByLabel("Publish sekarang").uncheck();
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page.getByText("QA Blog Post Updated")).toBeVisible();
  await expect(page.getByText("Draft")).toBeVisible();

  await page
    .getByRole("button", { name: "Hapus blog post QA Blog Post Updated" })
    .click();
  await expect(page.getByText("QA Blog Post Updated")).toHaveCount(0);
});

test("portfolio admin can create, edit, and delete an item", async ({
  page,
}) => {
  await loginAs(page);

  await page.goto("/admin/portfolio");
  await page.getByRole("link", { name: "Tambah Item" }).click();

  await page.getByLabel("Judul").fill("QA Portfolio");
  await page.getByLabel("Deskripsi").fill("Deskripsi portfolio QA.");
  await page.getByLabel("Kategori").fill("Branding");
  await page.getByLabel("Urutan").fill("2");
  await uploadImage(page);
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page).toHaveURL(/\/admin\/portfolio$/);
  await expect(page.getByText("QA Portfolio")).toBeVisible();

  await page.getByRole("link", { name: "Edit portfolio QA Portfolio" }).click();
  await page.getByLabel("Judul").fill("QA Portfolio Updated");
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page.getByText("QA Portfolio Updated")).toBeVisible();

  await page
    .getByRole("button", { name: "Hapus portfolio QA Portfolio Updated" })
    .click();
  await expect(page.getByText("QA Portfolio Updated")).toHaveCount(0);
});

test("crew admin can create, edit, and delete a member", async ({ page }) => {
  await loginAs(page);

  await page.goto("/admin/crew");
  await page.getByRole("link", { name: "Tambah Anggota" }).click();

  await page.getByLabel("Nama").fill("QA Crew");
  await page.getByLabel("Role").fill("Videographer");
  await page.getByLabel("Bio").fill("Bio anggota untuk QA admin.");
  await page.getByLabel("Urutan").fill("2");
  await uploadImage(page);
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page).toHaveURL(/\/admin\/crew$/);
  await expect(page.getByText("QA Crew")).toBeVisible();

  await page.getByRole("link", { name: "Edit anggota tim QA Crew" }).click();
  await page.getByLabel("Nama").fill("QA Crew Updated");
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page.getByText("QA Crew Updated")).toBeVisible();

  await page
    .getByRole("button", { name: "Hapus anggota tim QA Crew Updated" })
    .click();
  await expect(page.getByText("QA Crew Updated")).toHaveCount(0);
});

test("services admin can create, edit, and delete a service", async ({
  page,
}) => {
  await loginAs(page);

  await page.goto("/admin/services");
  await page.getByRole("link", { name: "Tambah Layanan" }).click();

  await page.getByLabel("Judul").fill("QA Service");
  await page.getByLabel("Deskripsi").fill("Deskripsi layanan untuk QA.");
  await page.getByLabel("Urutan").fill("2");
  await uploadImage(page);
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page).toHaveURL(/\/admin\/services$/);
  await expect(page.getByText("QA Service")).toBeVisible();

  await page.getByRole("link", { name: "Edit layanan QA Service" }).click();
  await page.getByLabel("Judul").fill("QA Service Updated");
  await page.getByRole("button", { name: "Simpan" }).click();

  await expect(page.getByText("QA Service Updated")).toBeVisible();

  await page
    .getByRole("button", { name: "Hapus layanan QA Service Updated" })
    .click();
  await expect(page.getByText("QA Service Updated")).toHaveCount(0);
});
