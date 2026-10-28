# wicked-youtube-transcript

Transcripts of any public YouTube video: plain text, timestamped segments, SRT, WebVTT, caption languages and video facts. No YouTube API key, no browser, no dependencies. Backed by the [Wicked YouTube Transcript Scraper](https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper) on RapidAPI (50 transcripts a month free, then from $4.99 for 4,000).

```bash
pip install wicked-youtube-transcript
```

```python
from wicked_youtube_transcript import YouTubeTranscript
yt = YouTubeTranscript(os.environ["RAPIDAPI_KEY"])
t = yt.transcript("https://www.youtube.com/watch?v=jNQXAC9IVRw", lang="en")
print(t["title"], t["text"][:200])
for seg in t["data"]: print(seg["start"], seg["text"])
langs = yt.languages("jNQXAC9IVRw")                      # free
batch = yt.transcripts(["jNQXAC9IVRw", "IELMSD2kdmk"], format="srt")  # up to 25
```

Failures (no captions, missing language) raise `YouTubeTranscriptError` with `.status`, `.code` and `.details`, and are never billed. Python 3.8+. MIT.
