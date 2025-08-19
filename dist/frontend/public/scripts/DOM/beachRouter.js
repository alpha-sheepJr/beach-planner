import * as data from '../data/getForecast.js';
import { beachKeyMap } from './beachesMap.js';
import { Beaches } from './beachesEnum.js';
export class BeachRouter {
    constructor() {
        this.beachChoiceButton = null;
        this.beachInput = null;
        this.beachesMap = beachKeyMap;
    }
    init() {
        this.beachChoiceButton = document.getElementById('beach-choice-button');
        this.beachInput = document.getElementById('beach-input');
        this.beachChoiceButton?.addEventListener('click', () => this.handleBeachSelection());
    }
    handleBeachSelection() {
        if (!this.beachInput)
            return;
        const selectedLabel = this.beachInput.value.trim();
        const beachId = this.beachesMap[selectedLabel];
        if (beachId) {
            window.location.href = `/beach/${beachId}`;
        }
        else {
            alert("Please select a valid beach from the list.");
        }
    }
}
// Instantiate to activate
new BeachRouter();
/* assure that the button routes correctly, as with the svg map */
async function handleRouteChange() {
    const match = window.location.pathname.match(/^\/beach\/(.+)$/);
    if (!match)
        return;
    const beachID = resolveToBeachIdNumber(match[1]);
    const db = await data.openForecastDB();
    const forecastData = await data.getForecastData(db, beachID, "daily", "weather");
    let div = document.createElement('div');
    div.textContent = JSON.stringify(forecastData);
    document.appendChild(div);
}
function resolveToBeachIdNumber(beachIdString) {
    let key = beachKeyMap[beachIdString];
    if (key === "wildwood" || key === "wildwood_crest") {
        key = "west_wildwood";
    }
    if (!key || Beaches[key] === undefined) {
        throw new Error(`Invalid beach ID string: ${beachIdString}`);
    }
    return Beaches[key];
}
