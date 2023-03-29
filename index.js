class Junction {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.touchingJunctions = [];

    let domElement = document.createElement("span");
    domElement.className = "junction"
    domElement.innerHTML = "&#x2022;";
    domElement.style.left = (x - 25) + "px";
    domElement.style.top = (y - 25) + "px";
    domElement.draggable = true;

    domElement.addEventListener("drag", (event) => {
      if (event.x == 0 && event.y == 0) {
        return;
      }

      this.x = Math.floor(event.x / 10) * 10;
      this.y = Math.floor(event.y / 10) * 10;

      domElement.style.left = (this.x - 25) + "px";
      domElement.style.top = (this.y - 25) + "px";

      redraw();
    });

    domElement.addEventListener("dragstart", (event) => {
      var img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
      event.dataTransfer.setDragImage(img, 0, 0);
    });

    document.body.appendChild(domElement);
    this.domElement = domElement;
  }
}

let JUNCTIONS = [new Junction(100, 100), new Junction(500, 500)];
JUNCTIONS[0].touchingJunctions.push(JUNCTIONS[1]);
JUNCTIONS[1].touchingJunctions.push(JUNCTIONS[0]);

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.classList.add("canvas");
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  JUNCTIONS.forEach(junction => {
    junction.touchingJunctions.forEach(touching => {
      ctx.beginPath();
      ctx.moveTo(junction.x, junction.y);
      ctx.lineTo(touching.x, touching.y);
      ctx.stroke();
    });
  });
}

redraw();

canvas.addEventListener("dblclick", (event) => {
  charges.push(new Charge(1, event.x, event.y));
  doublePress = true;
});

window.addEventListener("resize", (event) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
