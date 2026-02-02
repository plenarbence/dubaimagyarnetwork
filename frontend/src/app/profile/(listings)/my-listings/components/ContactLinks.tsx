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

type ContactLinksProps = {
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
    },
    phone_number && {
      label: phone_number,
      href: `tel:${phone_number}`,
      Icon: Phone,
    },
    website && {
      label: website.replace(/^https?:\/\//, ""),
      href: website.startsWith("http") ? website : `https://${website}`,
      Icon: Globe,
    },
    whatsapp && {
      label: "WhatsApp",
      href: `https://wa.me/${whatsapp.replace(/\D/g, "")}`,
      Icon: MessageCircle,
    },
    instagram && {
      label: `@${instagram}`,
      href: `https://instagram.com/${instagram}`,
      Icon: Instagram,
    },
    tiktok && {
      label: `@${tiktok}`,
      href: `https://www.tiktok.com/@${tiktok}`,
      Icon: SiTiktok,
    },
    facebook && {
        label: `@${facebook}`,
        href: `https://facebook.com/${facebook.replace(/^@/, "")}`,
        Icon: Facebook,
    },
    youtube && {
      label: "YouTube",
      href: youtube,
      Icon: Youtube,
    },
  ].filter(Boolean) as {
    label: string;
    href: string;
    Icon: React.ElementType;
  }[];

  if (links.length === 0) return null;

return (
  <div className="mt-6">
    <h3 className="text-sm font-medium text-gray-800 mb-2">
      Kapcsolat
    </h3>

    <div className="flex flex-col gap-2">
      {links.map(({ label, href, Icon }, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 text-sm text-gray-700"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
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
