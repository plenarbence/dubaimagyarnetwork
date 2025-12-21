// contactValidators.ts

import type { ContactFieldName } from "./ContactFieldsConfig";

// -----------------------------
// VALIDÁTOROK MINDEN MEZŐHÖZ
// üres érték -> valid
// nem üres -> ellenőrzés
// -----------------------------
export const CONTACT_VALIDATORS: Record<ContactFieldName, (v: string) => boolean> = {
  company: (v) => v.trim().length <= 255,

  phone: (v) => /^[+]?\d{6,15}$/.test(v.trim()),

  email: (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim().toLowerCase()),

  website: (v) =>
    /^https?:\/\/[^\s$.?#].[^\s]*$/i.test(v.trim()) ||
    /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(v.trim()),

  location: (v) => v.trim().length > 0 && v.trim().length <= 255,

  whatsapp: (v) => /^[+]?\d{6,15}$/.test(v.trim()),

  instagram: (v) => /^[a-zA-Z0-9._]{2,30}$/.test(v.trim()),

  tiktok: (v) => /^[a-zA-Z0-9._]{2,30}$/.test(v.trim()),

  facebook: (v) => /^[a-zA-Z0-9._]{2,50}$/.test(v.trim()),

  youtube: (v) =>
    /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(v.trim()),
};

