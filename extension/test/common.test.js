import { test } from "node:test"; import assert from "node:assert/strict";
globalThis.chrome = { storage: { sync: { get: (d, cb) => cb(d) } } };
const { videoIdFrom, toSrt } = await import("../src/common.js");
test("video id parsing", () => {
  for (const u of ["https://www.youtube.com/watch?v=jNQXAC9IVRw&t=3s", "https://youtu.be/jNQXAC9IVRw", "https://m.youtube.com/shorts/jNQXAC9IVRw", "https://www.youtube.com/embed/jNQXAC9IVRw", "https://www.youtube.com/live/jNQXAC9IVRw", "jNQXAC9IVRw"]) assert.equal(videoIdFrom(u), "jNQXAC9IVRw", u);
  for (const u of ["https://example.com/watch?v=jNQXAC9IVRw", "https://www.youtube.com/", "", "abc"]) assert.equal(videoIdFrom(u), null, u);
});
test("srt builder", () => {
  const s = toSrt([{ start: 0, dur: 1.5, text: "Hi" }, { start: 61.25, dur: 2, text: "There" }]);
  assert.ok(s.startsWith("1\n00:00:00,000 --> 00:00:01,500\nHi\n")); assert.ok(s.includes("00:01:01,250 --> 00:01:03,250\nThere"));
});
