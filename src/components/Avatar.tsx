import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  alt?: string;
  size?: number; // px
  fallbackText?: string;
  className?: string;
};

export function Avatar({
  src,
  alt = "",
  size = 32,
  fallbackText,
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`rounded-full ${className}`}
      />
    );
  }

  const initial = (fallbackText || "?").trim().charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-nnrc-purple-light text-white font-semibold ${className}`}
      style={{ width: size, height: size }}
      aria-hidden={alt ? undefined : true}
    >
      {initial}
    </div>
  );
}

