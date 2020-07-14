async function load() {
  const codingAdventuresSections = document.querySelector("section.sect2");
  for (const { id, thumbnail, displayName, url } of videos) {
    const elem = document.createElement("a");
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
  const gitHubSections = document.querySelector("section.sect3");

  const repos = await fetch(
    "https://api.github.com/users/SebLague/repos"
  ).then((f) => f.json());
  for (const { html_url, full_name, node_id } of repos) {
    const elem = document.createElement("a");
    const img = document.createElement("img");
    const titleContainer = document.createElement("div");
    const title = document.createElement("p");
    img.src = `assets/logos/github/GitHub-Mark-light-120px-plus.png`;
    title.innerText = full_name;
    elem.href = html_url;
    elem.id = node_id;
    elem.appendChild(img);
    titleContainer.appendChild(title);
    elem.appendChild(titleContainer);
    gitHubSections.appendChild(elem);
  }
}

load();

function appendOnLoad(getelem, toAppend) {
  addEventListener("load", () => {
    const elem = getelem();
    elem.appendChild(toAppend);
  });
}
