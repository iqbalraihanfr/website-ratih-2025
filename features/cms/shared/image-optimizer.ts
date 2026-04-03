import sharp from "sharp";

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
export const MAX_OPTIMIZED_UPLOAD_BYTES = 1_500_000;
export const MAX_UPLOAD_DIMENSION = 2400;

const QUALITY_STEPS = [88, 84, 80, 76] as const;
const SCALE_STEPS = [1, 0.96, 0.92, 0.88] as const;

export interface OptimizedCmsImage {
  buffer: Buffer;
  width: number;
  height: number;
  bytes: number;
  quality: number;
  contentType: "image/webp";
  extension: "webp";
}

export async function optimizeCmsImageBuffer(
  buffer: Buffer
): Promise<OptimizedCmsImage> {
  const image = sharp(buffer).rotate();
  const metadata = await image.metadata();
  const inputWidth = metadata.width;
  const inputHeight = metadata.height;

  if (!inputWidth || !inputHeight) {
    throw new Error("Gambar tidak valid atau dimensinya tidak terbaca.");
  }

  const downscaleToMaxDimension = Math.min(
    1,
    MAX_UPLOAD_DIMENSION / Math.max(inputWidth, inputHeight)
  );

  let bestCandidate: OptimizedCmsImage | null = null;

  for (const scale of SCALE_STEPS) {
    const resizeScale = Math.min(1, downscaleToMaxDimension * scale);
    const width = Math.max(1, Math.round(inputWidth * resizeScale));
    const height = Math.max(1, Math.round(inputHeight * resizeScale));

    for (const quality of QUALITY_STEPS) {
      const optimizedBuffer = await sharp(buffer)
        .rotate()
        .resize({
          width,
          height,
          fit: "inside",
          withoutEnlargement: true,
        })
        .sharpen(0.8, 0.4, 1.2)
        .webp({
          quality,
          effort: 5,
          smartSubsample: true,
        })
        .toBuffer();

      const candidate: OptimizedCmsImage = {
        buffer: optimizedBuffer,
        width,
        height,
        bytes: optimizedBuffer.byteLength,
        quality,
        contentType: "image/webp",
        extension: "webp",
      };

      if (!bestCandidate || candidate.bytes < bestCandidate.bytes) {
        bestCandidate = candidate;
      }

      if (candidate.bytes <= MAX_OPTIMIZED_UPLOAD_BYTES) {
        return candidate;
      }
    }
  }

  if (!bestCandidate) {
    throw new Error("Gagal mengoptimalkan gambar.");
  }

  return bestCandidate;
}
