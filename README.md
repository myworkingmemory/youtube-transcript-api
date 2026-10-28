# YouTube Transcript API: timestamped transcripts of any public YouTube video

Get the transcript of a YouTube video as plain text, timestamped segments, SRT or WebVTT, plus the video's title, channel, duration and every caption language it has. Manual captions first, auto-generated as fallback, any language the video carries. No YouTube API key, no browser, no quota.

Two ways to call it:

| | RapidAPI (REST, key in a header) | Apify (actor, runs up to 250 videos) |
|---|---|---|
| Listing | https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper | https://apify.com/myworkingmemory/wicked-youtube-transcript-scraper-api |
| Free tier | 50 transcripts a month | Apify free credit |
| Price | from $4.99 for 4,000 transcripts ($0.0012 each); $39.99 for 35,000 | $0.70 per 1,000 transcripts, no start fee |
| Batch | 25 videos per request | 250 videos per run |
| Failures | never billed | never billed |

## 30-second start (RapidAPI)

```bash
curl "https://wicked-youtube-transcript-scraper.p.rapidapi.com/transcript?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&lang=en" \
  -H "X-RapidAPI-Key: YOUR_KEY" -H "X-RapidAPI-Host: wicked-youtube-transcript-scraper.p.rapidapi.com"
```

Response (abridged):

```json
{
  "videoId": "jNQXAC9IVRw",
  "title": "Me at the zoo",
  "channel": "jawed",
  "language": "en",
  "captionType": "manual",
  "text": "All right, so here we are in front of the elephants ...",
  "data": [{ "start": 0.0, "dur": 1.5, "text": "All right, so here we are" }],
  "availableLanguages": [{ "code": "en", "name": "English", "kind": "manual" }]
}
```

## Endpoints

| Method and path | What it does | Billed |
|---|---|---|
| `GET /transcript?url=&lang=en&captionType=any&format=srt,vtt&segments=true` | One video. `lang` accepts a priority list such as `es,en`. | 1 transcript on success, 0 on any failure |
| `GET /languages?url=` | The video's caption languages and facts | 0 |
| `POST /transcripts` with `{"urls": [...], "lang": "en"}` (up to 25) | Batch; failed videos are listed, not charged | 1 per delivered transcript |

Full specification: [openapi.json](./openapi.json). Postman collection: [postman_collection.json](./postman_collection.json).

## Examples

- [curl](./examples/curl.sh)
- [Node.js (fetch)](./examples/node.mjs)
- [Python (requests)](./examples/python.py)
- [Apify client, 250 videos in one run](./examples/apify.py)

## In this repository

| Folder | What |
|---|---|
| `examples/` | curl, Node.js, Python and Apify examples |
| `packages/npm/` | `wicked-youtube-transcript` JavaScript client (`npm i wicked-youtube-transcript`) |
| `packages/pypi/` | `wicked-youtube-transcript` Python client, no dependencies (`pip install wicked-youtube-transcript`) |
| `integrations/n8n-nodes-wicked-youtube-transcript/` | n8n community node: Get Transcript, List Languages, Batch of 25 |
| `integrations/pipedream/` | Pipedream app and actions |
| `extension/` | Browser extension (Chrome, Firefox, Edge): transcript of the video you are watching, bring your own key |
| `mcp/server.json` | MCP Registry record; the Apify actor runs as a remote MCP server at `https://mcp.apify.com/?tools=myworkingmemory/wicked-youtube-transcript-scraper-api` |
| `openapi.json`, `postman_collection.json` | Specifications |

## What you will not pay for

No start fee, no charge for a video without captions, no charge to list languages, no charge for SRT or WebVTT, no charge when a requested language is missing (the languages it does have come back instead).

## Honest limits

Public videos only. Captions come from the video's own caption tracks; a video with no captions returns `NO_CAPTIONS` and is not billed. Auto-generated captions are YouTube's, errors included. No audio transcription, no translation.

## Support

support@myworkingmemory.ai · [Terms](https://www.myworkingmemory.ai/api-terms.html) · [Privacy](https://www.myworkingmemory.ai/api-privacy.html)

© 2026 Myworkingmemory LLC. All rights reserved. Examples in this repository are MIT licensed.
