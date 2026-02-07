const projects = [
  {
    id: "yakuza-tower",
    name: "Yakuza Tower",
    repo: "https://github.com/Duckpedia/Yakuza-Tower",
    description:
      "Group project where I built a semi-capable rendering engine and ECS.",
    tags: ["JS", "Webgpu", "Game"],
  },
  {
    id: "ripple",
    name: "Ripple",
    repo: "https://github.com/JanGolicnik/ripple",
    description: "Immediate-mode UI layout library written in C.",
    tags: ["C", "UI"],
    favorite: true,
  },
  {
    id: "printccy",
    name: "Printccy",
    repo: "https://github.com/JanGolicnik/printccy",
    description: 'printf("Hello {}", "World")',
    tags: "C",
    favorite: true,
  },
  {
    id: "graphics-demos",
    name: "graphics_demos",
    repo: "https://github.com/JanGolicnik/graphics_demos",
    description:
      "Couple of demos including shadow mapping, datamoshing via motion vectors, glTF skeletal animation and a few others.",
    tags: ["Rust", "Webgpu"],
  },
  {
    id: "gardenere",
    name: "Gardenere",
    repo: "https://github.com/JanGolicnik/Gardenere",
    description: "Acerola Jam game made in 2 weeks.",
    tags: ["Rust", "Webgpu", "Game"],
    favorite: true,
  },
  {
    id: "void-garden",
    name: "void-garden",
    repo: "https://github.com/JanGolicnik/void-garden",
    description: "A procedural Lsystem garden you explore.",
    tags: ["Rust", "Webgpu", "Game"],
    favorite: true,
  },
  {
    id: "cpp-ray-tracer",
    name: "Software Ray Tracer",
    repo: "https://github.com/JanGolicnik/CppRayTracerEngine",
    description: "CPU ray tracer written C++. Loosely based on the PBR book.",
    tags: "C++",
  },
  {
    id: "ant-simulation",
    name: "ant-simulation",
    repo: "https://github.com/JanGolicnik/ant-simulation",
    description:
      "Ant simualtion with pheromones that gets you cool visuals implemnented in compute.",
    tags: ["C++", "OpenGL"],
  },
  {
    id: "terraria-clone",
    name: "TerrariaClone",
    repo: "https://github.com/JanGolicnik/TerrariaClone",
    description:
      "Terraria pre-hardmode clone with procedural world generation, items, bosses, UI, lighting, liquids, and audio.",
    tags: ["C++", "OpenGL"],
  },
];

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
          <span class="projects-ul-span"><a href="/projects.html#${p.id}">${p.name}</a> ${tags}</span>
        </li>`;
    })
    .join("");
}

function render_favorites() {
  return projects
    .filter((p) => p.favorite)
    .map((p) => {
      return `
        <li> <a href="/projects.html#${p.id}">${p.name}</a> </li>`;
    })
    .join("");
}

let projects_div = document.getElementById("projects");
if (projects_div) projects_div.innerHTML = render_projects();

let projects_ul = document.getElementById("projects-ul");
if (projects_ul) projects_ul.innerHTML = render_projects_ul();

let favorites = document.getElementById("favorites");
if (favorites) favorites.innerHTML = render_favorites();
