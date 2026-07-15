import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  name: string;
  activeImage: number;
  onSelectImage: (index: number) => void;
}

export function VillaGallery({ images, name, activeImage, onSelectImage }: Props) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-4 sm:grid-rows-2 sm:h-[440px]">
      <div className="overflow-hidden rounded-3xl sm:col-span-2 sm:row-span-2">
        <img
          src={images[activeImage]}
          alt={name}
          className="h-72 w-full object-cover sm:h-full"
        />
      </div>
      {images.slice(0, 4).map((img, i) => (
        <button
          key={i}
          onClick={() => onSelectImage(i)}
          className={cn(
            "overflow-hidden rounded-3xl transition-all aspect-square sm:aspect-auto",
            activeImage === i && "ring-2 ring-primary ring-offset-2 ring-offset-background",
          )}
        >
          <img src={img} alt={`${name} ${i}`} className="h-full w-full object-cover" />
        </button>
      ))}
    </div>
  );
}
