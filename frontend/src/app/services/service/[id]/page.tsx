"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { useOptionalAuthUser } from "./components/useOptionalAuthUser";
import { RatingDisplay } from "./components/RatingDisplay";
import { TagsDisplay } from "./components/TagsDisplay";
import ListingImageDesktop from "./components/ListingImageDesktop";
import ListingImageMobile from "./components/ListingImageMobile";
import LocationLink from "./components/LocationLink";
import ContactLinks from "./components/ContactLinks";
import ListingRatings from "./components/ListingRatings";


export type ListingPublic = {
  // ---- alap ----
  title: string;
  description: string;

  // ---- üzleti / kontakt ----
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

  // ---- rating (aggregált) ----
  rating_avg: number | null;
  rating_count: number;

  // ---- képek ----
  image_url_list: string[];

  // ---- rating lista ----
  ratings_list: {
    id: number;
    user_id: number;
    created_at: string; // ISO datetime
    rating: number;
    text: string | null;
  }[];
};


export default function ListingPublicPage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useOptionalAuthUser();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [listing, setListing] = useState<ListingPublic | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);



  // -----------------------------
  // LOAD PUBLIC DATA
  // -----------------------------
  useEffect(() => {
    if (!id) return;

    async function fetchPreview() {
      try {
        const res = await fetch(`${API_URL}/listings/public/listing/${id}`);
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
  }, [id, API_URL, reloadKey]);



  // -----------------------------
  // UI STATES
  // -----------------------------
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
            listingId={Number(id)}
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

          <ListingRatings
            listingId={Number(id)}
            ratings={listing.ratings_list}
            userId={user?.id ?? null}
            isLoggedIn={isLoggedIn}
            setReloadKey={setReloadKey}
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

        {listing.description && (
          <div className="mt-4 text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {listing.description}
          </div>
        )}



        <ListingRatings
          listingId={Number(id)}
          ratings={listing.ratings_list}
          userId={user?.id ?? null}
          isLoggedIn={isLoggedIn}
          setReloadKey={setReloadKey}
        />





      </div>
    </div>
  );
}