// handleRouteChange.ts
import { Beaches } from './beachesEnum.js';
import { ForecastDBReader } from '../data/getForecast.js';
/**
 * Handles route changes when a user navigates to a /beach/:id path.
 */
export async function handleRouteChange() {
    console.log("handleRouteChange triggered:", window.location.pathname);
    const mainPage = document.getElementById('main-page');
    const beachPage = document.getElementById('beach-page');
    if (!mainPage || !beachPage) {
        console.error("Missing #main-page or #beach-page element in DOM");
        return;
    }
    const match = window.location.pathname.match(/^\/beach\/([^/]+)\/?$/);
    if (!match) {
        console.log("No beach route matched, showing main page");
        mainPage.style.display = "block";
        beachPage.style.display = "none";
        return;
    }
    // Show beach page, hide main page
    mainPage.style.display = "none";
    beachPage.style.display = "block";
    try {
        const beachIDString = match[1];
        console.log("Matched beach ID string:", beachIDString);
        const beachID = resolveToBeachIdNumber(beachIDString);
        console.log("Resolved beachID:", beachID);
        if (beachID === undefined) {
            console.error(`Invalid beach ID: ${beachIDString}`);
            beachPage.innerHTML = `<p>Error: Invalid beach ID.</p>`;
            return;
        }
        const reader = new ForecastDBReader();
        console.log("Opening ForecastDBReader...");
        await reader.open();
        console.log("ForecastDBReader opened");
        const dailyWeather = await reader.getDailyWeather(beachID);
        console.log("Daily weather fetched:", dailyWeather);
        const beachName = await reader.getName(beachID);
        const latitude = await reader.getLatitude(beachID);
        const longitude = await reader.getLongitude(beachID);
        console.log(`Rendering page for ${beachName} at [${latitude}, ${longitude}]`);
        beachPage.innerHTML = `
      <h2>${beachName}</h2>
      <p>Latitude: ${latitude}, Longitude: ${longitude}</p>
      <pre>${JSON.stringify(dailyWeather, null, 2)}</pre>
    `;
    }
    catch (err) {
        console.error("Routing error:", err);
        beachPage.innerHTML = `<p>Error loading beach data: ${String(err)}</p>`;
    }
}
/**
 * Resolves a URL string (e.g. "asbury_park") into a Beaches enum numeric ID.
 */
function resolveToBeachIdNumber(beachIdString) {
    const aliasMap = {
        wildwood: "west_wildwood",
        wildwood_crest: "west_wildwood",
    };
    const key = aliasMap[beachIdString] ?? beachIdString;
    const resolved = Beaches[key];
    console.log(`resolveToBeachIdNumber: ${beachIdString} -> ${resolved}`);
    return resolved;
}
