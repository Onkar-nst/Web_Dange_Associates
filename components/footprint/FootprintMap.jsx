"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Interactive map for the "Geographical network" section.
// Leaflet is driven directly (no React wrapper) so markers can be rebuilt on a
// filter change without tearing the map down. Tiles are Esri's keyless World Dark
// Gray Canvas (base + separate labels); the CSS in globals.css tints them to the
// brand navy so the status pins are the only strong colour on the map.

const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
const BASE = `${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`;
const LABELS = `${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`;
const ATTRIB = '&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, OpenStreetMap';

export default function FootprintMap({ pins, allPins, focus, onSelect, statusLabel }) {
  const host = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const select = useRef(onSelect);
  select.current = onSelect;

  // Whole footprint: every project, regardless of the status filter.
  const boundsOf = (list) => L.latLngBounds(list.map((p) => p.coords));

  // Create once.
  useEffect(() => {
    if (!host.current || map.current) return;
    const m = L.map(host.current, {
      zoomControl: false,
      scrollWheelZoom: false,
      // On a phone a one-finger drag would trap page scroll; pan with the zoom buttons there.
      dragging: !L.Browser.mobile,
      attributionControl: true,
      minZoom: 8,
      maxZoom: 16,
    });
    L.tileLayer(BASE, { attribution: ATTRIB, maxZoom: 16 }).addTo(m);
    L.tileLayer(LABELS, { maxZoom: 16, pane: "shadowPane" }).addTo(m);
    L.control.zoom({ position: "topleft" }).addTo(m);
    const all = boundsOf(allPins);
    m.fitBounds(all, { padding: [40, 40] });
    layer.current = L.layerGroup().addTo(m);
    map.current = m;

    // The section animates in, so the container may have no size on mount.
    let fitted = false;
    const ro = new ResizeObserver(() => {
      m.invalidateSize();
      if (!fitted && host.current?.clientWidth) {
        fitted = true;
        m.fitBounds(all, { padding: [40, 40] });
      }
    });
    ro.observe(host.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild markers whenever the filtered set (or language) changes.
  useEffect(() => {
    const g = layer.current;
    if (!g) return;
    g.clearLayers();
    for (const p of pins) {
      const icon = L.divIcon({
        className: "fp-pin-wrap",
        html: `<span class="fp-pin fp-pin--${p.status}"></span>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      L.marker(p.coords, { icon, title: p.name, riseOnHover: true })
        .bindTooltip(`<strong>${p.name}</strong><span>${p.location} · ${statusLabel(p.status)}</span>`, {
          className: "fp-tip",
          direction: "top",
          offset: [0, -10],
        })
        .on("click", () => select.current(p))
        .addTo(g);
    }
  }, [pins, statusLabel]);

  // Fly to the open region, or back out to the whole footprint.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const inRegion = focus ? allPins.filter((p) => p.region === focus) : [];
    if (inRegion.length) {
      m.flyToBounds(boundsOf(inRegion), { padding: [70, 70], maxZoom: 15, duration: 0.9 });
    } else {
      m.flyToBounds(boundsOf(allPins), { padding: [40, 40], duration: 0.9 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  return <div className="fp__map" ref={host} role="application" aria-label="Map of Dange Associates projects" />;
}
