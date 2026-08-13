/**
 * Static Reels Service
 * ───────────────────────────
 * Manually update this list with your own videos.
 */

export interface InstagramReel {
  id: string;
  title: string;
  thumbnail_url: string;
  media_url: string; // Video URL (mp4)
  permalink: string;
  timestamp: string;
  like_count?: number;
  comments_count?: number;
  play_count?: number; // views
}

// ─── Format view count (e.g. 12400 → "12.4K") ───────────────────────────────
export function formatCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K`;
  return count.toString();
}

// ─── Static Data (Manually update this list with your own videos) ───────────
export const STATIC_REELS: InstagramReel[] = [
  {
    id: "reel_1",
    title: "iPhone 15 Pro Unboxing!",
    thumbnail_url: "", // Add thumbnail URL here
    media_url: "/videos/1.mp4",
    permalink: "https://www.instagram.com/refoneindia/",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    like_count: 1240,
    play_count: 12400,
  },
  {
    id: "reel_2",
    title: "How to sell old phone easily?",
    thumbnail_url: "",
    media_url: "/videos/2.mp4",
    permalink: "https://www.instagram.com/refoneindia/",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    like_count: 870,
    play_count: 8700,
  },
  {
    id: "reel_3",
    title: "Top 5 things to check before selling",
    thumbnail_url: "",
    media_url: "/videos/3.mp4",
    permalink: "https://www.instagram.com/refoneindia/",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    like_count: 1530,
    play_count: 15300,
  },
  {
    id: "reel_4",
    title: "Refone gives best value!",
    thumbnail_url: "",
    media_url: "/videos/4.mp4",
    permalink: "https://www.instagram.com/refoneindia/",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    like_count: 1110,
    play_count: 11100,
  },
  {
    id: "reel_5",
    title: "From Old to Gold",
    thumbnail_url: "",
    media_url: "https://videos.pexels.com/video-files/9558745/9558745-sd_506_960_25fps.mp4",
    permalink: "https://www.instagram.com/refoneindia/",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    like_count: 920,
    play_count: 9200,
  },
  {
    id: "reel_6",
    title: "Happy Customers",
    thumbnail_url: "",
    media_url: "https://videos.pexels.com/video-files/18291332/18291332-sd_360_640_30fps.mp4",
    permalink: "https://www.instagram.com/refoneindia/",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    like_count: 1080,
    play_count: 10800,
  },
];
