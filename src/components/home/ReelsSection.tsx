/**
 * ReelsSection — Server Component (SSR / ISR)
 * Fetches reels on the server (or from cache) and passes them to the
 * client-side ReelsSlider for interactive playback.
 *
 * ISR revalidation is controlled inside instagramService (every 1 hour).
 */
// import { instagramService } from "@/services/instagramService";

import { STATIC_REELS } from "@/services/instagramService";
import ReelsSlider from "./ReelsSlider";

export default async function ReelsSection() {
  const reels = await STATIC_REELS
  console.log(reels)

  if (!reels || reels.length === 0) return null;


  const reelData = reels.map((item) => (item))

  return <ReelsSlider reels={reelData} />;
}
