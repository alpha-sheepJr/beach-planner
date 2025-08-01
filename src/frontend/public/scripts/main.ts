import { SVGMap } from "./svg/initMap.js";

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

// initializes the svg map of NJ, makes beach markers clickable
// clicking navigates to page for appropriate beach
const mapContainer = document.getElementById('svg-container');
if (!(mapContainer instanceof HTMLDivElement)) {
  throw new Error('Expected a <div> with ID "map-container"');
}

const beachMap = new SVGMap("../images/jersey_beaches_map.svg", mapContainer);
beachMap.init();

document.addEventListener('DOMContentLoaded', () => {
  const beachChoiceButton = document.getElementById('beach-choice-button');
  const beachInput = document.getElementById('beach-input') as HTMLInputElement | null;

  const beachMap: Record<string, string> = {
    "Allenhurst": "allenhurst",
    "Asbury Park": "asbury_park",
    "Atlantic City": "atlantic_city",
    "Avalon": "avalon",
    "Avon-by-the-Sea": "avon-by-the-sea",
    "Barnegat Light": "barnegat_light",
    "Bay Head": "bay_head",
    "Beach Haven": "beach_haven",
    "Belmar": "belmar",
    "Bradley Beach": "bradley_beach",
    "Brick": "brick",
    "Brigantine": "brigantine",
    "Cape May": "cape_may",
    "Cape May Point": "cape_may_point",
    "Corson's Inlet State Park (Strathmere)": "corsons_inlet_state_park",
    "Deal": "deal",
    "Gunnison Beach": "gunnison_beach",
    "Harvey Cedars": "harvey_cedars",
    "Island Beach State Park (Berkeley Twp.)": "island_beach_state_park",
    "Keansburg": "keansburg",
    "Lavallette": "lavallette",
    "Loch Arbour": "loch_arbor",
    "Long Beach": "long_beach",
    "Long Branch": "long_branch",
    "Longport": "longport",
    "Manasquan": "manasquan",
    "Mantoloking": "mantoloking",
    "Margate City": "margate_city",
    "Monmouth Beach": "monmouth_beach",
    "North Wildwood": "north_wildwood",
    "Ocean City": "ocean_city",
    "Ocean Grove (Neptune)": "ocean_grove",
    "Ortley Beach (Toms River)": "ortley_beach",
    "Point Pleasant Beach": "point_pleasant_beach",
    "Sandy Hook (Highlands)": "sandy_hook",
    "Sea Bright": "sea_bright",
    "Sea Girt": "sea_girt",
    "Sea Isle City": "sea_isle_city",
    "Seaside Heights": "seaside_heights",
    "Seaside Park": "seaside_park",
    "Seven Presidents Oceanfront Park (Long Branch)": "seven_presidents",
    "Ship Bottom": "ship_bottom",
    "Spring Lake": "spring_lake",
    "Stone Harbor": "stone_harbor",
    "Strathmere (Upper Twp.)": "strathemere",
    "Surf City": "surf_city",
    "Union Beach": "union_beach",
    "Ventnor City": "ventor_city",
    "West Wildwood": "west_wildwood",
    "Wildwood": "wildwood",
    "Wildwood Crest": "wildwood_crest"
  };

  beachChoiceButton?.addEventListener('click', () => {
    if (!beachInput) return;

    const selectedLabel = beachInput.value.trim();
    const beachId = beachMap[selectedLabel];

    if (beachId) {
      window.location.href = `/beach/${beachId}`;
    } else {
      alert("Please select a valid beach from the list.");
    }
  });
});