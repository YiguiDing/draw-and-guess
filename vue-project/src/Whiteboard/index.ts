type LineInfo = {
  strokeStyle: string;
  lineWidth: number;
  points: Array<number>;
};
export class Whiteboard {
  fillStyle = "black";
  pencilSize = 10;
  canvas!: HTMLCanvasElement;
  ctx!: CanvasRenderingContext2D;
  CANVAS_W = 1024;
  CANVAS_H = 760;
  lines: LineInfo[] = [];
  lineBuffer: LineInfo = {
    strokeStyle: "",
    lineWidth: 0,
    points: [],
  };
  afterUpdate = () => {};
  mouseInput!: InputListener;
  constructor(canvasId?: string) {
    if (canvasId) this.init(canvasId);
  }
  init(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.width = this.CANVAS_W;
    this.canvas.height = this.CANVAS_H;
    this.mouseInput = new InputListener(canvasId);
    return this;
  }
  update() {
    while (this.mouseInput.inputs.length != 0) {
      this.lines.push(this.mouseInput.inputs.shift());
    }
    this.lineBuffer = Object.assign({}, this.mouseInput.input_buffer);
    this.afterUpdate();
  }
  drawLines(graphs: LineInfo[]) {
    graphs.forEach((graph) => {
      if (graph.points.length <= 2) return;
      this.ctx.beginPath();
      this.ctx.moveTo(graph.points[0], graph.points[1]);
      for (let index = 2; index < graph.points.length; ) {
        const pointX = graph.points[index++];
        const pointY = graph.points[index++];
        this.ctx.lineTo(pointX, pointY);
      }
      this.ctx.lineWidth = graph.lineWidth;
      this.ctx.strokeStyle = graph.strokeStyle;
      this.ctx.stroke();
    });
  }
  draw(interval: number) {
    this.ctx.clearRect(0, 0, this.CANVAS_W, this.CANVAS_H);
    this.drawLines(this.lines);
    this.drawLines([this.lineBuffer]);
  }
  refresh(interval: number) {
    this.update();
    this.draw(interval);
  }
  start() {
    let last = 0;
    let animate = (current: number) => {
      this.refresh(current - last);
      last = current;
      requestAnimationFrame(animate);
    };
    animate(0);
  }
}
class InputListener {
  inputs: LineInfo[] = [];
  input_buffer: LineInfo = {
    strokeStyle: "black",
    lineWidth: 5,
    points: [],
  };
  target: HTMLElement;
  constructor(targetId: string) {
    this.target = document.getElementById(targetId) as HTMLElement;
    this.listening_pc();
    // this.listening_mobile()
  }
  listening_pc() {
    let mousedown = false;
    this.target.addEventListener("mousedown", () => {
      mousedown = true;
    });
    this.target.addEventListener("mousemove", (e) => {
      if (!mousedown) return;
      this.input_buffer.points.push(e.offsetX);
      this.input_buffer.points.push(e.offsetY);
    });
    this.target.addEventListener("mouseup", () => {
      mousedown = false;
      this.inputs.push(Object.assign({}, this.input_buffer));
      this.input_buffer.points = [];
    });
  }
  // listening_mobile() {
  // 	let touched = false;
  // 	this.target.addEventListener("touchstart", () => {
  // 		touched = true;
  // 	})
  // 	this.target.addEventListener("touchmove", (e) => {
  // 		if (!touched) return
  // 		this.inputs.push({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY })
  // 	})
  // 	this.target.addEventListener("touchend", () => {
  // 		touched = false;
  // 	})
  // }
}
