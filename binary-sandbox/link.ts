import p5, { Vector } from "p5";
import "./types";
import { Cell } from "./cell";
import { redColor, grayColor, xInc, yInc } from "./main";
import { Input, Output } from "./io";

export interface ILinkIO {
  cell: Cell | Input | Output;
  connection: number;
}

export class Link {
  p: p5;
  start: ILinkIO | null;
  end: ILinkIO | null;
  value: boolean;
  cells: Cell[];

  direct: boolean;

  alive = true;
  io: (Input | Output)[];

  constructor(
    p: p5,
    start: ILinkIO | null,
    end: ILinkIO | null,
    value: boolean,
    cells: Cell[],
    direct: boolean,
    io: (Input | Output)[]
  ) {
    this.start = start;
    this.end = end;
    this.value = value;
    this.p = p;
    this.cells = cells;
    this.io = io;
    this.direct = direct;

    if (start !== null) start.cell.setOutput(start.connection, this);
    if (end !== null) end.cell.setInput(end.connection, this);
  }

  findNearbyCell(v: Vector): ILinkIO | null {
    for (const cell of this.cells) {
      const _connect = cell.insideConnect(v);
      if (_connect !== false) {
        return {
          cell,
          connection: _connect.connection,
        };
      }
    }

    for (const io of this.io) {
      const _connect = io.insideConnect(v);
      if (_connect !== false) {
        return {
          cell: io,
          connection: _connect.connection,
        };
      }
    }

    return null;
  }

  connect() {
    const mousePos = this.p.createVector(this.p.mouseX, this.p.mouseY);
    const linkIO = this.findNearbyCell(mousePos);

    if (
      linkIO === null ||
      (this.start === null && linkIO.cell === this.end.cell) ||
      (this.end === null && linkIO.cell === this.start.cell)
    )
      this.alive = false;

    if (
      linkIO !== null &&
      this.end === null &&
      linkIO.cell !== this.start.cell
    ) {
      linkIO.cell.setInput(linkIO.connection, this);
      this.end = linkIO;
    }

    if (
      linkIO !== null &&
      this.start === null &&
      linkIO.cell !== this.end.cell
    ) {
      this.start = linkIO;
      linkIO.cell.setOutput(linkIO.connection, this);
    }
  }

  getStartPos() {
    if (this.start === null)
      return this.p.createVector(this.p.mouseX, this.p.mouseY);

    const { cell, connection } = this.start;
    return cell.getOutputPosition(connection);
  }

  getEndPos() {
    if (this.end === null)
      return this.p.createVector(this.p.mouseX, this.p.mouseY);

    const { cell, connection } = this.end;
    return cell.getInputPosition(connection);
  }

  show() {
    this.p.noFill();

    if (this.value) this.p.stroke(redColor);
    else this.p.stroke(grayColor);

    const startPos = this.getStartPos();
    const endPos = this.getEndPos();

    this.p.strokeWeight(4);
    if (startPos.x !== endPos.x && !this.direct) {
      const midX = Math.round((startPos.x + endPos.x) / (2 * xInc)) * xInc;

      this.p.strokeJoin(this.p.ROUND);
      this.p.beginShape();
      this.p.vertex(startPos.x, startPos.y);
      this.p.vertex(midX, startPos.y);
      this.p.vertex(midX, endPos.y);
      this.p.vertex(endPos.x, endPos.y);
      this.p.endShape();
    } else {
      this.p.line(startPos.x, startPos.y, endPos.x, endPos.y);
    }
  }
}
