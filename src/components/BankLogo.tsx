"use client";

import Image from "next/image";

interface BankLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export default function BankLogo({ width = 32, height = 32, className }: BankLogoProps) {
  return (
    <Image
      src="/images/Logo.png"
      alt="Sovereign Trust Bank"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
