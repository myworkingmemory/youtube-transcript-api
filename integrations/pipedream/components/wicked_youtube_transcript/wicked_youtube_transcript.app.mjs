import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wicked_youtube_transcript",
  propDefinitions: {
    url: { type: "string", label: "Video URL or ID", description: "YouTube URL (watch, youtu.be, Shorts, embed, live) or 11-character video ID" },
    lang: { type: "string", label: "Language", description: "ISO 639-1 code or a priority list such as es,en", default: "en", optional: true },
    captionType: { type: "string", label: "Caption Type", options: ["any", "manual", "auto"], default: "any", optional: true },
    format: { type: "string[]", label: "Subtitle Formats", options: ["srt", "vtt"], optional: true, description: "Free; adds srt and vtt text" },
  },
  methods: {
    _baseUrl() { return "https://wicked-youtube-transcript-scraper.p.rapidapi.com"; },
    _headers() { return { "X-RapidAPI-Key": this.$auth.api_key, "X-RapidAPI-Host": "wicked-youtube-transcript-scraper.p.rapidapi.com" }; },
    async _makeRequest({ $ = this, path, ...opts }) { return axios($, { url: this._baseUrl() + path, headers: this._headers(), ...opts }); },
    getTranscript(args = {}) { return this._makeRequest({ path: "/transcript", ...args }); },
    listLanguages(args = {}) { return this._makeRequest({ path: "/languages", ...args }); },
    getTranscripts(args = {}) { return this._makeRequest({ path: "/transcripts", method: "POST", ...args }); },
  },
};
