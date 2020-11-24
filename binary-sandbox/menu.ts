import p5, { Vector } from "p5";
import "./types";
import {
  height,
  width,
  xInc,
  yInc,
  grayColor,
  redColor,
  whiteColor,
  menuHeight,
} from "./main";
import { Cell } from "./cell";
import { Input, Output } from "./io";
import { Link } from "./link";
import { getColor } from "./colors";

const itemWidth = 125;
const createBTNWidth = 175;

const pointsInsideRect = ({ x1, y1, x2, y2 }, { x, y }) =>
  x > x1 && x < x2 && y > y1 && y < y2;

export class Menu {
  p: p5;

  items: Item[] = [];

  static h: number = menuHeight;
  ios: (Input | Output)[];
  links: Link[];
  cells: Cell[];

  constructor(p: p5, ios: (Input | Output)[], links: Link[], cells: Cell[]) {
    this.p = p;
    this.ios = ios;
    this.links = links;
    this.cells = cells;
  }

  getPos() {
    return this.p.createVector(0, height - Menu.h);
  }

  getHeight() {
    return Menu.h;
  }

  getWidth() {
    return width;
  }

  getItemsWidth() {
    return this.items.length * itemWidth;
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

    if (this.insideCreateBtn()) return this.createClick();

    for (const item of this.items) {
      if (item.inside(mousePos, offset)) {
        item.onclick(cb);
        break;
      }

      offset += itemWidth;
    }
  }

  // Click on create button
  //TODO: Implement cell creation
  createClick() {
    const name = prompt("Name of the new cell ?");
  }

  // Check if mouse is on the create button
  insideCreateBtn() {
    const mousePos = this.p.createVector(this.p.mouseX, this.p.mouseY);

    const rect = {
      x1: width - createBTNWidth,
      x2: width,
      y1: height - Menu.h,
      y2: height,
    };

    return pointsInsideRect(rect, mousePos);
  }

  show() {
    const p = this.p;

    p.noStroke();
    p.fill(grayColor);
    p.rect(0, height - Menu.h, width, height);

    this.showCreateBtn();

    let offset = 0;
    for (const item of this.items) {
      item.show(offset);
      offset += itemWidth;
    }
  }

  showCreateBtn() {
    const p = this.p;
    p.fill(whiteColor);
    p.noStroke();

    p.textSize(18);

    const mid = p.createVector(width - createBTNWidth / 2, height - Menu.h / 2);

    p.text("CREATE", mid.x, mid.y);

    p.fill(255, 7);
    p.rect(width - createBTNWidth, height - Menu.h, createBTNWidth, Menu.h);
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

  cellLabelFunc: (...args: boolean[]) => string;

  color: string;

  constructor(
    p: p5,
    menu: Menu,
    label: string,
    cells: Cell[],
    func: (...args: boolean[]) => boolean[],
    inputsCount: number,
    cellLabelFunc?: (...args: boolean[]) => string
  ) {
    this.p = p;
    this.menu = menu;
    this.label = label;
    this.cells = cells;
    this.func = func;
    this.inputsCount = inputsCount;
    this.cellLabelFunc = cellLabelFunc || (() => label);
    this.color = getColor(label);
  }

  inside(v: Vector, offset: number) {
    const [xMin, yMin, xMax, yMax] = [
      offset,
      height - Menu.h,
      offset + itemWidth,
      height,
    ];

    return v.x >= xMin && v.x <= xMax && v.y >= yMin && v.y <= yMax;
  }

  show(offset: number) {
    const p = this.p;
    p.fill(whiteColor);
    p.noStroke();

    p.textSize(18);

    const mid = p.createVector(offset + itemWidth / 2, height - Menu.h / 2);

    p.text(this.label, mid.x, mid.y);

    if (this.hovered) {
      p.fill(255, 10);
      p.rect(offset, height - Menu.h, itemWidth, Menu.h);
    }
  }

  onclick(cb: (c: Input | Output | Cell) => any) {
    const v = this.p.createVector(this.p.mouseX, this.p.mouseY);
    const mid = v
      .copy()
      .sub(this.p.createVector((5 * xInc) / 2, (5 * yInc) / 2));

    const inputs: boolean[] = [];

    for (let i = 0; i < this.inputsCount; i++) inputs.push(false);

    // Replace undefined inputs with false
    const func = (...v: boolean[]) => this.func(...v.map((b) => b || false));
    const cellLabelFunc = (...v: boolean[]) =>
      this.cellLabelFunc(...v.map((b) => b || false));

    const cell = new Cell(
      this.p,
      7.5 * xInc,
      0,
      cellLabelFunc,
      mid,
      inputs,
      func,
      this.menu,
      this.cells,
      this.color
    );

    cell.setDragDifference(v);

    cb(cell);

    this.cells.push(cell);
  }
}

export class IOItem extends Item {
  type: "input" | "output";
  inputsOutputs: (Input | Output)[];

  constructor(
    p: p5,
    menu: Menu,
    io: (Input | Output)[],
    type: "input" | "output"
  ) {
    super(p, menu, type.toUpperCase(), [], () => null, 1);
    this.type = type;
    this.inputsOutputs = io;
  }

  createNewInput(v: Vector) {
    return new Input(this.p, v, this.menu);
  }
  createNewOutput(v: Vector) {
    return new Output(this.p, v, this.menu);
  }

  onclick(cb: (c: Input | Output | Cell) => any) {
    const v = this.p.createVector(this.p.mouseX, this.p.mouseY);

    const io =
      this.type === "input" ? this.createNewInput(v) : this.createNewOutput(v);

    io.setDeltaDrag(v);

    cb(io);

    this.inputsOutputs.push(io);
  }
}
