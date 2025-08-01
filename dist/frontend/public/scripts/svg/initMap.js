import * as SVGMapUtil from './init_logic.js';
export class SVGMap {
    constructor(mapPath, mapContainer) {
        this.mapPath = mapPath;
        this.mapContainer = mapContainer;
    }
    async init() {
        const svg = await SVGMapUtil.loadSvgMap(this.mapPath, this.mapContainer);
        if (!svg)
            return;
        const beachIds = SVGMapUtil.getAllBeachMarkerIDs(svg);
        console.log("Found beach markers: ", beachIds);
        beachIds.forEach((id) => {
            ``;
            SVGMapUtil.attachClickHandler(id, () => window.location.href = `/beach/${id}`);
        });
    }
}
