import p5, { Vector } from "p5";
import "./types";
import { columns, lines, yInc } from "./main";

export function pointInsideCircle(a: Vector, c: Vector, r: number) {
  const dt = a.copy().sub(c);
  const distSq = dt.magSq();

  return distSq <= r * r;
}

export const inputRadius = yInc * 0.5;

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

  outputsCount: number;
  inputsCount: number;

  func: (...args: boolean[]) => boolean[];

  constructor(
    p: p5,
    w: number,
    i: number,
    label: string,
    pos: Vector,
    inputs: boolean[],
    func: (...args: boolean[]) => boolean[]
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
    this.h = this.getHeight();
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

  showInputs() {
    const inc = this.h / this.inputsCount;

    for (let i = 0; i < this.inputsCount; i++) {
      const yoffset = inc * (i + 0.5);
      const x = this.pos.x;
      const y = this.pos.y + yoffset;
      const d = inputRadius * 2;

      const value = this.inputs[i];

      this.p.fill(255 * +value, 0, 0);
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

    for (let i = 0; i < this.outputsCount; i++) {
      const yoffset = inc * (i + 0.5);
      const x = this.pos.x + this.w;
      const y = this.pos.y + yoffset;
      const d = inputRadius * 2;

      const value = ouputs[i];

      this.p.fill(255 * +value, 0, 0);
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

  drag() {
    const p = this.p;
    this.pos = p.createVector(p.mouseX - this.delta.x, p.mouseY - this.delta.y);
  }

  release() {
    const p = this.p;

    const xGrid = p.width / columns;
    const yGrid = p.height / lines;

    const x = Math.round((p.mouseX - this.delta.x) / xGrid);
    const y = Math.round((p.mouseY - this.delta.y) / yGrid);
    this.pos = p.createVector(x * xGrid, y * yGrid);
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
      if (pointInsideCircle(v, pos, inputRadius)) return false;

    for (const pos of this.getOutputsPositions())
      if (pointInsideCircle(v, pos, inputRadius)) return false;

    if (this.insideBox(v)) return true;

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
    p.fill("#212121");
    p.stroke("#fafafa");

    if (this.selected || this.hovered) p.strokeWeight(4);
    else p.strokeWeight(2);

    p.rect(this.pos.x, this.pos.y, this.w, this.h, 10);

    p.noStroke();
    p.fill("#fafafa");
    const mid = this.getMiddlePoint();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text(this.label, mid.x, mid.y);

    p.noStroke();
    this.showInputs();
    this.showOuputs();
  }
}
