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

function getTouchingWires(wire) {
  return WIRES.filter(neighbor => {
    if (wire[2] == "v" && neighbor[2] == "v") {
      return Math.abs(wire[1] - neighbor[1]) == 1 && wire[0] == neighbor[0];
    } else if (wire[2] == "h" && neighbor[2] == "h") {
      return Math.abs(wire[0] - neighbor[0]) == 1 && wire[1] == neighbor[1];
    } else {
      let v, h;
      if (wire[2] == "v") {
        v = wire;
        h = neighbor;
      } else {
        v = neighbor;
        h = wire;
      }

      return ((v[0] == h[0] && v[1] == h[1]) || (v[0] == 1 + h[0] && v[1] == h[1]) || (v[0] == h[0] && v[1] + 1 == h[1]) || (v[0] == 1 + h[0] && v[1] + 1 == h[1]));
    }
  });
}

function getNodes() {
  let wiresAlreadyAssigned = [];
  let nodes = [];

  function wireAlreadyAssigned(wire) {
    return wiresAlreadyAssigned.some(test => JSON.stringify(test) == JSON.stringify(wire));
  }

  function recurs(wire) {
    if (wireAlreadyAssigned(wire)) {
      return;
    }

    let node = nodes[nodes.length - 1];
    wiresAlreadyAssigned.push(wire);
    node.push[wire];

    getTouchingWires().forEach(touching => {
      recurs(touching);
    });
  }

  WIRES.forEach(wire => {
    if (wireAlreadyAssigned(wire)) {
      return;
    }

    nodes.push([]);
    recurs(wire);
  });

  return nodes;
}

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
  let ghost = getGhostWire();
  drawWire(ghost);
}

let mouseX, mouseY;
window.addEventListener("mousemove", ({pageX, pageY}) => {
  mouseX = pageX;
  mouseY = pageY;

  drawGhostWire();
  console.log(getNodes());
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
