# n8n-nodes-wicked-youtube-transcript

An n8n community node that returns the transcript of any public YouTube video: plain text, timestamped segments, SRT, WebVTT, caption languages and video facts. Three operations: Get Transcript, List Caption Languages (free), Get Transcripts (batch of 25).

Install in n8n: Settings → Community Nodes → Install → `n8n-nodes-wicked-youtube-transcript`. Credentials: one RapidAPI key from https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper (50 transcripts a month free, then from $4.99 for 4,000). Failed videos (no captions, missing language) are never billed.

Typical flows: new video on a channel → transcript → summarize with an LLM → post to Slack or Notion; a sheet of URLs → batch transcripts → SRT files to Drive.

MIT. © 2026 Myworkingmemory LLC.
