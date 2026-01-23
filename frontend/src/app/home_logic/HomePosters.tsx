"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

import { PosterPublic } from "./types";
import { getPublicPosters } from "./usePosters";
import { useEmblaAutoplay } from "./useEmblaAutoplay";

export default function HomePosters() {
  const [posters, setPosters] = useState<PosterPublic[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEmblaAutoplay(emblaApi, 15000);

  useEffect(() => {
    getPublicPosters().then(setPosters);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const toAbsoluteUrl = (url: string) =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;

  if (posters.length === 0) return null;

  return (
    <section className="w-full">
      <div className="max-w-2xl mx-auto overflow-hidden">
        <div ref={emblaRef}>
          <div className="flex">
            {posters.map((p) => (
              <a
                key={p.id}
                href={toAbsoluteUrl(p.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative min-w-full aspect-2/1"
                onClick={() => {
                  fetch(`${API_URL}/posters/${p.id}/click`, {
                    method: "POST",
                    keepalive: true,
                  }).catch(() => {});
                }}
              >
                <Image
                  src={p.url}
                  alt={"Poster"}
                  fill
                  className="object-cover"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 1200px"
                />
              </a>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="flex justify-center gap-2 mt-3">
          {posters.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === selectedIndex
                  ? "bg-gray-700"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
