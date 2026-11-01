# wicked-youtube-transcript

Source client for supported public YouTube videos with available captions: plain text, timestamped segments, SRT, WebVTT, caption languages and video facts. It retrieves existing captions; it does not transcribe audio or translate captions.

This client calls the [Wicked YouTube Transcript Scraper on RapidAPI](https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper). Use your own RapidAPI key and review that listing’s current plans, quotas and charging rules before calling. Apify pricing does not apply to this RapidAPI client.

Use the package source in this repository. From a local checkout, install it into your project with the local package path; registry publication is not assumed:

```bash
npm install /absolute/path/to/youtube-transcript-api/packages/npm
```

```js
import YouTubeTranscript from "wicked-youtube-transcript";
const yt = new YouTubeTranscript(process.env.RAPIDAPI_KEY);
const t = await yt.transcript("https://www.youtube.com/watch?v=jNQXAC9IVRw", { lang: "en" });
console.log(t.title, t.text);
const langs = await yt.languages("jNQXAC9IVRw");
const batch = await yt.transcripts(["jNQXAC9IVRw", "IELMSD2kdmk"], { format: "srt" }); // up to 25
```

HTTP failures throw `YouTubeTranscriptError` with `status`, `code` and `details`; available languages may appear in the error details. Inspect each batch result, since caption availability and language support vary by video. Node 18+. MIT.
