import io, json, sys, os, unittest, urllib.error
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from wicked_youtube_transcript import YouTubeTranscript, YouTubeTranscriptError

calls = []
class FakeResp(io.BytesIO):
    def __enter__(self): return self
    def __exit__(self, *a): return False
def opener(req, timeout=0):
    calls.append(req)
    if "bad" in req.full_url:
        raise urllib.error.HTTPError(req.full_url, 404, "nf", {}, io.BytesIO(json.dumps({"error": "NO_CAPTIONS", "message": "none"}).encode()))
    return FakeResp(json.dumps({"videoId": "jNQXAC9IVRw", "text": "hi"}).encode())

class T(unittest.TestCase):
    def test_url_and_headers(self):
        c = YouTubeTranscript("k", opener=opener)
        r = c.transcript("https://youtu.be/jNQXAC9IVRw", lang=["es", "en"], format="srt")
        self.assertEqual(r["videoId"], "jNQXAC9IVRw")
        req = calls[-1]
        self.assertTrue(req.full_url.startswith("https://wicked-youtube-transcript-scraper.p.rapidapi.com/transcript?"))
        self.assertIn("lang=es%2Cen", req.full_url); self.assertIn("format=srt", req.full_url)
        self.assertEqual(req.get_header("X-rapidapi-key"), "k")
    def test_errors_and_limits(self):
        c = YouTubeTranscript("k", opener=opener)
        with self.assertRaises(YouTubeTranscriptError) as cm: c.transcript("bad")
        self.assertEqual((cm.exception.status, cm.exception.code), (404, "NO_CAPTIONS"))
        with self.assertRaises(ValueError): c.transcripts(["x"] * 26)
        c.transcripts(["a", "b"], lang="en")
        self.assertEqual(calls[-1].get_method(), "POST"); self.assertEqual(json.loads(calls[-1].data)["urls"], ["a", "b"])
if __name__ == "__main__": unittest.main()
