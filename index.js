let WIRES = [[5, 5, "h"], [5, 5, "v"]];

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.classList.add("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function drawWire([x, y, direction]) {
  ctx.beginPath();
  ctx.moveTo(x * 100, y *100);

  if (direction == "h") {
    ctx.lineTo((x + 1) * 100, y * 100);
  } else if (direction == "v") {
    ctx.lineTo(x * 100, (y + 1) * 100);
  }

  ctx.stroke();
}

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  WIRES.forEach(drawWire);
}

redraw();

function getGhostWire() {
  let wx = mouseX / 100;
  let wy = mouseY / 100;

  let ax = wx % 1;
  let ay = wy % 1;

  let u = Math.hypot(.5 - ax, 0 - ay);
  let d = Math.hypot(.5 - ax, 1 - ay);
  let l = Math.hypot(0 - ax, .5 - ay);
  let r = Math.hypot(1 - ax, .5 - ay);
  let min = Math.min(u, d, l, r);

  let ghostWire = [];
  if (u == min) {
    ghostWire[0] = Math.floor(wx);
    ghostWire[1] = Math.floor(wy);
    ghostWire[2] = "h";
  } else if (d == min) {
    ghostWire[0] = Math.floor(wx);
    ghostWire[1] = Math.floor(wy) + 1;
    ghostWire[2] = "h";
  } else if (l == min) {
    ghostWire[0] = Math.floor(wx);
    ghostWire[1] = Math.floor(wy);
    ghostWire[2] = "v";
  } else if (r == min) {
    ghostWire[0] = Math.floor(wx) + 1;
    ghostWire[1] = Math.floor(wy);
    ghostWire[2] = "v";
  }

  return ghostWire;
}

function drawGhostWire() {
  redraw();
  drawWire(getGhostWire());
}

let mouseX, mouseY;
window.addEventListener("mousemove", ({pageX, pageY}) => {
  mouseX = pageX;
  mouseY = pageY;

  drawGhostWire();
});

window.addEventListener("click", () => {
  let ghost = getGhostWire();

  if (!WIRES.some(wire => JSON.stringify(wire) == JSON.stringify(ghost))) {
    WIRES.push(ghost);
    redraw();
  }
});

window.addEventListener("resize", (event) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
