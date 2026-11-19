/* Rendering engine for the motivation framework site. No dependencies. */
(function () {
  "use strict";

  const HM = (window.HM = {
    site: {},
    refs: {},
    srcs: {},
    mechs: [],
    references(obj) { Object.assign(HM.refs, obj); },
    sources(obj) { Object.assign(HM.srcs, obj); },
    mechanism(m) { HM.mechs.push(m); },
    boot(cfg) {
      HM.site = cfg.site || {};
      loadSequential(cfg.files || [], () => { buildCitationIndex(); renderNav(); route(); });
    }
  });

  // ---------- loading ----------
  function loadSequential(files, done) {
    if (!files.length) return done();
    const s = document.createElement("script");
    s.src = files[0];
    s.onload = () => loadSequential(files.slice(1), done);
    s.onerror = () => { console.error("Failed to load", files[0]); loadSequential(files.slice(1), done); };
    document.body.appendChild(s);
  }

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const DIR = { pos: "Positive", neg: "Negative", ns: "Non-significant / mixed" };
  const SIGN = { "+": "+", "-": "−", "−": "−", "?": "?" };
  const signCls = (s) => (s === "+" ? "pos" : s === "-" || s === "−" ? "neg" : s === "?" ? "ns" : "");

  // Content text supports [@key] citations and **bold**; content files are trusted HTML.
  function rich(text) {
    if (!text) return "";
    return String(text)
      .replace(/\[@([\w-]+)\]/g, (_, k) => {
        const r = HM.refs[k];
        if (!r) return `<span class="cite missing" title="Missing reference: ${esc(k)}">[${esc(k)}]</span>`;
        return r.url
          ? `<a class="cite" href="${esc(r.url)}" target="_blank" rel="noopener" title="${esc(r.note || r.label)}">${esc(r.label)}</a>`
          : `<span class="cite">${esc(r.label)}</span>`;
      })
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }

  function parseChain(str) {
    return String(str).split("→").map((seg) => {
      const m = seg.trim().match(/^(.*?)\s*\(\s*([+\-−?])\s*\)\s*$/);
      return m ? { label: m[1].trim(), sign: m[2] } : { label: seg.trim(), sign: "" };
    });
  }

  function chainHTML(c) {
    const nodes = parseChain(c.chain);
    const parts = nodes.map((n, i) => {
      const last = i === nodes.length - 1;
      const sign = n.sign ? `<i class="sg">${SIGN[n.sign] || esc(n.sign)}</i>` : "";
      return `<span class="node${last ? " end" : ""}">${esc(n.label)}${sign}</span>`;
    });
    return `<div class="chain" data-dir="${esc(c.dir || "")}">
      <span class="dir-tag mono">${esc(DIR[c.dir] || "Hypothesis")}</span>
      <div class="nodes">${parts.join('<span class="arr" aria-hidden="true"></span>')}</div>
    </div>`;
  }

  function allPathways(m) {
    return (m.dimensions || []).flatMap((d) => (d.pathways || []).map((p) => ({ ...p, dimension: d.name })));
  }

  function stats(m) {
    const pws = allPathways(m);
    const chains = pws.flatMap((p) => p.chains || []).concat((m.dimensions || []).map((d) => d.intro).filter(Boolean));
    const count = (d) => chains.filter((c) => c.dir === d).length;
    return {
      pathways: pws.length,
      metrics: pws.reduce((a, p) => a + (p.metrics || []).length, 0),
      pos: count("pos"), neg: count("neg"), ns: count("ns"),
      refs: new Set(JSON.stringify(m).match(/\[@[\w-]+\]/g) || []).size
    };
  }

  function dirBar(s) {
    const tot = s.pos + s.neg + s.ns || 1;
    const seg = (k) => (s[k] ? `<span class="seg ${k}" style="flex:${s[k] / tot}" title="${DIR[k]}: ${s[k]}"></span>` : "");
    return `<span class="dirbar">${seg("pos")}${seg("neg")}${seg("ns")}</span>`;
  }

  const STATUS = { consistent: "Consistent", mixed: "Mixed evidence", "in-progress": "In progress" };
  const statusBadge = (st) => (st ? `<span class="badge mono" data-status="${esc(st)}">${esc(STATUS[st] || st)}</span>` : "");

  const legend = () => `<div class="legend mono">
      <span><i class="dot pos"></i>positive</span>
      <span><i class="dot neg"></i>negative</span>
      <span><i class="dot ns"></i>non-significant / mixed</span>
    </div>`;

  // ---------- citation index ----------
  HM.citedIn = {};
  function buildCitationIndex() {
    const add = (text, m, where) => {
      (String(text || "").match(/\[@([\w-]+)\]/g) || []).forEach((t) => {
        const k = t.slice(2, -1);
        const list = (HM.citedIn[k] = HM.citedIn[k] || []);
        if (!list.some((x) => x.m === m.id && x.where === where)) list.push({ m: m.id, where });
      });
    };
    HM.mechs.forEach((m) => {
      (m.summary || []).forEach((t) => add(t, m, m.code));
      (m.dimensions || []).forEach((d) => {
        if (d.intro) add(d.intro.evidence, m, m.code);
        (d.pathways || []).forEach((p) => {
          add(p.evidence, m, p.id);
          (p.chains || []).forEach((c) => add(c.evidence, m, p.id));
        });
      });
    });
  }

  // ---------- navigation ----------
  function renderNav() {
    const items = [
      `<a href="#/" data-r="home"><span class="mono">00</span>Overview</a>`,
      `<div class="nav-label mono">Mechanisms</div>`,
      ...HM.mechs.map((m) => `<a href="#/m/${m.id}" data-r="m/${m.id}"><span class="mono">${esc(m.code)}</span>${esc(m.short || m.title)}</a>`),
      `<div class="nav-label mono">Index</div>`,
      `<a href="#/metrics" data-r="metrics"><span class="mono">Ix</span>Metrics &amp; data</a>`,
      `<a href="#/references" data-r="references"><span class="mono">Rf</span>References</a>`
    ];
    $("#nav").innerHTML = items.join("");
  }

  function setActive(key) {
    document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.r === key));
    document.body.classList.remove("nav-open");
  }

  // ---------- views ----------
  function viewHome() {
    const s = HM.site;
    const cards = HM.mechs.map((m) => {
      const st = stats(m);
      return `<a class="mcard" href="#/m/${m.id}">
        <div class="mcard-top"><span class="mono code">${esc(m.code)}</span>${statusBadge(m.status)}</div>
        <h3>${esc(m.title)}</h3>
        <p>${esc(m.question || clip(stripTags(rich((m.summary || [""])[0])), 140))}</p>
        <div class="mcard-foot mono">
          <span>${st.pathways} pathways</span><span>${st.metrics} metrics</span>${dirBar(st)}
        </div>
      </a>`;
    }).join("");

    return `
      <header class="hero">
        <div class="kicker mono">${esc(s.kicker || "")}</div>
        <h1>${esc(s.title || "")}</h1>
        ${(s.intro || []).map((p) => `<p class="lead">${rich(p)}</p>`).join("")}
      </header>
      ${figureCard()}
      <section>
        <div class="sec-head"><h2>Mechanisms</h2>${legend()}</div>
        <div class="mgrid">${cards}</div>
      </section>
      <footer class="foot mono">Updated ${esc(s.updated || "")} · ${esc(s.author || "")}</footer>`;
  }

  function clip(t, n) { return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; }
  function stripTags(h) { const d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; }

  // Fig 1: mechanisms (modules) wired into the motivation hub, then to outcomes.
  function figureCard() {
    const n = HM.mechs.length;
    const rowH = 56, top = 28, W = 880, H = top * 2 + n * rowH - 16;
    const mx = 24, mw = 300, mh = 40;
    const hx = 560, hw = 170, hh = 76, hy = H / 2 - hh / 2;
    const ox = 790, ow = 80, oh = 44, oy = H / 2 - oh / 2;
    let wires = "", mods = "";
    HM.mechs.forEach((m, i) => {
      const y = top + i * rowH, cy = y + mh / 2;
      const ty = hy + 14 + (i * (hh - 28)) / Math.max(n - 1, 1);
      const x1 = mx + mw, x2 = hx;
      const st = stats(m);
      wires += `<g class="wire" data-i="${i}">
        <path d="M${x1} ${cy} C ${x1 + 150} ${cy}, ${x2 - 150} ${ty}, ${x2} ${ty}"/>
        <path class="flow" d="M${x1} ${cy} C ${x1 + 150} ${cy}, ${x2 - 150} ${ty}, ${x2} ${ty}"/>
        <circle class="term" cx="${x1}" cy="${cy}" r="2.6"/><circle class="term" cx="${x2}" cy="${ty}" r="2.6"/>
      </g>`;
      const ticks = ["pos", "neg", "ns"].flatMap((k) => Array(st[k]).fill(k))
        .map((k, j) => `<circle class="tick ${k}" cx="${mx + mw - 14 - j * 6.5}" cy="${cy}" r="2.2"/>`).join("");
      mods += `<a href="#/m/${m.id}" class="mod" data-i="${i}">
        <rect x="${mx}" y="${y}" width="${mw}" height="${mh}" rx="7"/>
        <line x1="${mx + 44}" y1="${y + 8}" x2="${mx + 44}" y2="${y + mh - 8}"/>
        <text class="code" x="${mx + 14}" y="${cy + 4}">${esc(m.code)}</text>
        <text class="name" x="${mx + 56}" y="${cy + 4}">${esc(m.short || m.title)}</text>
        ${ticks}
        <circle class="screw" cx="${mx + 5}" cy="${y + 5}" r=".9"/><circle class="screw" cx="${mx + mw - 5}" cy="${y + 5}" r=".9"/>
        <circle class="screw" cx="${mx + 5}" cy="${y + mh - 5}" r=".9"/><circle class="screw" cx="${mx + mw - 5}" cy="${y + mh - 5}" r=".9"/>
      </a>`;
    });
    const hub = `<g class="hub">
      <rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="10"/>
      <rect class="inner" x="${hx + 6}" y="${hy + 6}" width="${hw - 12}" height="${hh - 12}" rx="6"/>
      <text class="lbl" x="${hx + hw / 2}" y="${hy + hh / 2 - 4}" text-anchor="middle">EVACUATION</text>
      <text class="lbl" x="${hx + hw / 2}" y="${hy + hh / 2 + 12}" text-anchor="middle">MOTIVATION</text>
    </g>
    <g class="wire out">
      <path d="M${hx + hw} ${H / 2} L ${ox} ${H / 2}"/><path class="flow" d="M${hx + hw} ${H / 2} L ${ox} ${H / 2}"/>
      <circle class="term" cx="${hx + hw}" cy="${H / 2}" r="2.6"/><circle class="term" cx="${ox}" cy="${H / 2}" r="2.6"/>
    </g>
    <g class="outc">
      <rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" rx="7"/>
      <text x="${ox + ow / 2}" y="${oy + 19}" text-anchor="middle">evacuation</text>
      <text x="${ox + ow / 2}" y="${oy + 33}" text-anchor="middle">outcomes</text>
    </g>`;
    const tot = HM.mechs.reduce((a, m) => { const s = stats(m); a.p += s.pathways; a.k += s.metrics; return a; }, { p: 0, k: 0 });
    return `<figure class="fig">
      <div class="fig-bar mono"><span>Fig 1</span><span>Motivation-centered framework</span></div>
      <svg class="fig-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Six mechanisms feed evacuation motivation, which drives evacuation outcomes">${wires}${hub}${mods}</svg>
      <div class="fig-bar mono"><span>select a mechanism</span><span>${n} mechanisms · ${tot.p} pathways · ${tot.k} metrics</span></div>
    </figure>
    <figcaption class="cap">Each module is a source of motivation; dots inside a module count its hypothesized chains by direction.</figcaption>`;
  }

  function sourceChips(list) {
    return (list || []).map((k) => {
      const s = HM.srcs[k];
      if (!s) return `<span class="chip">${esc(k)}</span>`;
      return s.url ? `<a class="chip" href="${esc(s.url)}" target="_blank" rel="noopener" title="${esc(s.note || "")}">${esc(s.label)}</a>`
                   : `<span class="chip" title="${esc(s.note || "")}">${esc(s.label)}</span>`;
    }).join("");
  }

  function metricsTable(metrics) {
    if (!metrics || !metrics.length) return "";
    const rows = metrics.map((x) => `<tr>
        <td class="mname">${esc(x.name)}</td>
        <td>${x.measure || '<span class="na">—</span>'}</td>
        <td>${sourceChips(x.source) || '<span class="na">—</span>'}</td>
        <td class="sign ${signCls(x.sign)}">${x.sign ? SIGN[x.sign] || esc(x.sign) : ""}</td>
      </tr>`).join("");
    return `<div class="block"><div class="block-label mono">Metrics</div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th>Metric</th><th>Measure</th><th>Data source</th><th title="Expected sign on evacuation motivation">Exp.</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
  }

  function extraTable(t) {
    if (!t) return "";
    return `<div class="block"><div class="block-label mono">Context</div><div class="tbl-wrap"><table class="tbl small">
      <thead><tr>${t.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${t.rows.map((r) => `<tr>${r.map((c) => `<td>${rich(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div></div>`;
  }

  function pathwayCard(p) {
    const chains = p.chains || [];
    const evid = chains.filter((c) => c.evidence)
      .map((c) => `<div class="ev" data-dir="${esc(c.dir)}"><i class="dot ${esc(c.dir)}"></i><p>${rich(c.evidence)}</p></div>`).join("")
      + (p.evidence ? `<div class="ev"><i class="dot"></i><p>${rich(p.evidence)}</p></div>` : "");
    const nMetrics = (p.metrics || []).length;
    const hasDetail = evid || nMetrics || p.table || p.note;
    const detailLabel = [evid ? "evidence" : "", nMetrics ? `${nMetrics} metric${nMetrics > 1 ? "s" : ""}` : "", p.table ? "context" : ""].filter(Boolean).join(" · ");
    return `<article class="pw" id="p-${esc(p.id)}">
      <header class="pw-head"><span class="mono pid">${esc(p.id)}</span><h3>${esc(p.title)}</h3></header>
      ${chains.map(chainHTML).join("")}
      ${hasDetail ? `<details class="pw-more">
        <summary class="mono">${esc(detailLabel || "details")}</summary>
        ${evid ? `<div class="block"><div class="block-label mono">Evidence</div>${evid}</div>` : ""}
        ${metricsTable(p.metrics)}
        ${extraTable(p.table)}
        ${p.note ? `<p class="note">${rich(p.note)}</p>` : ""}
      </details>` : `<p class="note">No metrics or evidence recorded yet.</p>`}
    </article>`;
  }

  function viewMechanism(id, focus) {
    const i = HM.mechs.findIndex((m) => m.id === id);
    const m = HM.mechs[i];
    if (!m) return viewNotFound();
    const st = stats(m);
    const prev = HM.mechs[i - 1], next = HM.mechs[i + 1];
    const dims = (m.dimensions || []).map((d, k) => `<section class="dim">
        <div class="dim-head"><span class="mono">D${k + 1}</span><h2>${esc(d.name)}</h2></div>
        ${d.intro ? `<div class="intro"><div class="block-label mono">Dimension hypothesis</div>${chainHTML(d.intro)}
          ${d.intro.evidence ? `<div class="ev" data-dir="${esc(d.intro.dir)}"><i class="dot ${esc(d.intro.dir)}"></i><p>${rich(d.intro.evidence)}</p></div>` : ""}</div>` : ""}
        ${(d.pathways || []).map(pathwayCard).join("")}
      </section>`).join("");

    return `
      <div class="crumb mono"><a href="#/">Overview</a><span>/</span>${esc(m.code)}</div>
      <header class="mhead">
        <div class="mhead-top"><span class="mono code big">${esc(m.code)}</span>${statusBadge(m.status)}</div>
        <h1>${esc(m.title)}</h1>
        ${m.question ? `<p class="question">${esc(m.question)}</p>` : ""}
      </header>
      <div class="readout mono">
        <div><b>${st.pathways}</b><span>pathways</span></div>
        <div><b>${st.metrics}</b><span>metrics</span></div>
        <div><b>${st.refs}</b><span>references</span></div>
        <div class="rd-dir"><span><i class="dot pos"></i>${st.pos}</span><span><i class="dot neg"></i>${st.neg}</span><span><i class="dot ns"></i>${st.ns}</span><span>chains</span></div>
      </div>
      <section class="summary">${(m.summary || []).map((p) => `<p>${rich(p)}</p>`).join("")}</section>
      ${(m.notes || []).length ? `<aside class="notes"><div class="block-label mono">Open notes</div><ul>${m.notes.map((n) => `<li>${rich(n)}</li>`).join("")}</ul></aside>` : ""}
      <div class="toolbar">${legend()}<button class="btn mono" id="toggle-all">expand all</button></div>
      ${dims}
      <nav class="pager">
        ${prev ? `<a href="#/m/${prev.id}"><span class="mono">← ${esc(prev.code)}</span>${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="r" href="#/m/${next.id}"><span class="mono">${esc(next.code)} →</span>${esc(next.title)}</a>` : "<span></span>"}
      </nav>`;
  }

  function viewMetrics() {
    const rows = HM.mechs.flatMap((m) => allPathways(m).flatMap((p) => (p.metrics || []).map((x) => ({ m, p, x }))));
    const body = rows.map(({ m, p, x }) => `<tr data-text="${esc([m.code, m.title, p.dimension, p.title, x.name, stripTags(x.measure || ""), (x.source || []).map((k) => (HM.srcs[k] || {}).label || k).join(" ")].join(" ").toLowerCase())}">
        <td class="mono"><a href="#/m/${m.id}/${esc(p.id)}">${esc(p.id)}</a></td>
        <td>${esc(p.dimension)}<div class="sub">${esc(p.title)}</div></td>
        <td class="mname">${esc(x.name)}</td>
        <td>${x.measure || '<span class="na">—</span>'}</td>
        <td>${sourceChips(x.source) || '<span class="na">—</span>'}</td>
        <td class="sign ${signCls(x.sign)}">${x.sign ? SIGN[x.sign] || esc(x.sign) : ""}</td>
      </tr>`).join("");
    return `
      <div class="crumb mono"><a href="#/">Overview</a><span>/</span>Metrics</div>
      <header class="mhead"><h1>Metrics &amp; data</h1>
        <p class="question">All operationalized metrics across mechanisms, with measures, data sources and expected sign on evacuation motivation.</p></header>
      <div class="toolbar"><input id="filter" class="filter mono" placeholder="filter: e.g. ACS, flood, tenure" aria-label="Filter metrics">${legend()}</div>
      <div class="tbl-wrap"><table class="tbl" id="mtbl"><thead><tr><th>ID</th><th>Dimension / pathway</th><th>Metric</th><th>Measure</th><th>Data source</th><th>Exp.</th></tr></thead><tbody>${body}</tbody></table></div>
      <p class="note mono" id="mcount">${rows.length} metrics</p>`;
  }

  function viewReferences() {
    const citeLinks = (k) => (HM.citedIn[k] || []).map((c) => {
      const href = /^\d/.test(c.where) ? `#/m/${c.m}/${c.where}` : `#/m/${c.m}`;
      return `<a class="chip" href="${href}">${esc(c.where)}</a>`;
    }).join("");
    const domain = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
    const refs = Object.entries(HM.refs).sort((a, b) => a[1].label.localeCompare(b[1].label)).map(([k, r]) => `<li>
        <div class="ref-main">${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.label)}</a>` : esc(r.label)}
          <span class="mono dom">${esc(domain(r.url))}</span></div>
        ${r.note ? `<div class="ref-note">${esc(r.note)}</div>` : ""}
        <div class="ref-cited">${citeLinks(k) || '<span class="na mono">not cited</span>'}</div>
      </li>`).join("");
    const srcs = Object.values(HM.srcs).map((s) => `<li>
        <div class="ref-main">${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)}</a>` : esc(s.label)}
          <span class="mono dom">${esc(s.url ? domain(s.url) : "")}</span></div>
        ${s.note ? `<div class="ref-note">${esc(s.note)}</div>` : ""}
      </li>`).join("");
    return `
      <div class="crumb mono"><a href="#/">Overview</a><span>/</span>References</div>
      <header class="mhead"><h1>References</h1><p class="question">Literature cited in the framework, with links to the pathways that cite each work.</p></header>
      <section><div class="sec-head"><h2>Literature</h2><span class="mono note">${Object.keys(HM.refs).length} works</span></div><ul class="refs">${refs}</ul></section>
      <section><div class="sec-head"><h2>Data sources</h2></div><ul class="refs">${srcs}</ul></section>`;
  }

  function viewNotFound() {
    return `<div class="crumb mono"><a href="#/">Overview</a></div><h1>Not found</h1><p>This page does not exist.</p>`;
  }

  // ---------- router ----------
  function route() {
    const parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean);
    const app = $("#app");
    let key = "home";
    if (parts[0] === "m") { key = `m/${parts[1]}`; app.innerHTML = viewMechanism(parts[1]); }
    else if (parts[0] === "metrics") { key = "metrics"; app.innerHTML = viewMetrics(); }
    else if (parts[0] === "references") { key = "references"; app.innerHTML = viewReferences(); }
    else if (!parts.length) { app.innerHTML = viewHome(); }
    else { app.innerHTML = viewNotFound(); }
    setActive(key);
    document.title = (key === "home" ? "" : stripTags($("h1", app)?.innerHTML || "") + " · ") + "Evacuation Motivation Framework";
    bindView();
    const focus = parts[0] === "m" && parts[2] ? document.getElementById("p-" + parts[2]) : null;
    if (focus) {
      const d = $("details", focus); if (d) d.open = true;
      focus.classList.add("flash");
      focus.scrollIntoView({ block: "start" });
    } else window.scrollTo(0, 0);
  }

  function bindView() {
    const t = $("#toggle-all");
    if (t) t.onclick = () => {
      const ds = document.querySelectorAll(".pw-more");
      const open = ![...ds].every((d) => d.open);
      ds.forEach((d) => (d.open = open));
      t.textContent = open ? "collapse all" : "expand all";
    };
    const f = $("#filter");
    if (f) f.oninput = () => {
      const q = f.value.trim().toLowerCase();
      let n = 0;
      document.querySelectorAll("#mtbl tbody tr").forEach((tr) => { const hit = !q || tr.dataset.text.includes(q); tr.hidden = !hit; n += hit; });
      $("#mcount").textContent = `${n} metrics`;
    };
    document.querySelectorAll(".fig .mod").forEach((a) => {
      const w = document.querySelector(`.fig .wire[data-i="${a.dataset.i}"]`);
      a.onmouseenter = () => { w && w.classList.add("on"); document.querySelector(".fig").classList.add("hovering"); };
      a.onmouseleave = () => { w && w.classList.remove("on"); document.querySelector(".fig").classList.remove("hovering"); };
    });
  }

  window.addEventListener("hashchange", route);
  document.addEventListener("DOMContentLoaded", () => {
    const b = document.getElementById("menu-btn");
    if (b) b.onclick = () => document.body.classList.toggle("nav-open");
  });
})();
