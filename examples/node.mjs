// node examples/node.mjs <youtube url or id>   (needs RAPIDAPI_KEY in the environment)
const host = "wicked-youtube-transcript-scraper.p.rapidapi.com";
const url = process.argv[2] ?? "jNQXAC9IVRw";
const r = await fetch(`https://${host}/transcript?url=${encodeURIComponent(url)}&lang=en`, {
  headers: { "X-RapidAPI-Key": process.env.RAPIDAPI_KEY, "X-RapidAPI-Host": host },
});
const item = await r.json();
if (!r.ok) throw new Error(`${r.status} ${item.error}: ${item.message}`);
console.log(item.title, "by", item.channel);
console.log(item.text.slice(0, 500));
