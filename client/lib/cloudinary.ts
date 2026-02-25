// lib/cloudinary.ts

// ── URL helpers ───────────────────────────────────────────────────

export function cloudinaryUrl(url: string, transforms = "c_fill,w_1920,h_1080,f_webp,q_auto") {
  if (!url?.includes("/image/upload/")) return url;
  if (url.includes(`/image/upload/${transforms}/`)) return url;
  return url.replace("/image/upload/", `/image/upload/${transforms}/`);
}

export function extractPublicId(url: string): string | null {
  // Strips any existing transform segment, then captures the public_id (no extension)
  // e.g. .../image/upload/c_fill,w_400/cambodia-travel/photo.webp → cambodia-travel/photo
  const match = url.match(/\/image\/upload\/(?:[^/]+\/)*?(cambodia-travel\/[^.]+)/);
  return match ? match[1] : null;
}

// ── Cloudinary delete via backend ────────────────────────────────

export async function deleteFromCloudinary(urls: string[]): Promise<void> {
  const publicIds = urls.map(extractPublicId).filter((id): id is string => !!id);
  if (!publicIds.length) return;

  console.log("[cloudinary] deleting:", publicIds);

  try {
    const res = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicIds }),
    });
    const data = await res.json();
    console.log("[cloudinary] delete results:", data.results);
  } catch (err) {
    console.error("[cloudinary] delete request failed:", err);
  }
}

// Delete only URLs that were in `before` but are no longer in `after`
export async function deleteOrphanedImages(before: string[], after: string[]): Promise<void> {
  const removed = before.filter((url) => !after.includes(url));
  if (removed.length) await deleteFromCloudinary(removed);
}

// ── Upload ────────────────────────────────────────────────────────

function compressImage(file: File, maxWidth = 1920, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    const src = URL.createObjectURL(file);
    img.onload = () => {
      const scale  = img.width > maxWidth ? maxWidth / img.width : 1;
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(src);
      canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", quality);
    };
    img.src = src;
  });
}

export async function uploadToCloudinary(
  file: File,
  onDone: (url: string) => void,
  onError: () => void,
) {
  const cloudName    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloudName || !uploadPreset) { onError(); return; }

  const compressed = await compressImage(file);
  const body       = new FormData();
  body.append("file", compressed);
  body.append("upload_preset", uploadPreset);
  body.append("folder", "cambodia-travel");
  // No extra params — unsigned presets only allow file/upload_preset/folder

  try {
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body });
    const data = await res.json();
    if (data.secure_url) onDone(data.secure_url);
    else { console.error("[cloudinary] upload error:", data.error); onError(); }
  } catch (err) {
    console.error("[cloudinary] upload failed:", err);
    onError();
  }
}