"""Thin client for the Wicked YouTube Transcript Scraper on RapidAPI (standard library only).
Get a key at https://rapidapi.com/Myworkingmemory/api/wicked-youtube-transcript-scraper (50 transcripts a month free)."""
import json
import urllib.request
import urllib.parse
import urllib.error

HOST = "wicked-youtube-transcript-scraper.p.rapidapi.com"
__all__ = ["YouTubeTranscript", "YouTubeTranscriptError", "HOST"]


class YouTubeTranscriptError(Exception):
    def __init__(self, status, code, message, details=None):
        super().__init__(f"{status} {code}: {message}")
        self.status, self.code, self.details = status, code, details


def _csv(v):
    if v is None:
        return None
    return ",".join(v) if isinstance(v, (list, tuple)) else v


class YouTubeTranscript:
    def __init__(self, api_key, host=HOST, timeout=90, opener=None):
        if not api_key:
            raise ValueError("A RapidAPI key is required.")
        self.api_key, self.host, self.timeout = api_key, host, timeout
        self._open = opener or urllib.request.urlopen

    def _request(self, path, query=None, body=None):
        q = {k: v for k, v in (query or {}).items() if v not in (None, "")}
        url = f"https://{self.host}{path}" + ("?" + urllib.parse.urlencode(q) if q else "")
        headers = {"X-RapidAPI-Key": self.api_key, "X-RapidAPI-Host": self.host}
        data = None
        if body is not None:
            headers["Content-Type"] = "application/json"
            data = json.dumps({k: v for k, v in body.items() if v is not None}).encode()
        req = urllib.request.Request(url, data=data, headers=headers, method="POST" if data else "GET")
        try:
            with self._open(req, timeout=self.timeout) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            try:
                payload = json.loads(e.read().decode())
            except Exception:
                payload = {"error": "ERROR", "message": str(e)}
            raise YouTubeTranscriptError(e.code, payload.get("error", "ERROR"), payload.get("message", ""), payload) from None

    def transcript(self, url, lang=None, caption_type=None, format=None, segments=None):
        """One video. url: YouTube URL or 11-character id. lang: 'en' or ['es', 'en']. Billed 1 on success, 0 on failure."""
        return self._request("/transcript", {"url": url, "lang": _csv(lang), "captionType": caption_type, "format": _csv(format), "segments": None if segments is None else str(segments).lower()})

    def languages(self, url):
        """Caption languages and video facts. Free."""
        return self._request("/languages", {"url": url})

    def transcripts(self, urls, lang=None, caption_type=None, format=None, segments=None):
        """Up to 25 videos in one call. Billed one per delivered transcript."""
        if not urls:
            raise ValueError("urls must be non-empty")
        if len(urls) > 25:
            raise ValueError("At most 25 urls per call; split the list.")
        return self._request("/transcripts", body={"urls": list(urls), "lang": _csv(lang), "captionType": caption_type, "format": _csv(format), "segments": segments})
