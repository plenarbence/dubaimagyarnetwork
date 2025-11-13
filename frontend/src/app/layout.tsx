import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"; 

export const metadata: Metadata = {
  title: "Dubai Magyar Network",
  description: "Magyar szolgáltatók Dubaiban 🇦🇪",
    icons: {
      icon: "/favicon.ico",
    },
};

const poppins = Poppins({
  subsets: ["latin-ext"],
  weight: "500",
  style: "normal",
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body className={`${poppins.className} flex flex-col min-h-screen bg-white text-black`}>
        {/* Navbar külön komponensként */}
        <Navbar />

        {/* Main komponens */}
        <main className="grow">{children}</main>

        {/* Footer külön komponensként */}
        <Footer />

      </body>
    </html>
  );
}
