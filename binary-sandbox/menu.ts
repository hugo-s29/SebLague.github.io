import p5, { Vector } from "p5";
import "./types";
import { height, width, xInc, yInc } from "./main";
import { Cell } from "./cell";

const itemWidth = 125;

export class Menu {
  p: p5;

  items: Item[] = [];

  h: number = 40;

  constructor(p: p5) {
    this.p = p;
  }

  hover() {
    let offset = 0;
    const mousePos = this.p.createVector(this.p.mouseX, this.p.mouseY);

    for (const item of this.items) item.hovered = false;

    for (const item of this.items) {
      if (item.inside(mousePos, offset)) {
        item.hovered = true;
        break;
      }

      offset += itemWidth;
    }
  }

  click(cb: (c: Cell) => any) {
    let offset = 0;
    const mousePos = this.p.createVector(this.p.mouseX, this.p.mouseY);

    for (const item of this.items) {
      if (item.inside(mousePos, offset)) {
        item.onclick(cb);
        break;
      }

      offset += itemWidth;
    }
  }

  show() {
    const p = this.p;

    p.noStroke();
    p.fill("#212121");
    p.rect(0, height - this.h, width, height);

    let offset = 0;
    for (const item of this.items) {
      item.show(offset);
      offset += itemWidth;
    }
  }
}

export class Item {
  menu: Menu;
  p: p5;
  label: string;

  hovered: boolean = false;

  cells: Cell[];

  func: (...args: boolean[]) => boolean[];
  inputsCount: number;

  constructor(
    p: p5,
    menu: Menu,
    label: string,
    cells: Cell[],
    func: (...args: boolean[]) => boolean[],
    inputsCount: number
  ) {
    this.p = p;
    this.menu = menu;
    this.label = label;
    this.cells = cells;
    this.func = func;
    this.inputsCount = inputsCount;
  }

  inside(v: Vector, offset: number) {
    const [xMin, yMin, xMax, yMax] = [
      offset,
      height - this.menu.h,
      offset + itemWidth,
      height,
    ];

    return v.x >= xMin && v.x <= xMax && v.y >= yMin && v.y <= yMax;
  }

  show(offset: number) {
    const p = this.p;
    p.fill("#fafafa");
    p.noStroke();

    p.textSize(18);

    const mid = p.createVector(
      offset + itemWidth / 2,
      height - this.menu.h / 2
    );

    p.text(this.label, mid.x, mid.y);

    if (this.hovered) {
      p.fill(255, 10);
      p.rect(offset, height - this.menu.h, itemWidth, this.menu.h);
    }
  }

  onclick(cb: (c: Cell) => any) {
    const v = this.p.createVector(this.p.mouseX, this.p.mouseY);
    const mid = v
      .copy()
      .sub(this.p.createVector((5 * xInc) / 2, (5 * yInc) / 2));

    const inputs = [];

    for (let i = 0; i < this.inputsCount; i++) inputs.push(false);

    const cell = new Cell(
      this.p,
      7.5 * xInc,
      0,
      this.label,
      mid,
      inputs,
      this.func
    );
    cell.setDragDifference(v);

    cb(cell);

    this.cells.push(cell);
  }
}
