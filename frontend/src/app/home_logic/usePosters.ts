import { PosterPublic } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPublicPosters(): Promise<PosterPublic[]> {
  const res = await fetch(`${API_URL}/posters`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}
