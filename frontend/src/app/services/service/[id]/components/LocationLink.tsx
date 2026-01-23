import { MapPin } from "lucide-react";

type LocationLinkProps = {
  location: string | null;
};

export default function LocationLink({ location }: LocationLinkProps) {
  if (!location) return null;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    location
  )}`;

  return (
    <div className="mt-4">
      <div className="text-sm font-medium text-gray-800 mb-1">
        Helyszín
      </div>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 hover:underline"
      >
        <MapPin size={16} className="shrink-0" />
        <span>{location}</span>
      </a>
    </div>
  );
}
