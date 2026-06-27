import { get, set, del, keys } from "idb-keyval";
import { generateId } from "./utils";

const IMAGE_PREFIX = "jobbminne_image_";

export type StoredImage = {
  id: string;
  dataUrl: string;
  name?: string;
  createdAt: string;
};

export async function saveImage(file: File): Promise<string> {
  const id = generateId();
  const dataUrl = await fileToDataUrl(file);
  const stored: StoredImage = {
    id,
    dataUrl,
    name: file.name,
    createdAt: new Date().toISOString(),
  };
  await set(`${IMAGE_PREFIX}${id}`, stored);
  return id;
}

export async function getImage(id: string): Promise<StoredImage | null> {
  const img = await get<StoredImage>(`${IMAGE_PREFIX}${id}`);
  return img ?? null;
}

export async function getImages(ids: string[]): Promise<StoredImage[]> {
  const results = await Promise.all(ids.map((id) => getImage(id)));
  return results.filter((r): r is StoredImage => r !== null);
}

export async function deleteImage(id: string): Promise<void> {
  await del(`${IMAGE_PREFIX}${id}`);
}

export async function getAllImageIds(): Promise<string[]> {
  const allKeys = await keys();
  return allKeys
    .filter((k) => String(k).startsWith(IMAGE_PREFIX))
    .map((k) => String(k).replace(IMAGE_PREFIX, ""));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
