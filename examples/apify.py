"""pip install apify-client ; APIFY_TOKEN in the environment. Up to 250 videos per run, $0.70 per 1,000."""
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])
run = client.actor("myworkingmemory/wicked-youtube-transcript-scraper-api").call(run_input={
    "videoUrls": ["https://www.youtube.com/watch?v=jNQXAC9IVRw", "https://youtu.be/IELMSD2kdmk"],
    "languages": ["en", "es"],
    "outputFormats": ["srt"],
})
for item in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(item["videoId"], item["title"], len(item["text"]), "chars")
