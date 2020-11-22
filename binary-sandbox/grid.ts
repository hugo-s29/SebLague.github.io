import p5 from "p5";
import "./types";
import {
  gridStartX,
  gridStartY,
  gridEndX,
  gridEndY,
  xInc,
  yInc,
  gridPadding,
  whiteColor,
} from "./main";

export const gridPaddingBackground = gridPadding / 2;

export function displayGrid(p: p5) {
  p.strokeWeight(2);

  p.stroke(whiteColor);
  p.fill("#424242");
  p.rect(
    gridStartX - gridPaddingBackground,
    gridStartY - gridPaddingBackground,
    gridEndX - gridStartX + 2 * gridPaddingBackground,
    gridEndY - gridStartY + 2 * gridPaddingBackground,
    20
  );

  p.stroke("#626262");

  for (let x = gridStartX; x <= gridEndX + xInc; x += xInc)
    for (let y = gridStartY; y <= gridEndY + yInc; y += yInc) p.point(x, y);
}
