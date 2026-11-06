"use client";

import { useEffect, useRef } from "react";

/**
 * Verisk's jack-o'-lantern: their logo carved into a pumpkin, from their
 * Halloween video. It never makes a sound: the file has no audio track, and
 * the element is held muted besides, so even an old cached copy that still
 * had audio stays silent. The dialog's pause control stops it, and with
 * reduced motion it stays on the still frame.
 */

const VIDEO = { src: "/coop/verisk/pumpkin.mp4", poster: "/coop/verisk/pumpkin-poster.jpg" } as const;
/** The pumpkin sits a little right of center in the 1224 by 640 frame. */
const FOCUS = "51.4% 50%";

export function PumpkinPanel({ paused, className = "" }: { paused: boolean; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Anything that unmutes it or raises the volume is undone at once.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const silence = () => {
      if (!video.muted) video.muted = true;
      if (video.volume !== 0) video.volume = 0;
    };
    video.defaultMuted = true;
    silence();
    video.addEventListener("volumechange", silence);
    return () => video.removeEventListener("volumechange", silence);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const still = paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) video.pause();
    else void video.play().catch(() => {});
  }, [paused]);

  return (
    <figure className={`rounded-[28px] border border-border bg-background p-2.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-[20px] bg-[#1a120b]">
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          poster={VIDEO.poster}
          aria-hidden
          tabIndex={-1}
          className="h-full w-full object-cover"
          style={{ objectPosition: FOCUS }}
        >
          <source src={VIDEO.src} type="video/mp4" />
        </video>
      </div>
      <figcaption className="px-2 pt-2.5 pb-1.5 text-[13px] leading-snug text-muted">
        Verisk&apos;s logo, carved into a jack-o&apos;-lantern for Halloween
      </figcaption>
    </figure>
  );
}
