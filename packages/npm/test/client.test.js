import { test } from "node:test"; import assert from "node:assert/strict";
import { YouTubeTranscript, YouTubeTranscriptError } from "../src/index.js";
const calls = [];
const fakeFetch = async (url, init) => { calls.push({ url, init }); const ok = !url.includes("bad");
  return { ok, status: ok ? 200 : 404, statusText: ok ? "OK" : "Not Found", text: async () => JSON.stringify(ok ? { videoId: "jNQXAC9IVRw", text: "hi", language: "en" } : { error: "NO_CAPTIONS", message: "none" }) }; };
test("transcript builds the right URL and headers", async () => {
  const c = new YouTubeTranscript("k", { fetch: fakeFetch });
  const r = await c.transcript("https://youtu.be/jNQXAC9IVRw", { lang: ["es", "en"], format: ["srt"] });
  assert.equal(r.videoId, "jNQXAC9IVRw");
  const { url, init } = calls.at(-1);
  assert.ok(url.startsWith("https://wicked-youtube-transcript-scraper.p.rapidapi.com/transcript?"));
  assert.ok(url.includes("lang=es%2Cen") && url.includes("format=srt"));
  assert.equal(init.headers["X-RapidAPI-Key"], "k"); assert.equal(init.headers["X-RapidAPI-Host"], "wicked-youtube-transcript-scraper.p.rapidapi.com");
});
test("errors carry status and code and batch limits are enforced", async () => {
  const c = new YouTubeTranscript("k", { fetch: fakeFetch });
  await assert.rejects(() => c.transcript("bad"), (e) => e instanceof YouTubeTranscriptError && e.status === 404 && e.code === "NO_CAPTIONS");
  assert.throws(() => c.transcripts(Array(26).fill("x")), /25/);
  await c.transcripts(["a", "b"], { lang: "en" });
  assert.equal(calls.at(-1).init.method, "POST"); assert.deepEqual(JSON.parse(calls.at(-1).init.body).urls, ["a", "b"]);
});
