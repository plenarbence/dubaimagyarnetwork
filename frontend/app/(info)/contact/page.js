// app/contact/page.js
import { Mail, Phone, MessageCircle } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">Kapcsolat</h1>
      <p className="mb-6 text-gray-700">
        Ha kérdésed van a hirdetésekkel vagy az oldallal kapcsolatban, keress minket bátran
        e-mailben, telefonon vagy WhatsAppon.
      </p>

      <div className="space-y-4 text-lg">
        <p className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-current" />
          <a href="mailto:info@dubaimagyarnetwork.com" className="hover:underline">
            info@dubaimagyarnetwork.com
          </a>
        </p>

        <p className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-current" />
          <a href="tel:+971501234567" className="hover:underline">
            +971 50 123 4567
          </a>
        </p>

        <p className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-current" />
          <a
            href="https://wa.me/971501234567"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            WhatsApp üzenet
          </a>
        </p>
      </div>
    </div>
  );
}
