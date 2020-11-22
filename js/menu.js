import $ from "jquery";

/**
 * @type {import("./module").Page[]}
 */
export const _pages = [
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
    file: "tutorials.html",
    displayName: "Tutorials",
    id: "tutorials",
  },
  {
    file: "repositories.html",
    displayName: "Repositories",
    id: "repositories",
  },
  {
    file: "tools.html",
    displayName: "Tools",
    id: "tools",
  },
];

/**
 * @param {import("./module").Page[]} pages
 * @param {string} current_id
 */
export function renderMenu(pages, current_id) {
  const nav = $("nav");
  const ul = $("<ul></ul>");

  for (const { id, file, displayName } of pages) {
    const link = $("<a></a>");
    link.text(displayName);
    if (id === current_id) link.addClass("nav-selected");
    else link.attr("href", file);

    const li = $("<li></li>");
    li.append(link);
    ul.append(li);
  }
  nav.append(ul);
}

export default renderMenu;
