import { expect, test, type Page } from "@playwright/test";

const CMS_TEST_PASSWORD = "ratih-admin-test-password";

async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth + 1;
  });

  expect(hasOverflow).toBe(false);
}

async function loginAsOwner(page: Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email").fill("owner@ratih.test");
  await page.getByLabel("Password").fill(CMS_TEST_PASSWORD);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.describe("mobile responsiveness", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("homepage header and hero logos stay crisp without horizontal overflow", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("link", { name: "Kembali ke beranda" })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Lihat profil Ratih Creative" })
    ).toBeVisible();

    await assertNoHorizontalOverflow(page);
  });

  test("admin login and dashboard remain usable on mobile", async ({ page }) => {
    await page.goto("/admin/login");

    await expect(
      page.getByRole("heading", { name: "Admin Login" })
    ).toBeVisible();
    await assertNoHorizontalOverflow(page);

    await loginAsOwner(page);
    await page.getByRole("button", { name: "Buka navigasi admin" }).click();
    await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();
    await assertNoHorizontalOverflow(page);
  });
});
