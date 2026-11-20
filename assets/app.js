/* Rendering engine for the motivation framework site. No dependencies. */
(function () {
  "use strict";

  const HM = (window.HM = {
    site: {}, refs: {}, srcs: {}, mechs: [], nodes: {}, citedIn: {},
    references(o) { Object.assign(HM.refs, o); },
    sources(o) { Object.assign(HM.srcs, o); },
    mechanism(m) { HM.mechs.push(m); },
    boot(cfg) {
      HM.site = cfg.site || {};
      loadSequential(cfg.files || [], () => { prepare(); bindGlobal(); route(); });
    }
  });

  const state = { page: null, mech: null, node: null, open: new Map(), rendered: null };

  // ---------- loading ----------
  function loadSequential(files, done) {
    if (!files.length) return done();
    const s = document.createElement("script");
    s.src = files[0];
    s.onload = s.onerror = () => loadSequential(files.slice(1), done);
    document.body.appendChild(s);
  }

  // ---------- helpers ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const DIR = { pos: "Positive", neg: "Negative", ns: "Non-significant / mixed" };
  const SIGN = { "+": "+", "-": "−", "−": "−", "?": "?" };
  const signCls = (s) => (s === "+" ? "pos" : s === "-" || s === "−" ? "neg" : s === "?" ? "ns" : "");
  const KIND = { mechanism: "mechanism", dimension: "dimension", group: "group", metric: "metric", mediator: "evidence-backed chain", factor: "factor" };
  const kindName = (k) => KIND[k] || k || "node";
  const STATUS = { consistent: "Consistent", mixed: "Mixed evidence", "in-progress": "In progress" };
  const domain = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const stripTags = (h) => { const d = document.createElement("div"); d.innerHTML = h; return d.textContent || ""; };

  // ---------- APA 7 ----------
  const family = (a) => a.split(",")[0].trim();
  function inText(r) {
    if (r.label) return r.label;
    const a = r.authors || [];
    const who = a.length === 1 ? family(a[0]) : a.length === 2 ? `${family(a[0])} and ${family(a[1])}` : `${family(a[0])} et al.`;
    return `${who} (${r.year}${r.suffix || ""})`;
  }
  function apaAuthors(a) {
    if (!a || !a.length) return "";
    if (a.length === 1) return esc(a[0]);
    if (a.length <= 20) return a.slice(0, -1).map(esc).join(", ") + ", &amp; " + esc(a[a.length - 1]);
    return a.slice(0, 19).map(esc).join(", ") + ", … " + esc(a[a.length - 1]);
  }
  const endDot = (t) => (/[.?!]$/.test(t) ? t : t + ".");
  function apaHTML(r) {
    if (r.apa) return r.apa + (r.url ? ` <a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url)}</a>` : "");
    const au = apaAuthors(r.authors);
    const auPart = au ? (/\.$/.test(au) ? au : au + ".") : "";
    const link = r.doi ? `https://doi.org/${r.doi}` : r.url;
    const linkHTML = link ? ` <a href="${esc(link)}" target="_blank" rel="noopener">${esc(link)}</a>` : "";
    const yr = `(${esc(r.date || r.year + (r.suffix || ""))}).`;
    const t = esc(r.title || "");
    let body;
    if (r.type === "article") {
      body = `${endDot(t)} <i>${esc(r.journal)}</i>${r.volume ? `, <i>${esc(r.volume)}</i>` : ""}${r.issue ? `(${esc(r.issue)})` : ""}${r.pages ? `, ${esc(r.pages)}` : ""}.`;
    } else if (r.type === "report" || r.type === "book") {
      body = `<i>${t}</i>${r.number ? ` (${esc(r.number)})` : ""}. ${r.publisher ? endDot(esc(r.publisher)) : ""}`;
    } else if (r.type === "conference") {
      body = `<i>${t}</i> [Paper presentation]. ${endDot(esc(r.event || ""))}`;
    } else {
      body = `<i>${endDot(t)}</i> ${r.site ? endDot(esc(r.site)) : ""}`;
    }
    return `${auPart} ${yr} ${body}${linkHTML}`.replace(/\s+/g, " ").trim();
  }
  const sortKey = (r) => `${(r.authors || [r.label || ""])[0]} ${r.year || ""}${r.suffix || ""}`.toLowerCase();

  // Content text supports [@key] citations and **bold**; content files are trusted HTML.
  function rich(text) {
    if (!text) return "";
    return String(text)
      .replace(/\[@([\w-]+)\]/g, (_, k) => {
        const r = HM.refs[k];
        if (!r) return `<span class="cite missing" title="Missing reference: ${esc(k)}">[${esc(k)}]</span>`;
        const href = r.doi ? `https://doi.org/${r.doi}` : r.url || "#/references";
        return `<a class="cite${r.flag ? " flagged" : ""}" data-ref="${esc(k)}" href="${esc(href)}" title="${esc(stripTags(apaHTML(r)))}">${esc(inText(r))}</a>`;
      })
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  }

  function srcChips(list) {
    return (list || []).map((k) => {
      const s = HM.srcs[k];
      if (!s) return `<span class="chip">${esc(k)}</span>`;
      return `<a class="chip" data-src="${esc(k)}" href="${esc(s.url || "#/references")}" title="${esc(s.note || "")}">${esc(s.label)}</a>`;
    }).join("");
  }

  function parseChain(str) {
    return String(str).split("→").map((seg) => {
      const m = seg.trim().match(/^(.*?)\s*\(\s*([+\-−?])\s*\)\s*$/);
      return m ? { label: m[1].trim(), sign: m[2] } : { label: seg.trim(), sign: "" };
    });
  }

  function chainHTML(h) {
    const nodes = parseChain(h.chain);
    const parts = nodes.map((n, i) => `<span class="node${i === nodes.length - 1 ? " end" : ""}">${esc(n.label)}${n.sign ? `<i class="sg">${SIGN[n.sign] || esc(n.sign)}</i>` : ""}</span>`);
    return `<div class="chain" data-dir="${esc(h.dir || "")}">
      <span class="dir-tag mono">${esc(DIR[h.dir] || "Hypothesis")}</span>
      <div class="nodes">${parts.join('<span class="arr" aria-hidden="true"></span>')}</div>
    </div>`;
  }

  const legend = () => `<div class="legend mono"><span><i class="dot pos"></i>positive</span><span><i class="dot neg"></i>negative</span><span><i class="dot ns"></i>non-significant / mixed</span></div>`;

  // ---------- model ----------
  function prepare() {
    HM.mechs.forEach((m) => {
      m.root = { label: m.short || m.title, title: m.title, kind: "mechanism", children: m.children || [], key: m.id, path: "", depth: 0, mech: m, parent: null };
      HM.nodes[m.id] = m.root;
      const walk = (n, parent, path, depth) => {
        n.path = path; n.depth = depth; n.parent = parent; n.mech = m;
        n.key = `${m.id}/${path}`;
        HM.nodes[n.key] = n;
        (n.children || []).forEach((c, i) => walk(c, n, path ? `${path}.${i + 1}` : `${i + 1}`, depth + 1));
      };
      m.root.children.forEach((c, i) => walk(c, m.root, `${i + 1}`, 1));
      if (m.metricsOnly) {
        const g = { label: m.metricsOnly.group, kind: "group", parent: m.root, mech: m, depth: 1 };
        m.metricsOnly.items.forEach((it, i) => {
          const n = Object.assign({}, it, { kind: "metric", metricsOnly: true, parent: g, mech: m, depth: 2, path: `0.${i + 1}`, key: `${m.id}/x${i + 1}` });
          HM.nodes[n.key] = n;
        });
      }
    });
    // citation index: reference key -> [{ key: node key, text }]
    const add = (text, node) => {
      (String(text || "").match(/\[@[\w-]+\]/g) || []).forEach((t) => {
        const k = t.slice(2, -1);
        const list = (HM.citedIn[k] = HM.citedIn[k] || []);
        const sentence = sentenceWith(text, t);
        if (!list.some((x) => x.key === node.key && x.text === sentence)) list.push({ key: node.key, text: sentence });
      });
    };
    Object.values(HM.nodes).forEach((n) => {
      if (n.kind === "mechanism") (n.mech.summary || []).forEach((t) => add(t, n));
      (n.hypotheses || []).forEach((h) => add(h.evidence, n));
      add(n.evidence, n);
    });
  }

  function sentenceWith(text, token) {
    const parts = String(text).split(/(?<=[.;])\s+(?=[A-Z\[“])/);
    return parts.find((p) => p.includes(token)) || text;
  }

  function stats(m) {
    const all = Object.values(HM.nodes).filter((n) => n.mech === m);
    const hyps = all.flatMap((n) => n.hypotheses || []);
    const c = (d) => hyps.filter((h) => h.dir === d).length;
    return { nodes: all.length - 1, metrics: all.filter((n) => n.metric).length, hyps: hyps.length, pos: c("pos"), neg: c("neg"), ns: c("ns") };
  }

  const isOpen = (n) => (state.open.has(n.key) ? state.open.get(n.key) : n.open !== false);
  const pathOf = (n) => { const p = []; for (let x = n; x; x = x.parent) p.unshift(x); return p; };
  const hrefOf = (n) => (n.metricsOnly ? "#/metrics" : `#/${n.mech.id}${n.path ? "/" + n.path : ""}`);

  // ---------- page: overview ----------
  function viewHome() {
    const s = HM.site;
    return `
      <header class="hero">
        <div class="kicker mono">${esc(s.kicker || "")}</div>
        <h1>${esc(s.title || "")}</h1>
        ${(s.intro || []).map((p) => `<p class="lead">${rich(p)}</p>`).join("")}
      </header>
      ${figureFlow()}
      <div id="decomp"></div>
      <footer class="foot mono">Updated ${esc(s.updated || "")} · ${esc(s.author || "")}</footer>`;
  }

  // Overview figure: mechanisms wired into the motivation hub, then to outcomes.
  function figureFlow() {
    const n = HM.mechs.length;
    const rowH = 56, top = 24, W = 1060, H = top * 2 + n * rowH - 16;
    const mx = 20, mw = 300, mh = 40;
    const hx = 640, hw = 190, hh = 76, hy = H / 2 - hh / 2;
    const ox = 930, ow = 110, oh = 46, oy = H / 2 - oh / 2;
    let wires = "", mods = "";
    HM.mechs.forEach((m, i) => {
      const y = top + i * rowH, cy = y + mh / 2;
      const ty = hy + 14 + (i * (hh - 28)) / Math.max(n - 1, 1);
      const x1 = mx + mw, x2 = hx, d = `M${x1} ${cy} C ${x1 + 170} ${cy}, ${x2 - 170} ${ty}, ${x2} ${ty}`;
      const st = stats(m);
      wires += `<g class="wire" data-m="${m.id}"><path d="${d}"/><path class="flow" d="${d}"/>
        <circle class="term" cx="${x1}" cy="${cy}" r="2.6"/><circle class="term" cx="${x2}" cy="${ty}" r="2.6"/></g>`;
      const ticks = ["pos", "neg", "ns"].flatMap((k) => Array(st[k]).fill(k))
        .map((k, j) => `<circle class="tick ${k}" cx="${mx + mw - 14 - j * 6.5}" cy="${cy}" r="2.2"/>`).join("");
      mods += `<a href="#/${m.id}" class="mod" data-m="${m.id}" aria-label="${esc(m.title)}">
        <rect x="${mx}" y="${y}" width="${mw}" height="${mh}" rx="7"/>
        <line x1="${mx + 44}" y1="${y + 8}" x2="${mx + 44}" y2="${y + mh - 8}"/>
        <text class="code" x="${mx + 14}" y="${cy + 4}">${esc(m.code)}</text>
        <text class="name" x="${mx + 56}" y="${cy + 4}">${esc(m.short || m.title)}</text>${ticks}
        ${[[5, 5], [mw - 5, 5], [5, mh - 5], [mw - 5, mh - 5]].map(([a, b]) => `<circle class="screw" cx="${mx + a}" cy="${y + b}" r=".9"/>`).join("")}
      </a>`;
    });
    const hub = `<g class="hub"><rect x="${hx}" y="${hy}" width="${hw}" height="${hh}" rx="10"/>
      <rect class="inner" x="${hx + 6}" y="${hy + 6}" width="${hw - 12}" height="${hh - 12}" rx="6"/>
      <text class="lbl" x="${hx + hw / 2}" y="${hy + hh / 2 - 4}" text-anchor="middle">EVACUATION</text>
      <text class="lbl" x="${hx + hw / 2}" y="${hy + hh / 2 + 12}" text-anchor="middle">MOTIVATION</text></g>
      <g class="wire out"><path d="M${hx + hw} ${H / 2} L ${ox} ${H / 2}"/><path class="flow" d="M${hx + hw} ${H / 2} L ${ox} ${H / 2}"/>
      <circle class="term" cx="${hx + hw}" cy="${H / 2}" r="2.6"/><circle class="term" cx="${ox}" cy="${H / 2}" r="2.6"/></g>
      <g class="outc"><rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" rx="7"/>
      <text x="${ox + ow / 2}" y="${oy + 20}" text-anchor="middle">evacuation</text><text x="${ox + ow / 2}" y="${oy + 34}" text-anchor="middle">outcomes</text></g>`;
    const tot = HM.mechs.reduce((a, m) => { const s = stats(m); a.n += s.nodes; a.k += s.metrics; a.h += s.hyps; return a; }, { n: 0, k: 0, h: 0 });
    return `<figure class="fig" id="fig1">
      <div class="fig-bar mono"><span>Overview</span><span>Motivation-centered framework</span></div>
      <div class="fig-scroll"><svg class="fig-svg" viewBox="0 0 ${W} ${H}" style="min-width:720px" role="img" aria-label="Mechanisms feeding evacuation motivation">${wires}${hub}${mods}</svg></div>
      <div class="fig-bar mono"><span class="hint">select a mechanism to unfold it</span><span>${n} mechanisms · ${tot.k} metrics · ${tot.h} hypotheses</span></div>
    </figure>
    <div class="cap-row">${legend()}<span class="cap">Dots in each module count its hypotheses by direction.</span></div>`;
  }

  // Mechanism figure: decomposition tree of the selected mechanism.
  const T = { NW: 190, RW: 156, GAP: 34, P: 52, H: 42 };
  const colX = (d) => (d === 0 ? 0 : T.RW + T.GAP + (d - 1) * (T.NW + T.GAP));

  function layoutTree(root) {
    let row = 0, maxD = 0;
    const place = (n, d) => {
      n._d = d; maxD = Math.max(maxD, d);
      const kids = n.children && n.children.length && isOpen(n) ? n.children : [];
      if (kids.length) { kids.forEach((k) => place(k, d + 1)); n._y = (kids[0]._y + kids[kids.length - 1]._y) / 2; }
      else n._y = row++ * T.P + T.H / 2;
      n._kids = kids;
    };
    place(root, 0);
    return { w: colX(maxD) + T.NW + 8, h: Math.max(row * T.P - (T.P - T.H), T.H) };
  }

  function nodeMeta(n) {
    if (n.kind === "mechanism") return n.mech.code;
    const bits = [kindName(n.kind)];
    if (n.metric && n.metric.source) bits.push((n.metric.source.map((k) => (HM.srcs[k] || {}).label || k)).join(", "));
    else if (n.children && n.children.length) bits.push(`${n.children.length}`);
    return bits.join(" · ");
  }

  function treeHTML(m) {
    const root = m.root;
    const { w, h } = layoutTree(root);
    let wires = "", nodes = "";
    const visit = (n) => {
      const x = colX(n._d), nw = n._d === 0 ? T.RW : T.NW, y = n._y;
      n._kids.forEach((c) => {
        const x1 = x + nw, x2 = colX(c._d), y2 = c._y, mid = (x1 + x2) / 2;
        wires += `<path d="M${x1} ${y} C ${mid} ${y}, ${mid} ${y2}, ${x2} ${y2}"/><circle class="term" cx="${x2}" cy="${y2}" r="2.4"/>`;
        visit(c);
      });
      const hasKids = n.children && n.children.length;
      const dots = (n.hypotheses || []).map((hh) => `<i class="dot ${esc(hh.dir)}"></i>`).join("");
      const sign = n.metric && n.metric.sign ? `<i class="nsign ${signCls(n.metric.sign)}" title="expected direction on evacuation motivation">${SIGN[n.metric.sign]}</i>` : "";
      const toggle = hasKids && n._d > 0
        ? `<span class="tg mono${isOpen(n) ? " open" : ""}" data-toggle="${esc(n.key)}" title="${isOpen(n) ? "hide" : "show"} ${n.children.length} items">${isOpen(n) ? "" : `<b>${n.children.length}</b>`}<i class="chev"></i></span>`
        : "";
      nodes += `<a class="tn k-${esc(n.kind)}${state.node === n.key ? " sel" : ""}" href="${hrefOf(n)}" data-key="${esc(n.key)}" title="${esc(n.title || n.label)}"
          style="left:${x}px;top:${y - T.H / 2}px;width:${nw}px">
        <span class="tn-l">${esc(n.label)}</span>
        <span class="tn-m mono"><span class="tn-meta">${esc(nodeMeta(n))}</span><span class="tn-d">${dots}${sign}</span></span>
        ${toggle}
      </a>`;
      if (hasKids && n._d > 0) wires += `<circle class="term" cx="${x + nw}" cy="${y}" r="2.4"/>`;
    };
    visit(root);
    return `<div class="tree" style="width:${w}px;height:${h}px">
      <svg class="tree-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${wires}</svg>${nodes}</div>`;
  }

  function renderDecomp() {
    const box = $("#decomp");
    if (!box) return;
    const m = HM.mechs.find((x) => x.id === state.mech);
    $$(".fig .mod").forEach((a) => a.classList.toggle("sel", a.dataset.m === state.mech));
    $$(".fig .wire").forEach((w) => w.classList.toggle("on", w.dataset.m === state.mech));
    $("#fig1")?.classList.toggle("has-sel", !!m);
    if (!m) { box.innerHTML = ""; state.rendered = null; return; }
    const st = stats(m);
    if (state.rendered !== m.id) {
      box.innerHTML = `<section class="dec">
        <figure class="fig">
          <div class="fig-bar mono"><span>Mechanism ${esc(String(m.code).replace(/^M/, ""))}</span><span>${m.status ? `<span class="badge" data-status="${esc(m.status)}">${esc(STATUS[m.status] || m.status)}</span>` : ""}</span></div>
          <header class="dec-head">
            <h2>${esc(m.title)}</h2>
            ${m.question ? `<p class="question">${esc(m.question)}</p>` : ""}
          </header>
          <div class="tree-scroll" id="tree-wrap"></div>
          <div class="dec-foot">
            <details class="bg" open><summary class="mono">literature summary</summary><div class="summary">${(m.summary || []).map((p) => `<p>${rich(p)}</p>`).join("")}</div></details>
          </div>
          <div class="fig-bar mono"><span class="hint">select a node to inspect · › to unfold a branch</span>
            <span>${st.metrics} metrics · ${st.hyps} hypotheses · <i class="dot pos"></i>${st.pos} <i class="dot neg"></i>${st.neg} <i class="dot ns"></i>${st.ns}</span></div>
        </figure>
      </section>`;
      state.rendered = m.id;
    }
    $("#tree-wrap").innerHTML = treeHTML(m);
  }

  // ---------- inspector ----------
  function openInspector(n) {
    const ins = $("#inspector");
    if (!n) { ins.classList.remove("on"); ins.setAttribute("aria-hidden", "true"); document.body.classList.remove("ins-open"); return; }
    const trail = pathOf(n);
    $("#ins-crumb").innerHTML = trail.map((x) => `<a href="${hrefOf(x)}">${esc(x.kind === "mechanism" ? x.mech.code : x.label)}</a>`).join("<span>/</span>");
    const inherited = trail.slice(0, -1).reverse().find((x) => (x.hypotheses || []).length);
    const metric = n.metric;
    const kids = n.children || [];
    let html = `<div class="ins-kind mono">${esc(n.kind === "mechanism" ? n.mech.code + " · mechanism" : kindName(n.kind))}</div>
      <h2>${esc(n.title || n.label)}</h2>`;

    if (n.kind === "mechanism") {
      html += n.mech.question ? `<p class="question">${esc(n.mech.question)}</p>` : "";
      html += `<div class="sec">${(n.mech.summary || []).map((p) => `<p>${rich(p)}</p>`).join("")}</div>`;
    }
    if ((n.hypotheses || []).length) {
      html += `<div class="sec"><div class="block-label mono">Hypotheses</div>${n.hypotheses.map((h) =>
        chainHTML(h) + (h.evidence ? `<div class="ev"><i class="dot ${esc(h.dir)}"></i><p>${rich(h.evidence)}</p></div>` : `<p class="na mono small noev">no evidence recorded</p>`)).join("")}</div>`;
    } else if (inherited && n.kind !== "mechanism") {
      html += `<div class="sec inh"><div class="block-label mono">Hypothesis inherited from <a href="${hrefOf(inherited)}">${esc(inherited.label)}</a></div>${inherited.hypotheses.map((h) => chainHTML(h) + (h.evidence ? `<div class="ev"><i class="dot ${esc(h.dir)}"></i><p>${rich(h.evidence)}</p></div>` : "")).join("")}</div>`;
    }
    if (metric) {
      html += `<div class="sec"><div class="block-label mono">Metric construction</div>
        <dl class="kv">
          <dt>Metric</dt><dd class="strong">${esc(metric.name || n.label)}</dd>
          <dt>Measure</dt><dd>${metric.measure || '<span class="na">to be specified</span>'}</dd>
          <dt>Expected Directions</dt><dd>${metric.sign ? `<span class="sign ${signCls(metric.sign)}">${SIGN[metric.sign]}</span> on evacuation motivation` : '<span class="na">—</span>'}</dd>
          <dt>Data source</dt><dd>${srcChips(metric.source) || `<span class="na">${metric.measure === "No data" ? "no data" : "to be specified"}</span>`}</dd>
        </dl></div>`;
    }
    if (n.evidence) html += `<div class="sec"><div class="block-label mono">Evidence</div><div class="ev"><i class="dot"></i><p>${rich(n.evidence)}</p></div></div>`;
    if (n.table) html += `<div class="sec"><div class="block-label mono">Context</div><table class="tbl"><thead><tr>${n.table.columns.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${n.table.rows.map((r) => `<tr>${r.map((c) => `<td>${rich(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
    if (n.note) html += `<p class="note">${rich(n.note)}</p>`;
    if (kids.length) html += `<div class="sec"><div class="block-label mono">Contains</div><div class="kids">${kids.map((k) =>
      `<a class="kid" href="${hrefOf(k)}"><span>${esc(k.label)}</span><span class="mono">${esc(kindName(k.kind))}${k.metric && k.metric.sign ? ` <i class="nsign ${signCls(k.metric.sign)}">${SIGN[k.metric.sign]}</i>` : ""}</span></a>`).join("")}</div></div>`;

    $("#ins-body").innerHTML = html;
    $("#ins-body").scrollTop = 0;
    ins.classList.add("on"); ins.setAttribute("aria-hidden", "false");
    document.body.classList.add("ins-open");
  }

  // ---------- viewer ----------
  const NOEMBED = /(sciencedirect|elsevier|wiley|springer|tandfonline|sagepub|ascelibrary|ametsoc|aphapublications|ncbi\.nlm\.nih|proquest|books\.google|doi\.org|jstor)/i;

  function openViewer(kind, key) {
    const raw = kind === "ref" ? HM.refs[key] : HM.srcs[key];
    if (!raw) return;
    const item = Object.assign({}, raw, { label: kind === "ref" ? inText(raw) : raw.label, url: raw.url || (raw.doi ? `https://doi.org/${raw.doi}` : "") });
    const v = $("#viewer"), body = $("#viewer-body");
    const token = (viewerToken = {});
    $("#viewer-title").innerHTML = `${esc(kind === "ref" ? "reference" : "data source")} · <b>${esc(item.label)}</b>`;
    const open = $("#viewer-open");
    if (item.url) { open.href = item.url; open.hidden = false; } else open.hidden = true;
    const hasId = kind === "ref" && !!item.doi;
    const embed = item.url && (item.embed === true || (item.embed !== false && !NOEMBED.test(item.url)));
    const cited = kind === "ref" ? (HM.citedIn[key] || []) : sourceUses(key);
    const uses = cited.length ? `<div class="block-label mono vlabel">Used in this framework</div>
      <ul class="uses">${cited.map((c) => { const n = HM.nodes[c.key]; return `<li><a href="${hrefOf(n)}" data-close>${esc(n.kind === "mechanism" ? n.mech.code + " · literature summary" : pathOf(n).map((x) => x.kind === "mechanism" ? x.mech.code : x.label).join(" / "))}</a>${c.text ? `<p>${rich(c.text)}</p>` : ""}</li>`; }).join("")}</ul>` : "";
    const head = `<div class="kicker mono">${esc(domain(item.url) || "no link yet")}</div>
      <h2>${esc(item.label)}</h2>
      <p class="apa">${apaHTML(raw)}</p>${item.flag ? `<p class="flag">${esc(item.flag)}</p>` : ""}${item.note ? `<p class="note">${esc(item.note)}</p>` : ""}
      ${item.url ? `<a class="btn mono" href="${esc(item.url)}" target="_blank" rel="noopener">open original ↗</a>` : ""}`;
    const record = hasId ? `<div class="record" id="record"><p class="mono note">loading abstract…</p></div>` : "";
    const why = !embed && item.url ? `<p class="note why">${hasId ? "Publisher pages open in their own browser tab; they cannot be shown inside another website. The abstract is loaded here instead." : "This page opens in its own browser tab; the site does not allow previews inside other websites."}</p>` : "";
    const card = `<div class="vcard">${head}${why}${record}${uses}</div>`;
    body.innerHTML = embed
      ? `<div class="vsplit"><div class="frame"><p class="frame-hint mono">preview · if this area shows “refused to connect”, the site blocks previews — use “open in new tab”.</p>
          <iframe src="${esc(item.url)}" title="${esc(item.label)}" referrerpolicy="no-referrer"></iframe></div>${card}</div>`
      : card;
    v.classList.add("on"); v.setAttribute("aria-hidden", "false");
    if (hasId) loadRecord(key, item).then((rec) => {
      if (token !== viewerToken || !$("#record")) return;
      $("#record").innerHTML = rec ? recordHTML(rec) : `<p class="note">The abstract could not be loaded right now. Use “open original”.</p>`;
    });
  }
  let viewerToken = null;

  // Live citation records from public APIs that allow cross-origin requests.
  const recordCache = new Map();
  async function getJSON(url, ms = 9000) {
    const c = new AbortController(), t = setTimeout(() => c.abort(), ms);
    try { const r = await fetch(url, { signal: c.signal }); if (!r.ok) throw new Error(r.status); return await r.json(); }
    finally { clearTimeout(t); }
  }
  const plain = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").replace(/^\s*abstract\s*/i, "").trim();
  function fromCrossref(m) {
    return {
      title: (m.title || [])[0], year: ((m.issued || {})["date-parts"] || [[]])[0][0],
      authors: (m.author || []).map((a) => [a.given, a.family].filter(Boolean).join(" ") || a.name).filter(Boolean),
      venue: (m["container-title"] || [])[0] || m.publisher, doi: m.DOI, abstract: plain(m.abstract), via: "Crossref"
    };
  }
  async function loadRecord(key, ref) {
    if (recordCache.has(key)) return recordCache.get(key);
    let rec = null;
    try {
      if (ref.doi) rec = fromCrossref((await getJSON(`https://api.crossref.org/works/${encodeURIComponent(ref.doi)}`)).message);
    } catch (e) { rec = null; }
    if (rec && rec.doi && !rec.abstract) {
      try {
        const s2 = await getJSON(`https://api.semanticscholar.org/graph/v1/paper/DOI:${encodeURIComponent(rec.doi)}?fields=abstract,tldr,openAccessPdf`);
        if (s2.abstract) { rec.abstract = plain(s2.abstract); rec.absVia = "Semantic Scholar"; }
        else if (s2.tldr && s2.tldr.text) { rec.tldr = s2.tldr.text; rec.absVia = "Semantic Scholar"; }
        if (s2.openAccessPdf && s2.openAccessPdf.url) rec.pdf = s2.openAccessPdf.url;
      } catch (e) { /* abstract stays empty */ }
    }
    if (rec) recordCache.set(key, rec);
    return rec;
  }
  function recordHTML(r) {
    const au = r.authors || [];
    const authors = au.length > 6 ? au.slice(0, 6).join(", ") + ", et al." : au.join(", ");
    void authors;
    return `${r.abstract ? `<div class="block-label mono vlabel">Abstract</div><p class="rec-abs">${esc(r.abstract)}</p>`
        : r.tldr ? `<div class="block-label mono vlabel">Summary (TL;DR)</div><p class="rec-abs">${esc(r.tldr)}</p>`
        : `<p class="note">No abstract is available from public metadata for this work.</p>`}
      ${r.pdf ? `<a class="btn mono" href="${esc(r.pdf)}" target="_blank" rel="noopener">open-access PDF ↗</a>` : ""}
      <p class="mono note small">record: ${esc(r.via)}${r.absVia ? ` · abstract: ${esc(r.absVia)}` : ""}</p>`;
  }
  function closeViewer() { const v = $("#viewer"); v.classList.remove("on"); v.setAttribute("aria-hidden", "true"); $("#viewer-body").innerHTML = ""; }

  function sourceUses(k) {
    return Object.values(HM.nodes).filter((n) => n.metric && (n.metric.source || []).includes(k)).map((n) => ({ key: n.key, text: "" }));
  }

  // ---------- page: references ----------
  function viewReferences() {
    const used = (k) => (HM.citedIn[k] || []).filter((c, i, a) => a.findIndex((x) => x.key === c.key) === i)
      .map((c) => { const n = HM.nodes[c.key]; return `<a class="chip" href="${hrefOf(n)}">${esc(n.kind === "mechanism" ? n.mech.code : n.mech.code + " / " + n.label)}</a>`; }).join("");
    const refs = Object.entries(HM.refs).sort((a, b) => sortKey(a[1]).localeCompare(sortKey(b[1]))).map(([k, r]) => `<li${r.flag ? ' class="has-flag"' : ""}>
        <p class="apa">${apaHTML(r)}</p>
        ${r.flag ? `<p class="flag">${esc(r.flag)}</p>` : ""}
        <div class="ref-cited mono"><a class="cite" data-ref="${esc(k)}" href="${esc(r.doi ? "https://doi.org/" + r.doi : r.url || "#")}">${esc(inText(r))}</a><span class="sep">cited in</span>${used(k) || '<span class="na">—</span>'}</div></li>`).join("");
    const srcs = Object.entries(HM.srcs).map(([k, s]) => `<li>
        <p class="apa">${apaHTML(s)}</p>${s.note ? `<p class="ref-note">${esc(s.note)}</p>` : ""}
        <div class="ref-cited mono"><a class="cite" data-src="${esc(k)}" href="${esc(s.url || "#")}">${esc(s.label)}</a><span class="sep">used in</span>${sourceUses(k).map((c) => { const n = HM.nodes[c.key]; return `<a class="chip" href="${hrefOf(n)}">${esc(n.mech.code + " / " + n.label)}</a>`; }).join("") || '<span class="na">—</span>'}</div></li>`).join("");
    return `<header class="hero"><div class="kicker mono">Index</div><h1>References</h1>
        <p class="lead">Literature and data sources cited in the framework, in APA 7th edition format. Select an in-text label to preview the work; chips link to the nodes that use it.</p></header>
      <section><div class="sec-head"><h2>Literature</h2><span class="mono note">${Object.keys(HM.refs).length} works</span></div><ol class="refs">${refs}</ol></section>
      <section><div class="sec-head"><h2>Data sources</h2><span class="mono note">${Object.keys(HM.srcs).length} sources</span></div><ol class="refs">${srcs}</ol></section>`;
  }

  // ---------- page: metrics ----------
  function metricRows() {
    return HM.mechs.flatMap((m) => Object.values(HM.nodes)
      .filter((n) => n.mech === m && n.metric)
      .sort((a, b) => a.path.split(".").map(Number).reduce((r, v, i) => r || v - (b.path.split(".").map(Number)[i] ?? -1), 0) || a.path.length - b.path.length)
      .map((n) => ({ m, n, x: n.metric })));
  }
  function viewMetrics() {
    const rows = metricRows();
    const withSrc = rows.filter((r) => (r.x.source || []).length).length;
    const noData = rows.filter((r) => !(r.x.source || []).length && r.x.measure === "No data").length;
    const srcKeys = Object.keys(HM.srcs).filter((k) => rows.some((r) => (r.x.source || []).includes(k)));
    const dirCell = (sg) => sg ? `<span class="sign ${signCls(sg)}">${SIGN[sg]}</span>` : '<span class="na">—</span>';
    const sections = HM.mechs.map((m) => {
      const mr = rows.filter((r) => r.m === m);
      if (!mr.length) return `<section class="msec empty"><div class="sec-head"><h2><span class="mono mcode">Mechanism ${esc(String(m.code).replace(/^M/, ""))}</span>${esc(m.title)}</h2><span class="mono note">no metrics specified yet</span></div></section>`;
      const body = mr.map(({ n, x }) => {
        const trail = pathOf(n).slice(1, -1).map((a) => esc(a.label)).join('<span class="tsep">›</span>');
        const text = [m.title, pathOf(n).map((a) => a.label).join(" "), x.name, stripTags(x.measure || ""), (x.source || []).map((k) => (HM.srcs[k] || {}).label || k).join(" ")].join(" ").toLowerCase();
        return `<tr data-text="${esc(text)}" data-src="${esc((x.source || []).join(" ") || "none")}">
          <td class="mpath">${trail || '<span class="na">—</span>'}</td>
          <td class="mname">${n.metricsOnly
            ? `<button class="mx" data-x="${esc(n.key)}" title="show formula and definitions">${esc(x.name || n.label)}<i class="chev"></i></button>`
            : `<a href="${hrefOf(n)}" title="open in overview">${esc(x.name || n.label)}</a>`}</td>
          <td>${x.measure || '<span class="na">to be specified</span>'}</td>
          <td>${srcChips(x.source) || `<span class="na">${x.measure === "No data" ? "no data" : "to be specified"}</span>`}</td>
          <td class="dir">${dirCell(x.sign)}</td>
        </tr>${n.metricsOnly ? `<tr class="mdetail" data-for="${esc(n.key)}" hidden><td></td><td colspan="4">
          ${x.formula ? `<div class="formula">${x.formula}</div>` : ""}
          ${(x.definitions || []).length ? `<ul class="defs">${x.definitions.map((d) => `<li>${d}</li>`).join("")}</ul>` : ""}
        </td></tr>` : ""}`;
      }).join("");
      return `<section class="msec" data-m="${m.id}">
        <div class="sec-head"><h2><span class="mono mcode">Mechanism ${esc(String(m.code).replace(/^M/, ""))}</span>${esc(m.title)}</h2><span class="mono note mcount">${mr.length} metrics</span></div>
        <div class="tbl-wrap"><table class="tbl mtbl"><thead><tr><th>Dimension / group</th><th>Metric</th><th>Measure</th><th>Data source</th><th>Expected Directions</th></tr></thead><tbody>${body}</tbody></table></div>
      </section>`;
    }).join("");
    return `<header class="hero"><div class="kicker mono">Index</div><h1>Metrics</h1>
        <p class="lead">How each metric in the framework is measured: its construction, data source and expected direction on evacuation motivation. Select a metric to open it in the overview.</p></header>
      <div class="readout mono">
        <div><b>${rows.length}</b><span>metrics</span></div>
        <div><b>${withSrc}</b><span>with data source</span></div>
        <div><b>${rows.length - withSrc - noData}</b><span>source to be specified</span></div>
        <div><b>${noData}</b><span>no data</span></div>
        <div><b>${srcKeys.length}</b><span>data sources</span></div>
      </div>
      <div class="mtools">
        <input id="mfilter" class="filter mono" placeholder="search metrics, measures, sources" aria-label="Search metrics">
        <div class="srcfilter mono" id="srcfilter"><button class="on" data-f="">all</button>${srcKeys.map((k) => `<button data-f="${esc(k)}">${esc(HM.srcs[k].label)}</button>`).join("")}<button data-f="none">no source yet</button></div>
      </div>
      ${sections}
      <p class="note mono" id="mempty" hidden>No metrics match.</p>`;
  }
  function bindMetrics() {
    let q = "", f = "";
    const apply = () => {
      let total = 0;
      $$(".msec.empty").forEach((sec) => (sec.hidden = !!(q || f)));
      $$(".msec:not(.empty)").forEach((sec) => {
        let n = 0;
        $$("tbody tr:not(.mdetail)", sec).forEach((tr) => {
          const hit = (!q || tr.dataset.text.includes(q)) && (!f || tr.dataset.src.split(" ").includes(f));
          tr.hidden = !hit; n += hit;
          const d = tr.nextElementSibling;
          if (d && d.classList.contains("mdetail")) d.hidden = !hit || !tr.classList.contains("open");
        });
        sec.hidden = !n; total += n;
      });
      $("#mempty").hidden = total > 0;
    };
    $$(".mx").forEach((b) => (b.onclick = () => {
      const tr = b.closest("tr"), d = tr.nextElementSibling;
      const open = !tr.classList.contains("open");
      tr.classList.toggle("open", open); d.hidden = !open;
    }));
    $("#mfilter").oninput = (e) => { q = e.target.value.trim().toLowerCase(); apply(); };
    $$("#srcfilter button").forEach((b) => (b.onclick = () => {
      f = b.dataset.f; $$("#srcfilter button").forEach((x) => x.classList.toggle("on", x === b)); apply();
    }));
  }

  // ---------- router ----------
  function route() {
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const app = $("#app");
    closeViewer();
    document.body.classList.toggle("map-mode", parts[0] === "evac");
    if (parts[0] !== "evac" && window.HMEvac) window.HMEvac.unmount();
    if (parts[0] === "evac") {
      if (state.page !== "evac") { state.page = "evac"; state.rendered = null; app.innerHTML = ""; }
      openInspector(null);
      const go = () => window.HMEvac.show(app, parts[1]);
      if (window.HMEvac) go();
      else { const sc = document.createElement("script"); sc.src = "assets/evac.js"; sc.onload = go; document.body.appendChild(sc); }
    } else if (parts[0] === "references") {
      state.page = "references"; state.rendered = null;
      app.innerHTML = viewReferences(); openInspector(null); window.scrollTo(0, 0);
    } else if (parts[0] === "metrics") {
      state.page = "metrics"; state.rendered = null;
      app.innerHTML = viewMetrics(); bindMetrics(); openInspector(null); window.scrollTo(0, 0);
    } else {
      const mech = HM.mechs.find((m) => m.id === parts[0]) ? parts[0] : null;
      const nodeKey = mech && parts[1] ? `${mech}/${parts[1]}` : mech;
      if (state.page !== "home") { app.innerHTML = viewHome(); state.page = "home"; state.rendered = null; bindFigure(); }
      const changedMech = state.mech !== mech;
      state.mech = mech;
      state.node = nodeKey && HM.nodes[nodeKey] ? nodeKey : null;
      if (state.node) pathOf(HM.nodes[state.node]).slice(0, -1).forEach((x) => state.open.set(x.key, true));
      renderDecomp();
      openInspector(state.node && parts[1] ? HM.nodes[state.node] : null);
      if (changedMech && mech) requestAnimationFrame(() => $("#decomp").scrollIntoView({ behavior: "smooth", block: "start" }));
      if (!mech) window.scrollTo(0, 0);
    }
    $$("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.r === (state.page === "home" ? "home" : state.page)));
    document.title = (state.mech && state.page === "home" ? HM.mechs.find((m) => m.id === state.mech).title + " · " : state.page === "references" ? "References · " : state.page === "metrics" ? "Metrics · " : state.page === "evac" ? "Evacuation orders · " : "") + "Evacuation Motivation Framework";
  }

  function bindFigure() {
    $$(".fig .mod").forEach((a) => {
      const w = $(`.fig .wire[data-m="${a.dataset.m}"]`);
      a.addEventListener("mouseenter", () => { w && w.classList.add("hov"); $("#fig1").classList.add("hovering"); });
      a.addEventListener("mouseleave", () => { w && w.classList.remove("hov"); $("#fig1").classList.remove("hovering"); });
    });
  }

  function bindGlobal() {
    document.addEventListener("click", (e) => {
      const tg = e.target.closest("[data-toggle]");
      if (tg) {
        e.preventDefault(); e.stopPropagation();
        const n = HM.nodes[tg.dataset.toggle];
        state.open.set(n.key, !isOpen(n));
        renderDecomp();
        return;
      }
      const r = e.target.closest("a[data-ref], a[data-src]");
      if (r && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault();
        openViewer(r.dataset.ref ? "ref" : "src", r.dataset.ref || r.dataset.src);
        return;
      }
      if (e.target.closest("[data-close]")) closeViewer();
      if (e.target.id === "viewer") closeViewer();
    });
    $("#viewer-close").onclick = closeViewer;
    $("#ins-close").onclick = () => { if (state.mech) location.hash = `#/${state.mech}`; else openInspector(null); };
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if ($("#viewer").classList.contains("on")) closeViewer();
      else if ($("#inspector").classList.contains("on")) $("#ins-close").click();
    });
    window.addEventListener("hashchange", route);
  }
})();
