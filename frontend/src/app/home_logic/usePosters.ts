import { PosterPublic } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getPublicPosters(): Promise<PosterPublic[]> {
  const res = await fetch(`${API_URL}/posters`, {
    next: { revalidate: 300 }, // 5 perc
  });

  if (!res.ok) return [];
  return res.json();
}
