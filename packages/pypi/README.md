# wicked-youtube-transcript

Source client for supported public YouTube videos with available captions: plain text, timestamped segments, SRT, WebVTT, caption languages and video facts. It retrieves existing captions; it does not transcribe audio or translate captions. The client uses Python’s standard library at runtime.

This client calls the [Wicked YouTube Transcript Scraper on RapidAPI](https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper). Use your own RapidAPI key and review that listing’s current plans, quotas and charging rules before calling. Apify pricing does not apply to this RapidAPI client.

Use the package source in this repository. From a local checkout, install it into your environment with the local package path; registry publication is not assumed:

```bash
python -m pip install /absolute/path/to/youtube-transcript-api/packages/pypi
```

```python
import os
from wicked_youtube_transcript import YouTubeTranscript

yt = YouTubeTranscript(os.environ["RAPIDAPI_KEY"])
t = yt.transcript("https://www.youtube.com/watch?v=jNQXAC9IVRw", lang="en")
print(t.get("title"), t.get("text", "")[:200])
for seg in t.get("data", []):
    print(seg.get("start"), seg.get("text"))
langs = yt.languages("jNQXAC9IVRw")
batch = yt.transcripts(["jNQXAC9IVRw", "IELMSD2kdmk"], format="srt")  # up to 25
```

HTTP failures raise `YouTubeTranscriptError` with `.status`, `.code` and `.details`. Inspect each batch result, since caption availability and language support vary by video. Python 3.8+. MIT.
