import { updateEmitter } from './updateEvent.js';
function getMillisUntilNext3AM() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(3, 0, 0, 0);
    if (now >= next) {
        next.setDate(next.getDate() + 1);
    }
    return next.getTime() - now.getTime();
}
export async function scheduleDailyUpdate() {
    try {
        const timeout = getMillisUntilNext3AM();
        console.log(`Next update in ${(timeout / 1000 / 60).toFixed(2)} minutes.`);
        setTimeout(async () => {
            try {
                console.log("⏰ Running forecast update...");
                updateEmitter.emit('updateForecasts');
                await scheduleDailyUpdate();
            }
            catch (err) {
                updateEmitter.emit('error', err);
            }
        }, timeout);
    }
    catch (err) {
        updateEmitter.emit('error', err);
    }
}
