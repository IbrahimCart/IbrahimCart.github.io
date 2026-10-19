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
  $("hero-desc").textContent = featured.description || PROFILE.tagline;
  $("hero-byline").textContent = `${PROFILE.name} · ${PROFILE.tagline}`;
  setLink($("hero-log"), featured.log);
  setLink($("hero-repo"), featured.repo || PROFILE.github);
  $("year").textContent = new Date().getFullYear();

  // Contact
  $("links").innerHTML = [
    ["GitHub", PROFILE.github],
    ["Email", PROFILE.email && "mailto:" + PROFILE.email],
    ["LinkedIn", PROFILE.linkedin]
  ].filter(([, u]) => u)
    .map(([l, u]) => `<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">${l}</a>`).join("");

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

  // Course sections
  $("courses").innerHTML = COURSES.map((c) => {
    const arts = c.artifacts || [];
    const done = arts.filter((a) => a.status === "released").length;
    return `
      <section class="course-block" id="${esc((c.code || "").replace(/\s+/g, "-").toLowerCase())}">
        <div class="section-head">
          <div>
            <h2>${esc(c.code)} Artifacts</h2>
            <p class="sub">${esc(c.title)}${c.term ? " · " + esc(c.term) : ""}</p>
          </div>
          <span class="counter mono">${done} / ${arts.length} released</span>
        </div>
        <div class="grid">${arts.map(artifactCard).join("")}</div>
      </section>`;
  }).join("");

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

  // Enlarged image view (native <dialog>: Esc and the close button dismiss it)
  const box = document.createElement("dialog");
  box.className = "lightbox";
  box.innerHTML = '<button type="button" class="lb-close" aria-label="Close">&times;</button><img alt=""><p></p>';
  document.body.appendChild(box);
  const openLightbox = (src, alt, cap) => {
    box.querySelector("img").src = src;
    box.querySelector("img").alt = alt || "";
    box.querySelector("p").textContent = cap || "";
    box.showModal();
  };
  box.addEventListener("click", (e) => { if (e.target === box || e.target.classList.contains("lb-close")) box.close(); });

  // Slideshows (no autoplay; arrows, dots and left/right keys)
  document.querySelectorAll(".slideshow").forEach((ss) => {
    const slides = [...ss.querySelectorAll(".ss-slide")];
    const dots = [...ss.querySelectorAll(".ss-dot")];
    let cur = 0;
    const show = (n) => {
      cur = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.hidden = k !== cur; });
      dots.forEach((d, k) => d.setAttribute("aria-current", k === cur ? "true" : "false"));
    };
    ss.querySelector(".prev")?.addEventListener("click", () => show(cur - 1));
    ss.querySelector(".next")?.addEventListener("click", () => show(cur + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => show(k)));
    slides.forEach((s) => {
      const img = s.querySelector("img");
      img.title = "Click to enlarge";
      img.addEventListener("click", () => openLightbox(img.src, img.alt, s.querySelector("figcaption")?.textContent));
    });
    ss.tabIndex = 0;
    ss.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });
  });

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
