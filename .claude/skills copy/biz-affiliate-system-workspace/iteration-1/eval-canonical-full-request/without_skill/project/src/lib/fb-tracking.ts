export type FbTracking = {
  eventId: string;
  eventSourceUrl: string;
  userAgent: string;
  referrer: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
};

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const escaped = name.replace(/[.$?*|{}()[\]\\/+^]/g, "\\$&");
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + escaped + "=([^;]*)"),
  );
  return match ? decodeURIComponent(match[1]) : undefined;
}

// Facebook click ID format when synthesized from URL fbclid
// See: https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/fbp-and-fbc/
function buildFbcFromFbclid(fbclid: string): string {
  return `fb.1.${Date.now()}.${fbclid}`;
}

function generateEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function collectFbTracking(): FbTracking | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const fbclid = url.searchParams.get("fbclid") ?? undefined;
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  if (!fbc && fbclid) {
    fbc = buildFbcFromFbclid(fbclid);
  }
  return {
    eventId: generateEventId(),
    eventSourceUrl: window.location.href,
    userAgent: navigator.userAgent,
    referrer: document.referrer || "",
    fbp,
    fbc,
    fbclid,
  };
}
