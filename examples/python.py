"""python examples/python.py <youtube url or id>   (needs RAPIDAPI_KEY in the environment)"""
import os, sys, requests

HOST = "wicked-youtube-transcript-scraper.p.rapidapi.com"
url = sys.argv[1] if len(sys.argv) > 1 else "jNQXAC9IVRw"
r = requests.get(f"https://{HOST}/transcript", params={"url": url, "lang": "en"},
                 headers={"X-RapidAPI-Key": os.environ["RAPIDAPI_KEY"], "X-RapidAPI-Host": HOST}, timeout=60)
item = r.json()
if not r.ok:
    raise SystemExit(f"{r.status_code} {item.get('error')}: {item.get('message')}")
print(item["title"], "by", item["channel"])
for seg in item["data"][:10]:
    print(f"{seg['start']:8.2f}  {seg['text']}")
