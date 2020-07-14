function limit(max) {
  return (k, i) => i < max;
}

function render({ repos }) {
  // ----- CODING ADVENTURES -----

  const codingAdventuresSections = document.querySelector("section.sect2");
  for (const { id, thumbnail, displayName, url } of videos.filter(limit(6))) {
    const elem = document.createElement("a");
    elem.classList.add("box-1");
    const img = document.createElement("img");
    const titleContainer = document.createElement("div");
    const title = document.createElement("p");
    img.src = `assets/videos/${thumbnail}`;
    title.innerText = displayName;
    elem.href = url;
    elem.id = id;
    elem.appendChild(img);
    titleContainer.appendChild(title);
    elem.appendChild(titleContainer);
    codingAdventuresSections.appendChild(elem);
  }
  const moreCodingAdventuresContainer = document.createElement("div");
  const moreCodingAdventuresYt = document.createElement("a");
  moreCodingAdventuresYt.classList.add("more-btn");
  moreCodingAdventuresYt.href =
    "https://www.youtube.com/playlist?list=PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK";
  moreCodingAdventuresYt.innerText = "See on Youtube";
  moreCodingAdventuresContainer.appendChild(moreCodingAdventuresYt);
  const moreCodingAdventures = document.createElement("a");
  moreCodingAdventures.classList.add("more-btn");
  moreCodingAdventures.href = "/coding-adventures";
  moreCodingAdventures.innerText = "See other adventures";
  moreCodingAdventuresContainer.appendChild(moreCodingAdventures);
  codingAdventuresSections.appendChild(moreCodingAdventuresContainer);

  // ----- GITHUB -----

  const gitHubSection = document.querySelector("section.sect3");

  for (const { html_url, name, node_id } of repos) {
    const elem = document.createElement("a");
    const titleContainer = document.createElement("div");
    const title = document.createElement("p");
    title.innerText = name.replace("-", " ");
    elem.classList.add("box-2");
    elem.href = html_url;
    elem.id = node_id;
    titleContainer.appendChild(title);
    elem.appendChild(titleContainer);
    gitHubSection.appendChild(elem);
  }
  const moreGithubContainer = document.createElement("div");
  const moreGithub = document.createElement("a");
  moreGithub.href = "https://github.com/SebLague";
  moreGithub.classList.add("more-btn");
  moreGithub.innerText = "Go to GitHub";
  moreGithubContainer.appendChild(moreGithub);
  const moreRepos = document.createElement("a");
  moreRepos.href = "/repositories";
  moreRepos.classList.add("more-btn");
  moreRepos.innerText = "See all repositories";
  moreGithubContainer.appendChild(moreRepos);
  gitHubSection.appendChild(moreGithubContainer);
}
