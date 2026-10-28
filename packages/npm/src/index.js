/**
 * Thin client for the Wicked YouTube Transcript Scraper on RapidAPI.
 * Get a key at https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper (50 transcripts a month free).
 */
export const HOST = "wicked-youtube-transcript-scraper.p.rapidapi.com";

export class YouTubeTranscriptError extends Error {
  constructor(status, code, message, details) { super(message); this.name = "YouTubeTranscriptError"; this.status = status; this.code = code; this.details = details; }
}

export class YouTubeTranscript {
  /** @param {string} apiKey your RapidAPI key  @param {{fetch?: typeof fetch, host?: string}} [options] */
  constructor(apiKey, options = {}) {
    if (!apiKey) throw new Error("A RapidAPI key is required.");
    this.apiKey = apiKey; this.fetch = options.fetch ?? globalThis.fetch; this.host = options.host ?? HOST;
  }
  headers(extra = {}) { return { "X-RapidAPI-Key": this.apiKey, "X-RapidAPI-Host": this.host, ...extra }; }
  async request(path, { method = "GET", query, body } = {}) {
    const qs = query ? "?" + new URLSearchParams(Object.fromEntries(Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== ""))).toString() : "";
    const res = await this.fetch(`https://${this.host}${path}${qs}`, { method, headers: this.headers(body ? { "Content-Type": "application/json" } : {}), body: body ? JSON.stringify(body) : undefined });
    const text = await res.text();
    let json; try { json = JSON.parse(text); } catch { json = { error: "BAD_RESPONSE", message: text.slice(0, 200) }; }
    if (!res.ok) throw new YouTubeTranscriptError(res.status, json.error ?? "ERROR", json.message ?? res.statusText, json);
    return json;
  }
  /** One video. url: YouTube URL or 11-character id. lang: "en" or a priority list "es,en" or ["es","en"]. */
  transcript(url, { lang, captionType, format, segments } = {}) {
    return this.request("/transcript", { query: { url, lang: Array.isArray(lang) ? lang.join(",") : lang, captionType, format: Array.isArray(format) ? format.join(",") : format, segments } });
  }
  /** Caption languages and video facts. Free. */
  languages(url) { return this.request("/languages", { query: { url } }); }
  /** Up to 25 videos in one call. Billed one per delivered transcript. */
  transcripts(urls, { lang, captionType, format, segments } = {}) {
    if (!Array.isArray(urls) || urls.length === 0) throw new Error("urls must be a non-empty array");
    if (urls.length > 25) throw new Error("At most 25 urls per call; split the list.");
    return this.request("/transcripts", { method: "POST", body: { urls, lang: Array.isArray(lang) ? lang.join(",") : lang, captionType, format: Array.isArray(format) ? format.join(",") : format, segments } });
  }
}
export default YouTubeTranscript;
