// ===== Global Config =====
const ADMIN_EMAIL = "AK3067@akmail.com"; // <- change to your email
const ADMIN_PASS  = "AK47BLACK"; // <- change to your password
const STORAGE_KEY = "arpit_projects_v1";

// ===== Utilities =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function getProjects(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch { return []; }
}
function saveProjects(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
function uid(){ return Math.random().toString(36).slice(2) + Date.now().toString(36); }

// ===== Page Init =====
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  // Year footer
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Render projects on index (only if element exists)
  const projectGrid = document.getElementById("projectGrid");
  if (projectGrid) {
    try {
      renderPublicProjects();
    } catch (e) {
      console.error("Error rendering projects:", e);
    }
  }

  // Setup gauges animation (only if elements exist)
  const gauges = document.querySelectorAll(".gauge");
  if (gauges.length > 0) {
    try {
      setupGauges();
    } catch (e) {
      console.error("Error setting up gauges:", e);
    }
  }

  // Set resume link (only if element exists)
  const resumeLink = document.querySelector('a[href*="resume"]');
  if (resumeLink) {
    try {
      setResumeLink();
    } catch (e) {
      console.error("Error setting resume link:", e);
    }
  }

  // Setup project modal (only if element exists)
  const projectModal = document.getElementById("projectModal");
  if (projectModal) {
    try {
      setupProjectModal();
    } catch (e) {
      console.error("Error setting up project modal:", e);
    }
  }

  // Login form
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const emailInput = document.getElementById("email");
      const passwordInput = document.getElementById("password");
      const errorBox = document.getElementById("authError");
      
      if (!emailInput || !passwordInput) {
        console.error("Login form inputs not found");
        return;
      }
      
      const email = emailInput.value.trim();
      const pass = passwordInput.value.trim();
      
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        window.location.href = "admin.html";
      } else {
        if (errorBox) {
          errorBox.classList.remove("hidden");
          errorBox.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(6px)" }, { transform: "translateX(0)" }],
            { duration: 400, iterations: 1 }
          );
          setTimeout(() => errorBox.classList.add("hidden"), 3000);
        }
      }
    });
  }

  // Password visibility toggle
  const togglePasswordBtn = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePasswordBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Admin page logic
  if (window.location.pathname.endsWith("admin.html") || document.querySelector(".admin-form")) {
    setupAdmin();
    setupResumeManagement();
  }

  // ===== Theme Toggle =====
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    });
    // On load, set theme
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light-mode");
    }
  }
});

// ===== Resume Management =====
function setupResumeManagement() {
  const uploadBtn = document.getElementById("uploadResumeBtn");
  const deleteBtn = document.getElementById("deleteResumeBtn");
  const resumeInput = document.getElementById("resumeInput");
  const alertBox = document.getElementById("resumeAlert");

  if (uploadBtn) {
    uploadBtn.addEventListener("click", () => {
      const file = resumeInput.files[0];
      if (file && file.type === "application/pdf") {
        // In a static site, we can't upload to server, so simulate by storing filename in localStorage
        localStorage.setItem("resumeFile", file.name);
        alertBox.textContent = "Resume uploaded successfully!";
        alertBox.classList.remove("hidden");
        setTimeout(() => alertBox.classList.add("hidden"), 3000);
      } else {
        alertBox.textContent = "Please select a valid PDF file.";
        alertBox.classList.remove("hidden");
        setTimeout(() => alertBox.classList.add("hidden"), 3000);
      }
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      localStorage.removeItem("resumeFile");
      alertBox.textContent = "Resume deleted!";
      alertBox.classList.remove("hidden");
      setTimeout(() => alertBox.classList.add("hidden"), 3000);
    });
  }
}

// ===== Resume Link =====
function setResumeLink() {
  const resumeLink = document.querySelector('a[href*="resume"]');
  if (resumeLink) {
    const storedFile = localStorage.getItem("resumeFile");
    if (storedFile) {
      resumeLink.href = storedFile;
      resumeLink.download = storedFile;
    } else {
      resumeLink.href = "resume.pdf";
      resumeLink.download = "Arpit_Kumar_Resume.pdf";
    }
  }
}

// ===== Project Modal =====
function setupProjectModal() {
  const modal = document.getElementById("projectModal");
  const closeBtn = document.querySelector(".close-modal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalProgress = document.getElementById("modalProgress");
  const modalLink = document.getElementById("modalLink");

  // Close modal
  closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Open modal on project click
  document.addEventListener("click", (e) => {
    if (e.target.closest(".project-card")) {
      const card = e.target.closest(".project-card");
      const img = card.querySelector("img").src;
      const title = card.querySelector(".project-title").textContent;
      const desc = card.querySelector(".project-desc").textContent;
      const progress = card.querySelector(".progress-bar").style.width;
      const link = card.querySelector(".link").href;

      modalImage.src = img;
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalProgress.style.width = progress;
      modalLink.href = link;

      modal.classList.remove("hidden");
    }
  });
}

// ===== Gauges =====
function setupGauges(){
  const targets = $$(".gauge");
  if (!targets.length) return;
  targets.forEach(g => {
    const val = Number(g.dataset.value || 0);
    const svg = gaugeSVG(val);
    g.insertAdjacentHTML("afterbegin", svg);
  });
}
function gaugeSVG(val){
  const pct = Math.max(0, Math.min(100, val));
  const arcLen = (pct/100) * 283;
  return `
    <svg viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="100" y2="0">
          <stop offset="0%" stop-color="#ff3131"/>
          <stop offset="100%" stop-color="#ff7a18"/>
        </linearGradient>
      </defs>
      <path d="M20,80 A45,45 0 1,1 80,80" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="8" stroke-linecap="round"/>
      <path d="M20,80 A45,45 0 1,1 80,80" fill="none" stroke="url(#grad)" stroke-width="8" stroke-linecap="round"
        stroke-dasharray="${arcLen} 283" transform="rotate(-135,50,50)"/>
      <g transform="rotate(${135 + 270*(pct/100)} 50 50)">
        <line x1="50" y1="50" x2="50" y2="16" stroke="#fff" stroke-width="2"/>
        <circle cx="50" cy="50" r="3" fill="#fff"/>
      </g>
    </svg>
  `;
}

// ===== Public Projects Render =====
function renderPublicProjects(){
  const grid = document.getElementById("projectGrid");
  if (!grid) return;
  const items = getProjects();
  grid.innerHTML = "";
  if (!items.length){
    grid.innerHTML = '<div class="muted">No projects yet. Login to add your first one.</div>';
    return;
  }
  items.forEach(p => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-thumb">${p.logo ? `<img src="${p.logo}" alt="logo"/>` : "<span class='muted'>No Logo</span>"}</div>
      <div class="project-body">
        <div class="project-title">${escapeHTML(p.title)}</div>
        <p class="project-desc">${escapeHTML(p.desc || "")}</p>
        <div class="progress"><div class="progress-bar" style="width:${Number(p.percent)||0}%"></div></div>
        <div class="project-meta">
          ${p.link ? `<a class="link" href="${escapeAttr(p.link)}" target="_blank" rel="noreferrer">Link</a><span class="muted">•</span>` : ""}
          <span class="muted">${Number(p.percent)||0}% complete</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ===== Admin Logic =====
function setupAdmin(){
  const title = document.getElementById("titleInput");
  const desc = document.getElementById("descInput");
  const link = document.getElementById("linkInput");
  const percent = document.getElementById("percentInput");
  const logoInput = document.getElementById("logoInput");
  const alertBox = document.getElementById("formAlert");

  let editingId = null;
  let logoDataUrl = "";

  // Live preview bindings
  const pTitle = document.getElementById("previewTitle");
  const pDesc = document.getElementById("previewDesc");
  const pBar = document.getElementById("previewBar");
  const pPct = document.getElementById("previewPct");
  const pLink = document.getElementById("previewLink");
  const pLogo = document.getElementById("previewLogo");

  function updatePreview(){
    pTitle.textContent = title.value || "Project Title";
    pDesc.textContent = desc.value || "Project details will appear here.";
    pBar.style.width = (Number(percent.value)||0) + "%";
    pPct.textContent = (Number(percent.value)||0) + "% complete";
    pLink.href = (link.value || "#");
    pLogo.src = logoDataUrl || "images/placeholder.png";
  }

  ["input","change"].forEach(evt => {
    title.addEventListener(evt, updatePreview);
    desc.addEventListener(evt, updatePreview);
    link.addEventListener(evt, updatePreview);
    percent.addEventListener(evt, updatePreview);
  });

  logoInput.addEventListener("change", () => {
    const file = logoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { logoDataUrl = reader.result; updatePreview(); };
    reader.readAsDataURL(file);
  });

  updatePreview();

  // Save & Reset
  document.getElementById("saveBtn").addEventListener("click", () => {
    const titleVal = title.value.trim();
    const perVal = Math.max(0, Math.min(100, Number(percent.value)||0));
    if (!titleVal){
      showFormAlert("Please enter a project title", true);
      return;
    }
    const list = getProjects();
    if (editingId){
      const idx = list.findIndex(x => x.id === editingId);
      if (idx >= 0){
        list[idx] = { ...list[idx],
          title: titleVal,
          desc: desc.value.trim(),
          link: link.value.trim(),
          percent: perVal,
          logo: logoDataUrl || list[idx].logo
        };
      }
    } else {
      list.unshift({
        id: uid(),
        title: titleVal,
        desc: desc.value.trim(),
        link: link.value.trim(),
        percent: perVal,
        logo: logoDataUrl,
        createdAt: Date.now()
      });
    }
    saveProjects(list);
    renderAdminList();
    clearForm();
    showFormAlert("Saved!");
  });

  document.getElementById("resetBtn").addEventListener("click", () => {
    clearForm();
    showFormAlert("Cleared");
  });

  function showFormAlert(msg, isError=false){
    alertBox.textContent = (isError ? "❌ " : "✅ ") + msg;
    alertBox.style.background = isError ? "#2a0c0c" : "#0e2a16";
    alertBox.style.borderColor = isError ? "#6b1a1a" : "#1a6b32";
    alertBox.classList.remove("hidden");
    setTimeout(() => alertBox.classList.add("hidden"), 2200);
  }

  function clearForm(){
    editingId = null;
    logoInput.value = "";
    logoDataUrl = "";
    title.value = "";
    desc.value = "";
    link.value = "";
    percent.value = 0;
    updatePreview();
  }

  // Admin list
  function renderAdminList(){
    const wrap = document.getElementById("adminList");
    wrap.innerHTML = "";
    const items = getProjects();
    if (!items.length){
      wrap.innerHTML = '<div class="muted">No projects yet.</div>';
      return;
    }
    items.forEach(p => {
      const el = document.createElement("div");
      el.className = "project-card";
      el.innerHTML = `
        <div class="project-thumb">${p.logo ? `<img src="${p.logo}" alt="logo"/>` : "<span class='muted'>No Logo</span>"}</div>
        <div class="project-body">
          <div class="project-title">${escapeHTML(p.title)}</div>
          <p class="project-desc">${escapeHTML(p.desc || "")}</p>
          <div class="progress"><div class="progress-bar" style="width:${Number(p.percent)||0}%"></div></div>
          <div class="project-meta">
            ${p.link ? `<a class="link" href="${escapeAttr(p.link)}" target="_blank" rel="noreferrer">Link</a><span class="muted">•</span>` : ""}
            <span class="muted">${Number(p.percent)||0}%</span>
          </div>
          <div class="actions" style="margin-top:8px;display:flex;gap:8px">
            <button class="btn ghost" data-edit="${p.id}">Edit</button>
            <button class="btn" data-delete="${p.id}" style="background:#331212;color:#ff9a9a">Delete</button>
          </div>
        </div>
      `;
      wrap.appendChild(el);
    });

    // Bind edit/delete
    wrap.querySelectorAll("[data-edit]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-edit");
        const items = getProjects();
        const item = items.find(x => x.id === id);
        if (!item) return;
        editingId = id;
        logoDataUrl = item.logo || "";
        title.value = item.title;
        desc.value = item.desc || "";
        link.value = item.link || "";
        percent.value = Number(item.percent)||0;
        updatePreview();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    wrap.querySelectorAll("[data-delete]").forEach(b => {
      b.addEventListener("click", () => {
        const id = b.getAttribute("data-delete");
        const yes = confirm("Delete this project?");
        if (!yes) return;
        const items = getProjects().filter(x => x.id !== id);
        saveProjects(items);
        renderAdminList();
      });
    });
  }

  renderAdminList();
}

// ===== Simple Escaping =====
function escapeHTML(s){ return (s||"").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function escapeAttr(s){ return (s||"").replace(/"/g, '&quot;'); }
