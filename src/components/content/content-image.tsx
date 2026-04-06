import Image from "next/image";

type ContentImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  objectFit?: "cover" | "contain";
};

export function ContentImage({
  src,
  alt,
  className,
  width,
  height,
  fill = false,
  sizes,
  objectFit = "cover",
}: ContentImageProps) {
  if (fill) {
    return (
      <Image
        alt={alt}
        className={className}
        fill
        sizes={sizes}
        src={src}
        style={{ objectFit }}
      />
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      height={height ?? 1200}
      src={src}
      style={{ height: "auto", objectFit }}
      width={width ?? 1600}
    />
  );
}
