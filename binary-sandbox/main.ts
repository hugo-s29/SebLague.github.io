export const columns = 80;
export const lines = 45;
export const width = innerWidth;
export const height = innerHeight;
export const xInc = width / columns;
export const yInc = height / lines;

import p5 from "p5";
import "./types";
import { Cell } from "./cell";
import { displayGrid } from "./grid";
import { Menu, Item } from "./menu";

new p5((p: p5) => {
  let cells: Cell[] = [];
  let currentCell: Cell | null = null;
  const menu = new Menu(p);

  //@ts-ignore
  window.cells = cells;

  p.setup = () => {
    p.createCanvas(width, height);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);

    menu.items.push(new Item(p, menu, "AND", cells, (a, b) => [a && b], 2));
    menu.items.push(new Item(p, menu, "NOT", cells, (a) => [!a], 1));
  };

  p.draw = () => {
    p.background("#424242");

    p.strokeWeight(2);
    p.stroke("#626262");
    displayGrid(p);

    menu.hover();
    menu.show();

    const mousePos = p.createVector(p.mouseX, p.mouseY);
    for (const cell of cells) {
      cell.hovered = cell.insideDrag(mousePos);

      cell.show();
    }
  };

  p.mouseReleased = () => {
    if (currentCell) {
      currentCell.release();
      currentCell.selected = false;
    }
    currentCell = null;
  };

  p.mousePressed = () => {
    menu.click((c) => (currentCell = c));

    const mousePos = p.createVector(p.mouseX, p.mouseY);
    for (const cell of cells) {
      if (cell.insideDrag(mousePos)) {
        currentCell = cell;
        currentCell.setDragDifference(mousePos);
        currentCell.selected = true;

        currentCell.index = 0;

        //Set all cells to back
        cells.forEach((cell) => cell.index++);
        cells = cells.sort((a, b) => b.index - a.index);

        break;
      }
    }
  };

  p.mouseDragged = () => {
    if (currentCell !== null) currentCell.drag();
  };
});
