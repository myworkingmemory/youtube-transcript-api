import app from "../../wicked_youtube_transcript.app.mjs";

export default {
  key: "wicked_youtube_transcript-list-languages",
  name: "List Caption Languages",
  description: "Caption languages and facts of a public YouTube video. Free (never billed). [See the docs](https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper)",
  version: "0.0.1",
  type: "action",
  props: { app, url: { propDefinition: [app, "url"] } },
  async run({ $ }) {
    const response = await this.app.listLanguages({ $, params: { url: this.url } });
    $.export("$summary", `${(response.availableLanguages || []).length} caption languages for ${response.title || response.videoId}`);
    return response;
  },
};
