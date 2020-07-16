let loaded = false;
const setLoaded = () => (loaded = true);

addEventListener("load", setLoaded);

async function requestData({ getrepos, getcoding_adventures }) {
  //   const repos = await fetch("https://api.github.com/users/SebLague/repos")
  //     .then((f) => f.json())
  //     .then((f) => f.filter(limit(5)));
  let repos, coding_adventures;

  if (getrepos)
    repos = await fetch("/gh.json")
      .then((f) => f.json())
      .then((f) => f.filter(limit(getrepos)));

  if (getcoding_adventures)
    coding_adventures = _coding_adventures.filter(limit(getcoding_adventures));
  const pages = _pages;

  const _render = () =>
    render({
      repos,
      coding_adventures,
      current_id: window.current_page_id,
      pages,
      getcoding_adventures,
      getrepos,
    });
  if (loaded) {
    _render();
  } else {
    removeEventListener("load", setLoaded);
    addEventListener("load", () => _render());
  }
}

function limit(max) {
  switch (max) {
    case true:
      return (k, i) => true;

    case false:
      return (k, i) => false;

    default:
      return (k, i) => i < max;
  }
}
