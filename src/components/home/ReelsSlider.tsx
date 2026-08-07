"use client";

import React, { useRef, useState, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "@/styles/ReelsSection.css";
import { InstagramReel, formatCount } from "@/services/instagramService";
import {
  FaPlay,
  FaPause,
  FaVolumeMute,
  FaVolumeUp,
  FaInstagram,
} from "react-icons/fa";
import { HiOutlineExternalLink } from "react-icons/hi";

interface ReelsSliderProps {
  reels: InstagramReel[];
}

interface ReelCardProps {
  reel: InstagramReel;
}

const ReelCard: React.FC<ReelCardProps> = ({ reel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Always muted by default
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handlePlayPause = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      try {
        video.muted = true; // Ensure muted on first play (browser policy)
        setIsMuted(true);
        await video.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Video play failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [isPlaying]);

  const handleMuteToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleVideoEnd = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    setIsPlaying(false);
  }, []);

  const viewCount = reel.play_count ?? reel.like_count ?? 0;
  console.log("ye rha video",reel.media_url)

  return (
    <div className="reel-card" onClick={handlePlayPause}>
      {/* Video */}
      <video
        ref={videoRef}
        className="reel-video"
        src={reel.media_url}
        poster={reel.thumbnail_url || undefined}
        preload="metadata"
        playsInline
        muted
        loop={false}
        onEnded={handleVideoEnd}
        
        // onError={handleError}
        onError={() => {console.log("Video error:", reel.media_url);}}
      />

      {/* Gradient overlay */}
      <div className="reel-overlay" />

      {/* Top: Instagram badge */}
      {/* <div className="reel-top">
        <span className="reel-insta-badge">
          <FaInstagram />
        </span>
      </div> */}

      {/* Center: Play / Pause / Loading */}
      <div className="reel-center-controls">
        {isLoading ? (
          <div className="reel-spinner" />
        ) : hasError ? (
          <a
            href={reel.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="reel-external-link"
            onClick={(e) => e.stopPropagation()}
            aria-label="View on Instagram"
          >
            <HiOutlineExternalLink />
          </a>
        ) : isPlaying ? (
          <div className="reel-play-btn reel-play-btn--visible">
            <FaPause />
          </div>
        ) : (
          <div className="reel-play-btn reel-play-btn--visible">
            <FaPlay />
          </div>
        )}
      </div>

      {/* Bottom: Title + views + mute */}
      <div className="reel-bottom">
        <div className="reel-meta">
          <p className="reel-title">{reel.title}</p>
          <span className="reel-views">
            <FaPlay className="reel-views-icon" />
            {formatCount(viewCount)} views
          </span>
        </div>
        {isPlaying && (
          <button
            className="reel-mute-btn"
            onClick={handleMuteToggle}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        )}
      </div>
    </div>
  );
};

const ReelsSlider: React.FC<ReelsSliderProps> = ({ reels }) => {
  return (
    <section className="reels-section">
      <div className="container">
        {/* Section Header */}
        <div className="reels-header">
          <div className="reels-header-left">
            <span className="reels-header-icon">
              <FaInstagram />
            </span>
            <div>
              <h2 className="reels-title">Trending Reels</h2>
              <p className="reels-subtitle">Watch our latest reels on Instagram</p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/refoneindia/"
            target="_blank"
            rel="noopener noreferrer"
            className="reels-view-all"
            id="reels-view-all-btn"
          >
            View All Reels&nbsp;›
          </a>
        </div>

        {/* Grid (desktop) / Swiper (mobile) */}
        <div className="reels-grid-desktop">
          {reels.map((reel) => (
            <ReelCard key={reel.id} reel={reel} />
          ))}
        </div>

        <div className="reels-slider-mobile">
          <Swiper
            modules={[Navigation, FreeMode]}
            spaceBetween={12}
            slidesPerView={1.4}
            centeredSlides={false}
            freeMode
            grabCursor
            breakpoints={{
              360: { slidesPerView: 1.5, spaceBetween: 12 },
              480: { slidesPerView: 2.2, spaceBetween: 14 },
              640: { slidesPerView: 2.8, spaceBetween: 16 },
              768: { slidesPerView: 3.3, spaceBetween: 16 },
            }}
          >
            {reels.map((reel) => (
              <SwiperSlide key={reel.id}>
                <ReelCard reel={reel} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ReelsSlider;
