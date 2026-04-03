import sharp from "sharp";
import { describe, expect, it } from "vitest";
import {
  MAX_OPTIMIZED_UPLOAD_BYTES,
  MAX_UPLOAD_DIMENSION,
  optimizeCmsImageBuffer,
} from "@/features/cms/shared/image-optimizer";

async function createLargeImageBuffer(width: number, height: number) {
  return sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 220, g: 180, b: 90 },
    },
  })
    .jpeg({ quality: 95 })
    .toBuffer();
}

describe("optimizeCmsImageBuffer", () => {
  it("keeps smaller images close to original dimensions", async () => {
    const input = await createLargeImageBuffer(1000, 700);
    const optimized = await optimizeCmsImageBuffer(input);

    expect(optimized.contentType).toBe("image/webp");
    expect(optimized.width).toBe(1000);
    expect(optimized.height).toBe(700);
  });

  it("downscales oversized images to the max dimension budget", async () => {
    const input = await createLargeImageBuffer(2600, 1600);
    const optimized = await optimizeCmsImageBuffer(input);

    expect(optimized.width).toBeLessThanOrEqual(MAX_UPLOAD_DIMENSION);
    expect(optimized.height).toBeLessThanOrEqual(MAX_UPLOAD_DIMENSION);
    expect(optimized.width).toBeGreaterThanOrEqual(2400);
    expect(optimized.bytes).toBeLessThanOrEqual(MAX_OPTIMIZED_UPLOAD_BYTES);
  });
});
