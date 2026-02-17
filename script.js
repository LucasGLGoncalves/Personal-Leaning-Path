// DevOps Tooling Portfolio (GitHub Pages friendly)
// Static data: bundled seed-tools.js. No JSON upload and no persistence.

const dashboard = document.getElementById("dashboard");
const searchInput = document.getElementById("searchInput");
const statusFilters = document.getElementById("statusFilters");
const summaryLine = document.getElementById("summaryLine");


if (typeof DEFAULT_TOOLS === "undefined") {
  document.body.innerHTML = `
    <div style="padding:24px;font-family:system-ui">
      <h1 style="font-size:20px;font-weight:700;margin:0 0 8px 0">DevOps Tooling Portfolio</h1>
      <p style="margin:0 0 8px 0">Seed data failed to load. Please check that <code>seed-tools.js</code> is present and error-free.</p>
      <p style="margin:0">If you are running this on GitHub Pages, confirm the file exists at <code>/seed-tools.js</code> in the published artifact.</p>
    </div>
  `;
  throw new Error("DEFAULT_TOOLS is not defined");
}



function normalize(s) {
  return String(s || "").toLowerCase();
}

function getStatusList() {
  // keep a stable order
  return ["Comfortable", "Used but not comfortable", "Plan to learn"];
}

let tools = JSON.parse(JSON.stringify(DEFAULT_TOOLS));
let activeStatus = "All";

function renderStatusFilters() {
  const statuses = ["All", ...getStatusList()];

  const counts = tools.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});

  statusFilters.innerHTML = statuses.map((s) => {
    const isActive = activeStatus === s;
    const base = "px-3 py-1 rounded border text-sm inline-flex items-center gap-2";
    const cls = isActive
      ? "bg-gray-900 text-white border-gray-900"
      : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50";
    const count = s === "All" ? tools.length : (counts[s] || 0);
    const emoji = s === "All" ? "🗂️" : getStatusEmoji(s);
    return `<button class="${base} ${cls}" data-status="${s}">
      <span>${emoji}</span>
      <span>${s}</span>
      <span class="opacity-70">(${count})</span>
    </button>`;
  }).join("");

  [...statusFilters.querySelectorAll("button")].forEach(btn => {
    btn.addEventListener("click", () => {
      activeStatus = btn.getAttribute("data-status");
      renderAll();
    });
  });
}

function buildGrouped(toolsList) {
  return toolsList.reduce((acc, tool) => {
    const cat = tool.category || "Uncategorized";
    acc[cat] = acc[cat] || [];
    acc[cat].push(tool);
    return acc;
  }, {});
}

function renderSummary(filteredTools) {
  const byStatus = filteredTools.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  const parts = getStatusList().map(s => `${getStatusEmoji(s)} ${s}: <span class="font-semibold">${byStatus[s] || 0}</span>`);
  summaryLine.innerHTML = `Showing <span class="font-semibold">${filteredTools.length}</span> tools. ${parts.join(" · ")}`;
}

function renderDashboard(filteredTools) {
  const grouped = buildGrouped(filteredTools);
  const categories = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  dashboard.innerHTML = "";
  categories.forEach((category) => {
    const section = document.createElement("section");
    section.className = "bg-white border rounded shadow p-4";

    const toolsInCat = [...grouped[category]].sort((a, b) => a.name.localeCompare(b.name));

    section.innerHTML = `
      <div class="flex items-center justify-between gap-3 mb-4">
        <h2 class="text-xl font-bold text-gray-800">${category}</h2>
        <div class="text-sm text-gray-600">${toolsInCat.length} tool(s)</div>
      </div>
    `;

    const grid = document.createElement("div");
    grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";

    toolsInCat.forEach((tool) => {
      const emoji = getStatusEmoji(tool.status);

      const logo = tool.logo?.trim()
        ? (tool.logo.trim().startsWith("<svg")
          ? `<div class="w-[90px] h-[90px] flex items-center justify-center overflow-hidden">${tool.logo}</div>`
          : `<img src="${tool.logo}" alt="logo" class="h-[90px] w-[90px] object-contain" loading="lazy" />`)
        : `<div class="h-[90px] w-[90px] flex items-center justify-center text-3xl">🧩</div>`;

      grid.innerHTML += `
        <div class="p-4 border bg-white rounded flex flex-col items-center text-center hover:shadow transition-shadow">
          <div class="mb-2">${logo}</div>
          <div class="font-bold text-gray-800">${tool.name}</div>
          <div class="text-sm italic text-gray-600 mt-1">${emoji} ${tool.status}</div>
        </div>
      `;
    });

    section.appendChild(grid);
    dashboard.appendChild(section);
  });
}

function getFilteredTools() {
  const query = normalize(searchInput.value);
  return tools.filter(t => {
    const matchesQuery =
      !query ||
      normalize(t.name).includes(query) ||
      normalize(t.category).includes(query) ||
      normalize(t.status).includes(query);

    const matchesStatus =
      activeStatus === "All" || t.status === activeStatus;

    return matchesQuery && matchesStatus;
  });
}

function renderAll() {
  renderStatusFilters();
  const filtered = getFilteredTools();
  renderSummary(filtered);
  renderDashboard(filtered);
}

searchInput.addEventListener("input", renderAll);

// Initial render
renderAll();
