"use client";

import SingleContactField from "./SingleContactField";
import { CONTACT_FIELDS } from "./ContactFieldsConfig";
import type { ContactFormState } from "./ContactFieldsConfig";

interface ContactFieldsManagerProps {
  value: ContactFormState;                 // teljes contact state
  onChange: (next: ContactFormState) => void; // state frissítés
}

export default function ContactFieldsManager({
  value,
  onChange,
}: ContactFieldsManagerProps) {
  // mező frissítése egyesével
  const updateField = (field: string, nextValue: string) => {
    onChange({
      ...value,
      [field]: nextValue,
    });
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {CONTACT_FIELDS.map((field) => (
        <SingleContactField
          key={field}
          field={field}
          value={value[field]}
          onChange={(next) => updateField(field, next)}
        />
      ))}
    </div>
  );
}
