import Image from "next/image";

// The school crest on a white tile, so it reads on the green header.
export function Crest({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden bg-white ${className}`}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.24) }}
    >
      <Image src="/crest.png" alt="Tolayope's School crest" width={size - 6} height={size - 6} priority />
    </span>
  );
}
