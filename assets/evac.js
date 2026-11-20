/* Mandatory evacuation order map. Standalone page; loaded on demand from app.js. */
(function () {
  "use strict";

  const BASE = "evac/";
  const MAPTILER_KEY = "65de6b6f5746";
  const LEVEL_COLORS = { 1: "#f2c66d", 2: "#ee8a5b", 3: "#c86fa8", 4: "#8a8fe0" };
  // plasma-like ramp for confidence (0 = low, 1 = high)
  const CONF_STOPS = [[0, "#3b0f8c"], [0.25, "#8b1fa6"], [0.5, "#cc4778"], [0.75, "#f89540"], [1, "#f0f921"]];
  const confExpr = ["interpolate", ["linear"], ["coalesce", ["get", "conf"], 0], ...CONF_STOPS.flat()];
  const levelExpr = ["match", ["get", "level"], 1, "#f2c66d", 2, "#ee8a5b", 3, "#c86fa8", 4, "#8a8fe0", "#888"];
  function confColor(c) {
    c = Math.max(0, Math.min(1, Number(c) || 0));
    for (let i = 1; i < CONF_STOPS.length; i++) {
      const [x1, h1] = CONF_STOPS[i - 1], [x2, h2] = CONF_STOPS[i];
      if (c <= x2) {
        const t = (c - x1) / (x2 - x1), a = parseInt(h1.slice(1), 16), b = parseInt(h2.slice(1), 16);
        const mix = (sh) => Math.round(((a >> sh) & 255) * (1 - t) + ((b >> sh) & 255) * t);
        return `rgb(${mix(16)},${mix(8)},${mix(0)})`;
      }
    }
    return CONF_STOPS[CONF_STOPS.length - 1][1];
  }
  const LEVEL_NAMES = { 1: "whole county / official zone", 2: "constructed (place, island, road, levee)", 3: "proxy for vague wording", 4: "population only (county)" };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const st = { data: null, map: null, hk: null, oid: null, base: "dark", colorBy: "conf", props: {},
    areaOp: 1, cbgOp: 1, areaLine: true, cbgLine: true, showArea: true, showCbg: true, noSliver: true, inCounty: true, ready: false, popup: null };

  // ---------- loading ----------
  function loadScript(src) {
    return new Promise((ok, fail) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = fail; document.head.appendChild(s); });
  }
  function loadCss(href) { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l); }
  let libs = null;
  function ensureLibs() {
    if (!libs) {
      loadCss(BASE + "vendor/maplibre-gl.css");
      libs = Promise.all([loadScript(BASE + "vendor/maplibre-gl.js"), loadScript(BASE + "vendor/pmtiles.js"), fetch(BASE + "data/orders.json").then((r) => r.json())])
        .then(([, , data]) => { st.data = data; });
    }
    return libs;
  }

  // ---------- helpers ----------
  const hurricanes = () => st.data.hurricanes;
  const byKey = (k) => hurricanes().find((h) => h.key === k);
  const years = () => [...new Set(hurricanes().map((h) => h.year))].sort();
  const center = (b) => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
  const gmaps = (lng, lat) => `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lng.toFixed(6)}`;
  const gsv = (lng, lat) => `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${lat.toFixed(6)},${lng.toFixed(6)}`;
  const googleLinks = (lng, lat) => `<div class="glinks mono"><a href="${gmaps(lng, lat)}" target="_blank" rel="noopener">Google Maps ↗</a><a href="${gsv(lng, lat)}" target="_blank" rel="noopener">Street View ↗</a></div>`;
  const conf = (c) => (c == null || c === "" ? "—" : Number(c).toFixed(2));
  const colorOf = (o) => (st.colorBy === "conf" ? confColor(o.confidence) : LEVEL_COLORS[o.level] || "#666");
  const badge = (o) => st.colorBy === "conf"
    ? `<span class="lv" style="background:${colorOf(o)}">${conf(o.confidence)}</span>`
    : `<span class="lv" style="background:${colorOf(o)}">L${o.level ?? "?"}</span>`;
  async function loadProps(hk) {
    if (!st.props[hk]) st.props[hk] = fetch(BASE + `data/props/${hk}.json`).then((r) => r.json()).catch(() => ({ areas: {}, cbg: {} }));
    return st.props[hk];
  }

  // ---------- view ----------
  function shell() {
    return `<div class="evac">
      <aside class="evac-panel">
        <div class="kicker mono">Mandatory evacuation orders</div>
        <h1>Evacuation order map</h1>
        <p class="evac-sub mono" id="ev-sub"></p>
        <div class="ev-sec"><div class="block-label mono">Year</div><div class="chips" id="ev-years"></div></div>
        <div class="ev-sec"><div class="block-label mono">Hurricane</div><div class="chips" id="ev-hurr"></div></div>
        <div class="ev-sec ev-layers">
          <div class="block-label mono">Layers</div>
          <label><input type="checkbox" id="ev-area" checked><span class="sw area"></span>Evacuation area</label>
          <div class="sub lyr">
            <span class="mono">opacity</span><input type="range" id="ev-area-op" min="0" max="100" value="100"><span class="mono val" id="ev-area-op-v">100%</span>
            <label><input type="checkbox" id="ev-area-line" checked>outline</label>
          </div>
          <label><input type="checkbox" id="ev-cbg" checked><span class="sw cbg"></span>Evacuation CBG</label>
          <div class="sub lyr">
            <span class="mono">opacity</span><input type="range" id="ev-cbg-op" min="0" max="100" value="100"><span class="mono val" id="ev-cbg-op-v">100%</span>
            <label><input type="checkbox" id="ev-cbg-line" checked>outline</label>
          </div>
          <div class="sub">
            <label><input type="checkbox" id="ev-sliver" checked>hide slivers (&lt; 1% of block group)</label>
            <label><input type="checkbox" id="ev-county" checked>order county only</label>
          </div>
        </div>
        <div class="ev-sec"><div class="block-label mono">Color areas by</div>
          <div class="seg mono" id="ev-colorby"><button data-c="conf" class="on">Confidence</button><button data-c="level">Level</button></div>
          <div class="ev-legend" id="ev-legend"></div>
        </div>
        <div class="ev-sec"><div class="block-label mono" id="ev-list-label">Orders</div><div id="ev-detail"></div><ol class="ev-list" id="ev-list"></ol></div>
      </aside>
      <div class="evac-map">
        <div id="ev-map"></div>
        <div class="basemap mono" id="ev-base"><button data-b="dark" class="on">Dark</button><button data-b="sat">Satellite</button></div>
        <div class="ev-loading mono" id="ev-loading">loading map…</div>
      </div>
    </div>`;
  }

  function renderYears() {
    const y = st.hk ? byKey(st.hk).year : years()[years().length - 1];
    $("#ev-years").innerHTML = years().map((v) => `<button class="${v === y ? "on" : ""}" data-y="${v}">${v}</button>`).join("");
    $("#ev-hurr").innerHTML = hurricanes().filter((h) => h.year === y)
      .map((h) => `<a class="${h.key === st.hk ? "on" : ""}" href="#/evac/${h.key}">${esc(h.name)} <span>${h.orders.length}</span></a>`).join("");
    $$("#ev-years button").forEach((b) => (b.onclick = () => {
      const first = hurricanes().find((h) => h.year === Number(b.dataset.y));
      location.hash = `#/evac/${first.key}`;
    }));
  }

  function renderLegend() {
    const cbg = `<div class="cap2">Area and CBG use the same colors. Each CBG row carries the confidence and level of its order; CBG shade = % of the block group inside the order.</div>`;
    $("#ev-legend").innerHTML = st.colorBy === "conf"
      ? `<div class="ramp"><i style="background:linear-gradient(90deg, ${CONF_STOPS.map(([x, c]) => `${c} ${x * 100}%`).join(", ")})"></i>
          <div class="ticks"><span>0</span><span>0.25</span><span>0.5</span><span>0.75</span><span>1</span></div>
          <div class="cap2">confidence that the polygon matches the ordered area (low → high)</div></div>${cbg}`
      : [1, 2, 3, 4].map((l) => `<div><i style="background:${LEVEL_COLORS[l]}"></i><span class="mono">L${l}</span>${LEVEL_NAMES[l]}</div>`).join("") + cbg;
    $$("#ev-colorby button").forEach((b) => b.classList.toggle("on", b.dataset.c === st.colorBy));
  }

  function setColorBy(c) {
    st.colorBy = c; renderLegend(); renderList();
    if (st.ready) {
      const e = c === "conf" ? confExpr : levelExpr;
      ["area-fill", "cbg-fill"].forEach((l) => st.map.setPaintProperty(l, "fill-color", e));
      ["area-line", "cbg-line"].forEach((l) => st.map.setPaintProperty(l, "line-color", e));
    }
  }

  function renderList() {
    const h = byKey(st.hk);
    $("#ev-list-label").textContent = `Orders · ${h.name} ${h.year} · ${h.orders.length}`;
    $("#ev-list").innerHTML = h.orders.map((o) => `<li class="${o.id === st.oid ? "on" : ""}" data-o="${esc(o.id)}">
        <div class="r1">${badge(o)}<b>${esc(o.county)}, ${esc(o.state)}</b></div>
        <div class="r2 mono">${esc(o.announce || "time not stated")} ${esc(o.tz)} · L${o.level} · conf ${conf(o.confidence)}</div>
        <div class="r3">${esc(o.area)}</div>
      </li>`).join("");
    $$("#ev-list li").forEach((li) => (li.onclick = () => selectOrder(li.dataset.o, true)));
  }

  function orderDetail(o) {
    const flags = [o.mobile ? "also mobile homes / RVs" : "", o.lowlying ? "also low-lying areas" : "", o.pop ? `restricted: ${o.pop}` : ""].filter(Boolean);
    const c = center(o.bbox);
    return `<div class="ev-card">
      <div class="ev-card-top mono"><span>${esc(o.id)}</span><button class="x" id="ev-close">×</button></div>
      <p class="ev-text">${esc(o.area)}</p>
      <dl class="kv">
        <dt>Type</dt><dd>${esc(o.type)}</dd>
        <dt>Announced</dt><dd>${esc(o.announce || "—")} ${esc(o.tz)}</dd>
        <dt>Effective</dt><dd>${esc(o.effective || "—")}</dd>
        ${o.zones ? `<dt>Zones</dt><dd>${esc(o.zones)}</dd>` : ""}
        <dt>Level</dt><dd>${esc(o.level_desc)}</dd>
        <dt>Confidence</dt><dd>${conf(o.confidence)}</dd>
        ${flags.length ? `<dt>Notes</dt><dd>${esc(flags.join("; "))}</dd>` : ""}
        ${o.note ? `<dt>Geometry</dt><dd>${esc(o.note)}</dd>` : ""}
        <dt>Area</dt><dd>${o.km2 != null ? Number(o.km2).toLocaleString() + " km²" : "—"}</dd>
        <dt>Block groups</dt><dd>${o.n1} with ≥ 1% · ${o.n50} with ≥ 50%</dd>
        <dt>Source</dt><dd>${esc(o.record)}${o.src ? ` · <a href="${esc(o.src)}" target="_blank" rel="noopener">original post ↗</a>` : ""}</dd>
      </dl>
      ${googleLinks(c[0], c[1])}
    </div>`;
  }

  // ---------- map ----------
  function style() {
    return {
      version: 8,
      sources: {
        dark: { type: "raster", tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"], tileSize: 256, maxzoom: 16, attribution: "Esri, HERE, Garmin, © OpenStreetMap contributors" },
        darklbl: { type: "raster", tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"], tileSize: 256, maxzoom: 16 },
        sat: { type: "raster", tiles: [`https://api.maptiler.com/tiles/satellite-v2/{z}/{x}/{y}.jpg?key=${MAPTILER_KEY}`], tileSize: 512, maxzoom: 20, attribution: "© MapTiler © OpenStreetMap contributors" },
        satfb: { type: "raster", tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"], tileSize: 256, maxzoom: 19, attribution: "Imagery © Esri" },
        areas: { type: "vector", url: `pmtiles://${new URL(BASE + "data/areas.pmtiles", location.href).href}` },
        cbg: { type: "vector", url: `pmtiles://${new URL(BASE + "data/cbg.pmtiles", location.href).href}` }
      },
      layers: [
        { id: "bg", type: "background", paint: { "background-color": "#0b0b0b" } },
        { id: "dark", type: "raster", source: "dark" },
        { id: "sat", type: "raster", source: "sat", layout: { visibility: "none" } },
        { id: "satfb", type: "raster", source: "satfb", layout: { visibility: "none" } },
        { id: "cbg-fill", type: "fill", source: "cbg", "source-layer": "cbg",
          paint: { "fill-color": confExpr, "fill-opacity": ["interpolate", ["linear"], ["coalesce", ["get", "pct"], 0], 0, 0.12, 50, 0.35, 100, 0.55] } },
        { id: "cbg-line", type: "line", source: "cbg", "source-layer": "cbg", minzoom: 7,
          paint: { "line-color": confExpr, "line-opacity": 0.7, "line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.3, 12, 0.9] } },
        { id: "area-fill", type: "fill", source: "areas", "source-layer": "areas",
          paint: { "fill-color": confExpr, "fill-opacity": 0.28 } },
        { id: "area-line", type: "line", source: "areas", "source-layer": "areas",
          paint: { "line-color": confExpr, "line-width": 1.2 } },
        { id: "area-hl", type: "line", source: "areas", "source-layer": "areas", filter: ["==", ["get", "oid"], ""],
          paint: { "line-color": "#ffffff", "line-width": 2.6 } },
        { id: "darklbl", type: "raster", source: "darklbl", paint: { "raster-opacity": 0.85 } }
      ]
    };
  }

  function applyFilters() {
    const m = st.map; if (!m || !st.ready) return;
    const hkf = ["==", ["get", "hk"], st.hk || ""];
    const cf = ["all", hkf];
    if (st.noSliver) cf.push([">=", ["get", "pct"], 1]);
    if (st.inCounty) cf.push(["==", ["get", "inc"], 1]);
    ["cbg-fill", "cbg-line"].forEach((l) => { m.setFilter(l, cf); m.setLayoutProperty(l, "visibility", st.showCbg ? "visible" : "none"); });
    ["area-fill", "area-line", "area-hl"].forEach((l) => m.setLayoutProperty(l, "visibility", st.showArea ? "visible" : "none"));
    m.setFilter("area-fill", hkf); m.setFilter("area-line", hkf);
    applyLook();
    m.setFilter("area-hl", ["==", ["get", "oid"], st.oid || ""]);
  }

  // per-layer opacity and outline visibility
  function applyLook() {
    const m = st.map; if (!m || !st.ready) return;
    m.setPaintProperty("area-fill", "fill-opacity", (st.showCbg ? 0.08 : 0.3) * st.areaOp);
    m.setPaintProperty("area-line", "line-opacity", st.areaOp);
    m.setPaintProperty("cbg-fill", "fill-opacity", ["interpolate", ["linear"], ["coalesce", ["get", "pct"], 0], 0, 0.12 * st.cbgOp, 50, 0.35 * st.cbgOp, 100, 0.55 * st.cbgOp]);
    m.setPaintProperty("cbg-line", "line-opacity", 0.7 * st.cbgOp);
    m.setLayoutProperty("area-line", "visibility", st.showArea && st.areaLine ? "visible" : "none");
    m.setLayoutProperty("cbg-line", "visibility", st.showCbg && st.cbgLine ? "visible" : "none");
  }

  function setBase(b) {
    st.base = b;
    $$("#ev-base button").forEach((x) => x.classList.toggle("on", x.dataset.b === b));
    if (!st.ready) return;
    st.map.setLayoutProperty("dark", "visibility", b === "dark" ? "visible" : "none");
    st.map.setLayoutProperty("darklbl", "visibility", b === "dark" ? "visible" : "none");
    st.map.setLayoutProperty(st.satFallback ? "satfb" : "sat", "visibility", b === "sat" ? "visible" : "none");
  }

  function fit(b, pad = 40) { st.map.fitBounds([[b[0], b[1]], [b[2], b[3]]], { padding: pad, duration: 700, maxZoom: 12 }); }

  function selectHurricane(hk, flyTo) {
    if (!byKey(hk)) hk = hurricanes()[hurricanes().length - 1].key;
    const changed = st.hk !== hk;
    st.hk = hk; if (changed) st.oid = null;
    const h = byKey(hk);
    $("#ev-sub").textContent = `${h.name} ${h.year} · ${h.states.join(", ")} · ${h.orders.length} orders · ${h.n_bg.toLocaleString()} block groups`;
    renderYears(); renderList(); $("#ev-detail").innerHTML = ""; loadProps(hk);
    applyFilters();
    if (st.popup) st.popup.remove();
    if (flyTo && h.bbox) fit(h.bbox);
  }

  function selectOrder(oid, flyTo) {
    const o = byKey(st.hk).orders.find((x) => x.id === oid); if (!o) return;
    st.oid = oid;
    $$("#ev-list li").forEach((li) => li.classList.toggle("on", li.dataset.o === oid));
    $("#ev-detail").innerHTML = orderDetail(o);
    $("#ev-close").onclick = () => { st.oid = null; $("#ev-detail").innerHTML = ""; $$("#ev-list li").forEach((li) => li.classList.remove("on")); applyFilters(); };
    applyFilters();
    if (flyTo) fit(o.bbox, 60);
    $(".evac-panel").scrollTo({ top: $("#ev-detail").offsetTop - 80, behavior: "smooth" });
  }

  function propTable(obj) {
    return `<table class="ptbl">${Object.entries(obj).map(([k, v]) => {
      let val = v == null || v === "" ? '<span class="na">—</span>' : esc(v);
      if (typeof v === "string" && /^https?:\/\//.test(v)) val = `<a href="${esc(v)}" target="_blank" rel="noopener">${esc(v.length > 48 ? v.slice(0, 48) + "…" : v)}</a>`;
      return `<tr><th class="mono">${esc(k)}</th><td>${val}</td></tr>`;
    }).join("")}</table>`;
  }

  async function identify(oids, cbgRows, lngLat) {
    const P = await loadProps(st.hk);
    const short = (id) => id.replace(st.hk + "_", "");
    const tabs = [];
    oids.forEach((id) => tabs.push({ label: `Area · ${short(id)}`, file: "evacuation_area.geojson", html: propTable(P.areas[id] || { order_id: id }) }));
    cbgRows.forEach((r) => tabs.push({ label: `CBG · ${r.GEOID} × ${short(r.oid)}`, file: "evacuation_cbg.geojson",
      html: propTable(P.cbg[`${r.GEOID}|${r.oid}`] || { GEOID: r.GEOID, order_id: r.oid }) }));
    if (!tabs.length) return;
    $("#ev-detail").innerHTML = `<div class="ev-card">
      <div class="ev-card-top mono"><span>Properties · ${tabs.length} feature${tabs.length > 1 ? "s" : ""}</span><button class="x" id="ev-close">×</button></div>
      <div class="ptabs mono">${tabs.map((t, i) => `<button data-t="${i}" class="${i === 0 ? "on" : ""}">${esc(t.label)}</button>`).join("")}</div>
      ${tabs.map((t, i) => `<div class="ppane" data-t="${i}" ${i ? "hidden" : ""}><div class="pfile mono">${esc(st.hk)}_mandatory_${esc(t.file)}</div>${t.html}</div>`).join("")}
      ${googleLinks(lngLat.lng, lngLat.lat)}
    </div>`;
    $$(".ptabs button").forEach((b) => (b.onclick = () => {
      $$(".ptabs button").forEach((x) => x.classList.toggle("on", x === b));
      $$(".ppane").forEach((p) => (p.hidden = p.dataset.t !== b.dataset.t));
    }));
    $("#ev-close").onclick = () => { $("#ev-detail").innerHTML = ""; };
    $(".evac-panel").scrollTo({ top: $("#ev-detail").offsetTop - 80, behavior: "smooth" });
  }

  const short = (id) => String(id || "").replace(st.hk + "_", "");
  function onClick(e) {
    const m = st.map;
    const feats = m.queryRenderedFeatures(e.point, { layers: ["area-fill", "cbg-fill"].filter((l) => m.getLayoutProperty(l, "visibility") !== "none") });
    if (!feats.length) return;
    const h = byKey(st.hk);
    const areaF = feats.filter((f) => f.layer.id === "area-fill");
    const cbgRows = [];
    feats.filter((f) => f.layer.id === "cbg-fill").forEach((f) => {
      const p = f.properties;
      if (!cbgRows.some((r) => r.GEOID === p.GEOID && r.oid === p.oid)) cbgRows.push(p);
    });
    const oids = [...new Set(areaF.map((f) => f.properties.oid))];
    let html = "";
    if (oids.length) {
      html += `<div class="pp-h mono">${oids.length} order${oids.length > 1 ? "s" : ""} here</div>` + oids.map((id) => {
        const o = h.orders.find((x) => x.id === id) || { id };
        return `<button class="pp-o" data-o="${esc(id)}">${badge(o)}${esc(o.county || id)} · ${esc((o.announce || "").slice(0, 16))}<br><small>${esc((o.area || "").slice(0, 90))}${(o.area || "").length > 90 ? "…" : ""}</small></button>`;
      }).join("");
    }
    if (cbgRows.length) {
      html += `<div class="pp-h mono">Block group ${esc(cbgRows[0].GEOID)}</div>` + cbgRows.map((p) =>
        `<div class="pp-b">${badge({ confidence: p.conf, level: p.level })} ${esc(short(p.oid))} · ${Number(p.pct).toFixed(1)}% inside</div>`).join("");
    }
    html += googleLinks(e.lngLat.lng, e.lngLat.lat);
    if (st.popup) st.popup.remove();
    st.popup = new maplibregl.Popup({ maxWidth: "320px", className: "ev-pop" }).setLngLat(e.lngLat).setHTML(html).addTo(m);
    $$(".pp-o", st.popup.getElement()).forEach((b) => (b.onclick = () => selectOrder(b.dataset.o, false)));
    identify(oids, cbgRows, e.lngLat);
  }

  // ---------- mount ----------
  async function mount(root, hk) {
    root.innerHTML = shell();
    await ensureLibs();
    if (!maplibregl.__pmtiles) { maplibregl.addProtocol("pmtiles", new pmtiles.Protocol().tile); maplibregl.__pmtiles = true; }
    st.ready = false;
    const h0 = byKey(hk) || hurricanes()[hurricanes().length - 1];
    st.hk = h0.key; st.oid = null;
    $("#ev-sub").textContent = "";
    renderYears(); renderLegend(); renderList();
    const m = (st.map = new maplibregl.Map({ container: "ev-map", style: style(), bounds: [[h0.bbox[0], h0.bbox[1]], [h0.bbox[2], h0.bbox[3]]], fitBoundsOptions: { padding: 40 }, attributionControl: { compact: true } }));
    m.addControl(new maplibregl.NavigationControl({ visualizePitch: false }), "top-right");
    m.addControl(new maplibregl.ScaleControl({ unit: "imperial" }), "bottom-right");
    m.on("error", (e) => {
      if (e && e.error && !["dark", "darklbl", "sat", "satfb"].includes(e.sourceId)) console.warn("map error:", e.error.message || e.error);
      // MapTiler key rejected or unreachable: fall back to Esri imagery
      if (e && e.sourceId === "sat" && !st.satFallback) { st.satFallback = true; if (st.base === "sat") { m.setLayoutProperty("sat", "visibility", "none"); m.setLayoutProperty("satfb", "visibility", "visible"); } }
    });
    const top = document.querySelector(".top"); if (top) root.querySelector(".evac").style.top = top.offsetHeight + "px";
    m.once("style.load", () => {
      st.ready = true; $("#ev-loading").hidden = true;
      setBase(st.base); setColorBy(st.colorBy); selectHurricane(st.hk, false);
    });
    m.on("click", onClick);
    ["area-fill", "cbg-fill"].forEach((l) => { m.on("mouseenter", l, () => (m.getCanvas().style.cursor = "pointer")); m.on("mouseleave", l, () => (m.getCanvas().style.cursor = "")); });
    $$("#ev-base button").forEach((b) => (b.onclick = () => setBase(b.dataset.b)));
    $$("#ev-colorby button").forEach((b) => (b.onclick = () => setColorBy(b.dataset.c)));
    $("#ev-area").onchange = (e) => { st.showArea = e.target.checked; applyFilters(); };
    $("#ev-cbg").onchange = (e) => { st.showCbg = e.target.checked; applyFilters(); };
    $("#ev-sliver").onchange = (e) => { st.noSliver = e.target.checked; applyFilters(); };
    [["area", "areaOp"], ["cbg", "cbgOp"]].forEach(([k, key]) => {
      $(`#ev-${k}-op`).oninput = (e) => { st[key] = e.target.value / 100; $(`#ev-${k}-op-v`).textContent = `${e.target.value}%`; applyLook(); };
    });
    $("#ev-area-line").onchange = (e) => { st.areaLine = e.target.checked; applyLook(); };
    $("#ev-cbg-line").onchange = (e) => { st.cbgLine = e.target.checked; applyLook(); };
    $("#ev-county").onchange = (e) => { st.inCounty = e.target.checked; applyFilters(); };
  }

  window.HMEvac = {
    async show(root, hk) {
      if (!st.map || !document.getElementById("ev-map")) return mount(root, hk);
      if (hk && hk !== st.hk) selectHurricane(hk, true);
    },
    get map() { return st.map; },
    unmount() { if (st.map) { st.map.remove(); st.map = null; st.ready = false; } }
  };
})();
