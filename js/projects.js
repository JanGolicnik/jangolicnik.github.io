function get_projects_tags(p) {
  const tagsArray =
    typeof p.tags === "string" ? [p.tags] : Array.isArray(p.tags) ? p.tags : [];

  return tagsArray.length
    ? `<ul class="tags">${tagsArray.map((t) => `<li class="muted">${t}</li>`).join("")}</ul>`
    : "";
}

function render_projects() {
  return projects
    .map((p) => {
      let tags = get_projects_tags(p);
      return `
      <article id="${p.id}" class="card">
        <h2>
          ${p.name}
          <span class="meta">(<a href="${p.repo}">repository</a>)</span>
        </h2>
        ${tags}
        <p>${p.description}</p>
      </article>
    `;
    })
    .join("");
}

function render_projects_ul() {
  return projects
    .map((p) => {
      let tags = get_projects_tags(p);
      return `
        <li>
          <span class="projects-ul-span"><a href="projects.html#${p.id}">${p.name}</a> ${tags}</span>
        </li>`;
    })
    .join("");
}

function render_favorites() {
  return projects
    .filter((p) => p.favorite)
    .map((p) => {
      return `
        <li> <a href="projects.html#${p.id}">${p.name}</a> </li>`;
    })
    .join("");
}

let projects_div = document.getElementById("projects");
if (projects_div) projects_div.innerHTML = render_projects();

let projects_ul = document.getElementById("projects-ul");
if (projects_ul) projects_ul.innerHTML = render_projects_ul();

let favorites = document.getElementById("favorites");
if (favorites) favorites.innerHTML = render_favorites();
