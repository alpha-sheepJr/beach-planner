export async function loadSvgMap(svgPath, container) {
    const res = await fetch(svgPath);
    const svgMarkup = await res.text();
    if (!container)
        return null;
    container.innerHTML = svgMarkup;
    const svg = container.querySelector("svg");
    return svg;
}
export function getBeachElement(id) {
    const el = document.getElementById(id);
    return el instanceof SVGElement ? el : null;
}
export function attachClickHandler(id, handler) {
    const el = getBeachElement(id);
    el?.addEventListener("click", handler);
}
export function getAllBeachMarkerIDs(svg) {
    const markers = svg.querySelectorAll('use[id]');
    return Array.from(markers).map(el => el.id).sort();
}
