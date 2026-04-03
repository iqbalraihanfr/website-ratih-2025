// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import { uploadCmsImage } from "@/features/cms/shared/upload";

vi.mock("@/features/cms/shared/upload", () => ({
  uploadCmsImage: vi.fn(),
}));

vi.mock("@/lib/storage", () => ({
  storageUrl: (path: string) => `https://example.supabase.co/storage/${path}`,
}));

describe("ImageUploader", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks files larger than 5MB before upload", async () => {
    const user = userEvent.setup();
    render(<ImageUploader folder="blog" onUploaded={vi.fn()} />);

    const oversizedFile = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      "too-large.png",
      { type: "image/png" }
    );

    await user.upload(
      screen.getByLabelText("Pilih gambar untuk upload"),
      oversizedFile
    );

    expect(
      screen.getByText("Ukuran gambar maksimal 5MB.")
    ).toBeInTheDocument();
    expect(uploadCmsImage).not.toHaveBeenCalled();
  });

  it("uploads images and forwards the stored path", async () => {
    const user = userEvent.setup();
    const onUploaded = vi.fn();
    vi.mocked(uploadCmsImage).mockResolvedValue({ path: "blog/qa-cover.webp" });

    render(<ImageUploader folder="blog" onUploaded={onUploaded} />);

    const file = new File([new Uint8Array([1, 2, 3])], "cover.png", {
      type: "image/png",
    });

    await user.upload(screen.getByLabelText("Pilih gambar untuk upload"), file);
    await user.click(screen.getByRole("button", { name: "Upload Gambar" }));

    await waitFor(() => {
      expect(uploadCmsImage).toHaveBeenCalledTimes(1);
      expect(onUploaded).toHaveBeenCalledWith("blog/qa-cover.webp");
    });

    expect(
      screen.getByText("Gambar berhasil diupload dan dioptimalkan.")
    ).toBeInTheDocument();
  });
});
