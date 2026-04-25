"use client";

import { useState, useEffect, useRef } from "react";

interface VideoBackgroundProps {
  src: string;
  poster?: string;
  className?: string;
  minPosterDisplayTime?: number;
  onPosterLoaded?: () => void;
}

export function VideoBackground({
  src,
  poster,
  className = "",
  minPosterDisplayTime = 2000,
  onPosterLoaded,
}: VideoBackgroundProps) {
  const [showPoster, setShowPoster] = useState(false);
  const [fadingOutPoster, setFadingOutPoster] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoCanPlay, setVideoCanPlay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const posterLoadTimeRef = useRef<number>(0);

  useEffect(() => {
    if (poster && onPosterLoaded) {
      const img = new Image();
      img.onload = () => {
        posterLoadTimeRef.current = Date.now();
        setTimeout(() => setShowPoster(true), 100);
        onPosterLoaded();
      };
      img.src = poster;
    } else if (!poster && onPosterLoaded) {
      onPosterLoaded();
    }
  }, [poster, onPosterLoaded]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setVideoCanPlay(true);
    };

    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  useEffect(() => {
    if (!videoCanPlay) return;

    const elapsedTime = Date.now() - posterLoadTimeRef.current;
    const remainingTime = Math.max(0, minPosterDisplayTime - elapsedTime);

    const fadeOutTimer = setTimeout(() => {
      setFadingOutPoster(true);

      const fadeInTimer = setTimeout(() => {
        setShowVideo(true);
      }, 300);

      return () => clearTimeout(fadeInTimer);
    }, remainingTime);

    return () => clearTimeout(fadeOutTimer);
  }, [videoCanPlay, minPosterDisplayTime]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {poster && (
        <div
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-300 ease-in-out ${
            fadingOutPoster
              ? "opacity-0"
              : showPoster
                ? "opacity-100"
                : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className={`h-full w-full object-cover transition-opacity duration-300 ease-in-out ${
          showVideo ? "opacity-100" : "opacity-0"
        }`}
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-black" />
    </div>
  );
}
