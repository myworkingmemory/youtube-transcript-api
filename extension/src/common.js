export const HOST = "wicked-youtube-transcript-scraper.p.rapidapi.com";
export const LISTING = "https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper";
/** 11-character YouTube id from watch, youtu.be, shorts, embed, live URLs or a bare id; null otherwise. */
export function videoIdFrom(input) {
  const s = String(input || "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  let u; try { u = new URL(s); } catch { return null; }
  const host = u.hostname.replace(/^www\.|^m\./, "");
  if (host === "youtu.be") return ok(u.pathname.slice(1));
  if (!/(^|\.)youtube(-nocookie)?\.com$/.test(host)) return null;
  const v = u.searchParams.get("v"); if (v) return ok(v);
  const m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
function ok(id) { return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null; }
export async function getSettings() { return new Promise((r) => chrome.storage.sync.get({ apiKey: "", lang: "en" }, r)); }
export async function fetchTranscript(apiKey, videoId, lang, format) {
  const qs = new URLSearchParams({ url: videoId, lang: lang || "en", ...(format ? { format } : {}) });
  const res = await fetch(`https://${HOST}/transcript?${qs}`, { headers: { "X-RapidAPI-Key": apiKey, "X-RapidAPI-Host": HOST } });
  const body = await res.json().catch(() => ({ error: "BAD_RESPONSE", message: "Unexpected response" }));
  if (!res.ok) { const e = new Error(body.message || res.statusText); e.code = body.error || String(res.status); e.status = res.status; e.details = body; throw e; }
  return body;
}
export function toSrt(data) {
  const ts = (t) => { const ms = Math.round(t * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60, x = ms % 1000; return `${p(h)}:${p(m)}:${p(s)},${String(x).padStart(3, "0")}`; };
  const p = (n) => String(n).padStart(2, "0");
  return (data || []).map((seg, i) => `${i + 1}\n${ts(seg.start)} --> ${ts(seg.start + seg.dur)}\n${seg.text}\n`).join("\n");
}
