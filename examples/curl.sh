#!/bin/sh
# One transcript, English preferred, Spanish fallback, with SRT text included.
curl "https://wicked-youtube-transcript-scraper.p.rapidapi.com/transcript?url=https://www.youtube.com/watch?v=jNQXAC9IVRw&lang=en,es&format=srt" \
  -H "X-RapidAPI-Key: $RAPIDAPI_KEY" -H "X-RapidAPI-Host: wicked-youtube-transcript-scraper.p.rapidapi.com"
# Languages only (free).
curl "https://wicked-youtube-transcript-scraper.p.rapidapi.com/languages?url=jNQXAC9IVRw" \
  -H "X-RapidAPI-Key: $RAPIDAPI_KEY" -H "X-RapidAPI-Host: wicked-youtube-transcript-scraper.p.rapidapi.com"
# Batch of up to 25.
curl -X POST "https://wicked-youtube-transcript-scraper.p.rapidapi.com/transcripts" -H "Content-Type: application/json" \
  -H "X-RapidAPI-Key: $RAPIDAPI_KEY" -H "X-RapidAPI-Host: wicked-youtube-transcript-scraper.p.rapidapi.com" \
  -d '{"urls": ["jNQXAC9IVRw", "https://youtu.be/IELMSD2kdmk"], "lang": "en"}'
