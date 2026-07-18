export interface AttributionData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  fbclid?: string;
}

export function saveAttributionFromUrl(searchParams: URLSearchParams | string) {
  if (typeof window === "undefined") return;

  const params = typeof searchParams === "string" ? new URLSearchParams(searchParams) : searchParams;
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const utmCampaign = params.get("utm_campaign");
  const fbclid = params.get("fbclid");

  if (utmSource) sessionStorage.setItem("utm_source", utmSource);
  if (utmMedium) sessionStorage.setItem("utm_medium", utmMedium);
  if (utmCampaign) sessionStorage.setItem("utm_campaign", utmCampaign);
  if (fbclid) sessionStorage.setItem("fbclid", fbclid);
}

export function getAttributionData(): AttributionData {
  if (typeof window === "undefined") return {};

  return {
    utmSource: sessionStorage.getItem("utm_source") || undefined,
    utmMedium: sessionStorage.getItem("utm_medium") || undefined,
    utmCampaign: sessionStorage.getItem("utm_campaign") || undefined,
    fbclid: sessionStorage.getItem("fbclid") || undefined,
  };
}
