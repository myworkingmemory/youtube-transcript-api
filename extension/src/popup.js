import { videoIdFrom, getSettings, fetchTranscript, toSrt, LISTING } from "./common.js";
const $ = (id) => document.getElementById(id);
let current = null;
const settings = await getSettings();
$("lang").value = settings.lang || "en";
$("opts").onclick = (e) => { e.preventDefault(); chrome.runtime.openOptionsPage(); };
if (!settings.apiKey) { $("nokey").hidden = false; }
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
const videoId = videoIdFrom(tab?.url);
if (!videoId) $("status").textContent = "Open a YouTube video, then click Get transcript.";
function render() {
  const withStamps = $("stamps").checked && Array.isArray(current.data);
  $("out").textContent = withStamps ? current.data.map((s) => `[${fmt(s.start)}] ${s.text}`).join("\n") : current.text;
}
const fmt = (t) => { const m = Math.floor(t / 60), s = Math.floor(t % 60); return `${m}:${String(s).padStart(2, "0")}`; };
$("stamps").onchange = () => current && render();
$("go").onclick = async () => {
  if (!settings.apiKey) { $("nokey").hidden = false; chrome.runtime.openOptionsPage(); return; }
  if (!videoId) { $("status").textContent = "This tab is not a YouTube video."; return; }
  $("status").textContent = "Fetching…"; $("go").disabled = true;
  try {
    current = await fetchTranscript(settings.apiKey, videoId, $("lang").value);
    chrome.storage.sync.set({ lang: $("lang").value });
    $("status").textContent = `${current.title || videoId} · ${current.language} · ${current.captionType} captions`;
    $("out").hidden = false; $("actions").hidden = false; render();
  } catch (e) {
    const langs = e.details?.availableLanguages?.map((l) => l.code).join(", ");
    $("status").textContent = e.code === "NO_CAPTIONS" ? "This video has no captions (not charged)." : e.code === "NO_CAPTIONS_IN_LANGUAGE" ? `No ${$("lang").value} captions. Available: ${langs || "none"} (not charged).` : e.status === 403 || e.status === 401 ? "Key rejected. Check it in settings, or subscribe to the free plan." : e.status === 429 ? `Plan limit reached. Upgrade at ${LISTING}` : `Error: ${e.message}`;
  } finally { $("go").disabled = false; }
};
$("copy").onclick = () => navigator.clipboard.writeText($("out").textContent);
const download = (name, text) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" })); a.download = name; a.click(); };
$("txt").onclick = () => download(`${videoId}.txt`, $("out").textContent);
$("srt").onclick = () => download(`${videoId}.srt`, current.srt || toSrt(current.data));
