/**
 * @type {import("./module").Page[]}
 */
const _pages = [
  {
    file: "index.html",
    displayName: "Home",
    id: "home",
  },
  {
    file: "coding_adventures.html",
    displayName: "Coding Adventures",
    id: "coding_adventures",
  },
  {
    file: "repositories.html",
    displayName: "Repositories",
    id: "repositories",
  },
];

/**
 * @param {import("./module").Page[]} pages
 * @param {string} current_id
 */
function renderMenu(pages, current_id) {
  const nav = document.querySelector("nav");
  const ul = document.createElement("ul");

  for (const { id, file, displayName } of pages) {
    const link = document.createElement("a");
    link.textContent = displayName;
    if (id === current_id) link.classList.add("nav-selected");
    else link.href = file;

    const li = document.createElement("li");
    li.appendChild(link);
    ul.appendChild(li);
  }
  nav.appendChild(ul);
}
