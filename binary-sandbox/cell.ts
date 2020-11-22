import p5, { Vector } from "p5";
import "./types";
import {
  yInc,
  redColor,
  grayColor,
  whiteColor,
  xInc,
  width,
  height,
} from "./main";
import { Link } from "./link";
import { Menu } from "./menu";
import { IORadius } from "./io";

export function pointInsideCircle(a: Vector, c: Vector, r: number) {
  const dt = a.copy().sub(c);
  const distSq = dt.magSq();

  return distSq <= r * r;
}

export function rectToRectCollision(
  p1: Vector,
  w1: number,
  h1: number,
  p2: Vector,
  w2: number,
  h2: number
) {
  return (
    p1.x < p2.x + w2 && p1.x + w1 > p2.x && p1.y < p2.y + h2 && p1.y + h1 > p2.y
  );
}

export class Cell {
  pos: Vector;
  p: p5;
  w: number;
  h: number;
  delta: Vector;
  selected: boolean = false;
  index: number;
  hovered: boolean;
  label: string;
  inputs: boolean[];
  outputs: boolean[];

  menu: Menu;

  outputsCount: number;
  inputsCount: number;

  inputLinks: Record<number, Link> = {};
  outputLinks: Record<number, Link[]> = {};

  alive: boolean = true;
  cells: Cell[];

  func: (...args: boolean[]) => boolean[];

  constructor(
    p: p5,
    w: number,
    i: number,
    label: string,
    pos: Vector,
    inputs: boolean[],
    func: (...args: boolean[]) => boolean[],
    menu: Menu,
    cells: Cell[]
  ) {
    this.p = p;
    this.pos = pos;
    this.w = w;
    this.label = label;
    this.index = i;
    this.inputs = inputs;
    this.inputsCount = inputs.length;
    this.outputsCount = func(...inputs).length;
    this.func = func;
    this.menu = menu;
    this.cells = cells;
    this.h = this.getHeight();
  }

  setInput(connection: number, link: Link) {
    if (this.inputLinks[connection]) {
      this.inputLinks[connection].alive = false;
      return;
    }

    if (connection >= this.inputsCount) {
      link.alive = false;
      return;
    }

    this.inputLinks[connection] = link;
  }

  setOutput(connection: number, link: Link) {
    if (!this.outputLinks[connection]) this.outputLinks[connection] = [];

    if (connection >= this.outputsCount) {
      link.alive = false;
      return;
    }

    this.outputLinks[connection].push(link);
  }

  getInputsPositions() {
    const positions: Vector[] = [];
    const inc = this.h / this.inputsCount;

    for (let i = 0; i < this.inputsCount; i++) {
      const yoffset = inc * (i + 0.5);
      const x = this.pos.x;
      const y = this.pos.y + yoffset;

      positions.push(this.p.createVector(x, y));
    }
    return positions;
  }

  update() {
    for (const key of Object.keys(this.outputLinks))
      this.outputLinks[key] = this.outputLinks[key].filter((l) => l.alive);

    for (const key of Object.keys(this.inputLinks))
      if (this.inputLinks[key] && !(this.inputLinks[key] as Link).alive)
        delete this.inputLinks[key];

    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputLinks[i]) this.inputs[i] = this.inputLinks[i].value;
      else this.inputs[i] = false;
    }

    this.outputs = this.func(...this.inputs);

    for (let i = 0; i < this.outputs.length; i++) {
      if (this.outputLinks[i])
        for (const link of this.outputLinks[i]) link.value = this.outputs[i];
    }
  }

  getInputPosition(i: number) {
    const inc = this.h / this.inputsCount;

    const yoffset = inc * (i + 0.5);
    const x = this.pos.x;
    const y = this.pos.y + yoffset;

    return this.p.createVector(x, y);
  }

  showInputs() {
    const inc = this.h / this.inputsCount;

    this.p.stroke(whiteColor);

    for (let i = 0; i < this.inputsCount; i++) {
      const yoffset = inc * (i + 0.5);
      const x = this.pos.x;
      const y = this.pos.y + yoffset;
      const d = IORadius * 2;

      const value = this.inputs[i];

      if (value) this.p.fill(redColor);
      else this.p.fill(grayColor);

      this.p.ellipse(x, y, d, d);
    }
  }

  getHeight() {
    const max = Math.max(this.inputsCount, this.outputsCount);

    return max * yInc * 2;
  }

  showOuputs() {
    const ouputs = this.func(...this.inputs);
    const inc = this.h / this.outputsCount;

    this.p.stroke(whiteColor);

    for (let i = 0; i < this.outputsCount; i++) {
      const yoffset = inc * (i + 0.5);
      const x = this.pos.x + this.w;
      const y = this.pos.y + yoffset;
      const d = IORadius * 2;

      const value = ouputs[i];

      if (value) this.p.fill(redColor);
      else this.p.fill(grayColor);

      this.p.ellipse(x, y, d, d);
    }
  }

  getOutputsPositions() {
    const positions: Vector[] = [];
    const inc = this.h / this.outputsCount;

    for (let i = 0; i < this.outputsCount; i++) {
      const yoffset = inc * (i + 0.5);
      const x = this.pos.x + this.w;
      const y = this.pos.y + yoffset;

      positions.push(this.p.createVector(x, y));
    }

    return positions;
  }

  getOutputPosition(i: number) {
    const inc = this.h / this.outputsCount;

    const yoffset = inc * (i + 0.5);
    const x = this.pos.x + this.w;
    const y = this.pos.y + yoffset;

    return this.p.createVector(x, y);
  }

  drag() {
    const p = this.p;
    this.pos = p.createVector(p.mouseX - this.delta.x, p.mouseY - this.delta.y);
  }

  release() {
    // Check for collisiion with menu
    if (
      rectToRectCollision(
        this.pos,
        this.w,
        this.h,
        this.menu.getPos(),
        this.menu.getWidth(),
        this.menu.getHeight()
      ) ||
      !rectToRectCollision(
        this.pos,
        this.w,
        this.h,
        this.p.createVector(0, 0),
        width,
        height
      )
    ) {
      this.alive = false;

      for (const key of Object.keys(this.inputLinks))
        if (this.inputLinks[key]) this.inputLinks[key].alive = false;

      for (const key of Object.keys(this.outputLinks))
        if (this.outputLinks[key])
          (this.outputLinks[key] as Link[]).forEach((l) => (l.alive = false));

      return;
    }

    const p = this.p;

    const x = Math.round((p.mouseX - this.delta.x) / xInc);
    const y = Math.round((p.mouseY - this.delta.y) / yInc);
    this.pos = p.createVector(x * xInc, y * yInc);
  }

  setDragDifference(mousePos: Vector) {
    this.delta = mousePos.copy().sub(this.pos);
  }

  insideBox(v: Vector) {
    const {
      pos: { x, y },
      w,
      h,
    } = this;

    return v.x >= x && v.x <= x + w && v.y >= y && v.y <= y + h;
  }

  insideDrag(v: Vector) {
    for (const pos of this.getInputsPositions())
      if (pointInsideCircle(v, pos, IORadius)) return false;

    for (const pos of this.getOutputsPositions())
      if (pointInsideCircle(v, pos, IORadius)) return false;

    if (this.insideBox(v)) return true;

    return false;
  }

  insideConnectInput(v: Vector) {
    let i = 0;
    for (const pos of this.getInputsPositions())
      if (pointInsideCircle(v, pos, IORadius * 2)) return i;
      else i++;

    return false;
  }

  insideConnect(
    v: Vector
  ):
    | {
        connection: number;
        type: "input" | "output";
      }
    | false {
    const connection = this.insideConnectInput(v);
    if (connection !== false) return { connection, type: "input" };
    else {
      const connection = this.insideConnectOutput(v);
      if (connection !== false) return { connection, type: "output" };
    }

    return false;
  }

  insideConnectOutput(v: Vector) {
    let i = 0;
    for (const pos of this.getOutputsPositions())
      if (pointInsideCircle(v, pos, IORadius * 2)) return i;
      else i++;

    return false;
  }

  getMiddlePoint() {
    const mid = this.pos.copy();
    const v = this.p.createVector(this.w / 2, this.h / 2);
    mid.add(v);
    return mid;
  }

  show() {
    const p = this.p;
    p.fill(grayColor);
    p.stroke(whiteColor);

    if (this.selected || this.hovered) p.strokeWeight(4);
    else p.strokeWeight(2);

    p.rect(this.pos.x, this.pos.y, this.w, this.h, 10);

    p.noStroke();
    p.fill(whiteColor);
    const mid = this.getMiddlePoint();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text(this.label, mid.x, mid.y);

    p.noStroke();
    this.showInputs();
    this.showOuputs();
  }
}
