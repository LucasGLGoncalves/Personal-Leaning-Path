// DevOps Tooling Portfolio (GitHub Pages friendly)
// Data persistence: browser localStorage. No server writes needed.

const dashboard = document.getElementById("dashboard");
const searchInput = document.getElementById("searchInput");
const statusFilters = document.getElementById("statusFilters");
const summaryLine = document.getElementById("summaryLine");

const STORAGE_KEY = "devopsTools.v2";
const STORAGE_META_KEY = "devopsTools.meta.v2";

function normalizeStatus(status) {
  const s = (status || "").trim();
  const map = {
    "Concluido": "Comfortable",
    "Concluído": "Comfortable",
    "Em Progresso": "Used but not comfortable",
    "Em progresso": "Used but not comfortable",
    "Pendente": "Plan to learn"
  };
  if (map[s]) return map[s];
  // Accept already-normalized English labels
  const allowed = new Set(["Comfortable", "Used but not comfortable", "Plan to learn"]);
  if (allowed.has(s)) return s;
  return s || "Plan to learn";
}

function normalizeKey(name) {
  return (name || "").trim().toLowerCase();
}

function loadTools() {
  const raw = localStorage.getItem(STORAGE_KEY);
  let stored = null;

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) stored = parsed;
    } catch (_) {}
  }

  // If we already have data, keep it — but ensure it's up-to-date with the current defaults.
  if (stored) {
    let changed = false;

    // Normalize stored items
    stored = stored.map((t) => {
      const name = (t?.name || "").trim();
      const status = normalizeStatus(t?.status);
      const logo = t?.logo || "";
      const category = t?.category || "";
      if (status !== t?.status || name !== t?.name) changed = true;
      return { ...t, name, status, logo, category };
    });

    const byName = new Map(stored.map((t) => [normalizeKey(t.name), t]));

    // Merge any missing default tools into storage
    for (const def of DEFAULT_TOOLS) {
      const key = normalizeKey(def.name);
      const existing = byName.get(key);

      if (!existing) {
        stored.push(def);
        byName.set(key, def);
        changed = true;
        continue;
      }

      // Backfill missing fields from defaults (but keep user's status)
      if (!existing.logo && def.logo) { existing.logo = def.logo; changed = true; }
      if (!existing.category && def.category) { existing.category = def.category; changed = true; }
      if (!existing.status) { existing.status = def.status; changed = true; }
    }

    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      localStorage.setItem(STORAGE_META_KEY, JSON.stringify({
        updatedAt: new Date().toISOString(),
        version: "v2",
        defaultsCount: DEFAULT_TOOLS.length
      }));
    }

    return stored;
  }

  // First run: seed from DEFAULT_TOOLS (full list)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TOOLS));
  localStorage.setItem(STORAGE_META_KEY, JSON.stringify({
    seededAt: new Date().toISOString(),
    version: "v2",
    defaultsCount: DEFAULT_TOOLS.length
  }));
  return DEFAULT_TOOLS;
}

function saveTools(tools) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
}

function normalize(s) {
  return String(s || "").toLowerCase();
}

function getStatusList() {
  // keep a stable order
  return ["Comfortable", "Used but not comfortable", "Plan to learn"];
}

let tools = loadTools();
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
  // reload from storage to reflect editor changes
  tools = loadTools();

  renderStatusFilters();
  const filtered = getFilteredTools();
  renderSummary(filtered);
  renderDashboard(filtered);
}

searchInput.addEventListener("input", renderAll);

// Initial render
renderAll();
