(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const STATUS = { released: "Released", "in-progress": "In progress", upcoming: "Upcoming" };
  const setLink = (el, url) => { if (url) el.href = url; else el.hidden = true; };

  const featured = COURSES[0] || {};

  // Header + hero (featured = first course)
  $("nav-name").textContent = PROFILE.name;
  $("nav-course").textContent = featured.code || "";
  setLink($("nav-log"), featured.log);
  $("hero-badge").textContent = [featured.code, featured.term].filter(Boolean).join(" · ") || "Portfolio";
  $("hero-title").textContent = featured.code ? `${featured.code}: ${featured.title}` : PROFILE.name;
  setLink($("hero-log"), featured.log);
  setLink($("hero-repo"), featured.repo || PROFILE.github);
  $("year").textContent = new Date().getFullYear();

  // Contact (the traveler doubles as the NPC portrait)
  $("npc-name").textContent = PROFILE.name;
  $("npc-tag").textContent = PROFILE.tagline;
  const contactLinks = [
    ["GitHub", PROFILE.github],
    ["Email", PROFILE.email && "mailto:" + PROFILE.email],
    ["LinkedIn", PROFILE.linkedin]
  ].filter(([, u]) => u)
    .map(([l, u]) => `<a class="btn small" href="${esc(u)}" target="_blank" rel="noopener">${l}</a>`).join("");
  $("links").innerHTML = contactLinks;

  const tags = (t) => (t && t.length)
    ? `<div class="tags">${t.map((x) => `<span class="tag mono">${esc(x)}</span>`).join("")}</div>` : "";

  const links = (p) => {
    const l = [
      p.repo && `<a class="btn small primary" href="${esc(p.repo)}" target="_blank" rel="noopener">View repository</a>`,
      p.demo && `<a class="btn small" href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo</a>`
    ].filter(Boolean).join("");
    return l ? `<div class="card-links">${l}</div>` : "";
  };

  const slideshow = (imgs, id) => (imgs && imgs.length) ? `
    <div class="slideshow" data-ss="${id}" role="group" aria-roledescription="carousel" aria-label="Screenshots">
      <div class="ss-track">${imgs.map((im, n) => `
        <figure class="ss-slide" ${n ? "hidden" : ""}>
          <img src="${esc(im.src)}" alt="${esc(im.alt || "")}" loading="${n ? "lazy" : "eager"}">
          ${im.caption ? `<figcaption>${esc(im.caption)}</figcaption>` : ""}
        </figure>`).join("")}</div>
      ${imgs.length > 1 ? `
      <button class="ss-btn prev" type="button" aria-label="Previous image">&#8249;</button>
      <button class="ss-btn next" type="button" aria-label="Next image">&#8250;</button>
      <div class="ss-dots">${imgs.map((_, n) => `<button type="button" class="ss-dot" aria-label="Show image ${n + 1}" aria-current="${n ? "false" : "true"}"></button>`).join("")}</div>` : ""}
    </div>` : "";

  function artifactCard(a, i) {
    const status = STATUS[a.status] ? a.status : "upcoming";
    const upcoming = status === "upcoming";
    return `
      <article class="card ${upcoming ? "pending" : ""}">
        <div class="card-top">
          <span class="label mono">Artifact ${pad(i + 1)}</span>
          <span class="status ${status}">${STATUS[status]}</span>
        </div>
        ${upcoming ? "" : slideshow(a.images, i)}
        <h3>${esc(a.title || "Future artifact")}</h3>
        <p>${esc(a.summary || "Project overview and deliverables will be posted when this artifact is released.")}</p>
        ${tags(a.tags)}
        ${upcoming ? "" : links(a)}
        <div class="card-foot mono"><span>Week ${a.week ?? "--"}</span></div>
      </article>`;
  }

  // The visitor's traveler: a pixel sprite drawn from this grid (facing right).
  // H hair, S skin, E eyes, B shirt, P backpack, L legs, K shoes.
  const SPRITE = (() => {
    // H hair (h: a lighter curl), with a little afro on top.
    const art = [
      "..HHhHHH..", ".HHHHHHhH.", "HhHHHHHHHH", "HHHHHhHHHH", "HHHSSSSSSH",
      "HHSSSESSEH", ".HSSSSSSS.", "..SSSSSS..", ".PBBBBBB..", "PPBBBBBBS.",
      "PPBBBBBBS.", "PPBBBBBB..", "..BBBBBB..", "..LL..LL..", "..LL..LL..", "..LL..LL..", ".KKK.KKK.."
    ];
    const col = { H: "#1c130e", h: "#3d2a1e", S: "#9a6240", E: "#120c0a", B: "#315efb", P: "#c0563b", L: "#2f3b5c", K: "#1d1d22" };
    const part = { body: "", a: "", b: "" };
    art.forEach((row, y) => {
      for (let x = 0; x < row.length;) {
        const c = row[x];
        let w = 1;
        while (row[x + w] === c) w++;
        if (col[c]) part[y >= 13 ? (x < 5 ? "a" : "b") : "body"] +=
          `<rect x="${x}" y="${y}" width="${w}" height="1" fill="${col[c]}"/>`;
        x += w;
      }
    });
    return `<svg viewBox="0 -1 10 19" shape-rendering="crispEdges">
      <ellipse cx="5" cy="17.2" rx="3.8" ry=".9" fill="rgba(0,0,0,.28)"/>
      <g class="leg-a">${part.a}</g><g class="leg-b">${part.b}</g><g class="sp-body">${part.body}</g></svg>`;
  })();

  $("npc-portrait").innerHTML = SPRITE;

  // Pixel clouds drifting across the sky band at the top of the map
  const CLOUD = ["....XXXX........", "..XXXXXXXX.XXX..", ".XXXXXXXXXXXXXX.", "XXXXXXXXXXXXXXXX", ".XXXXXXXXXXXXXX."];
  const cloud = `<svg viewBox="0 0 16 5" shape-rendering="crispEdges">${CLOUD.map((r, y) =>
    `<rect x="${r.indexOf("X")}" y="${y}" width="${r.lastIndexOf("X") - r.indexOf("X") + 1}" height="1"/>`).join("")}</svg>`;
  document.querySelector(".sky-fx").innerHTML = [1, 2, 3].map((n) => `<div class="cloud c${n}">${cloud}</div>`).join("");
  document.querySelector(".hero-char").innerHTML = SPRITE;
  // The traveler is also the logo in the nav and the browser-tab icon.
  // A headshot crop of the traveler (afro, face and shoulders) for the logo and tab icon.
  const HEADSHOT = SPRITE.replace('viewBox="0 -1 10 19"', 'viewBox="-.5 -.5 11 10.5"').replace(/<ellipse[^>]*\/>/, "");
  document.querySelector(".logo-mark").innerHTML = HEADSHOT;
  const icon = document.querySelector('link[rel="icon"]');
  if (icon) icon.href = "data:image/svg+xml," + encodeURIComponent(HEADSHOT
    .replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ')
    .replace('shape-rendering="crispEdges">', 'shape-rendering="crispEdges"><rect x="-.5" y="-.5" width="11" height="10.5" rx="1.5" fill="#7cc8f5"/>'));

  const progress = (arts) => {
    const done = arts.filter((a) => a.status === "released").length;
    const pct = arts.length ? Math.round(done / arts.length * 100) : 0;
    return `<div class="xp"><span class="counter mono">${done} / ${arts.length} released</span>` +
      `<span class="xp-bar" aria-hidden="true"><i style="width:${pct}%"></i></span></div>`;
  };

  // Course sections. The featured course is the map at the top of the page;
  // its section here is the quest log. Any other courses stay as card grids.
  const featuredArts = featured.artifacts || [];
  $("hud").innerHTML = progress(featuredArts) +
    '<p class="map-hint" id="map-hint"></p>';
  $("courses").innerHTML = COURSES.map((c, ci) => {
    const arts = c.artifacts || [];
    const isMap = ci === 0 && arts.length > 0;
    const head = `
        <div class="section-head">
          <div>
            <h2>${isMap ? "Quest log" : esc(c.code) + " Artifacts"}</h2>
            <p class="sub">${esc(c.code)}: ${esc(c.title)}${c.term ? " · " + esc(c.term) : ""}</p>
            ${isMap && c.description ? `<p class="sub">${esc(c.description)}</p>` : ""}
          </div>
          ${progress(arts)}
        </div>`;
    const id = isMap ? "quests" : esc((c.code || "").replace(/\s+/g, "-").toLowerCase());
    if (!isMap) return `<section class="course-block" id="${id}">${head}<div class="grid">${arts.map(artifactCard).join("")}</div></section>`;
    return `
      <section class="course-block" id="${id}">${head}
        <ol class="quest-log">${arts.map((a, i) => {
          const st = STATUS[a.status] ? a.status : "upcoming";
          return `<li><button type="button" class="quest ${st}" data-i="${i}"><span class="pin">${pad(i + 1)}</span>` +
            `<span class="q-title">${esc(a.title)}</span><span class="status ${st}">${STATUS[st]}</span></button></li>`;
        }).join("")}</ol>
      </section>`;
  }).join("");

  // About me: shown in the side panel when no island is selected (on wide screens),
  // or as a section under the map on smaller ones.
  const aboutHTML = () => {
    const arts = featured.artifacts || [];
    const done = arts.filter((a) => a.status === "released").length;
    return `<div class="about-me">
      <div class="about-top"><div class="about-portrait" aria-hidden="true">${SPRITE}</div>
        <div><h3>${esc(PROFILE.name)}</h3><p class="about-tag">${esc(PROFILE.tagline)}</p></div></div>
      ${PROFILE.about ? `<p class="about-text">${esc(PROFILE.about)}</p>` : ""}
      <ul class="about-facts">
        ${featured.code ? `<li><b>${esc(featured.code)}</b><span>${esc(featured.term || "")}</span></li>` : ""}
        <li><b>${done} / ${arts.length}</b><span>artifacts released</span></li>
        <li><b>${Math.max(0, arts.length - done)}</b><span>still to explore</span></li>
      </ul>
      <p class="about-hint">Click an island on the map to visit an artifact.</p>
      <div class="links">${contactLinks}${featured.log ? `<a class="btn small" href="${esc(featured.log)}" target="_blank" rel="noopener">Prompt log</a>` : ""}</div>
    </div>`;
  };
  $("about").innerHTML = aboutHTML();

  // Side panel: About me by default, or an artifact's card when its landmark is clicked
  if (featured.artifacts && featured.artifacts.length) {
    const side = document.createElement("aside");
    side.className = "side";
    side.id = "side";
    side.setAttribute("role", "dialog");
    side.setAttribute("aria-labelledby", "side-where");
    side.innerHTML = `
      <div class="side-head">
        <p class="side-where" id="side-where"></p>
        <button type="button" class="side-close" id="side-close" aria-label="Close card">&times;</button>
      </div>
      <div class="side-body"><div class="about-card">${aboutHTML()}</div>${featured.artifacts.map((a, i) => `<div class="loc-card" hidden>${artifactCard(a, i)}</div>`).join("")}</div>
      <div class="side-foot">
        <button type="button" class="btn small" id="side-prev">&#9664; Previous stop</button>
        <button type="button" class="btn small" id="side-next">Next stop &#9654;</button>
      </div>`;
    document.body.appendChild(side);
  }

  // Other projects (only shown when there are some)
  if (PROJECTS.length) {
    $("other").innerHTML = `
      <section>
        <div class="section-head"><div><h2>Other Projects</h2><p class="sub">Personal and side projects.</p></div></div>
        <div class="grid">${PROJECTS.map((p) => `
          <article class="card">
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.summary)}</p>
            ${tags(p.tags)}
            ${links(p)}
          </article>`).join("")}</div>
      </section>`;
  }

  // Enlarged image view (native <dialog>: Esc and the close button dismiss it).
  // Arrows / left-right keys step through the same list without closing it.
  const box = document.createElement("dialog");
  box.className = "lightbox";
  box.setAttribute("aria-label", "Enlarged image");
  box.innerHTML = '<button type="button" class="lb-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="lb-nav lb-prev" aria-label="Previous image">&#8249;</button>' +
    '<img alt=""><button type="button" class="lb-nav lb-next" aria-label="Next image">&#8250;</button>' +
    '<p class="lb-cap"></p><p class="lb-count"></p>';
  document.body.appendChild(box);
  let lb = { items: [], i: 0, onChange: null };
  const lbShow = (n) => {
    lb.i = Math.max(0, Math.min(n, lb.items.length - 1));
    const it = lb.items[lb.i];
    const img = box.querySelector("img");
    img.src = it.src; img.alt = it.alt || "";
    box.querySelector(".lb-cap").textContent = it.caption || "";
    const many = lb.items.length > 1;
    box.querySelector(".lb-count").textContent = many ? `${lb.i + 1} / ${lb.items.length}` : "";
    box.querySelectorAll(".lb-nav").forEach((b) => { b.hidden = !many; });
    box.querySelector(".lb-prev").disabled = lb.i === 0;
    box.querySelector(".lb-next").disabled = lb.i === lb.items.length - 1;
    if (lb.onChange) lb.onChange(lb.i);
  };
  const openLightbox = (items, i, onChange) => {
    lb = { items, i, onChange };
    lbShow(i);
    if (!box.open) box.showModal();
  };
  box.addEventListener("click", (e) => {
    if (e.target === box || e.target.classList.contains("lb-close")) box.close();
    else if (e.target.classList.contains("lb-prev")) lbShow(lb.i - 1);
    else if (e.target.classList.contains("lb-next")) lbShow(lb.i + 1);
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); lbShow(lb.i - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); lbShow(lb.i + 1); }
  });

  // Slideshows (no autoplay; arrows, dots and left/right keys)
  document.querySelectorAll(".slideshow").forEach((ss) => {
    const slides = [...ss.querySelectorAll(".ss-slide")];
    const dots = [...ss.querySelectorAll(".ss-dot")];
    let cur = 0;
    const show = (n) => {
      cur = Math.max(0, Math.min(n, slides.length - 1));
      slides.forEach((s, k) => { s.hidden = k !== cur; });
      const pv = ss.querySelector(".prev"), nx = ss.querySelector(".next");
      if (pv) pv.disabled = cur === 0;
      if (nx) nx.disabled = cur === slides.length - 1;
      dots.forEach((d, k) => d.setAttribute("aria-current", k === cur ? "true" : "false"));
    };
    ss.querySelector(".prev")?.addEventListener("click", () => show(cur - 1));
    ss.querySelector(".next")?.addEventListener("click", () => show(cur + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
    const items = slides.map((s) => ({
      src: s.querySelector("img").getAttribute("src"),
      alt: s.querySelector("img").alt,
      caption: s.querySelector("figcaption")?.textContent
    }));
    slides.forEach((s, k) => {
      const img = s.querySelector("img");
      img.title = "Click to enlarge";
      img.addEventListener("click", () => openLightbox(items, k, show));
    });
    show(0);
    ss.tabIndex = 0;
    ss.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  });

  // Quest map: each artifact is a stop on a trail, and the traveler walks
  // along the trail to the point nearest the visitor's cursor (or tap).
  const world = document.querySelector(".world");
  if (featuredArts.length) initMap(world, featuredArts);

  function initMap(world, arts) {
    const map = world.querySelector(".map"), inner = map.querySelector(".world-inner"), svg = map.querySelector("svg");
    const locsEl = map.querySelector(".map-locs"), hero = map.querySelector(".hero-char");
    const side = $("side"), cards = [...side.querySelectorAll(".loc-card")];
    const N = arts.length, SPEED = 300;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const canHover = matchMedia("(hover: hover)").matches;
    // World size (W x H) and the zoom used to fit it beside an open card.
    let W = 0, H = 0, zoom = 1, shiftY = 0, narrow = null;
    // The hub island (stop 0) sits in the middle; every other stop is an island
    // joined to it by a bridge. spokes[k] runs from the hub centre to stop k.
    let hub, stops, spokes, isles;
    // The traveler is d pixels out along spoke s (d = 0 is the hub).
    let pos = { s: 1, d: 0 }, target = { s: 1, d: 0 };
    let active = 0, raf = 0, last = 0, shown = -1, opener = null;
    // Launch state: the stop waiting for the traveler to arrive, and whether we're in space.
    let launchAt = -1, inSpace = false, launchRun = 0;

    const f = (n) => Math.round(n * 10) / 10;
    const rng = (a) => () => {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // One biome per island (cycled if there are more). Colours live in styles.css.
    const BIOMES = [
      { id: "meadow", name: "Home Island", kinds: ["tree", "tree", "tree", "pine", "bush", "flowers", "flowers", "rock"] },
      { id: "autumn", name: "Autumn Isle", kinds: ["tree", "tree", "tree", "tree", "bush", "mushroom", "flowers", "rock"] },
      { id: "desert", name: "Desert Isle", kinds: ["cactus", "cactus", "dune", "dune", "rock", "rock"] },
      { id: "snow", name: "Snow Isle", kinds: ["snowpine", "snowpine", "snowpine", "drift", "rock"] },
      { id: "volcano", name: "Volcano Isle", kinds: ["deadtree", "deadtree", "rock", "rock", "crack", "crack"] },
      // Only used when an artifact asks for it with biome: "space" in projects.js.
      // Clicking its landmark launches the rocket to the moon.
      { id: "space", name: "Launch Isle", kinds: ["dish", "dish", "tank", "astronaut", "astronaut", "flag", "rock"], special: true }
    ];
    const LAND = BIOMES.filter((b) => !b.special);
    const isLaunch = (i) => biomeOf(i).id === "space";
    const biomeOf = (i) => BIOMES.find((b) => b.id === arts[i].biome) ||
      (i === 0 ? LAND[0] : LAND[1 + (i - 1) % (LAND.length - 1)]);
    const locked = (i) => arts[i].status === "upcoming";

    // Landmarks, one per stop (cycled if there are more stops). (x, y) is the base.
    const LANDMARKS = [
      (x, y) => `<rect class="wl" x="${x - 24}" y="${y - 34}" width="48" height="34"/>
        <path class="rf" d="M${x - 31} ${y - 32}L${x} ${y - 60}L${x + 31} ${y - 32}Z"/>
        <rect class="dr" x="${x - 6}" y="${y - 18}" width="12" height="18"/>
        <rect class="wn" x="${x + 10}" y="${y - 27}" width="9" height="9"/>`,
      (x, y) => `<rect class="rk" x="${x - 32}" y="${y - 8}" width="64" height="8"/>
        <rect class="wl" x="${x - 25}" y="${y - 38}" width="6" height="30"/>
        <rect class="wl" x="${x + 19}" y="${y - 38}" width="6" height="30"/>
        <path class="ac" d="M${x - 33} ${y - 36}Q${x} ${y - 78} ${x + 33} ${y - 36}Z"/>
        <path class="nt" d="M${x + 3} ${y - 14}V${y - 30}L${x + 11} ${y - 27}"/>
        <circle class="nh" cx="${x}" cy="${y - 14}" r="3.5"/>`,
      (x, y) => `<path class="nt" d="M${x} ${y - 76}V${y - 92}"/>
        <circle class="wn" cx="${x}" cy="${y - 94}" r="4"/>
        <rect class="rk" x="${x - 15}" y="${y - 66}" width="30" height="66"/>
        <rect class="rk" x="${x - 19}" y="${y - 70}" width="38" height="8"/>
        <rect class="rk" x="${x - 19}" y="${y - 77}" width="8" height="7"/>
        <rect class="rk" x="${x - 4}" y="${y - 77}" width="8" height="7"/>
        <rect class="rk" x="${x + 11}" y="${y - 77}" width="8" height="7"/>
        <rect class="wn" x="${x - 4}" y="${y - 52}" width="8" height="12"/>
        <rect class="dr" x="${x - 6}" y="${y - 16}" width="12" height="16"/>`,
      (x, y) => `<rect class="rk" x="${x + 12}" y="${y - 58}" width="8" height="18"/>
        <rect class="wl" x="${x - 26}" y="${y - 32}" width="52" height="32"/>
        <path class="rf2" d="M${x - 32} ${y - 30}L${x} ${y - 56}L${x + 32} ${y - 30}Z"/>
        <rect class="dr" x="${x - 6}" y="${y - 18}" width="12" height="18"/>
        <rect class="wn" x="${x - 20}" y="${y - 24}" width="9" height="9"/>
        <rect class="wn" x="${x + 11}" y="${y - 24}" width="9" height="9"/>
        <circle class="f1" cx="${x - 30}" cy="${y - 2}" r="3"/><circle class="f2" cx="${x + 30}" cy="${y - 2}" r="3"/>`,
      (x, y) => `<rect class="rk" x="${x - 26}" y="${y - 6}" width="52" height="6"/>
        <g class="rocket-body"><path class="fn" d="M${x - 11} ${y - 36}L${x - 23} ${y - 8}L${x - 10} ${y - 14}Z"/>
        <path class="fn" d="M${x + 11} ${y - 36}L${x + 23} ${y - 8}L${x + 10} ${y - 14}Z"/>
        <path class="rkt" d="M${x} ${y - 86}C${x + 16} ${y - 68} ${x + 14} ${y - 36} ${x + 10} ${y - 12}H${x - 10}C${x - 14} ${y - 36} ${x - 16} ${y - 68} ${x} ${y - 86}Z"/>
        <circle class="wt" cx="${x}" cy="${y - 54}" r="6"/></g>`
    ];
    const DECOR = {
      tree: (x, y) => `<rect class="tk" x="${x - 2.5}" y="${y - 12}" width="5" height="12"/><circle class="td" cx="${x}" cy="${y - 20}" r="13"/><circle class="tr" cx="${x - 3}" cy="${y - 23}" r="7"/>`,
      pine: (x, y) => `<rect class="tk" x="${x - 2}" y="${y - 8}" width="4" height="8"/><path class="td" d="M${x} ${y - 42}L${x + 13} ${y - 8}H${x - 13}Z"/><path class="tr" d="M${x} ${y - 42}L${x + 6} ${y - 26}H${x - 6}Z"/>`,
      snowpine: (x, y) => DECOR.pine(x, y) + `<path class="cp" d="M${x} ${y - 42}L${x + 6} ${y - 28}L${x + 2} ${y - 30}L${x - 2} ${y - 27}L${x - 6} ${y - 28}Z"/>`,
      rock: (x, y) => `<path class="rk" d="M${x - 10} ${y}L${x - 7} ${y - 8}L${x + 2} ${y - 11}L${x + 10} ${y - 4}L${x + 9} ${y}Z"/>`,
      bush: (x, y) => `<circle class="td" cx="${x - 5}" cy="${y - 6}" r="7"/><circle class="tr" cx="${x + 4}" cy="${y - 7}" r="8"/>`,
      flowers: (x, y) => `<g class="nostroke"><circle class="f1" cx="${x}" cy="${y - 2}" r="2.5"/><circle class="f2" cx="${x + 6}" cy="${y}" r="2.5"/><circle class="f1" cx="${x + 3}" cy="${y - 6}" r="2.5"/></g>`,
      mushroom: (x, y) => `<rect class="wl" x="${x - 2}" y="${y - 7}" width="4" height="7"/><path class="ms" d="M${x - 7} ${y - 6}Q${x} ${y - 17} ${x + 7} ${y - 6}Z"/>`,
      cactus: (x, y) => `<path class="tr" d="M${x - 4} ${y}V${y - 26}a4 4 0 0 1 8 0V${y}Z"/><path class="tr" d="M${x - 4} ${y - 12}h-5v-8a2.5 2.5 0 0 1 5 0v3"/><path class="tr" d="M${x + 4} ${y - 16}h5v-7a2.5 2.5 0 0 0-5 0v2"/>`,
      dune: (x, y) => `<path class="dn" d="M${x - 24} ${y}Q${x - 6} ${y - 15} ${x + 10} ${y - 6}Q${x + 18} ${y - 2} ${x + 26} ${y}Z"/>`,
      drift: (x, y) => `<path class="cp" d="M${x - 16} ${y}Q${x - 8} ${y - 12} ${x} ${y - 7}Q${x + 8} ${y - 13} ${x + 16} ${y}Z"/>`,
      deadtree: (x, y) => `<path class="dt" d="M${x} ${y}V${y - 26}M${x} ${y - 12}l-8 -8M${x} ${y - 18}l7 -7M${x} ${y - 26}l-3 -6"/>`,
      crack: (x, y) => `<path class="lv" d="M${x - 14} ${y}L${x - 5} ${y - 4}L${x + 2} ${y + 1}L${x + 13} ${y - 3}"/>`,
      dish: (x, y) => `<path class="pole" d="M${x} ${y}V${y - 12}M${x - 5} ${y}h10M${x} ${y - 13}l5-12"/><path class="dish" d="M${x - 12} ${y - 20}Q${x} ${y - 6} ${x + 12} ${y - 20}Z"/><circle class="wn" cx="${x + 5}" cy="${y - 26}" r="2.5"/>`,
      tank: (x, y) => `<rect class="tank" x="${x - 7}" y="${y - 26}" width="14" height="26" rx="6"/><rect class="stripe" x="${x - 7}" y="${y - 17}" width="14" height="4"/>`,
      astronaut: (x, y) => ASTRO(x, y),
      flag: (x, y) => `<path class="pole" d="M${x} ${y}V${y - 28}"/><rect class="flag" x="${x}" y="${y - 28}" width="14" height="9"/>`
    };
    // A little pixel astronaut, base at (x, y)
    const ASTRO = (x, y) => `<g class="astro"><rect x="${x - 4}" y="${y - 6}" width="3" height="6"/><rect x="${x + 1}" y="${y - 6}" width="3" height="6"/>` +
      `<rect class="pack" x="${x - 8}" y="${y - 14}" width="4" height="8"/><rect x="${x - 5}" y="${y - 15}" width="10" height="10"/>` +
      `<rect x="${x - 5}" y="${y - 24}" width="10" height="9"/><rect class="visor" x="${x - 2}" y="${y - 21}" width="6" height="4"/></g>`;
    const ROCKET = `<svg viewBox="-26 -92 52 140" width="52" height="140" aria-hidden="true">
      <g class="flame"><path d="M-9-12Q0 40 9-12Z" fill="#ff8a2a"/><path d="M-5-12Q0 22 5-12Z" fill="#fff3a6"/></g>
      <g stroke="#2b2a33" stroke-width="2" stroke-linejoin="round"><path d="M-11-36L-23-8L-10-14Z" fill="#c8553d"/><path d="M11-36L23-8L10-14Z" fill="#c8553d"/>
      <path d="M0-86C16-68 14-36 10-12H-10C-14-36-16-68 0-86Z" fill="#eef0f4"/><circle cy="-54" r="6" fill="#6cc3e8"/></g></svg>`;
    const LOCK = '<svg width="12" height="14" viewBox="0 0 12 14" aria-hidden="true"><rect x="1" y="6" width="10" height="8" fill="currentColor"/><path d="M3 6V4a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

    // Layout: the hub in the middle and the other islands in a ring around it.
    // The whole world fits on screen; on phones it is taller and the page scrolls.
    const navH = () => document.querySelector(".nav").offsetHeight;
    const wantH = () => Math.max(640, innerHeight - navH());
    function build() {
      narrow = innerWidth < 760;
      map.classList.toggle("narrow", narrow);
      W = map.clientWidth;
      const banner = map.querySelector(".banner"), hud = $("hud");
      const M = Math.max(1, N - 1);
      let cx, cy, rx, ry, a0, R, RH;
      if (narrow) {
        hud.style.top = banner.offsetTop + banner.offsetHeight + 10 + "px";
        const top = hud.offsetTop + hud.offsetHeight;
        // Phones: islands stacked above and below the hub, alternating sides.
        R = 60; RH = 80;
        rx = W / 2 - R - 18; ry = 240;
        a0 = 0;
        cx = W / 2; cy = top + Math.ceil(M / 2) * ry + R + 110;
        H = cy + Math.floor(M / 2) * ry + R + 150;
      } else {
        hud.style.top = "";
        H = wantH();
        R = Math.max(78, Math.min(115, Math.min(W, H) * .105)); RH = R * 1.3;
        rx = Math.min(W * .36, W / 2 - R - 50); ry = H * .36;
        a0 = -90;
        cx = W / 2; cy = H * .5;
      }
      map.style.height = H + "px";
      inner.style.width = W + "px";
      svg.setAttribute("width", W);
      svg.setAttribute("height", H);
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

      const rnd = rng(490 + (narrow ? 1 : 0));
      // Each island is a wobbly circle: radius r(angle).
      // Each island is a wobbly, slightly stretched blob: radius r(angle). Many
      // harmonics of shrinking size give it bays and headlands like a real coastline.
      const shape = (r) => {
        const amp = [], ph = [];
        for (let k = 2; k <= 11; k++) { amp.push(.17 / Math.pow(k, .85) * (.5 + rnd())); ph.push(rnd() * 6.283); }
        const stretch = .08 + rnd() * .16, tilt = rnd() * Math.PI;
        return (a) => {
          let v = 1;
          for (let k = 0; k < amp.length; k++) v += amp[k] * Math.sin((k + 2) * a + ph[k]);
          return r * Math.max(.62, v) * (1 + stretch * Math.cos(2 * (a - tilt)));
        };
      };
      // Scatter the islands like a real archipelago: rough directions around the hub
      // with random turns, distances and sizes, kept clear of each other and the overlays.
      const keepOut = [banner, hud].map((el) => [el.offsetLeft - 20, el.offsetTop - 20,
        el.offsetLeft + el.offsetWidth + 20, el.offsetTop + el.offsetHeight + 20]);
      const clearOf = (x, y, r) => keepOut.every(([a, b, c, d]) => x + r < a || x - r > c || y + r + 10 < b || y - r - 100 > d);
      if (!narrow) { cx += (rnd() - .5) * W * .06; cy += (rnd() - .2) * H * .05; }
      hub = [Math.round(cx), Math.round(cy)];
      isles = [{ x: hub[0], y: hub[1], r: shape(RH), R: RH }];
      stops = [hub];
      const turn = narrow ? 0 : rnd() * 60 - 30;
      for (let k = 1; k < N; k++) {
        if (narrow) {
          const idx = k - 1, row = Math.floor(idx / 2) + 1, up = idx % 2 === 0;
          const right = (row % 2 === 1) === up;
          const x = Math.round((right ? W - R - 26 : R + 26) + (rnd() - .5) * 16);
          const y = Math.round(cy + (up ? -1 : 1) * row * ry + (rnd() - .5) * 24);
          isles.push({ x, y, r: shape(R), R });
          stops.push([x, y]);
          continue;
        }
        const home = a0 + turn + (k - 1) * 360 / M;
        const fits = (x, y, Rk) => x > Rk + 24 && x < W - Rk - 24 && y > Rk + 70 && y < H - Rk - 70 &&
          isles.every((o) => Math.hypot(o.x - x, o.y - y) > o.R + Rk + (o === isles[0] ? 70 : 60)) && clearOf(x, y, Rk);
        const at = (deg, far) => [Math.round(cx + Math.cos(deg * Math.PI / 180) * rx * far), Math.round(cy + Math.sin(deg * Math.PI / 180) * ry * far)];
        let best = null;
        // First try random nudges around this island's rough direction...
        for (let t = 0; t < 300 && !best; t++) {
          const Rk = R * (.82 + rnd() * .36), [x, y] = at(home + (rnd() - .5) * 54, .7 + rnd() * .38);
          if (fits(x, y, Rk)) best = { x, y, R: Rk };
        }
        // ...then sweep further round the hub, then give up and use the plain spot.
        for (let d = 0; d <= 180 && !best; d += 8) {
          for (const sgn of [1, -1]) for (const far of [.9, .75, 1.1, .6]) {
            const [x, y] = at(home + sgn * d, far);
            if (!best && fits(x, y, R * .85)) best = { x, y, R: R * .85 };
          }
        }
        if (!best) { const [x, y] = at(home, 1); best = { x, y, R }; }
        isles.push({ x: best.x, y: best.y, r: shape(best.R), R: best.R });
        stops.push([best.x, best.y]);
      }
      spokes = stops.map(([x, y], k) => {
        const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy) || 1;
        return { k, L, ux: dx / L, uy: dy / L, a: Math.atan2(dy, dx) };
      });

      // Little islets for future projects, reached by stepping stones off the hub
      // (the portfolio island), in the gaps between its bridges.
      // The first ones are named after PROJECTS in projects.js; the rest say "Future project".
      const segDist = (x, y, sp) => {
        const t = Math.max(0, Math.min(sp.L, (x - hub[0]) * sp.ux + (y - hub[1]) * sp.uy));
        return Math.hypot(x - (hub[0] + sp.ux * t), y - (hub[1] + sp.uy * t));
      };
      const islets = [];
      const wantIslets = Math.max(3, PROJECTS.length + 2);
      const angGap = (a, b) => Math.abs(((a - b) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI);
      for (let n = 0; n < wantIslets; n++) {
        for (let t = 0; t < 900; t++) {
          const p = 0, par = isles[0];
          const a = rnd() * Math.PI * 2;
          const r = 20 + rnd() * 8, gap = 46 + rnd() * (t < 300 ? 50 : 130);
          const reach = par.r(a) + gap + r;
          const x = par.x + Math.cos(a) * reach, y = par.y + Math.sin(a) * reach;
          // keep the stepping stones clear of the bridges and of other islands
          if (spokes.slice(1).some((sp) => angGap(a, sp.a) < .5)) continue;
          let crosses = false;
          for (let d = par.r(a); d < reach && !crosses; d += 10) {
            const px = par.x + Math.cos(a) * d, py = par.y + Math.sin(a) * d;
            crosses = isles.slice(1).some((o) => Math.hypot(o.x - px, o.y - py) < o.R * 1.2 + 8);
          }
          if (crosses) continue;
          const ok = x > Math.max(r + 16, 54) && x < W - Math.max(r + 16, 54) && y > r + 20 && y < H - r - 40 && clearOf(x, y, r) &&
            isles.every((o) => Math.hypot(o.x - x, o.y - y) > o.R * 1.15 + r + 24) &&
            islets.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + r + 60) &&
            spokes.slice(1).every((sp) => segDist(x, y, sp) > r + 34) &&
            stops.every(([sx, sy]) => !(Math.abs(x - sx) < 110 + r && y > sy - 20 - r && y < sy + 100 + r));
          if (!ok) continue;
          islets.push({ x, y, r, p, a, project: PROJECTS[n] });
          break;
        }
      }

      // Small rocky islets scattered just off each island's coast, kept clear of the
      // bridges, the stepping stones, the labels and everything else.
      const smalls = [];
      const offPath = (x, y, o) => {
        const L = Math.hypot(o.x - hub[0], o.y - hub[1]), ux = (o.x - hub[0]) / L, uy = (o.y - hub[1]) / L;
        const t = Math.max(0, Math.min(L, (x - hub[0]) * ux + (y - hub[1]) * uy));
        return Math.hypot(x - (hub[0] + ux * t), y - (hub[1] + uy * t));
      };
      isles.forEach((is, i) => {
        const want = i === 0 ? 3 : 2 + Math.floor(rnd() * 3);
        const avoid = i === 0 ? spokes.slice(1).map((sp) => sp.a) : [spokes[i].a + Math.PI];
        for (let n = 0, t = 0; n < want && t < 160; t++) {
          const a = rnd() * Math.PI * 2;
          if (avoid.some((d) => angGap(a, d) < .5)) continue;
          const r = 6 + rnd() * 12, reach = is.r(a) * 1.14 + r + 6 + rnd() * 36;
          const x = is.x + Math.cos(a) * reach, y = is.y + Math.sin(a) * reach;
          const ok = x > r + 8 && x < W - r - 8 && y > r + 8 && y < H - r - 8 && clearOf(x, y, r * .5) &&
            spokes.slice(1).every((sp) => segDist(x, y, sp) > r + 18) &&
            isles.every((o) => o === is || Math.hypot(o.x - x, o.y - y) > o.R * 1.25 + r + 10) &&
            smalls.every((o) => Math.hypot(o.x - x, o.y - y) > o.r + r + 12) &&
            islets.every((o) => Math.hypot(o.x - x, o.y - y) > o.r * 1.3 + r + 16 && offPath(x, y, o) > r + 12) &&
            stops.every(([sx, sy]) => !(Math.abs(x - sx) < 95 + r && y > sy - 10 - r && y < sy + 95 + r));
          if (!ok) continue;
          smalls.push({ x, y, r, R: r, b: biomeOf(i).id, rf: shape(r), owner: i });
          n++;
        }
      });

      // Open water away from land and bridges, where fish may jump.
      seaSpot = () => {
        for (let t = 0; t < 40; t++) {
          const x = 30 + Math.random() * (W - 60), y = 140 + Math.random() * (H - 180);
          if (!onLand(x, y, 30) && spokes.slice(1).every((sp) => segDist(x, y, sp) > 30) && clearOf(x, y, 20)) return [x, y];
        }
        return null;
      };

      // Sea with little waves, kept off the islands.
      const onLand = (x, y, pad) => isles.some((is) =>
        Math.hypot(x - is.x, y - is.y) < is.r(Math.atan2(y - is.y, x - is.x)) + pad) ||
        islets.some((o) => Math.hypot(x - o.x, y - o.y) < o.r * 1.3 + pad) ||
        smalls.some((o) => Math.hypot(x - o.x, y - o.y) < o.r * 1.4 + pad);
      // Boats sail slow loops around a few islands (under the bridges); each loop
      // follows the island's own coastline and must stay clear of every other island.
      const BOAT = [
        `<path class="hull" d="M11 0Q5-6-8-5L-9 5Q5 6 11 0Z"/><path class="deck" d="M6 0Q2-3-5-3L-5 3Q2 3 6 0Z"/><path class="sail" d="M8 0L-3-1.5L-3 1.5Z"/>`,
        `<path class="hull red" d="M9 0Q4-5-7-4L-7 4Q4 5 9 0Z"/><rect class="cabin" x="-4" y="-2.5" width="6" height="5"/>`
      ];
      let boats = "";
      const want = narrow ? 2 : 3;
      let made = 0;
      isles.map((_, k) => k).sort(() => rnd() - .5).forEach((k) => {
        if (made >= want) return;
        const n = made;
        const is = isles[k];
        for (const m of [1.3, 1.45, 1.6, 1.8, 2.05]) {
          // Follow the coast, but swing out around this island's own little islets.
          const ang = Array.from({ length: 72 }, (_, t) => t / 72 * Math.PI * 2);
          let rad = ang.map((a) => is.r(a) * m + 12);
          smalls.filter((o) => o.owner === k).forEach((o) => {
            const ao = Math.atan2(o.y - is.y, o.x - is.x), d = Math.hypot(o.x - is.x, o.y - is.y);
            const half = Math.atan2(o.r * 1.4 + 12, d) * 1.6;
            rad = rad.map((r, t) => angGap(ang[t], ao) < half ? Math.max(r, d + o.r * 1.4 + 12) : r);
          });
          for (let pass = 0; pass < 6; pass++) {
            rad = rad.map((r, t) => Math.max(r, (rad[(t + 71) % 72] + rad[(t + 1) % 72]) / 2));
          }
          const pts = ang.map((a, t) => [is.x + Math.cos(a) * rad[t], is.y + Math.sin(a) * rad[t]]);
          const clear = pts.every(([x, y]) => x > 8 && x < W - 8 && y > 8 && y < H - 8 &&
            isles.every((o) => o === is || Math.hypot(x - o.x, y - o.y) > o.r(Math.atan2(y - o.y, x - o.x)) * 1.06 + 6) &&
            smalls.every((o) => Math.hypot(x - o.x, y - o.y) > o.r * 1.1 + 5) &&
            islets.every((o) => Math.hypot(x - o.x, y - o.y) > o.r * 1.2 + 5));
          if (!clear) continue;
          if (rnd() < .5) pts.reverse();
          const dur = Math.round(50 + rnd() * 40);
          boats += `<g class="boat"><g transform="scale(1.45)">${BOAT[n % BOAT.length]}<path class="wake" d="M-11-3l-8-3M-11 3l-8 3"/></g>` +
            `<animateMotion dur="${dur}s" begin="-${f(rnd() * dur)}s" repeatCount="indefinite" rotate="auto" ` +
            `path="M${pts.map(([x, y]) => f(x) + " " + f(y)).join("L")}Z"/></g>`;
          made++;
          break;
        }
      });

      // One more boat laps the whole archipelago, just outside all the land.
      {
        const landAt = (x, y, pad) => isles.some((o) => Math.hypot(x - o.x, y - o.y) < o.r(Math.atan2(y - o.y, x - o.x)) * 1.12 + pad) ||
          smalls.some((o) => Math.hypot(x - o.x, y - o.y) < o.r * 1.35 + pad) || islets.some((o) => Math.hypot(x - o.x, y - o.y) < o.r * 1.3 + pad);
        let rad = Array.from({ length: 90 }, (_, t) => {
          const a = t / 90 * Math.PI * 2;
          let far = 0;
          for (let d = 0; d < Math.max(W, H); d += 6) if (landAt(hub[0] + Math.cos(a) * d, hub[1] + Math.sin(a) * d, 0)) far = d;
          return far + 34;
        });
        for (let pass = 0; pass < 8; pass++) rad = rad.map((r, t) => Math.max(r, (rad[(t + 89) % 90] + rad[(t + 1) % 90]) / 2));
        const pts = rad.map((r, t) => {
          const a = t / 90 * Math.PI * 2;
          return [Math.max(14, Math.min(W - 14, hub[0] + Math.cos(a) * r)), Math.max(130, Math.min(H - 14, hub[1] + Math.sin(a) * r))];
        });
        if (pts.every(([x, y]) => !landAt(x, y, 4))) {
          if (rnd() < .5) pts.reverse();
          const dur = Math.round(120 + rnd() * 40);
          boats += `<g class="boat"><g transform="scale(1.45)">${BOAT[0]}<path class="wake" d="M-11-3l-8-3M-11 3l-8 3"/></g>` +
            `<animateMotion dur="${dur}s" begin="-${f(rnd() * dur)}s" repeatCount="indefinite" rotate="auto" ` +
            `path="M${pts.map(([x, y]) => f(x) + " " + f(y)).join("L")}Z"/></g>`;
        }
      }

      let waves = "";
      for (let t = 0; t < W * H / 5000; t++) {
        const x = rnd() * W, y = rnd() * H;
        if (!onLand(x, y, 26)) waves += `M${f(x)} ${f(y)}q4-4 8 0t8 0`;
      }

      // Bridges over the water (dashed planks lead to locked islands), trails on land.
      const bridges = spokes.slice(1).map((sp) => {
        const a = sp.a, is = isles[sp.k];
        const b0 = isles[0].r(a) * .92, b1 = sp.L - is.r(a + Math.PI) * .92;
        const x0 = cx + sp.ux * b0, y0 = cy + sp.uy * b0, x1 = cx + sp.ux * b1, y1 = cy + sp.uy * b1;
        const nx = -sp.uy * 13, ny = sp.ux * 13;
        const line = `M${f(x0)} ${f(y0)}L${f(x1)} ${f(y1)}`;
        let posts = "";
        for (let d = 0; d <= b1 - b0; d += 34) {
          const px = x0 + sp.ux * d, py = y0 + sp.uy * d;
          posts += `<rect class="post" x="${f(px + nx - 3)}" y="${f(py + ny - 3)}" width="6" height="6"/><rect class="post" x="${f(px - nx - 3)}" y="${f(py - ny - 3)}" width="6" height="6"/>`;
        }
        return `<g class="bridge ${locked(sp.k) ? "broken" : ""}">
          <path class="br-edge" d="${line}"/><path class="br-deck" d="${line}"/><path class="br-planks" d="${line}"/>
          <path class="br-rail" d="M${f(x0 + nx)} ${f(y0 + ny)}L${f(x1 + nx)} ${f(y1 + ny)}M${f(x0 - nx)} ${f(y0 - ny)}L${f(x1 - nx)} ${f(y1 - ny)}"/>${posts}</g>`;
      }).join("");
      const trails = spokes.slice(1).map((sp) => {
        const a = sp.a, b0 = isles[0].r(a), b1 = sp.L - isles[sp.k].r(a + Math.PI);
        return `M${cx} ${cy}L${f(cx + sp.ux * b0)} ${f(cy + sp.uy * b0)}M${f(cx + sp.ux * b1)} ${f(cy + sp.uy * b1)}L${stops[sp.k][0]} ${stops[sp.k][1]}`;
      }).join("");

      // Islands: shallow water, beach and biome ground, plus scenery.
      const poly = (is, k) => {
        let d = "";
        const steps = is.R > 40 ? 140 : 40;
        for (let i = 0; i < steps; i++) {
          const a = i / steps * Math.PI * 2, r = is.r(a) * k;
          d += `${i ? "L" : "M"}${f(is.x + Math.cos(a) * r)} ${f(is.y + Math.sin(a) * r)}`;
        }
        return d + "Z";
      };
      const nearTrail = (x, y, gap) => spokes.slice(1).some((sp) => {
        const t = Math.max(0, Math.min(sp.L, (x - cx) * sp.ux + (y - cy) * sp.uy));
        return Math.hypot(x - (cx + sp.ux * t), y - (cy + sp.uy * t)) < gap;
      });
      const items = [], placed = [];
      const labelBox = [];   // filled below once label sides are known
      const islands = isles.map((is, i) => {
        const b = biomeOf(i);
        let tufts = "";
        for (let t = 0; t < is.R * is.R / 260; t++) {
          const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * is.r(a) * .8;
          tufts += `M${f(is.x + Math.cos(a) * r)} ${f(is.y + Math.sin(a) * r)}l2-5 2 5`;
        }
        // Higher ground: a hill and a smaller rise, a little off centre, like contour lines.
        const hx = is.x + (rnd() - .5) * is.R * .3, hy = is.y + (rnd() - .5) * is.R * .3;
        const hill = { x: hx, y: hy, r: shape(is.R * .5), R: is.R * .5 };
        const rise = { x: hx + (rnd() - .5) * is.R * .12, y: hy + (rnd() - .5) * is.R * .12, r: shape(is.R * .24), R: is.R * .24 };
        return `<g class="bm-${b.id}"><path class="shallow" d="${poly(is, 1.14)}"/><path class="beach" d="${poly(is, 1)}"/>` +
          `<path class="g" d="${poly(is, .86)}"/><path class="hill" d="${poly(hill, 1)}"/><path class="hill rise" d="${poly(rise, 1)}"/>` +
          `<path class="tuft" d="${tufts}"/></g>`;
      }).join("") + smalls.map((o) => {
        const is = { x: o.x, y: o.y, r: o.rf, R: o.r };
        const top = o.r > 11 && rnd() < .7
          ? `<circle class="td" cx="${f(o.x - 1)}" cy="${f(o.y - 2)}" r="${f(o.r * .32)}"/><circle class="tr" cx="${f(o.x - 2)}" cy="${f(o.y - 3)}" r="${f(o.r * .18)}"/>`
          : `<path class="rk" d="M${f(o.x - 4)} ${f(o.y + 2)}l2-5 4-1 3 4z"/>`;
        return `<g class="bm-${o.b} small-isle"><path class="shallow" d="${poly(is, 1.35)}"/><path class="beach" d="${poly(is, 1)}"/>` +
          (o.r > 9 ? `<path class="g" d="${poly(is, .7)}"/>` : "") + `${top}</g>`;
      }).join("");

      // Labels go on the side of each landmark that is furthest from its bridges.
      // On narrow screens, labels that would run off the edge are not considered.
      const LBL = { below: [0, 12, -50, 0], br: [26, 8, 0, 0], bl: [-26, 8, -100, 0], right: [40, -30, 0, 0], left: [-40, -30, -100, 0] };
      const onMap = (x, side) => {
        const [dx, , tx] = LBL[side], w = narrow ? 130 : 160;
        const lx = x + dx + (tx === -50 ? -w / 2 : tx === -100 ? -w : 0);
        return lx >= 4 && lx + w <= W - 4;
      };
      const sides = stops.map(([sx], i) => {
        const dirs = i === 0 ? spokes.slice(1).map((sp) => sp.a) : [spokes[i].a + Math.PI];
        const all = [["below", Math.PI / 2], ["br", Math.PI / 4], ["bl", Math.PI * 3 / 4], ["right", 0], ["left", Math.PI]];
        const cand = all.filter(([n]) => onMap(sx, n)).length ? all.filter(([n]) => onMap(sx, n)) : all;
        const gap = (a) => Math.min(...dirs.map((d) => { const x = Math.abs(((a - d) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI); return x; }), Math.PI);
        return (cand.find(([, a]) => gap(a) >= 1.4) || cand.reduce((b, c) => gap(c[1]) > gap(b[1]) ? c : b))[0];
      });
      stops.forEach(([x, y], i) => {
        const [dx, dy, tx] = LBL[sides[i]];
        const lx = x + dx + (tx === -50 ? -80 : tx === -100 ? -160 : 0);
        labelBox.push([lx, y + dy, lx + 160, y + dy + 80]);
      });

      isles.forEach((is, i) => {
        const b = biomeOf(i);
        const free = (x, y, r) =>
          !nearTrail(x, y, 26 + r) &&
          Math.hypot(x - stops[i][0], y - 34 - stops[i][1]) > 58 + r &&
          !labelBox.some(([a, bb, c, d]) => x > a - r && x < c + r && y > bb - r && y < d + r) &&
          placed.every(([px, py, pr]) => Math.hypot(px - x, py - y) > pr + r + 8);
        // A small pond (water, oasis, ice or lava) on each island when there is room;
        // the launch island gets a landing pad instead.
        for (let t = 0; t < 60; t++) {
          const a = rnd() * Math.PI * 2, r = (.3 + rnd() * .35) * is.r(a);
          const x = is.x + Math.cos(a) * r, y = is.y + Math.sin(a) * r;
          if (!free(x, y, 36)) continue;
          placed.push([x, y, 36]);
          items.push([y, b.id === "space"
            ? `<g class="bm-space"><ellipse class="pad" cx="${f(x)}" cy="${f(y)}" rx="34" ry="19"/><ellipse class="pad-ring" cx="${f(x)}" cy="${f(y)}" rx="24" ry="13"/>` +
              `<path class="pad-h" d="M${f(x - 6)} ${f(y - 6)}v12M${f(x + 6)} ${f(y - 6)}v12M${f(x - 6)} ${f(y)}h12"/></g>`
            : `<g class="bm-${b.id}"><ellipse class="we" cx="${f(x)}" cy="${f(y)}" rx="34" ry="19"/><ellipse class="wt" cx="${f(x)}" cy="${f(y)}" rx="29" ry="15"/>` +
              `<path class="ripple" d="M${f(x - 12)} ${f(y - 3)}h10M${f(x + 3)} ${f(y + 5)}h10"/></g>`]);
          break;
        }
        const want = Math.round(is.R * is.R / 520);
        for (let t = 0, made = 0; t < want * 8 && made < want; t++) {
          const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * is.r(a) * .78;
          const x = is.x + Math.cos(a) * r, y = is.y + Math.sin(a) * r;
          if (!free(x, y, 10)) continue;
          placed.push([x, y, 10]); made++;
          items.push([y, `<g class="dc bm-${b.id}">${DECOR[b.kinds[Math.floor(rnd() * b.kinds.length)]](f(x), f(y))}</g>`]);
        }
      });
      stops.forEach(([x, y], i) => items.push([y, `<g class="lm bm-${biomeOf(i).id} ${locked(i) ? "locked" : ""}">${(isLaunch(i) ? LANDMARKS[4] : LANDMARKS[i % LANDMARKS.length])(x, y - 6)}</g>`]));
      items.sort((a, b) => a[0] - b[0]);

      const glows = stops.map(([x, y], i) => locked(i) ? "" :
        `<circle class="glow" cx="${x}" cy="${y - 30}" r="90" fill="url(#lamp)"/>`).join("");
      const fog = stops.map(([x, y], i) => !locked(i) || isLaunch(i) ? "" :
        [[-26, -40, 20], [0, -56, 24], [24, -38, 20], [-8, -22, 18], [16, -18, 16]]
          .map(([dx, dy, r]) => `<circle class="fog" cx="${x + dx}" cy="${y + dy}" r="${r}"/>`).join("")).join("");

      svg.innerHTML = `
        <defs><radialGradient id="lamp"><stop offset="0" stop-color="#ffd86b" stop-opacity=".5"/><stop offset="1" stop-color="#ffd86b" stop-opacity="0"/></radialGradient></defs>
        <rect class="sea" width="${W}" height="${H}"/>
        <path class="wave" d="${waves}"/>
        ${reduce.matches ? "" : boats}
        ${islands}
        ${islets.map((o) => {
          const par = isles[o.p], from = par.r(o.a) * .9, to = Math.hypot(o.x - par.x, o.y - par.y) - o.r * .85;
          let stones = "";
          for (let d = from; d < to; d += 13) {
            stones += `<ellipse class="stone" cx="${f(par.x + Math.cos(o.a) * d)}" cy="${f(par.y + Math.sin(o.a) * d)}" rx="5" ry="3.5"/>`;
          }
          const top = o.project
            ? `<path class="tent" d="M${f(o.x - 11)} ${f(o.y + 2)}L${f(o.x)} ${f(o.y - 16)}L${f(o.x + 11)} ${f(o.y + 2)}Z"/>`
            : `<rect class="post" x="${f(o.x - 1.5)}" y="${f(o.y - 18)}" width="3" height="18"/><rect class="sign" x="${f(o.x - 10)}" y="${f(o.y - 20)}" width="20" height="10"/>`;
          return `<g class="islet bm-meadow">${stones}<circle class="shallow" cx="${f(o.x)}" cy="${f(o.y)}" r="${f(o.r * 1.25)}"/>` +
            `<circle class="beach" cx="${f(o.x)}" cy="${f(o.y)}" r="${f(o.r)}"/><circle class="g" cx="${f(o.x)}" cy="${f(o.y)}" r="${f(o.r * .74)}"/>${top}</g>`;
        }).join("")}
        ${bridges}
        <path class="trail-edge" d="${trails}"/><path class="trail" d="${trails}"/>
        ${items.map((it) => it[1]).join("")}
        ${fog}
        <rect class="night" width="${W}" height="${H}"/>
        ${glows}`;

      hero.style.width = "36px";
      locsEl.innerHTML = arts.map((a, i) => {
        const st = STATUS[a.status] ? a.status : "upcoming";
        const [dx, dy] = LBL[sides[i]];
        return `<button type="button" class="loc ${st} lbl-${sides[i]}" data-i="${i}" style="left:${stops[i][0] + dx}px;top:${stops[i][1] + dy}px"
          aria-label="Stop ${i + 1}: ${esc(a.title)} (${STATUS[st]}), ${biomeOf(i).name}">
          <span class="pin">${st === "upcoming" ? LOCK : pad(i + 1)}</span><span class="loc-name">${esc(a.title)}</span>
          <span class="loc-biome">${biomeOf(i).name}</span></button>`;
      }).join("") + islets.map((o) => {
        const p = o.project, url = p && (p.demo || p.repo);
        const style = `left:${f(o.x)}px;top:${f(o.y + o.r + 6)}px`;
        return url ? `<a class="islet-tag" style="${style}" href="${esc(url)}" target="_blank" rel="noopener">${esc(p.title)}</a>`
          : `<span class="islet-tag" style="${style}">${p ? esc(p.title) : "Future project"}</span>`;
      }).join("");

      pos = target = stopPos(active);
      fit(true);
      place();
      setHere(active);
    }

    const stopPos = (i) => i === 0 ? { s: pos.s || 1, d: 0 } : { s: i, d: spokes[i].L };
    function pointAt(p) {
      const sp = spokes[p.s] || spokes[1];
      if (!sp || N < 2) return hub;
      return [hub[0] + sp.ux * p.d, hub[1] + sp.uy * p.d];
    }
    // Nearest point on the bridge network to (x, y), snapped onto a landmark when close.
    function project(x, y) {
      let best = { s: 1, d: 0 }, bd = Infinity;
      for (let k = 1; k < N; k++) {
        const sp = spokes[k];
        const d = Math.max(0, Math.min(sp.L, (x - hub[0]) * sp.ux + (y - hub[1]) * sp.uy));
        const e = Math.hypot(x - (hub[0] + sp.ux * d), y - (hub[1] + sp.uy * d));
        if (e < bd) { bd = e; best = { s: k, d }; }
      }
      if (best.d < 45) best.d = 0;
      else if (spokes[best.s].L - best.d < 45) best.d = spokes[best.s].L;
      return best;
    }
    // How far the traveler still has to walk (via the hub when changing islands).
    const remaining = () => pos.s === target.s || pos.d === 0 ? Math.abs(target.d - pos.d) : pos.d + target.d;

    // When a card is open beside the map, shrink the world to fit the space left.
    function fit(instant) {
      if (inSpace) return;          // the map is being shown as Earth; leave it alone
      let free = W;
      if (shown >= 0 && !narrow && !docked()) {
        free = Math.max(320, side.getBoundingClientRect().left - map.getBoundingClientRect().left - 16);
      }
      zoom = Math.min(1, free / W);
      shiftY = (H - H * zoom) / 2;
      inner.style.transition = instant || reduce.matches ? "none" : "";
      inner.style.transform = zoom === 1 ? "" : `translate(0, ${shiftY}px) scale(${zoom})`;
    }
    function place() {
      const [x, y] = pointAt(pos);
      hero.style.left = x + "px";
      hero.style.top = y + "px";
    }
    // Highlight the landmark the traveler is standing at.
    function setHere(i) {
      active = i;
      locsEl.querySelectorAll(".loc").forEach((b, k) => {
        b.classList.toggle("here", k === i);
        b.setAttribute("aria-current", k === i ? "location" : "false");
      });
    }
    function arrive() {
      if (pos.d < 30) setHere(0);
      else if (N > 1 && spokes[pos.s].L - pos.d < 30) setHere(pos.s);
      if (launchAt >= 0 && launchAt === active && pos.d > 0) { const i = launchAt; launchAt = -1; launch(i); }
    }

    // ---- Rocket launch to the moon ----
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const play = (el, frames, opts) => reduce.matches ? Promise.resolve() :
      el.animate(frames, { fill: "forwards", ...opts }).finished.catch(() => {});
    // The moon: dusty grey seas, rough-rimmed craters lit from the upper left (shadowed
    // inner wall, bright far rim, foreshortened toward the edge) and lots of small pits.
    function moonSVG() {
      let seed = 1969;
      const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const C = 200, R = 196;
      const blob = (x, y, rad, flat, rot, jit, n) => {
        let d = "";
        for (let k = 0; k < n; k++) {
          const a = k / n * Math.PI * 2, j = 1 + (r() - .5) * jit;
          const px = Math.cos(a) * rad * flat * j, py = Math.sin(a) * rad * j;
          d += (k ? "L" : "M") + (x + px * Math.cos(rot) - py * Math.sin(rot)).toFixed(1) + " " + (y + px * Math.sin(rot) + py * Math.cos(rot)).toFixed(1);
        }
        return d + "Z";
      };
      const seas = [[150, 150, 70], [255, 230, 55], [170, 285, 42]].map(([x, y, rad]) =>
        `<path d="${blob(x, y, rad, 1, 0, .35, 18)}" fill="#c8ccd7"/>`).join("");
      let craters = "";
      const placed = [];
      for (let t = 0; t < 400 && placed.length < 16; t++) {
        const rad = placed.length < 6 ? 16 + r() * 18 : 6 + r() * 9;
        const x = C + (r() - .5) * 2 * R, y = C + (r() - .5) * 2 * R, dist = Math.hypot(x - C, y - C);
        if (dist > R - rad - 6 || placed.some(([px, py, pr]) => Math.hypot(px - x, py - y) < pr + rad + 6)) continue;
        placed.push([x, y, rad]);
        const flat = Math.sqrt(Math.max(.2, 1 - (dist / R) ** 2)), rot = Math.atan2(y - C, x - C);
        const ox = -rad * .14, oy = -rad * .14;
        craters += `<path d="${blob(x, y, rad, flat, rot, .14, 20)}" fill="#c4c8d3" stroke="#2b2a33" stroke-width="1.6" stroke-linejoin="round"/>` +
          `<path d="${blob(x + ox, y + oy, rad * .78, flat, rot, .12, 16)}" fill="#a9aebb"/>` +
          `<path d="${blob(x + ox * .3, y + oy * .3, rad * .6, flat, rot, .1, 14)}" fill="#bcc0cc"/>` +
          `<path d="M${(x + rad * .62).toFixed(1)} ${(y - rad * .05).toFixed(1)}Q${(x + rad * .55).toFixed(1)} ${(y + rad * .55).toFixed(1)} ${(x - rad * .05).toFixed(1)} ${(y + rad * .62).toFixed(1)}" fill="none" stroke="#f1f2f6" stroke-width="${(rad * .12 + .8).toFixed(1)}" stroke-linecap="round"/>`;
        if (rad > 22) for (let k = 0; k < 7; k++) {
          const a = r() * Math.PI * 2, e = rad * (1.25 + r() * .5);
          craters += `<circle cx="${(x + Math.cos(a) * e).toFixed(1)}" cy="${(y + Math.sin(a) * e).toFixed(1)}" r="${(1 + r() * 1.4).toFixed(1)}" fill="#b5bac6"/>`;
        }
      }
      let pits = "";
      for (let t = 0; t < 70; t++) {
        const a = r() * Math.PI * 2, dd = Math.sqrt(r()) * (R - 8), x = C + Math.cos(a) * dd, y = C + Math.sin(a) * dd, pr = 1.2 + r() * 2.6;
        if (placed.some(([px, py, prr]) => Math.hypot(px - x, py - y) < prr + pr + 2)) continue;
        pits += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${pr.toFixed(1)}" fill="#b3b8c4"/><circle cx="${(x + pr * .35).toFixed(1)}" cy="${(y + pr * .35).toFixed(1)}" r="${(pr * .45).toFixed(1)}" fill="#e6e8ee"/>`;
      }
      return `<svg viewBox="0 0 400 400"><defs><clipPath id="moon-clip"><circle cx="${C}" cy="${C}" r="${R}"/></clipPath>
        <radialGradient id="moon-shade" cx="35%" cy="32%" r="75%"><stop offset=".55" stop-color="#1e2340" stop-opacity="0"/><stop offset="1" stop-color="#1e2340" stop-opacity=".32"/></radialGradient></defs>
        <circle cx="${C}" cy="${C}" r="${R}" fill="#dcdfe7"/>
        <g clip-path="url(#moon-clip)">${seas}${pits}${craters}<circle cx="${C}" cy="${C}" r="${R}" fill="url(#moon-shade)"/></g>
        <circle cx="${C}" cy="${C}" r="${R}" fill="none" stroke="#2b2a33" stroke-width="4"/></svg>`;
    }
    const scene = document.createElement("div");
    scene.className = "space-scene";
    scene.innerHTML = `
      <div class="ss-sky" aria-hidden="true">${(() => {
        let seed = 2026, out = "";
        const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
        for (let k = 0; k < 420; k++) {
          const big = r() < .08, size = big ? 2.6 + r() * 1.6 : .8 + r() * 1.4;
          const tw = r() < .18 ? ` class="tw" style="animation-delay:${(r() * 4).toFixed(2)}s;animation-duration:${(2 + r() * 3).toFixed(2)}s"` : "";
          const hue = r() < .15 ? "#cfe0ff" : r() < .1 ? "#ffe9c4" : "#ffffff";
          out += `<circle cx="${(r() * 1920).toFixed(1)}" cy="${(r() * 1200).toFixed(1)}" r="${size.toFixed(2)}" fill="${hue}" opacity="${(.45 + r() * .55).toFixed(2)}"${tw}/>`;
        }
        return `<svg viewBox="0 0 1920 1200" preserveAspectRatio="xMidYMid slice">${out}</svg>`;
      })()}</div>
      <div class="ss-moon" aria-hidden="true">
        ${moonSVG()}
        <div class="ss-crew"><svg viewBox="-20 -40 60 44" width="90" height="66">${ASTRO(0, 0)}<path class="pole" d="M18 0V-34"/><rect class="flag" x="18" y="-34" width="18" height="11"/></svg></div>
      </div>
      <div class="ss-ship" aria-hidden="true">${ROCKET}</div>
      <p class="ss-caption">Touchdown on the Moon!</p>
      <button type="button" class="btn small ss-back">&#9660; Back to Earth</button>`;
    document.body.appendChild(scene);
    scene.querySelector(".ss-back").addEventListener("click", () => closeCard());

    async function launch(i) {
      const run = ++launchRun;
      inSpace = true;
      const [x, y] = stops[i];
      const btn = locsEl.children[i], r0 = btn.getBoundingClientRect();
      if (r0.top < 0 || r0.bottom > innerHeight) btn.scrollIntoView({ block: "center" });
      // The traveler boards and the rocket leaves the pad.
      hero.style.visibility = "hidden";
      svg.classList.add("launched");
      map.classList.add("leaving");          // labels and overlays fade as we leave
      const ready = prepareEarth();          // photograph the map for the globe while the rocket flies
      const flyer = makeFlyer(x, y);
      smoke(x, y);
      await play(flyer, [{ transform: "translateX(0)" }, { transform: "translateX(-2px)" }, { transform: "translateX(2px)" }, { transform: "translateX(0)" }],
        { duration: 120, iterations: 3 });
      const off = flyer.getBoundingClientRect().bottom + 80;
      await play(flyer, [{ transform: "translateY(0)" }, { transform: `translateY(${-off / zoom}px)` }],
        { duration: 1400, easing: "cubic-bezier(.55, 0, 1, .45)" });
      flyer.remove();
      if (run !== launchRun) return;
      // Out of the map and into space: the rocket lands on the moon.
      // Space fills the screen; the moon is centred in the part the card won't cover.
      spaceLayout();
      await ready;
      if (run !== launchRun) return;
      scene.classList.remove("landed");
      scene.classList.add("on");
      const moon = scene.querySelector(".ss-moon");
      const below = `translate(-50%, -50%) translateY(${sky.sh}px)`;
      moon.animate([{ transform: below }], { duration: 1, fill: "forwards" });
      await Promise.all([
        earth.ok ? Promise.resolve() : play(scene, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 }),
        zoomOut(),
        wait(reduce.matches ? 0 : 1200).then(() => play(moon, [{ transform: below }, { transform: "translate(-50%, -50%)" }], { duration: 1200, easing: "ease-out" }))
      ]);
      if (run !== launchRun) return;
      // The rocket rises from the launch island on the globe and lands on the moon.
      await fly(islePoint(), moonTop(), 2300, "land");
      if (run !== launchRun) return;
      scene.classList.add("landed");
      openCard(i);
      scene.querySelector(".ss-back").focus({ preventScroll: true });
    }
    // ---- Earth: the island map drawn on a real sphere (WebGL) ----
    // A camera starts close enough that the map looks flat and pulls back until the
    // whole planet shows, curving and shading as it goes; the way home reverses it.
    // Space layout: half of a big Earth rises from the bottom, the moon is smaller,
    // up and to the right, all within the part of the screen the card doesn't cover.
    let sky = null;
    function spaceLayout() {
      const free = shownWidth(), sh = innerHeight - navH();
      const gd = Math.round(Math.min(free * .78, sh * 1.2));
      const md = Math.round(Math.max(140, Math.min(300, Math.min(free, sh) * .32)));
      sky = { free, sh, gx: free * .3, gy: sh, gd, mx: free * .72, my: sh * .38, md };
      for (const k of ["free", "gx", "gy", "gd", "mx", "my", "md"]) scene.style.setProperty("--" + k, sky[k] + "px");
    }
    const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
    // Storybook look to match the map: crisp, gently shaded, lit from the moon's side,
    // with the same ink outline as the islands and a thin flat atmosphere ring.
    const FRAG = `precision highp float;
      uniform vec2 uRes;uniform float uDpr;uniform vec2 uC;uniform float uF;uniform float uD;uniform float uRho;
      uniform vec2 uMap;uniform vec2 uOff;uniform float uCurve;uniform vec3 uSea;uniform sampler2D uTex;uniform float uPxR;
      void main(){
        vec2 q=vec2(gl_FragCoord.x,uRes.y*uDpr-gl_FragCoord.y)/uDpr;
        vec3 o=vec3(0.,0.,uD);vec3 r=normalize(vec3(q-uC,-uF));
        float b=dot(o,r);float disc=b*b-(dot(o,o)-1.);
        if(disc<0.){
          float px=(sqrt(max(dot(o,o)-b*b,0.))-1.)*uPxR;
          if(px<2.5)gl_FragColor=vec4(.17,.16,.2,uCurve);
          else if(px<9.)gl_FragColor=vec4(.56,.84,.97,.32*uCurve*(1.-smoothstep(6.,9.,px)));
          else gl_FragColor=vec4(0.);
          return;}
        vec3 p=o+(-b-sqrt(disc))*r;
        float lon=atan(p.x,p.z);float lat=asin(clamp(p.y,-1.,1.));
        vec2 uv=(uMap*.5+(vec2(lon,lat)+uOff)*uRho)/uMap;
        vec3 col=uSea;
        if(uv.x>=0.&&uv.x<=1.&&uv.y>=0.&&uv.y<=1.)col=texture2D(uTex,uv).rgb;
        float diff=dot(p,normalize(vec3(.55,-.45,.7)));
        col*=mix(1.,mix(.84,1.,smoothstep(-.05,.3,diff)),uCurve);
        gl_FragColor=vec4(col,1.);
      }`;
    const earth = { gl: null, canvas: null, ok: false, tex: null, u: {}, sea: [0.36, 0.71, 0.89], st: null, raf: 0 };
    function glSetup() {
      if (earth.gl || earth.failed) return !!earth.gl;
      try {
        const cv = document.createElement("canvas");
        cv.className = "ss-gl";
        cv.setAttribute("aria-hidden", "true");
        scene.querySelector(".ss-sky").after(cv);
        const gl = cv.getContext("webgl", { premultipliedAlpha: false, antialias: true });
        const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
        const prog = gl.createProgram();
        gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
        gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
        gl.linkProgram(prog);
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, "a");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        for (const n of ["uRes", "uDpr", "uC", "uF", "uD", "uRho", "uMap", "uOff", "uCurve", "uSea", "uTex", "uPxR"]) earth.u[n] = gl.getUniformLocation(prog, n);
        earth.tex = gl.createTexture();
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        earth.gl = gl; earth.canvas = cv;
        return true;
      } catch (e) { earth.failed = true; return false; }
    }
    // Rasterise the current map (with its computed colours) into a texture.
    async function snapshot() {
      const clone = svg.cloneNode(true);
      const src = svg.querySelectorAll("*"), dst = clone.querySelectorAll("*");
      const props = ["fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linecap", "stroke-linejoin",
        "opacity", "fill-opacity", "stroke-opacity", "visibility", "display"];
      src.forEach((el, k) => {
        const cs = getComputedStyle(el);
        dst[k].setAttribute("style", props.map((p) => `${p}:${cs.getPropertyValue(p).replace(/url\("?[^#"]*#/, 'url("#')}`).join(";"));
      });
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
      try {
        const img = new Image();
        img.src = url;
        await img.decode();
        const k = Math.min(2, devicePixelRatio || 1, 4096 / Math.max(W, H));
        const cv = document.createElement("canvas");
        cv.width = Math.round(W * k); cv.height = Math.round(H * k);
        const ctx = cv.getContext("2d");
        ctx.drawImage(img, 0, 0, cv.width, cv.height);
        try { const px = ctx.getImageData(2, 2, 1, 1).data; earth.sea = [px[0] / 255, px[1] / 255, px[2] / 255]; } catch (e) {}
        return cv;
      } finally { URL.revokeObjectURL(url); }
    }
    async function prepareEarth() {
      earth.ok = false;
      if (!glSetup()) return;
      try {
        const cv = await snapshot();
        const gl = earth.gl;
        gl.bindTexture(gl.TEXTURE_2D, earth.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cv);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        earth.ok = true;
      } catch (e) { earth.ok = false; }
    }
    function drawEarth() {
      const gl = earth.gl, cv = earth.canvas, st = earth.st;
      if (!earth.ok || !st) return;
      // The further out the camera, the chunkier the pixels, so the globe reads as pixel art.
      const dpr = Math.min(2, devicePixelRatio || 1), w = innerWidth, h = innerHeight - navH();
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
        cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      }
      gl.viewport(0, 0, cv.width, cv.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const u = earth.u;
      gl.uniform2f(u.uRes, w, h); gl.uniform1f(u.uDpr, dpr);
      gl.uniform2f(u.uC, st.cx, st.cy); gl.uniform1f(u.uF, st.f); gl.uniform1f(u.uD, st.d);
      gl.uniform1f(u.uRho, st.rho); gl.uniform2f(u.uMap, W, H);
      gl.uniform2f(u.uOff, st.lon + st.rot, st.lat); gl.uniform1f(u.uCurve, st.curve);
      gl.uniform3f(u.uSea, ...earth.sea); gl.uniform1i(u.uTex, 0);
      gl.uniform1f(u.uPxR, st.f / Math.sqrt(Math.max(st.d * st.d - 1, 1e-4)));   // screen px per globe radius
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    // Camera states: "near" shows the map exactly as it was on screen; "far" is the globe.
    function earthStates() {
      const r = map.getBoundingClientRect(), top = navH();
      const x0 = Math.max(r.left, 0), x1 = Math.min(r.right, innerWidth), y0 = Math.max(r.top, top), y1 = Math.min(r.bottom, innerHeight);
      const sx = (x0 + x1) / 2, sy = (y0 + y1) / 2 - top;          // centre of the visible map, in scene px
      const qx = (sx - r.left) / zoom, qy = (sy + top - r.top - shiftY) / zoom;   // the same point in map px
      const f = 1.2 * Math.max(innerWidth, innerHeight - top);
      const rho = 1.1 * Math.max(W, H);                             // map px per radian of the globe
      const near = { cx: sx, cy: sy, f, rho, d: 1 + f / (zoom * rho), lon: (qx - W / 2) / rho, lat: (qy - H / 2) / rho, rot: 0, curve: 0 };
      // Far away the islands are drawn larger on the globe (fewer map px per radian).
      const far = { cx: sky.gx, cy: sky.gy, f, rho: .55 * Math.max(W, H), d: Math.sqrt((2 * f / sky.gd) ** 2 + 1), lon: -.15, lat: .55, rot: 0, curve: 1 };
      // (lat .55 turns the islands up into the half of the globe that is on screen)
      return { near, far };
    }
    const ease = (t) => t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    function tween(ms, step) {
      return new Promise((done) => {
        if (reduce.matches) { step(1); drawEarth(); return done(); }
        const t0 = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / ms);
          step(ease(t));
          drawEarth();
          if (t < 1 && inSpace) requestAnimationFrame(tick); else done();
        };
        requestAnimationFrame(tick);
      });
    }
    // Interpolate between camera states; distance moves in log space so the zoom feels even.
    const mixState = (a, b, e) => ({
      cx: a.cx + (b.cx - a.cx) * e, cy: a.cy + (b.cy - a.cy) * e, f: a.f,
      rho: Math.exp(Math.log(a.rho) + (Math.log(b.rho) - Math.log(a.rho)) * e),
      d: 1 + Math.exp(Math.log(a.d - 1) + (Math.log(b.d - 1) - Math.log(a.d - 1)) * e),
      lon: a.lon + (b.lon - a.lon) * e, lat: a.lat + (b.lat - a.lat) * e, rot: 0,
      curve: a.curve + (b.curve - a.curve) * Math.min(1, e * 1.6)
    });
    let path = null;
    async function zoomOut() {
      if (!earth.ok) return;
      path = earthStates();
      earth.st = { ...path.near };
      scene.classList.add("globe");
      drawEarth();
      await wait(reduce.matches ? 0 : 250);
      await tween(2200, (e) => { earth.st = mixState(path.near, path.far, e); });
      // Then the planet turns slowly while we're on the moon.
      const t0 = performance.now();
      const spinTick = (now) => {
        if (!inSpace || !earth.spinning) return;
        earth.st.rot = -(now - t0) / 1000 * (2 * Math.PI / 320);   // one slow turn every ~5 minutes
        drawEarth();
        earth.raf = requestAnimationFrame(spinTick);
      };
      earth.spinning = !reduce.matches;
      if (earth.spinning) earth.raf = requestAnimationFrame(spinTick);
    }
    // Stop spinning and turn the islands back to face us.
    async function rotateHome() {
      if (!earth.ok || !earth.st) return;
      earth.spinning = false;
      cancelAnimationFrame(earth.raf);
      const rot0 = ((earth.st.rot % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;   // shortest way back
      await tween(1000, (e) => { earth.st.rot = rot0 * (1 - e); });
    }
    // The camera dives back down to the map.
    async function zoomIn() {
      if (!earth.ok || !path) return;
      await rotateHome();
      path = { near: earthStates().near, far: path.far };
      await tween(2000, (e) => { earth.st = mixState(path.far, path.near, e); });
    }
    function leaveEarthMode() {
      earth.spinning = false;
      cancelAnimationFrame(earth.raf);
      earth.st = null;
      scene.classList.remove("globe");
      if (earth.gl) { earth.gl.clearColor(0, 0, 0, 0); earth.gl.clear(earth.gl.COLOR_BUFFER_BIT); }
    }
    // A rocket on the map standing on the pad at (x, y), and a burst of smoke there.
    function makeFlyer(x, y) {
      const el = document.createElement("div");
      el.className = "flyer";
      el.innerHTML = ROCKET;
      el.style.left = x - 26 + "px";
      el.style.top = y - 6 - 92 + "px";
      inner.appendChild(el);
      return el;
    }
    function smoke(x, y) {
      for (let k = 0; k < 8; k++) {
        const puff = document.createElement("span");
        puff.className = "puff";
        puff.style.left = x + (k - 3.5) * 7 + "px";
        puff.style.top = y - 10 + "px";
        puff.style.setProperty("--dx", (k - 3.5) * 9 + "px");
        puff.style.animationDelay = k * 40 + "ms";
        inner.appendChild(puff);
        setTimeout(() => puff.remove(), 1800);
      }
    }
    // Back to Earth: the crew boards, the rocket lifts off the moon, and it lands
    // back on the launch pad on the map before the traveler steps out.
    // ---- The rocket's flight between Earth and the moon ----
    const ship = scene.querySelector(".ss-ship");
    const moonTop = () => [sky.mx, sky.my - sky.md / 2];
    // Where the launch island is on the globe right now (or a spot on Earth without WebGL).
    function islePoint() {
      const i = stops.findIndex((_, k) => isLaunch(k)), st = earth.st;
      if (!earth.ok || !st || i < 0) return [sky.gx + sky.gd * .08, sky.gy - sky.gd * .4];
      const lon = (stops[i][0] - W / 2) / st.rho - (st.lon + st.rot), lat = (stops[i][1] - 6 - H / 2) / st.rho - st.lat;
      const P = [Math.cos(lat) * Math.sin(lon), Math.sin(lat), Math.cos(lat) * Math.cos(lon)];
      if (P[2] < .15) return [sky.gx + sky.gd * .08, sky.gy - sky.gd * .4];   // turned away: use a spot facing us
      const k = st.f / (st.d - P[2]);
      return [st.cx + P[0] * k, st.cy + P[1] * k];
    }
    function placeShip(x, y, deg, scale, alpha) {
      ship.style.left = x - 26 + "px";
      ship.style.top = y - 92 + "px";
      ship.style.transform = `rotate(${deg}deg) scale(${scale})`;
      ship.style.opacity = alpha;
    }
    // Fly along a curve. "land": leave Earth nose-first, then turn upright and settle on
    // the moon. "home": lift straight up off the moon, then dive toward Earth, shrinking away.
    function fly(from, to, ms, kind) {
      const land = kind === "land";
      const out = (() => { const dx = from[0] - sky.gx, dy = from[1] - sky.gy, L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; })();
      const inn = (() => { const dx = to[0] - sky.gx, dy = to[1] - sky.gy, L = Math.hypot(dx, dy) || 1; return [dx / L, dy / L]; })();
      const keep = ([x, y]) => [Math.max(60, Math.min(sky.free - 60, x)), Math.max(60, y)];
      const P = land
        ? [from, keep([from[0] + out[0] * 200, from[1] + out[1] * 200]), keep([to[0], to[1] - 240]), to]
        : [from, keep([from[0], from[1] - 200]), keep([to[0] + inn[0] * 200, to[1] + inn[1] * 200]), to];
      const at = (t, k) => { const u = 1 - t; return u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]; };
      const vel = (t, k) => { const u = 1 - t; return 3 * u * u * (P[1][k] - P[0][k]) + 6 * u * t * (P[2][k] - P[1][k]) + 3 * t * t * (P[3][k] - P[2][k]); };
      const pose = (e) => {
        const x = at(e, 0), y = at(e, 1);
        let deg = Math.atan2(vel(e, 1), vel(e, 0)) * 180 / Math.PI + 90;
        if (land) {                          // turn upright for a tail-first landing
          const w = Math.min(1, Math.max(0, (e - .5) / .3));
          deg = deg > 180 ? deg - 360 : deg;
          deg = deg * (1 - w);
        }
        const scale = land ? .35 + .4 * e : .75 - .5 * e;
        const alpha = land ? Math.min(1, e * 6) : Math.min(1, (1 - e) * 6);
        placeShip(x, y, deg, scale, alpha);
      };
      ship.classList.add("show");
      return new Promise((done) => {
        if (reduce.matches) { pose(1); if (!land) ship.classList.remove("show"); return done(); }
        const t0 = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - t0) / ms);
          pose(t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
          if (t < 1 && inSpace) requestAnimationFrame(tick);
          else { if (!land) ship.classList.remove("show"); done(); }
        };
        requestAnimationFrame(tick);
      });
    }
    let returning = false;
    async function returnHome() {
      if (!inSpace || returning || !scene.classList.contains("landed")) return;
      returning = true;
      const run = launchRun;
      const i = stops.findIndex((_, k) => isLaunch(k));
      scene.classList.remove("landed");
      await Promise.all([wait(reduce.matches ? 0 : 300), rotateHome()]);
      // Lift off the moon and fly back down to the launch island on the globe.
      await fly(moonTop(), islePoint(), 2100, "home");
      if (run !== launchRun) return;
      await Promise.all([
        play(scene.querySelector(".ss-moon"), [{ transform: "translate(-50%, -50%)" }, { transform: `translate(-50%, -50%) translateY(${sky.sh}px)` }], { duration: 900, easing: "ease-in" }),
        zoomIn()
      ]);
      if (run !== launchRun) return;
      if (!earth.ok) await play(scene, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
      leaveEarthMode();
      scene.classList.remove("on");
      scene.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      if (i >= 0 && !reduce.matches) {
        const [x, y] = stops[i];
        const btn = locsEl.children[i], r0 = btn.getBoundingClientRect();
        if (r0.top < 0 || r0.bottom > innerHeight) btn.scrollIntoView({ block: "center" });
        const flyer = makeFlyer(x, y);
        const off = flyer.getBoundingClientRect().bottom + 80;
        await play(flyer, [{ transform: `translateY(${-off / zoom}px)` }, { transform: "translateY(0)" }],
          { duration: 1500, easing: "cubic-bezier(.15, .7, .3, 1)" });
        if (run !== launchRun) return;
        smoke(x, y);
        await wait(250);
        flyer.remove();
      }
      if (run !== launchRun) return;
      endSpace();
    }
    // Width of the screen the space scene should cover (not the docked card).
    const shownWidth = () => narrow || innerWidth < 760 ? innerWidth : innerWidth - 16 - side.offsetWidth;
    function endSpace() {
      returning = false;
      launchAt = -1;
      launchRun++;
      if (!inSpace) return;
      inSpace = false;
      scene.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      inner.querySelectorAll(".flyer, .puff").forEach((el) => el.remove());
      scene.classList.remove("on", "landed");
      ship.classList.remove("show");
      leaveEarthMode();
      svg.classList.remove("launched");
      map.classList.remove("leaving");
      hero.style.visibility = "";
      fit(true);
    }

    // Walk toward the target: back to the hub first if it's on another bridge.
    function frame(t) {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const left = remaining();
      if (left < 0.5 || reduce.matches) {
        pos = { ...target };
        place();
        raf = 0; hero.classList.remove("walking");
        arrive();
        return;
      }
      const x0 = pointAt(pos)[0];
      let step = SPEED * (launchAt >= 0 ? 2.4 : 1) * Math.min(1, 0.3 + left / 60) * dt;
      if (pos.s !== target.s && pos.d > 0) {
        pos.d = Math.max(0, pos.d - step);
      } else {
        pos.s = target.s;
        pos.d += Math.sign(target.d - pos.d) * Math.min(Math.abs(target.d - pos.d), step);
      }
      place();
      const dx = pointAt(pos)[0] - x0;
      if (Math.abs(dx) > 0.05) hero.classList.toggle("left", dx < 0);
      hero.classList.add("walking");
      raf = requestAnimationFrame(frame);
    }
    function walkTo(p) {
      target = p;
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }

    // Slide the artifact's card in from the side.
    // Wide screens keep the panel docked beside the map at all times.
    const docked = () => innerWidth >= 1000;
    function showAbout() {
      shown = -1;
      cards.forEach((c) => { c.hidden = true; });
      side.querySelector(".about-card").hidden = false;
      side.classList.add("about");
      delete side.dataset.biome;
      $("side-where").textContent = "About me";
      $("side-prev").hidden = true;
      $("side-next").disabled = false;
      $("side-next").innerHTML = "Start the tour &#9654;";
      side.querySelector(".side-body").scrollTop = 0;
      document.querySelectorAll(".quest").forEach((b) => b.classList.remove("open"));
    }
    function openCard(i, from) {
      shown = i;
      side.querySelector(".about-card").hidden = true;
      side.classList.remove("about");
      side.dataset.biome = biomeOf(i).id;        // the card takes on its island's look
      cards.forEach((c, k) => { c.hidden = k !== i; });
      $("side-where").textContent = `Stop ${pad(i + 1)} of ${pad(N)} · ${biomeOf(i).name}`;
      $("side-prev").hidden = false;
      $("side-prev").disabled = i === 0;
      $("side-next").disabled = i === N - 1;
      $("side-next").innerHTML = "Next stop &#9654;";
      side.querySelector(".side-body").scrollTop = 0;
      document.querySelectorAll(".quest").forEach((b, k) => b.classList.toggle("open", k === i));
      if (!side.classList.contains("open")) {
        opener = from || opener || null;
        side.classList.add("open");
        document.body.classList.add("side-open");
        if (!docked()) $("side-close").focus({ preventScroll: true });
      }
      fit();
    }
    // Closing a card goes back to About me (docked) or slides the panel away.
    function closeCard() {
      if (inSpace) returnHome();
      if (shown < 0) return;
      showAbout();
      if (!docked()) {
        side.classList.remove("open");
        document.body.classList.remove("side-open");
      }
      if (opener) opener.focus({ preventScroll: true });
      opener = null;
      fit();
    }
    // Going to the launch island walks there and blasts off; the card opens on the moon.
    const go = (i, from) => {
      endSpace();
      walkTo(stopPos(i));
      if (isLaunch(i)) { opener = from || opener || null; launchAt = i; }
      else openCard(i, from);
    };

    // Map pointer position to world coordinates (undoing the fit-beside-card zoom).
    const toWorld = (e) => {
      const r = map.getBoundingClientRect();
      return [(e.clientX - r.left) / zoom, (e.clientY - r.top - shiftY) / zoom];
    };
    const overlay = (e) => e.target.closest(".banner, .hud");
    map.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" || overlay(e) || N < 2 || launchAt >= 0 || inSpace) return;
      walkTo(project(...toWorld(e)));
    });
    map.addEventListener("click", (e) => {
      const b = e.target.closest(".loc");
      if (b) return go(+b.dataset.i, b);
      if (overlay(e) || canHover || N < 2) return;
      walkTo(project(...toWorld(e)));
    });
    document.querySelector(".quest-log").addEventListener("click", (e) => {
      const b = e.target.closest(".quest");
      if (b) go(+b.dataset.i, b);
    });
    locsEl.addEventListener("focusin", (e) => {
      const b = e.target.closest(".loc");
      if (b && b.matches(":focus-visible")) walkTo(stopPos(+b.dataset.i));
    });
    locsEl.addEventListener("keydown", (e) => {
      const b = e.target.closest(".loc"), k = { ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 }[e.key];
      if (!b || !k) return;
      e.preventDefault();
      locsEl.querySelectorAll(".loc")[Math.max(0, Math.min(N - 1, +b.dataset.i + k))].focus({ preventScroll: true });
    });
    $("side-prev").addEventListener("click", () => go(Math.max(0, shown - 1)));
    $("side-next").addEventListener("click", () => go(Math.min(N - 1, shown + 1)));
    showAbout();
    $("side-close").addEventListener("click", closeCard);
    addEventListener("keydown", (e) => { if (e.key === "Escape" && inSpace && shown < 0) returnHome(); });
    // Earth stays put in the sky: no page scrolling while in space (the card still scrolls).
    const noScroll = (e) => { if (inSpace && !side.contains(e.target)) e.preventDefault(); };
    addEventListener("wheel", noScroll, { passive: false });
    addEventListener("touchmove", noScroll, { passive: false });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && shown >= 0 && !document.querySelector(".lightbox[open]")) closeCard();
    });
    $("map-hint").textContent = canHover
      ? "Move your cursor to walk across the bridges. Click a landmark to open its card."
      : "Tap a landmark to walk there and open its card.";

    // A fish jumps out of the sea every few seconds, with a splash where it goes in and out.
    let seaSpot = () => null;
    setInterval(() => {
      if (inSpace || reduce.matches || document.hidden || Math.random() < .35) return;
      const at = seaSpot();
      if (!at) return;
      const [x, y] = at, dir = Math.random() < .5 ? 1 : -1, len = 14 + Math.random() * 10;
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("class", "fish-jump");
      g.innerHTML = `<circle class="splash" cx="${x}" cy="${y}" r="1"><animate attributeName="r" from="1" to="9" dur=".6s" fill="freeze"/>` +
        `<animate attributeName="opacity" from="1" to="0" dur=".6s" fill="freeze"/></circle>` +
        `<circle class="splash" cx="${x + dir * len}" cy="${y}" r="1" opacity="0"><animate attributeName="r" from="1" to="9" begin=".75s" dur=".6s" fill="freeze"/>` +
        `<animate attributeName="opacity" values="1;0" begin=".75s" dur=".6s" fill="freeze"/></circle>` +
        `<g><path class="fish" d="M5 0L-3-3L-5 0L-3 3Z M-5 0L-9-3V3Z"/>` +
        `<animateMotion dur=".8s" fill="freeze" rotate="auto" path="M${x} ${y}Q${x + dir * len / 2} ${y - 16} ${x + dir * len} ${y}"/>` +
        `<animate attributeName="opacity" values="1;1;0" dur=".85s" fill="freeze"/></g>`;
      svg.insertBefore(g, svg.querySelector(".night"));
      setTimeout(() => g.remove(), 1600);
    }, 1400);

    build();
    let pending = 0, lastW = W;
    const refit = () => {
      cancelAnimationFrame(pending);
      pending = requestAnimationFrame(() => {
        if (inSpace) return;
        if (map.clientWidth === lastW && (narrow || Math.abs(wantH() - H) < 60) && (innerWidth < 760) === narrow) return fit(true);
        cancelAnimationFrame(raf); raf = 0; hero.classList.remove("walking");
        build();
        lastW = W;
      });
    };
    new ResizeObserver(refit).observe(map);
    addEventListener("resize", refit);
  }

  // Theme toggle (remembered per browser)
  const root = document.documentElement;
  try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch (e) {}
  $("theme").addEventListener("click", () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = dark ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
  });
})();
