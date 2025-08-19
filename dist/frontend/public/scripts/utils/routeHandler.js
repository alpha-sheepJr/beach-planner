// handleRouteChange.ts
import { Beaches } from './beachesEnum.js';
import { ForecastDBReader } from '../data/getForecast.js';
/**
 * Handles route changes when a user navigates to a /beach/:id path.
 */
export async function handleRouteChange() {
    const match = window.location.pathname.match(/^\/beach\/(.+)$/);
    if (!match)
        return; // no matching route, do nothing
    try {
        const beachIDString = match[1];
        const beachID = resolveToBeachIdNumber(beachIDString);
        if (beachID === undefined) {
            console.error(`Invalid beach ID: ${beachIDString}`);
            return;
        }
        const reader = new ForecastDBReader();
        await reader.open();
        // Example: get daily weather
        const dailyWeather = await reader.getDailyWeather(beachID);
        const beachName = await reader.getName(beachID);
        const latitude = await reader.getLatitude(beachID);
        const longitude = await reader.getLongitude(beachID);
        const container = document.getElementById('main-container');
        if (!container) {
            console.error('Main container element not found');
            return;
        }
        container.innerHTML = `
      <h2>${beachName}</h2>
      <p>Latitude: ${latitude}, Longitude: ${longitude}</p>
      <pre>${JSON.stringify(dailyWeather, null, 2)}</pre>
    `;
    }
    catch (err) {
        console.error("Routing error:", err);
    }
}
/**
 * Resolves a URL string (e.g. "asbury_park") into a Beaches enum numeric ID.
 */
function resolveToBeachIdNumber(beachIdString) {
    let key = beachIdString;
    // Handle wildwood aliases
    if (key === "wildwood" || key === "wildwood_crest") {
        key = "west_wildwood";
    }
    return Beaches[key];
}
