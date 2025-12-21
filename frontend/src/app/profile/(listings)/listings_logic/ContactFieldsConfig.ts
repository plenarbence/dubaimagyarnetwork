// ContactFieldsConfig.ts

// -----------------------------
// Típusdefiníciók
// -----------------------------
export type ContactFieldName =
  | "company"
  | "phone"
  | "email"
  | "website"
  | "location"
  | "whatsapp"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "youtube";

// -----------------------------
// Mezőlista (render sorrend)
// -----------------------------
export const CONTACT_FIELDS: ContactFieldName[] = [
  "company",
  "phone",
  "email",
  "website",
  "location",
  "whatsapp",
  "instagram",
  "tiktok",
  "facebook",
  "youtube",
];

// -----------------------------
// Label-ek
// -----------------------------
export const CONTACT_LABELS: Record<ContactFieldName, string> = {
  company: "Cég",
  phone: "Telefonszám",
  email: "E-mail",
  website: "Weboldal",
  location: "Helyszín",
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  youtube: "YouTube",
};

// -----------------------------
// Placeholder-ek
// -----------------------------
export const CONTACT_PLACEHOLDERS: Record<ContactFieldName, string> = {
  company: "Pl. Dubai Cleaning Services LLC",
  phone: "+971501234567",
  email: "example@email.com",
  website: "https://example.com",
  location: "Dubai, Arabian Ranches 3",
  whatsapp: "+971501234567",
  instagram: "instagramuser",
  tiktok: "tiktokuser",
  facebook: "facebookuser",
  youtube: "https://youtube.com/@channel",
};


// -----------------------------
// Max hosszok
// -----------------------------
export const CONTACT_MAX_LENGTHS: Record<ContactFieldName, number> = {
  company: 255,
  phone: 50,
  email: 255,
  website: 255,
  location: 255,
  whatsapp: 50,
  instagram: 30,
  tiktok: 30,
  facebook: 50,
  youtube: 255,
};


// --------------------------------
// Melyik fieldet lehet tesztelni
// --------------------------------
export const CONTACT_FIELDS_WITH_TEST: ContactFieldName[] = [
  "phone",
  "whatsapp",
  "email",
  "website",
  "location",
  "instagram",
  "tiktok",
  "facebook",
  "youtube",
];

// Objektum..
export type ContactFormState = Record<ContactFieldName, string>;
