(function () {
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const STATUS = { complete: "Complete", "in-progress": "In progress", planned: "Planned" };

  // Profile
  $("name").textContent = PROFILE.name.split(" ")[0];
  $("tagline").textContent = PROFILE.tagline;
  $("bio").textContent = PROFILE.bio;
  $("gh-btn").href = PROFILE.github;
  $("year").textContent = new Date().getFullYear();

  const links = [
    ["GitHub", PROFILE.github],
    ["Email", PROFILE.email && "mailto:" + PROFILE.email],
    ["LinkedIn", PROFILE.linkedin]
  ].filter(([, url]) => url);
  $("links").innerHTML = links
    .map(([label, url]) => `<a class="btn" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`)
    .join("");

  // Filters (built from the courses used in PROJECTS)
  const courses = ["All", ...new Set(PROJECTS.map((p) => p.course).filter(Boolean))];
  let active = "All";

  function renderFilters() {
    $("filters").innerHTML = courses
      .map((c) => `<button class="${c === active ? "active" : ""}" data-c="${esc(c)}">${esc(c)}</button>`)
      .join("");
  }
  $("filters").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    active = b.dataset.c;
    renderFilters();
    renderGrid();
  });

  function card(p) {
    const status = STATUS[p.status] ? p.status : "planned";
    const linkHtml = [
      p.repo && `<a href="${esc(p.repo)}" target="_blank" rel="noopener">Code →</a>`,
      p.demo && `<a href="${esc(p.demo)}" target="_blank" rel="noopener">Live demo →</a>`
    ].filter(Boolean).join("");
    return `
      <article class="card">
        <div class="card-top">
          <span class="course">${esc(p.course)}</span>
          <span class="status ${status}">${STATUS[status]}</span>
        </div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        <div class="tags">${(p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
        ${linkHtml ? `<div class="card-links">${linkHtml}</div>` : ""}
      </article>`;
  }

  function renderGrid() {
    const list = PROJECTS.filter((p) => active === "All" || p.course === active);
    $("grid").innerHTML = list.length ? list.map(card).join("") : `<p class="empty">No projects yet.</p>`;
  }

  renderFilters();
  renderGrid();

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
