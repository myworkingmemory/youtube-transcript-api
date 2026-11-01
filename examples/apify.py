"""Apify example: start once, retain the run ID, and read saved results.

Requires apify-client 3.4+ (run_timeout takes datetime.timedelta).
Set APIFY_TOKEN locally. Set APIFY_RUN_ID to resume an existing run without
starting another; leave it unset only when authorizing a new paid run.

Current transcript fees per 1,000: Free/Starter $3, Scale $2.70, Business $2.40.
Each started run also charges $0.00005 per allocated GB (minimum 1 GB).
The explicit $0.01 event ceiling below is not an all-services/account budget
or a failed-run refund. At 4096 MB, the start event is $0.0002.
"""
import json
import os
from datetime import timedelta
from decimal import Decimal

from apify_client import ApifyClient

# No automatic HTTP retries: an uncertain paid-start response needs inspection.
client = ApifyClient(os.environ["APIFY_TOKEN"], max_retries=0)
run_id = os.environ.get("APIFY_RUN_ID")
if not run_id:
    try:
        run = client.actor("myworkingmemory/wicked-youtube-transcript-scraper-api").start(
            run_input={
                "videoUrls": ["https://www.youtube.com/watch?v=jNQXAC9IVRw", "https://youtu.be/IELMSD2kdmk"],
                "languages": ["en", "es"],
                "outputFormats": ["srt"],
            },
            max_total_charge_usd=Decimal("0.01"),
            run_timeout=timedelta(seconds=300),
            memory_mbytes=4096,
            restart_on_error=False,
        )
    except Exception as exc:
        raise SystemExit(
            f"Start response unavailable ({type(exc).__name__}). Check Apify Console "
            "for an accepted run; set APIFY_RUN_ID to reuse it. Do not repeat the paid start automatically."
        ) from None
    run_id = run.get("id") if isinstance(run, dict) else None
    if not run_id:
        raise SystemExit("No run ID returned. Inspect Apify Console before authorizing any new start.")

print(f"Saved run ID: {run_id}; reuse with APIFY_RUN_ID={run_id}", flush=True)
try:
    run = client.run(run_id).wait_for_finish(wait_duration=timedelta(seconds=330))
    if not run:
        raise SystemExit("Run not found. Check the saved ID and token; do not start another run automatically.")
    status = run.get("status", "UNKNOWN")
    print("Run status:", status)
    if status not in {"SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"}:
        raise SystemExit("Run is not terminal. Resume this saved ID later; do not start another run.")

    # Job status alone does not prove delivery. Read diagnostics and every page,
    # including any partial results from a failed/timed-out/aborted run.
    store_id = run.get("defaultKeyValueStoreId")
    if store_id:
        record = client.key_value_store(store_id).get_record("OUTPUT")
        print("OUTPUT diagnostics:", json.dumps(record.get("value") if record else None, ensure_ascii=False))
    else:
        print("No defaultKeyValueStoreId returned; inspect this saved run in Apify Console.")

    dataset_id = run.get("defaultDatasetId")
    if not dataset_id:
        raise SystemExit("No defaultDatasetId returned. Inspect this saved run; do not start another automatically.")
    print("Saved dataset ID:", dataset_id)
    rows = 0
    for item in client.dataset(dataset_id).iterate_items(clean=False):
        text = item.get("text")
        print(item.get("videoId", "(missing videoId)"), item.get("title") or "(no title)",
              len(text) if isinstance(text, str) else 0, "text chars")
        # Deliver the usable caption/segment/subtitle data as well as diagnostics.
        print(json.dumps(item, ensure_ascii=False))
        rows += 1
    print("Dataset rows read:", rows, "— reconcile with OUTPUT; a cap or failures can leave a partial batch.")
except Exception as exc:
    raise SystemExit(
        f"Saved-run read interrupted ({type(exc).__name__}). Resume APIFY_RUN_ID={run_id}; "
        "this does not authorize another paid start."
    ) from None
if status != "SUCCEEDED":
    raise SystemExit(f"Run ended {status}; inspect the diagnostics and partial rows above.")
