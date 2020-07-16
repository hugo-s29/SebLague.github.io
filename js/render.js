/**
 * render the page with data
 * @param {Object} param0 Requested data
 * @param {any[]} param0.repos Github Repositories list
 * @param {import("./module").Video[]} param0.coding_adventures Coding Adventures list
 * @param {import("./module").Page[]} param0.pages Page list
 * @param {string} param0.current_id Current page ID
 * @param {boolean | number} param0.getcoding_adventures Limit the number of coding adventures displayed
 * @param {boolean | number} param0.getrepos Limit the number of repositories displayed
 */
function render({
  repos,
  coding_adventures,
  pages,
  current_id,
  getcoding_adventures,
  getrepos,
}) {
  renderMenu(pages, current_id);

  let i;
  // ----- CODING ADVENTURES -----
  if (coding_adventures) {
    const codingAdventuresSections = document.querySelector("section.sect2");

    const caColors = colorRange(
      materialColors.green[500],
      materialColors.teal[500],
      coding_adventures.length
    );
    const caBgColors = colorRange(
      materialColors.green[800],
      materialColors.teal[800],
      coding_adventures.length
    );

    i = 0;
    for (const { id, thumbnail, displayName, url } of coding_adventures) {
      const elem = document.createElement("a");
      elem.classList.add("box-1");
      const img = document.createElement("img");
      const titleContainer = document.createElement("div");
      const title = document.createElement("p");
      elem.style.setProperty("--bgColor1", caBgColors[i]);
      elem.style.setProperty("--color1", caColors[i]);
      img.src = `assets/videos/${thumbnail}`;
      title.innerText = displayName;
      elem.href = url;
      elem.id = id;
      elem.appendChild(img);
      titleContainer.appendChild(title);
      elem.appendChild(titleContainer);
      codingAdventuresSections.appendChild(elem);
      i++;
    }

    const moreCodingAdventuresYtContainer = document.createElement("p");
    const moreCodingAdventuresYt = document.createElement("a");
    moreCodingAdventuresYt.classList.add("more-btn");
    if (!(getcoding_adventures !== true && getcoding_adventures !== false))
      moreCodingAdventuresYt.classList.add("unsplit");
    moreCodingAdventuresYt.href =
      "https://www.youtube.com/playlist?list=PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK";
    moreCodingAdventuresYtContainer.innerText = "See on Youtube";
    moreCodingAdventuresYt.appendChild(moreCodingAdventuresYtContainer);
    codingAdventuresSections.appendChild(moreCodingAdventuresYt);
    if (getcoding_adventures !== true && getcoding_adventures !== false) {
      const moreCodingAdventuresContainer = document.createElement("p");
      const moreCodingAdventures = document.createElement("a");
      moreCodingAdventures.classList.add("more-btn");
      moreCodingAdventures.href = "/coding_adventures.html";
      moreCodingAdventuresContainer.innerText = "See other adventures";
      moreCodingAdventures.appendChild(moreCodingAdventuresContainer);
      codingAdventuresSections.appendChild(moreCodingAdventures);
    }
  }
  if (repos) {
    // ----- GITHUB -----

    const gitHubSection = document.querySelector("section.sect3");
    const ghColors = colorRange(
      (window.ghColorsStart || materialColors.pink)[500],
      (window.ghColorsEnd || materialColors.deeppurple)[500],
      repos.length
    );
    const ghBgColors = colorRange(
      (window.ghColorsStart || materialColors.pink)[800],
      (window.ghColorsEnd || materialColors.deeppurple)[800],
      repos.length
    );

    i = 0;
    for (const { html_url, name, node_id } of repos) {
      const elem = document.createElement("a");
      const titleContainer = document.createElement("div");
      const title = document.createElement("p");
      title.innerText = name.replace("-", " ");
      elem.classList.add("box-2");
      elem.style.setProperty("--bgColor2", ghBgColors[i]);
      elem.style.setProperty("--color2", ghColors[i]);
      elem.href = html_url;
      elem.id = node_id;
      titleContainer.appendChild(title);
      elem.appendChild(titleContainer);
      gitHubSection.appendChild(elem);
      i++;
    }

    const moreGithubContainer = document.createElement("div");
    const moreGithub = document.createElement("a");
    moreGithub.href = "https://github.com/SebLague";
    if (!(getrepos !== true && getrepos !== false))
      moreGithub.classList.add("unsplit");
    moreGithub.classList.add("more-btn");
    moreGithub.innerText = "Go to GitHub";
    moreGithubContainer.appendChild(moreGithub);
    if (getrepos !== true && getrepos !== false) {
      const moreRepos = document.createElement("a");
      moreRepos.href = "/repositories.html";
      moreRepos.classList.add("more-btn");
      moreRepos.innerText = "See all repositories";
      moreGithubContainer.appendChild(moreRepos);
    }
    gitHubSection.appendChild(moreGithubContainer);
  }

  document
    .querySelectorAll(".more-btn")
    .forEach((f) => f.classList.add("hover-animation"));
}
