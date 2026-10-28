import app from "../../wicked_youtube_transcript.app.mjs";

export default {
  key: "wicked_youtube_transcript-get-transcript",
  name: "Get YouTube Transcript",
  description: "Transcript of one public YouTube video: text, timestamped segments, optional SRT/WebVTT, video facts. Billed one transcript on success, nothing on failure. [See the docs](https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    url: { propDefinition: [app, "url"] },
    lang: { propDefinition: [app, "lang"] },
    captionType: { propDefinition: [app, "captionType"] },
    format: { propDefinition: [app, "format"] },
  },
  async run({ $ }) {
    const response = await this.app.getTranscript({ $, params: { url: this.url, lang: this.lang, captionType: this.captionType, format: (this.format || []).join(",") || undefined } });
    $.export("$summary", `Got transcript of ${response.title || response.videoId} (${response.language}, ${response.captionType})`);
    return response;
  },
};
