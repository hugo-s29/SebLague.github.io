import p5 from "p5";
import "./types";
import { columns, lines } from "./main";

export function displayGrid(p: p5) {
  const xInc = p.width / columns;
  const yInc = p.height / lines;

  for (let x = 0; x < p.width; x += xInc)
    for (let y = 0; y < p.height; y += yInc) p.point(x, y);
}
