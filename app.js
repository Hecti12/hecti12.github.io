const repoGroups = {
  analytics: [
    "Hecti12/business-dashboard-sample",
    "Hecti12/data-cleaning-case-study",
    "Hecti12/sales-forecast-project",
  ],
  it: [
    "Hecti12/windows-server-ad-lab",
    "Hecti12/azure-networking-packet-analysis",
    "Hecti12/helpdesk-ticket-system",
  ],
};

const tabs = [...document.querySelectorAll(".tab")];
const grid = document.querySelector("#project-grid");

async function fetchRepoCard(fullName) {
  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}`);
    if (!response.ok) throw new Error("Missing repo");
    const repo = await response.json();
    return `
      <article class="project-card">
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description provided yet."}</p>
        <a href="${repo.html_url}" target="_blank" rel="noreferrer">View Repository →</a>
      </article>
    `;
  } catch {
    return `
      <article class="project-card">
        <h3>${fullName.split("/")[1]}</h3>
        <p>Unable to load metadata right now. You can still open the repository directly.</p>
        <a href="https://github.com/${fullName}" target="_blank" rel="noreferrer">Open on GitHub →</a>
      </article>
    `;
  }
}

async function loadRepos(group) {
  grid.innerHTML = "<p>Loading projects...</p>";
  const cards = await Promise.all((repoGroups[group] || []).map(fetchRepoCard));
  grid.innerHTML = cards.join("");
}

function activateTab(group) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === group;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });
  loadRepos(group);
}

tabs.forEach((tab) => tab.addEventListener("click", () => activateTab(tab.dataset.tab)));
document.querySelector("#year").textContent = new Date().getFullYear();
activateTab("analytics");
