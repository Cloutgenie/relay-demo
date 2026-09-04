import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  size = 32,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <Image
      src="/brand/relay-mark.png"
      alt=""
      width={size}
      height={size}
      className={cn("h-8 w-8 object-contain", className)}
      priority
    />
  );
}

export function LogoWordmark({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span
        className={cn(
          "text-[15px] font-semibold tracking-tight",
          light ? "text-white" : "text-[#0b1220]",
        )}
      >
        Relay
      </span>
    </span>
  );
}

export function LogoLockup({
  className,
  width = 140,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <Image
      src="/brand/relay-logo.png"
      alt="Relay"
      width={width}
      height={Math.round(width * 1.05)}
      className={cn("object-contain", className)}
      priority
    />
  );
}
