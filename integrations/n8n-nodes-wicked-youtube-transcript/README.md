# n8n-nodes-wicked-youtube-transcript

Source for an n8n node that retrieves existing captions from a supported public YouTube video with available captions: plain text, timestamped segments, SRT, WebVTT, caption languages and video facts. Three operations: Get Transcript, List Caption Languages, and Get Transcripts (up to 25 videos per batch). It does not transcribe audio or translate captions.

This is a RapidAPI integration. Use your own key from the [Wicked YouTube Transcript Scraper on RapidAPI](https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper), and review that listing’s current plans, quotas and charging rules before executing a workflow. Apify pricing does not apply to this node. Caption availability and language support vary by video; inspect individual batch results and errors.

The node source and compiled description are included here. Use a locally built copy with your n8n custom-node workflow; this repository does not establish npm publication or n8n community-node verification. The credential type is `wickedYouTubeTranscriptApi` and requires your RapidAPI key.

Example workflows: a supplied video URL → transcript → an LLM summary → Slack or Notion; a sheet of URLs → batch transcripts → SRT files to Drive. Review the costs and access rules of each additional service separately.

MIT. © 2026 Myworkingmemory.
