(() => {
  "use strict";

  const config = window.TORAJO_DOWNLOAD_CONFIG || {};
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const isGithubPagesHost = window.location.hostname.endsWith(".github.io");
  const inferredOwner = isGithubPagesHost
    ? window.location.hostname.replace(/\.github\.io$/i, "")
    : "";
  const inferredRepo = isGithubPagesHost
    ? (pathParts[0] || inferredOwner + ".github.io")
    : "";

  const owner = config.owner || inferredOwner;
  const repo = config.repo || inferredRepo;
  const branch = config.branch || "";

  document.getElementById("year").textContent = new Date().getFullYear();

  const rules = {
    android: /^.+V(\d+\.\d+\.\d+) For android 11-16\.apk$/i,
    pc: /^.+V(\d+\.\d+\.\d+)\.zip$/i
  };

  function compareVersions(a, b) {
    const av = a.version.split(".").map(Number);
    const bv = b.version.split(".").map(Number);
    for (let i = 0; i < 3; i++) {
      if (av[i] !== bv[i]) return bv[i] - av[i];
    }
    return a.name.localeCompare(b.name);
  }

  function safeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }

  function renderBuilds(targetId, builds, platform) {
    const target = document.getElementById(targetId);
    if (!builds.length) {
      target.innerHTML = '<p class="empty">Nenhuma build disponível.</p>';
      return;
    }

    target.innerHTML = builds.sort(compareVersions).map(build => `
      <div class="build-item">
        <div class="build-info">
          <p class="build-name">${safeText(build.name)}</p>
          <p class="build-version">Versão: ${safeText(build.version)}</p>
        </div>
        <a class="download-link" href="${safeText(build.url)}" download>
          Baixar
        </a>
      </div>
    `).join("");
  }

  async function loadFolder(folder, platform) {
    if (!owner || !repo) {
      throw new Error("Configure owner e repo em config.js para este domínio.");
    }

    const refPart = branch ? `?ref=${encodeURIComponent(branch)}` : "";
    const apiUrl = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${folder}${refPart}`;
    const response = await fetch(apiUrl, {
      headers: { "Accept": "application/vnd.github+json" }
    });

    if (response.status === 404) return [];
    if (!response.ok) {
      throw new Error(`GitHub API respondeu HTTP ${response.status}.`);
    }

    const entries = await response.json();
    if (!Array.isArray(entries)) return [];

    return entries
      .filter(entry => entry.type === "file" && typeof entry.name === "string")
      .map(entry => {
        const match = entry.name.match(rules[platform]);
        if (!match || !entry.download_url) return null;
        return { name: entry.name, version: match[1], url: entry.download_url };
      })
      .filter(Boolean);
  }

  async function start() {
    try {
      const [android, pc] = await Promise.all([
        loadFolder("ANDROID", "android"),
        loadFolder("PC", "pc")
      ]);
      renderBuilds("android-list", android, "android");
      renderBuilds("pc-list", pc, "pc");
    } catch (error) {
      console.error("Falha ao carregar builds do TorajoRP:", error);
      const message = safeText(error && error.message ? error.message : "Erro desconhecido.");
      document.getElementById("android-list").innerHTML = `<p class="error">Não foi possível carregar as builds. ${message}</p>`;
      document.getElementById("pc-list").innerHTML = `<p class="error">Não foi possível carregar as builds. ${message}</p>`;
    }
  }

  start();
})();
