const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const table = document.getElementById("toolTable");
const nameInput = document.getElementById("toolName");
const logoInput = document.getElementById("toolLogo");
const statusInput = document.getElementById("toolStatus");
const categoryInput = document.getElementById("toolCategory");
const searchInput = document.getElementById("searchTools");

const STORAGE_KEY = "devopsTools.v2";
let tools = [];

let currentIndex = null;

function loadTools() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { return JSON.parse(raw); } catch (_) {}
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TOOLS));
  return DEFAULT_TOOLS;
}

function saveTools() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
}

function normalize(s) {
  return String(s || "").toLowerCase();
}

function renderTable(filter = "") {
  const q = normalize(filter);
  const filtered = tools.filter(t =>
    !q ||
    normalize(t.name).includes(q) ||
    normalize(t.category).includes(q) ||
    normalize(t.status).includes(q)
  );

  const sorted = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  table.innerHTML = sorted.map((t) => {
    const realIndex = tools.indexOf(t);
    const logoCell = t.logo?.trim()
      ? (t.logo.trim().startsWith("<svg")
        ? t.logo
        : `<img src='${t.logo}' alt='logo' class='h-6 w-6 object-contain'/>`)
      : `<span class="text-gray-400">—</span>`;

    return `
      <tr class="border-t hover:bg-gray-50 transition-colors">
        <td class='p-2 align-middle'>${logoCell}</td>
        <td class='p-2 align-middle font-medium text-gray-900'>${t.name}</td>
        <td class='p-2 align-middle'>${getStatusEmoji(t.status)} ${t.status}</td>
        <td class='p-2 align-middle'>${t.category}</td>
        <td class='p-2 align-middle'>
          <button onclick="editTool(${realIndex})" class="text-blue-600 hover:underline mr-4">
            <i class="fa-solid fa-pen"></i> Edit
          </button>
          <button onclick="deleteTool(${realIndex})" class="text-red-600 hover:underline">
            <i class="fa-solid fa-trash"></i> Delete
          </button>
        </td>
      </tr>
    `;
  }).join("");
}

function openModal(index = null) {
  currentIndex = index;
  modal.classList.remove("hidden");

  if (index !== null) {
    const t = tools[index];
    modalTitle.textContent = "Edit tool";
    nameInput.value = t.name || "";
    logoInput.value = t.logo || "";
    statusInput.value = t.status || "Comfortable";
    categoryInput.value = t.category || "";
  } else {
    modalTitle.textContent = "New tool";
    nameInput.value = "";
    logoInput.value = "";
    statusInput.value = "Comfortable";
    categoryInput.value = "";
  }

  setTimeout(() => nameInput.focus(), 0);
}

function closeModal() {
  modal.classList.add("hidden");
  currentIndex = null;
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

function saveTool() {
  const name = nameInput.value.trim();
  const logo = logoInput.value.trim();
  const status = statusInput.value;
  const category = categoryInput.value.trim();

  if (!name || !status || !category) {
    alert("Please fill in all required fields (name, status, category).");
    return;
  }

  const item = { name, logo, status, category };

  if (currentIndex !== null) {
    tools[currentIndex] = item;
  } else {
    tools.push(item);
  }

  saveTools();
  closeModal();
  renderTable(searchInput.value);
}

function deleteTool(index) {
  const t = tools[index];
  if (!t) return;

  if (confirm(`Delete "${t.name}"?`)) {
    tools.splice(index, 1);
    saveTools();
    renderTable(searchInput.value);
  }
}

function editTool(index) {
  openModal(index);
}

function importTools(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);

      if (!Array.isArray(imported)) {
        alert("Invalid JSON: expected an array of tools.");
        return;
      }

      // Normalize + keep only expected fields
      const normalized = imported.map((t) => ({
        name: String(t.name || "").trim(),
        logo: String(t.logo || "").trim(),
        status: String(t.status || "").trim(),
        category: String(t.category || "").trim(),
      })).filter(t => t.name && t.status && t.category);

      if (normalized.length === 0) {
        alert("No valid tools found in the JSON file.");
        return;
      }

      tools = [...tools, ...normalized];
      saveTools();
      renderTable(searchInput.value);
    } catch (_) {
      alert("Failed to import JSON.");
    } finally {
      // allow importing the same file twice
      event.target.value = "";
    }
  };

  reader.readAsText(file);
}

function exportTools() {
  const blob = new Blob([JSON.stringify(tools, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "devops-tools.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function resetToDefaults() {
  if (!confirm("Reset your list to the default tools? This will overwrite your current data.")) return;
  tools = [...DEFAULT_TOOLS];
  saveTools();
  renderTable(searchInput.value);
}

searchInput.addEventListener("input", (e) => renderTable(e.target.value));

tools = loadTools();
renderTable();
