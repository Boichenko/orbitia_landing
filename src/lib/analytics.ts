export const GA_MEASUREMENT_ID = "G-81TKH2HGVV";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackReportIntent(location: string, reportType?: string) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "start_report_flow", {
    event_category: "engagement",
    event_label: location,
    report_type: reportType,
  });
}
