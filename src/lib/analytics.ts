export const GA_MEASUREMENT_ID = "G-81TKH2HGVV";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackTelegramClick(location: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "click_telegram", {
    event_category: "engagement",
    event_label: location,
    link_url: "https://t.me/orbitia_bot",
  });
}
