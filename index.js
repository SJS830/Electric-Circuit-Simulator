const COMPONENT_SEGMENT_LENGTH = 100;
let BUILD_COMPONENT = "wire";

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.classList.add("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  assignNodes();

  WIRES.forEach(wire => wire.draw());
  RESISTORS.forEach(resistor => resistor.draw());

  RESISTORS.forEach(resistor => resistor.getNodesTouching());
}

redraw();

let mouseX, mouseY;
window.addEventListener("mousemove", ({pageX, pageY}) => {
  mouseX = pageX;
  mouseY = pageY;

  if (BUILD_COMPONENT == "wire") {
    redraw();
    getGhostWire().draw("grey");
  } else if (BUILD_COMPONENT == "resistor") {
    redraw();
    getGhostResistor().draw("grey");
  }
});

window.addEventListener("click", () => {
  if (BUILD_COMPONENT == "wire") {
    let ghost = getGhostWire();

    WIRES = WIRES.filter(wire => !ghost.onTopOf(wire));
    RESISTORS = RESISTORS.filter(resistor => !ghost.onTopOf(resistor));

    WIRES.push(ghost);
    redraw();
  } else if (BUILD_COMPONENT == "resistor") {
    let ghost = getGhostResistor();

    WIRES = WIRES.filter(wire => !ghost.onTopOf(wire));
    RESISTORS = RESISTORS.filter(resistor => !ghost.onTopOf(resistor));

    RESISTORS.push(ghost);
    redraw();
  }
});

window.addEventListener("resize", (event) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
