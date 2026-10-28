import { getSettings } from "./common.js";
const s = await getSettings();
document.getElementById("apiKey").value = s.apiKey; document.getElementById("lang").value = s.lang || "en";
document.getElementById("save").onclick = () => chrome.storage.sync.set({ apiKey: document.getElementById("apiKey").value.trim(), lang: document.getElementById("lang").value }, () => { document.getElementById("msg").textContent = "Saved."; });
