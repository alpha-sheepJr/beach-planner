import { SVGMap } from "./svg/initMap.js";
const worker = new Worker("./scripts/workers/forecastWorker.js", { type: "module" });
worker.onmessage = (event) => {
    if (event.data.type === "complete") {
        console.log('Database initialized.');
    }
    else if (event.data.type === "error") {
        console.log('Initialization failed: ', event.data.message);
    }
};
worker.postMessage({ type: 'initialize' });
const mapContainer = document.getElementById('svg-container');
if (!(mapContainer instanceof HTMLDivElement)) {
    throw new Error('Expected a <div> with ID "map-container"');
}
const beachMap = new SVGMap("../images/jersey_beaches_map.svg", mapContainer);
beachMap.init();
