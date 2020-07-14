let loaded = false;

addEventListener("load", () => (loaded = true));

async function requestData() {
  const repos = await fetch("https://api.github.com/users/SebLague/repos")
    .then((f) => f.json())
    .then((f) => f.filter(limit(5)));

  if (loaded) {
    render({ repos });
  } else {
    addEventListener("load", () => render({ repos }));
  }
}

requestData();
