export const columns = 100;
export const lines = 50;
export const width = innerWidth;
export const height = innerHeight;
export const gridPadding = 30;
export const menuHeight = 40;

export const xInc = (width - 2 * gridPadding) / columns;
export const yInc = (height - 2 * gridPadding - menuHeight) / lines;

import p5 from "p5";
import "./types";
import { Cell } from "./cell";
import { displayGrid } from "./grid";
import { Menu, Item, IOItem } from "./menu";
import { Link } from "./link";
import { Input, Output } from "./io";

export const gridStartX = gridPadding;
export const gridEndX = width - gridPadding;
export const gridStartY = gridPadding;
export const gridEndY = height - (gridPadding + Menu.h);

export const redColor = "#b71c1c";
export const grayColor = "#212121";
export const whiteColor = "#fafafa";

new p5((p: p5) => {
  let cells: Cell[] = [];
  let links: Link[] = [];

  let inputsOutputs: (Input | Output)[] = [];

  let currentCell: Cell | null = null;
  let currentLink: Link | null = null;
  let currentIO: Input | Output | null = null;

  const menu = new Menu(p, inputsOutputs, links, cells);

  const direct = true;

  p.setup = () => {
    p.createCanvas(width, height);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);

    menu.items.push(new IOItem(p, menu, inputsOutputs, "input"));
    menu.items.push(new IOItem(p, menu, inputsOutputs, "output"));
    menu.items.push(new Item(p, menu, "AND", cells, (a, b) => [a && b], 2));
    menu.items.push(new Item(p, menu, "NOT", cells, (a) => [!a], 1));
    menu.items.push(new Item(p, menu, "OR", cells, (a, b) => [a || b], 2));
  };

  p.draw = () => {
    p.background("#0f0f0f");

    displayGrid(p);

    menu.hover();
    menu.show();

    for (const io of inputsOutputs) {
      io.show();
      io.update();
    }

    const mousePos = p.createVector(p.mouseX, p.mouseY);

    for (const cell of cells) {
      cell.update();
    }
    for (const cell of cells) {
      cell.hovered = cell.insideDrag(mousePos);

      cell.show();
    }

    for (const link of links) {
      link.show();
    }

    //Remove dead cells, dead links and dead inputs / outputs
    let i = 0;
    for (const cell of cells) {
      if (!cell.alive) cells.splice(i, 1);
      i++;
    }

    i = 0;
    for (const link of links) {
      if (!link.alive) links.splice(i, 1);
      i++;
    }

    i = 0;
    for (const io of inputsOutputs) {
      if (!io.alive) inputsOutputs.splice(i, 1);
      i++;
    }
  };

  p.mouseReleased = () => {
    if (currentCell === null && currentLink === null) {
      const mousePos = p.createVector(p.mouseX, p.mouseY);
      for (const input of inputsOutputs) {
        if (!input.dragged && input.inside(mousePos)) {
          input.click();
          break;
        }
      }
    }

    if (currentCell) {
      currentCell.release();
      currentCell.selected = false;
    } else if (currentLink) {
      currentLink.connect();
    } else if (currentIO) {
      currentIO.release();
    }

    currentCell = null;
    currentLink = null;
    currentIO = null;
  };

  p.mousePressed = () => {
    menu.click((e) => {
      if (e instanceof Cell) {
        currentCell = e;
      } else {
        currentIO = e;
      }
    });

    const mousePos = p.createVector(p.mouseX, p.mouseY);

    for (const cell of cells) {
      const _connect = cell.insideConnect(mousePos);

      if (_connect !== false) {
        const { connection, type } = _connect;

        if (currentLink === null) {
          if (type === "output")
            currentLink = new Link(
              p,
              { cell, connection },
              null,
              false,
              cells,
              direct,
              inputsOutputs
            );
          else if (type === "input")
            currentLink = new Link(
              p,
              null,
              { cell, connection },
              false,
              cells,
              direct,
              inputsOutputs
            );
        }

        links.push(currentLink);

        currentCell = null;
        currentIO = null;

        break;
      }

      if (cell.insideDrag(mousePos)) {
        currentLink = null;
        currentIO = null;

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

    for (const io of inputsOutputs) {
      const _connect = io.insideConnect(mousePos);

      if (_connect !== false) {
        const { connection, type } = _connect;

        if (currentLink === null) {
          if (type === "output")
            currentLink = new Link(
              p,
              { cell: io, connection },
              null,
              false,
              cells,
              direct,
              inputsOutputs
            );
          else if (type === "input")
            currentLink = new Link(
              p,
              null,
              { cell: io, connection },
              false,
              cells,
              direct,
              inputsOutputs
            );
        }

        links.push(currentLink);

        currentCell = null;
        currentIO = null;

        break;
      }

      if (io.inside(mousePos)) {
        currentCell = null;
        currentLink = null;
        currentIO = io;
        io.setDeltaDrag(mousePos);
      }
    }
  };

  p.mouseDragged = () => {
    if (currentCell !== null) currentCell.drag();
    if (currentIO !== null) currentIO.drag();
  };
});
