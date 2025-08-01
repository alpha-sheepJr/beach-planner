export async function loadSvgMap(
  svgPath: string,
  container: HTMLDivElement | null
): Promise<SVGSVGElement | null> {
  const res = await fetch(svgPath);
  const svgMarkup = await res.text();

  if (!container) return null;
  container.innerHTML = svgMarkup;

  const svg = container.querySelector("svg");
  return svg as SVGSVGElement | null;
}

export function getBeachElement(id: string): SVGElement | null {
  const el = document.getElementById(id);
  return el instanceof SVGElement ? el : null;
}

export function attachClickHandler(id: string, handler: () => void): void {
  const el = getBeachElement(id);
  el?.addEventListener("click", handler);
}

export function getAllBeachMarkerIDs(svg: SVGSVGElement): string[] {
  const markers = svg.querySelectorAll('use[id]');
  return Array.from(markers).map(el => el.id).sort();
}