const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ListingClickTarget =
  | "listing"
  | "listing_featured"
  | "website"
  | "email"
  | "phone"
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "youtube";

export function trackListingClick(
  listingId: number,
  target: ListingClickTarget
) {
  try {
    fetch(
      `${API_URL}/listings/${listingId}/click?target=${target}`,
      { method: "POST" }
    );
  } catch {
    // best-effort: mindent lenyelünk
  }
}
