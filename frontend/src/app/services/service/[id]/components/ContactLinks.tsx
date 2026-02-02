import {
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";

import { SiTiktok } from "react-icons/si";

import { trackListingClick } from "../../../../../components/trackListingClick";


type ContactLinksProps = {
  listingId: number;

  email?: string | null;
  phone_number?: string | null;
  website?: string | null;
  whatsapp?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  facebook?: string | null;
  youtube?: string | null;
};

export default function ContactLinks({
  listingId,
  email,
  phone_number,
  website,
  whatsapp,
  instagram,
  tiktok,
  facebook,
  youtube,
}: ContactLinksProps) {
  const links = [
    email && {
      label: email,
      href: `mailto:${email}`,
      Icon: Mail,
      target: "email",
    },
    phone_number && {
      label: phone_number,
      href: `tel:${phone_number}`,
      Icon: Phone,
      target: "phone",
    },
    website && {
      label: website.replace(/^https?:\/\//, ""),
      href: website.startsWith("http") ? website : `https://${website}`,
      Icon: Globe,
      target: "website",
    },
    whatsapp && {
      label: "WhatsApp",
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
      Icon: MessageCircle,
      target: "whatsapp",
    },
    instagram && {
      label: `@${instagram}`,
      href: `https://instagram.com/${instagram}`,
      Icon: Instagram,
      target: "instagram",
    },
    tiktok && {
      label: `@${tiktok}`,
      href: `https://www.tiktok.com/@${tiktok}`,
      Icon: SiTiktok,
      target: "tiktok",
    },
    facebook && {
        label: `@${facebook}`,
        href: `https://facebook.com/${facebook.replace(/^@/, "")}`,
        Icon: Facebook,
        target: "facebook",
    },
    youtube && {
      label: "YouTube",
      href: youtube,
      Icon: Youtube,
      target: "youtube",
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    Icon: React.ElementType;
    target: Parameters<typeof trackListingClick>[1];
  }[];

  if (links.length === 0) return null;

return (
  <div className="mt-6">
    <h3 className="text-sm font-medium text-gray-800 mb-2">
      Kapcsolat
    </h3>

    <div className="flex flex-col gap-2">
      {links.map(({ label, href, Icon, target }, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackListingClick(listingId, target)}
            className="inline-flex items-center gap-2 hover:text-gray-900 hover:underline"
          >
            <Icon size={16} className="shrink-0" />
            <span>{label}</span>
          </a>
        </div>
      ))}
    </div>
  </div>
);

}
