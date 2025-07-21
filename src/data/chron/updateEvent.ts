import { EventEmitter } from "events";
import { fetchAndCacheForecasts } from "../weatherReports.js";

class UpdateEmitter extends EventEmitter {}

const updateEmitter = new UpdateEmitter();

updateEmitter.on("updateForecasts", async () => {
  console.log("🔁 Updating daily and hourly forecasts...");

  try {
    await Promise.all([
      (async () => {
        try {
          await fetchAndCacheForecasts("daily");
          console.log("✅ Daily forecast updated.");
        } catch (err) {
          console.error("❌ Daily forecast update failed:", err);
        }
      })(),
      (async () => {
        try {
          await fetchAndCacheForecasts("hourly");
          console.log("✅ Hourly forecast updated.");
        } catch (err) {
          console.error("❌ Hourly forecast update failed:", err);
        }
      })()
    ]);

    console.log("🎉 All forecast updates complete.");
  } catch (err) {
    // Shouldn't reach here since individual promises are caught,
    // but added as a fallback.
    updateEmitter.emit("error", err);
  }
});

updateEmitter.on("error", (err) => {
  console.error("⚠️ Uncaught updateEmitter error:", err);
});

export { updateEmitter };