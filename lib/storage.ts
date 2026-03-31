const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

/**
 * Generate public URL for an image in Supabase Storage.
 * @param path - Path within the `images` bucket, e.g. "crew/nathann-bg.webp"
 */
export function storageUrl(path: string): string {
  if (!path || path.startsWith("/") || path.includes("..")) {
    throw new Error(`Invalid storage path: ${path}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/images/${path}`;
}
