import Image from "next/image";
import { Image as ImageType } from "velite";

type PictureProps = {
  image: ImageType;
  quality?: number;
  width?: number;
  height?: number;
  alt: string;
  className?: string;
};

export default function Picture({ image, quality, width, height, alt, className }: PictureProps) {
  // Use provided dimensions or fall back to image dimensions
  const imageWidth = width || image.width || 1024;
  const imageHeight = height || image.height || 768;

  return (
    <Image
      src={image.src}
      alt={alt}
      width={imageWidth}
      height={imageHeight}
      className={className}
      priority
      blurDataURL={image.blurDataURL}
      quality={quality || 100}
    />
  );
}
