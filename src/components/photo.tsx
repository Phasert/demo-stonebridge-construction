"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** next/image with a graceful local fallback if a remote placeholder photo is unavailable. */
export function Photo({ src, alt, ...rest }: ImageProps) {
  const [failed, setFailed] = useState(false);
  return <Image {...rest} src={failed ? "/construction.webp" : src} alt={alt} onError={() => setFailed(true)} />;
}
