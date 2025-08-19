import { SVGMap } from "./svg/initMap.js";
import { BeachRouter } from './form/beachRouter.js';
import { handleRouteChange } from '../scripts/utils/routeHandler.js'

// initializes indexedDB with data fetched from the server
const worker = new Worker("./scripts/workers/forecastWorker.js", { type: "module" });

worker.onmessage = (event) => {
    if (event.data.type === "complete") {
        console.log('Database initialized.');
    } else if (event.data.type === "error") {
        console.log('Initialization failed: ', event.data.message);
    }
};

worker.postMessage({ type: 'initialize' });

const mapContainer = document.getElementById('svg-container');
if (!(mapContainer instanceof HTMLDivElement)) {
  throw new Error('Expected a <div> with ID "map-container"');
}

const beachRouter = new BeachRouter();
const beachMap = new SVGMap("../images/jersey_beaches_map.svg", mapContainer);

function initializeApp() {
    document.addEventListener('DOMContentLoaded', async () => {
        beachRouter.init();
        beachMap.init();

        window.addEventListener('popstate', handleRouteChange);
    });
}

initializeApp();