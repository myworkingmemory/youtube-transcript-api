# New app: Wicked YouTube Transcript (RapidAPI)

**App slug:** `wicked_youtube_transcript` · **Auth:** custom (RapidAPI key as `api_key`) · **Docs:** https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper

Transcripts of public YouTube videos (text, timestamped segments, SRT, WebVTT, caption languages, video facts) through RapidAPI. Two actions: **Get YouTube Transcript** (billed one transcript on success, nothing on failure) and **List Caption Languages** (free). Free tier: 50 transcripts a month.

Submission route: open the "Add new app" request at https://pipedream.com/support (Pipedream creates the app record with the custom-auth field `api_key`), then raise this PR against `PipedreamHQ/pipedream` under `components/wicked_youtube_transcript/`. Checklist: `pnpm lint` passes, versions `0.0.1`, `$summary` exported, docs link in each description.
