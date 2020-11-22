import render from "./render";
import { _coding_adventures, _tutorials, _tools } from "./videos";
import $ from "jquery";
import { _pages } from "./menu";
import cssVars from "css-vars-ponyfill";
import flexibility from "flexibility";
import "babel-polyfill";
import "bluebird";
import "json3";
import "fetch-polyfill2";

let loaded = false;
const setLoaded = () => (loaded = true);

addEventListener("load", setLoaded);

export async function requestData({
  getrepos,
  getcoding_adventures,
  gettutorials,
  gettools,
}) {
  //   const repos = await fetch("https://api.github.com/users/SebLague/repos")
  //     .then((f) => f.json())
  //     .then((f) => f.filter(limit(5)));
  let repos, coding_adventures, tutorials, tools;

  if (getrepos)
    if (process.env.NODE_ENV === "development")
      repos = await import("./gh")
        .then((f) => f.default)
        .then((f) => f.sort(() => Math.random() - 0.5).filter(limit(getrepos)));
    else
      repos = await fetch("https://api.github.com/users/SebLague/repos")
        .then((f) => f.json())
        .then((f) => f.sort(() => Math.random() - 0.5).filter(limit(getrepos)));

  if (getcoding_adventures)
    coding_adventures = _coding_adventures
      .sort(() => Math.random() - 0.5)
      .filter(limit(getcoding_adventures));
  if (gettutorials)
    tutorials = _tutorials
      .sort(() => Math.random() - 0.5)
      .filter(limit(gettutorials));

  if (gettools)
    tools = _tools.sort(() => Math.random() - 0.5).filter(limit(gettools));

  const pages = _pages;

  const _render = () =>
    render({
      repos,
      coding_adventures,
      tools,
      current_id: window.current_page_id,
      pages,
      getcoding_adventures,
      getrepos,
      tutorials,
      gettutorials,
      gettools,
    });
  if (loaded) {
    _render();
  } else {
    $(document).ready(() => _render());
  }
}

export function limit(max) {
  switch (max) {
    case true:
      return (k, i) => true;

    case false:
      return (k, i) => false;

    default:
      return (k, i) => i < max;
  }
}

export default requestData;

cssVars({});
flexibility(document.documentElement);
