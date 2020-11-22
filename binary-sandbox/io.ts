import p5, { Vector } from "p5";
import "./types";
import {
  yInc,
  grayColor,
  redColor,
  whiteColor,
  xInc,
  width,
  height,
} from "./main";
import { Link } from "./link";
import { pointInsideCircle, Cell, rectToRectCollision } from "./cell";
import { Menu } from "./menu";

export const IORadius = Math.min(xInc, yInc) * 0.5;

// Used for global IO, not the cell's IO
export const globalIORadius = IORadius * 1.5;
export const globalIOConnectionRadius = globalIORadius;

export class Input {
  connected: Link[] = [];
  p: p5;
  pos: p5.Vector;

  connectionPoint: Vector;
  delta: Vector;

  value: boolean;

  dragged: boolean = false;
  menu: Menu;
  alive: boolean = true;

  constructor(p: p5, pos: Vector, menu: Menu) {
    this.p = p;
    this.menu = menu;
    this.pos = pos;
    this.releaseConnectionPoint();
  }

  insideConnect(
    v: Vector
  ): { connection: number; type: "input" | "output" } | false {
    const pos = this.getInputPosition();
    if (pointInsideCircle(v, pos, globalIOConnectionRadius))
      return {
        connection: 0,
        type: "output",
      };

    return false;
  }

  getInputPosition(i?: number) {
    return this.connectionPoint.copy();
  }

  getOutputPosition(i?: number) {
    return this.connectionPoint.copy();
  }

  checkCollision() {
    // The input is approximated with a rectangle

    const h = Math.max(globalIORadius * 2, globalIOConnectionRadius);
    const w = globalIORadius + globalIOConnectionRadius / 2 + xInc * 2;

    if (
      rectToRectCollision(
        this.pos,
        w,
        h,
        this.menu.getPos(),
        this.menu.getWidth(),
        this.menu.getHeight()
      ) ||
      !rectToRectCollision(
        this.pos,
        w,
        h,
        this.p.createVector(0, 0),
        width,
        height
      )
    ) {
      this.alive = false;
    }
  }

  setInput(connection: number, l: Link) {}

  setOutput(connection: number, l: Link) {
    l.value = this.value;
    this.connected.push(l);
  }

  inside(v: Vector) {
    return pointInsideCircle(v, this.pos, globalIORadius);
  }

  release() {
    const x = Math.round(this.pos.x / xInc) * xInc;
    const y = Math.round(this.pos.y / xInc) * xInc;
    this.pos = this.p.createVector(x, y);
    this.releaseConnectionPoint();
    this.checkCollision();
  }

  click() {
    this.value = !this.value;
    for (const link of this.connected) {
      link.value = this.value;
    }
  }

  setDeltaDrag(mouse: Vector) {
    this.delta = this.pos.copy().sub(mouse);
    this.dragged = false;
  }

  updateConnectionPoint() {
    const x = this.pos.x + xInc * 2;
    const y = this.pos.y;

    this.connectionPoint = this.p.createVector(x, y);
  }

  releaseConnectionPoint() {
    const x = Math.round((this.pos.x + xInc * 2) / xInc) * xInc;
    const y = this.pos.y;
    this.connectionPoint = this.p.createVector(x, y);
  }

  drag() {
    const p = this.p;
    const mouse = p.createVector(p.mouseX, p.mouseY);

    this.pos = this.delta.copy().add(mouse);
    this.updateConnectionPoint();
    this.dragged = true;
  }

  update() {}

  show() {
    const p = this.p;

    p.strokeWeight(2);
    p.stroke(whiteColor);
    p.fill(this.value ? redColor : grayColor);
    const d = globalIORadius * 2;
    p.ellipse(this.pos.x, this.pos.y, d, d);

    p.noStroke();
    const connectionDiameter = globalIOConnectionRadius;
    p.ellipse(
      this.connectionPoint.x,
      this.connectionPoint.y,
      connectionDiameter,
      connectionDiameter
    );

    p.noFill();
    p.stroke(this.value ? redColor : grayColor);
    p.strokeWeight(4);
    p.line(
      this.pos.x,
      this.pos.y,
      this.connectionPoint.x,
      this.connectionPoint.y
    );
  }
}

export class Output {
  connected: Link | null = null;
  p: p5;
  pos: p5.Vector;

  connectionPoint: Vector;
  delta: Vector;

  value: boolean;

  dragged: boolean = false;
  menu: Menu;

  alive: boolean = true;

  constructor(p: p5, pos: Vector, menu: Menu) {
    this.p = p;
    this.menu = menu;
    this.pos = pos;
    this.releaseConnectionPoint();
  }

  insideConnect(
    v: Vector
  ): { connection: number; type: "input" | "output" } | false {
    const pos = this.getInputPosition();
    if (pointInsideCircle(v, pos, globalIOConnectionRadius))
      return {
        connection: 0,
        type: "input",
      };

    return false;
  }

  getInputPosition(i?: number) {
    return this.connectionPoint.copy();
  }

  getOutputPosition(i?: number) {
    return this.connectionPoint.copy();
  }

  setOutput(connection: number, l: Link) {}

  setInput(connection: number, l: Link) {
    this.value = l.value;
    this.connected = l;
  }

  inside(v: Vector) {
    return pointInsideCircle(v, this.pos, globalIORadius);
  }

  release() {
    this.checkCollision();
    const x = Math.round(this.pos.x / xInc) * xInc;
    const y = Math.round(this.pos.y / xInc) * xInc;
    this.pos = this.p.createVector(x, y);
    this.releaseConnectionPoint();
  }

  update() {
    if (this.connected) this.value = this.connected.value;
  }

  checkCollision() {
    // The output is approximated with a rectangle

    const h = Math.max(globalIORadius * 2, globalIOConnectionRadius);
    const w = globalIORadius + globalIOConnectionRadius / 2 + xInc * 2;

    if (
      rectToRectCollision(
        this.pos,
        w,
        h,
        this.menu.getPos(),
        this.menu.getWidth(),
        this.menu.getHeight()
      ) ||
      !rectToRectCollision(
        this.pos,
        w,
        h,
        this.p.createVector(0, 0),
        width,
        height
      )
    ) {
      this.alive = false;
    }
  }

  click() {}

  setDeltaDrag(mouse: Vector) {
    this.delta = this.pos.copy().sub(mouse);
    this.dragged = false;
  }

  updateConnectionPoint() {
    const x = this.pos.x - xInc * 2;
    const y = this.pos.y;

    this.connectionPoint = this.p.createVector(x, y);
  }

  releaseConnectionPoint() {
    const x = Math.round((this.pos.x - xInc * 2) / xInc) * xInc;
    const y = this.pos.y;
    this.connectionPoint = this.p.createVector(x, y);
  }

  drag() {
    const p = this.p;
    const mouse = p.createVector(p.mouseX, p.mouseY);

    this.pos = this.delta.copy().add(mouse);
    this.updateConnectionPoint();
    this.dragged = true;
  }

  show() {
    const p = this.p;

    p.strokeWeight(2);
    p.stroke(whiteColor);
    p.fill(this.value ? redColor : grayColor);
    const d = globalIORadius * 2;
    p.ellipse(this.pos.x, this.pos.y, d, d);

    p.noStroke();
    const connectionDiameter = globalIOConnectionRadius;
    p.ellipse(
      this.connectionPoint.x,
      this.connectionPoint.y,
      connectionDiameter,
      connectionDiameter
    );

    p.noFill();
    p.stroke(this.value ? redColor : grayColor);
    p.strokeWeight(4);
    p.line(
      this.pos.x,
      this.pos.y,
      this.connectionPoint.x,
      this.connectionPoint.y
    );
  }
}
