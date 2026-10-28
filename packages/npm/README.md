# wicked-youtube-transcript

Transcripts of any public YouTube video: plain text, timestamped segments, SRT, WebVTT, caption languages and video facts. No YouTube API key, no browser. Backed by the [Wicked YouTube Transcript Scraper](https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper) on RapidAPI (50 transcripts a month free, then from $4.99 for 4,000).

```bash
npm i wicked-youtube-transcript
```

```js
import YouTubeTranscript from "wicked-youtube-transcript";
const yt = new YouTubeTranscript(process.env.RAPIDAPI_KEY);
const t = await yt.transcript("https://www.youtube.com/watch?v=jNQXAC9IVRw", { lang: "en" });
console.log(t.title, t.text);
const langs = await yt.languages("jNQXAC9IVRw");          // free
const batch = await yt.transcripts(["jNQXAC9IVRw", "IELMSD2kdmk"], { format: "srt" }); // up to 25
```

Failures (no captions, missing language) throw `YouTubeTranscriptError` with `status`, `code` and `details.availableLanguages`, and are never billed. Node 18+. MIT.
