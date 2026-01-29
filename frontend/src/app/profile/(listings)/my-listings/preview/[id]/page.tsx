"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAuthUser } from "../../../../profile_logic/useAuthUser";
import { RatingDisplay } from "../../components/RatingDisplay";
import { TagsDisplay } from "../../components/TagsDisplay";
import ListingImageDesktop from "../../components/ListingImageDesktop";
import ListingImageMobile from "../../components/ListingImageMobile";
import LocationLink from "../../components/LocationLink";
import ContactLinks from "../../components/ContactLinks";
import HandleStatus from "../../components/HandleStatus";


type ListingPreview = {
  // alap
  title: string;
  description: string;
  status: string;

  // üzleti / kontakt
  company: string | null;
  email: string | null;
  phone_number: string | null;
  website: string | null;
  whatsapp: string | null;
  instagram: string | null;
  tiktok: string | null;
  facebook: string | null;
  youtube: string | null;
  location: string | null;
  tags: string[] | null;

  // rating (aggregált)
  rating_avg: number | null;
  rating_count: number;

  // képek
  image_url_list: string[];

  // admin visszajelzés
  admin_comment: string | null;
};


export default function ListingPreviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading } = useAuthUser();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [listing, setListing] = useState<ListingPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);

  // -----------------------------
  // LOAD PREVIEW DATA
  // -----------------------------
  useEffect(() => {
    if (!id || !user) return;

    async function fetchPreview() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const res = await fetch(
          `${API_URL}/listings/${id}/preview`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data?.detail || "Nem sikerült betölteni a hirdetést.");
          return;
        }

        setListing(data);
      } catch (err) {
        console.error("Preview load error:", err);
        setError("Hálózati hiba történt.");
      }
    }

    fetchPreview();
  }, [id, user, API_URL, router]);

  // -----------------------------
  // UI STATES
  // -----------------------------
  if (loading) return <p className="p-6">Betöltés...</p>;
  if (!user) return null;

  if (error) {
    return (
      <div className="p-6 text-black">
        {error}
      </div>
    );
  }

  if (!listing) {
    return <p className="p-6">Betöltés...</p>;
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* ===== DESKTOP ===== */}
      <div className="hidden md:grid grid-cols-12 gap-6">
        {/* KÉPEK – 1/3 */}
        <div className="col-span-4">
          <ListingImageDesktop
            images={listing.image_url_list}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />
        </div>

        {/* META – 2/3 */}
        <div className="col-span-8">
          <h1 className="text-2xl font-semibold">
            {listing.title}
          </h1>

          {listing.company && (
            <p className="text-sm text-gray-600 mt-1">
              {listing.company}
            </p>
          )}


          <RatingDisplay
            rating_avg={listing.rating_avg}
            rating_count={listing.rating_count}
          />

          <TagsDisplay tags={listing.tags} />

          <LocationLink location={listing.location} />

          <ContactLinks
            email={listing.email}
            phone_number={listing.phone_number}
            website={listing.website}
            whatsapp={listing.whatsapp}
            instagram={listing.instagram}
            tiktok={listing.tiktok}
            facebook={listing.facebook}
            youtube={listing.youtube}
          />


          {listing.description && (
            <div className="mt-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
              {listing.description}
            </div>
          )}


          <HandleStatus
            listing_id={Number(id)}
            status={listing.status}
            admin_comment={listing.admin_comment}
          />


        </div>
      </div>

      {/* ===== MOBILE ===== */}
      <div className="md:hidden">
        <h1 className="text-xl font-semibold">
          {listing.title}
        </h1>

        {listing.company && (
          <p className="text-sm text-gray-600 mt-1">
            {listing.company}
          </p>
        )}


        <RatingDisplay
          rating_avg={listing.rating_avg}
          rating_count={listing.rating_count}
        />

        <TagsDisplay tags={listing.tags} />

        <ListingImageMobile
          images={listing.image_url_list}
          activeImage={activeImage}
          setActiveImage={setActiveImage}
        />

        <LocationLink location={listing.location} />

        <ContactLinks
          email={listing.email}
          phone_number={listing.phone_number}
          website={listing.website}
          whatsapp={listing.whatsapp}
          instagram={listing.instagram}
          tiktok={listing.tiktok}
          facebook={listing.facebook}
          youtube={listing.youtube}
        />

        {listing.description && (
          <div className="mt-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {listing.description}
          </div>
        )}


        <HandleStatus
          listing_id={Number(id)}
          status={listing.status}
          admin_comment={listing.admin_comment}
        />


      </div>
    </div>
  );



}
