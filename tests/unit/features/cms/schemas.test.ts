import { describe, expect, it } from "vitest";
import { parseBlogPostFormData } from "@/features/cms/blog/schemas";
import { parsePortfolioItemFormData } from "@/features/cms/portfolio/schemas";
import { parseServiceFormData } from "@/features/cms/services/schemas";
import { parseTeamMemberFormData } from "@/features/cms/crew/schemas";

describe("cms schemas", () => {
  it("parses and trims blog post form data", () => {
    const formData = new FormData();
    formData.set("title", "  Judul Test  ");
    formData.set("content", " Isi konten ");
    formData.set("excerpt", " Ringkasan ");
    formData.set("author", " Ratih QA ");
    formData.set("cover_image_path", "blog/test-cover.webp");
    formData.set("is_published", "true");

    expect(parseBlogPostFormData(formData)).toEqual({
      title: "Judul Test",
      content: "Isi konten",
      excerpt: "Ringkasan",
      author: "Ratih QA",
      cover_image_path: "blog/test-cover.webp",
      is_published: true,
    });
  });

  it("rejects invalid portfolio display order", () => {
    const formData = new FormData();
    formData.set("title", "Project");
    formData.set("description", "Desc");
    formData.set("category", "Event");
    formData.set("image_path", "portfolio/project.webp");
    formData.set("display_order", "1000");

    expect(() => parsePortfolioItemFormData(formData)).toThrow(
      "Urutan maksimal 999."
    );
  });

  it("rejects invalid crew image paths", () => {
    const formData = new FormData();
    formData.set("name", "Crew Test");
    formData.set("role", "Stylist");
    formData.set("bio", "Bio");
    formData.set("image_path", "../unsafe.png");
    formData.set("display_order", "1");

    expect(() => parseTeamMemberFormData(formData)).toThrow(
      "Path gambar tidak valid."
    );
  });

  it("parses service form data", () => {
    const formData = new FormData();
    formData.set("title", " Foto Produk ");
    formData.set("description", " Deskripsi layanan ");
    formData.set("image_path", "services/service.webp");
    formData.set("display_order", "2");

    expect(parseServiceFormData(formData)).toEqual({
      title: "Foto Produk",
      description: "Deskripsi layanan",
      image_path: "services/service.webp",
      display_order: 2,
    });
  });
});
