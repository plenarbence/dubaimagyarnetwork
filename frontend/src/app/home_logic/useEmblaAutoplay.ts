import { useEffect, useRef } from "react";
import type { EmblaCarouselType } from "embla-carousel";

export function useEmblaAutoplay(
  emblaApi: EmblaCarouselType | undefined,
  delay = 15000
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!emblaApi) return;

    const start = () => {
      if (intervalRef.current) return;

      intervalRef.current = setInterval(() => {
        if (!emblaApi.canScrollNext()) {
          emblaApi.scrollTo(0);
        } else {
          emblaApi.scrollNext();
        }
      }, delay);
    };

    const stop = () => {
      if (!intervalRef.current) return;
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [emblaApi, delay]);
}
