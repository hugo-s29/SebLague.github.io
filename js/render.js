import { materialColors, colorRange } from "./colors";
import { renderMenu } from "./menu";
import $ from "jquery";

/**
 * render the page with data
 * @param {Object} param0 Requested data
 * @param {any[]} param0.repos Github Repositories list
 * @param {import("./module").Video[]} param0.coding_adventures Coding Adventures list
 * @param {import("./module").Page[]} param0.pages Page list
 * @param {import("./module").Tool[]} param0.tools Tool list
 * @param {import("./module").Tutorial[]} param0.tutorials Page list
 * @param {string} param0.current_id Current page ID
 * @param {boolean | number} param0.gettutorials Limit the number of tutorials displayed
 * @param {boolean | number} param0.getcoding_adventures Limit the number of coding adventures displayed
 * @param {boolean | number} param0.gettools Limit the number of tools displayed
 * @param {boolean | number} param0.getrepos Limit the number of repositories displayed
 */
export function render({
  repos,
  coding_adventures,
  tutorials,
  tools,
  pages,
  current_id,
  getcoding_adventures,
  getrepos,
  gettutorials,
  gettools,
}) {
  renderMenu(pages, current_id);

  let i;
  // ----- TUTORIALS -----
  if (tutorials) {
    const tutorialsSection = $("section.sect4");

    const caColors = colorRange(
      materialColors.amber[600],
      materialColors.deeporange[500],
      tutorials.length
    );
    const caBgColors = colorRange(
      materialColors.amber[800],
      materialColors.deeporange[800],
      tutorials.length
    );

    i = 0;
    for (const { id, thumbnail, displayName, url, videoCount } of tutorials) {
      const elem = $("<a></a>");
      elem.addClass("box-3");
      const img = $("<img></img>");
      const titleContainer = $("<div></div>");
      const title = $("<p></p>");
      const count = $("<p></p>");
      elem.css("--bgColor1", caBgColors[i]);
      elem.css("--color1", caColors[i]);
      img.attr("src", `assets/tutorials/${thumbnail}`);
      title.text(displayName);
      count.addClass("small");
      count.text(`${videoCount} videos`);
      title.append(count);
      elem.attr("href", url);
      elem.attr("id", id);
      elem.append(img);
      titleContainer.append(title);
      elem.append(titleContainer);
      tutorialsSection.append(elem);
      i++;
    }

    const moreTutorialsYtContainer = $("<p></p>");
    const moreTutorialsYt = $("<a></a>");
    moreTutorialsYt.addClass("more-btn");
    if (!(gettutorials !== true)) moreTutorialsYt.addClass("unsplit");
    moreTutorialsYt.attr(
      "href",
      "https://www.youtube.com/c/SebastianLague/playlists?view=1&sort=dd&shelf_id=0"
    );
    moreTutorialsYtContainer.text("See on Youtube");
    moreTutorialsYt.append(moreTutorialsYtContainer);
    tutorialsSection.append(moreTutorialsYt);
    if (gettutorials !== true) {
      const moreTutorialsContainer = $("<p></p>");
      const moreTutorials = $("<a></a>");
      moreTutorials.addClass("more-btn");
      moreTutorials.attr("href", "/tutorials.html");
      moreTutorialsContainer.text("See other tutorials");
      moreTutorials.append(moreTutorialsContainer);
      tutorialsSection.append(moreTutorials);
    }
  }

  // ----- CODING ADVENTURES -----
  if (coding_adventures) {
    const codingAdventuresSection = $("section.sect2");

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
      const elem = $("<a></a>");
      elem.addClass("box-1");
      const img = $("<img></img>");
      const titleContainer = $("<div></div>");
      const title = $("<p></p>");
      elem.css("--bgColor1", caBgColors[i]);
      elem.css("--color1", caColors[i]);
      img.attr("src", `assets/videos/${thumbnail}`);
      title.text(displayName);
      elem.attr("href", url);
      elem.attr("id", id);
      elem.append(img);
      titleContainer.append(title);
      elem.append(titleContainer);
      codingAdventuresSection.append(elem);
      i++;
    }

    const moreCodingAdventuresYtContainer = $("<p></p>");
    const moreCodingAdventuresYt = $("<a></a>");
    moreCodingAdventuresYt.addClass("more-btn");
    if (!(getcoding_adventures !== true))
      moreCodingAdventuresYt.addClass("unsplit");
    moreCodingAdventuresYt.attr(
      "href",
      "https://www.youtube.com/playlist?list=PLFt_AvWsXl0ehjAfLFsp1PGaatzAwo0uK"
    );
    moreCodingAdventuresYtContainer.text("See on Youtube");
    moreCodingAdventuresYt.append(moreCodingAdventuresYtContainer);
    codingAdventuresSection.append(moreCodingAdventuresYt);
    if (getcoding_adventures !== true) {
      const moreCodingAdventuresContainer = $("<p></p>");
      const moreCodingAdventures = $("<a></a>");
      moreCodingAdventures.addClass("more-btn");
      moreCodingAdventures.attr("href", "/coding_adventures.html");
      moreCodingAdventuresContainer.text("See other adventures");
      moreCodingAdventures.append(moreCodingAdventuresContainer);
      codingAdventuresSection.append(moreCodingAdventures);
    }
  }
  if (repos) {
    // ----- GITHUB -----

    const gitHubSection = $("section.sect3");
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
      const elem = $("<a></a>");
      const titleContainer = $("<div></div>");
      const title = $("<p></p>");
      title.text(name.replace("-", " "));
      elem.addClass("box-2");
      elem.css("--bgColor2", ghBgColors[i]);
      elem.css("--color2", ghColors[i]);
      elem.attr("href", html_url);
      elem.attr("id", node_id);
      titleContainer.append(title);
      elem.append(titleContainer);
      gitHubSection.append(elem);
      i++;
    }

    const moreGithubContainer = $("<div></div>");
    const moreGithub = $("<a></a>");
    moreGithub.attr("href", "https://github.com/SebLague");
    if (!(getrepos !== true)) moreGithub.addClass("unsplit");
    moreGithub.addClass("more-btn");
    moreGithub.text("Go to GitHub");
    moreGithubContainer.append(moreGithub);
    if (getrepos !== true) {
      const moreRepos = $("<a></a>");
      moreRepos.attr("href", "/repositories.html");
      moreRepos.addClass("more-btn");
      moreRepos.text("See all repositories");
      moreGithubContainer.append(moreRepos);
    }
    gitHubSection.append(moreGithubContainer);
  }

  if (tools) {
    // ----- Tools -----

    const toolsSection = $("section.sect5");
    const toolsColors = colorRange(
      (window.toolsColorsStart || materialColors.lime)[500],
      (window.toolsColorsEnd || materialColors.lightgreen)[500],
      tools.length
    );
    const toolsBgColors = colorRange(
      (window.toolsColorsStart || materialColors.lime)[800],
      (window.toolsColorsEnd || materialColors.lightgreen)[800],
      tools.length
    );

    i = 0;
    for (const { url, displayName } of tools) {
      const elem = $("<a></a>");
      const titleContainer = $("<div></div>");
      const title = $("<p></p>");
      title.text(displayName.replace("-", " "));
      elem.addClass("box-2");
      elem.css("--bgColor2", toolsBgColors[i]);
      elem.css("--color2", toolsColors[i]);
      elem.attr("href", url);
      titleContainer.append(title);
      elem.append(titleContainer);
      toolsSection.append(elem);
      i++;
    }

    const moreToolsContainer = $("<div></div>");
    if (gettools !== true) {
      const moreTools = $("<a></a>");
      moreTools.attr("href", "/tools.html");
      moreTools.addClass("more-btn");
      moreTools.addClass("unsplit");
      moreTools.text("See all tools");
      moreToolsContainer.append(moreTools);
    }
    toolsSection.append(moreToolsContainer);
  }

  $(".more-btn").addClass("hover-animation");
}

export default render;
