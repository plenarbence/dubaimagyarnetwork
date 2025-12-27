import Image from "next/image";

type Props = {
  images: string[];
  activeImage: number;
  setActiveImage: (i: number) => void;
};

export default function ListingImageMobile({
  images,
  activeImage,
  setActiveImage,
}: Props) {
  if (!images.length) return null;

  return (
    <div className="mt-4 space-y-3">
      {/* MAIN IMAGE */}
      <div className="relative w-full h-[260px] bg-gray-50 rounded-lg flex items-center justify-center">
        <Image
          src={images[activeImage]}
          alt="Image"
          fill
          sizes="100vw"
          className="object-contain rounded-lg"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveImage(activeImage === 0 ? images.length - 1 : activeImage - 1)
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1 shadow"
            >
              ‹
            </button>
            <button
              onClick={() =>
                setActiveImage(activeImage === images.length - 1 ? 0 : activeImage + 1)
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-2 py-1 shadow"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`relative h-20 aspect-3/4 rounded border shrink-0 ${
                idx === activeImage ? "border-gray-800" : "border-gray-300"
              }`}
            >
              <Image
                src={url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover rounded"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
