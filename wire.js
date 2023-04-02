let WIRES = [];

class Wire {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;

    this.node = -1;
  }

  draw(color = "black") {
    ctx.beginPath();
    ctx.strokeStyle = color;

    ctx.moveTo(this.x * COMPONENT_SEGMENT_LENGTH, this.y * COMPONENT_SEGMENT_LENGTH);

    if (this.direction == "horizontal") {
      ctx.lineTo((this.x + 1) * COMPONENT_SEGMENT_LENGTH, this.y * COMPONENT_SEGMENT_LENGTH);
    } else if (this.direction == "vertical") {
      ctx.lineTo(this.x * COMPONENT_SEGMENT_LENGTH, (this.y + 1) * COMPONENT_SEGMENT_LENGTH);
    }

    ctx.stroke();
  }

  getTouchingWires() {
    return WIRES.filter(other => {
      if (this.onTopOf(other)) {
        return false;
      }

      if (this.direction == "vertical" && other.direction == "vertical") {
        return Math.abs(this.y - other.y) == 1 && this.x == other.x;
      } else if (this.direction == "horizontal" && other.direction == "horizontal") {
        return Math.abs(this.x - other.x) == 1 && this.y == other.y;
      } else {
        let v, h;
        if (this.direction == "vertical") {
          v = this;
          h = other;
        } else {
          v = other;
          h = this;
        }

        return ((v.x == h.x && v.y == h.y) || (v.x == 1 + h.x && v.y == h.y) || (v.x == h.x && v.y + 1 == h.y) || (v.x == 1 + h.x && v.y + 1 == h.y));
      }
    });
  }

  onTopOf(other) {
    let thisHoriz = (this.direction == "horizontal");
    let otherHoriz = (other.direction == "horizontal" || other.direction == "left" || other.direction == "right");

    return this.x == other.x && this.y == other.y && thisHoriz == otherHoriz;
  }
}

function assignNodes() {
  let wiresAlreadyAssigned = [];
  let nodes = [];

  function wireAlreadyAssigned(wire) {
    return wiresAlreadyAssigned.some(other => wire.onTopOf(other));
  }

  function recurs(wire) {
    if (wireAlreadyAssigned(wire)) {
      return;
    }

    let node = nodes[nodes.length - 1];
    wiresAlreadyAssigned.push(wire);

    node.push(wire);
    wire.node = nodes.length - 1;

    wire.getTouchingWires().forEach(touching => {
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
  let wx = mouseX / COMPONENT_SEGMENT_LENGTH;
  let wy = mouseY / COMPONENT_SEGMENT_LENGTH;

  let ax = wx % 1;
  let ay = wy % 1;

  let u = Math.hypot(.5 - ax, 0 - ay);
  let d = Math.hypot(.5 - ax, 1 - ay);
  let l = Math.hypot(0 - ax, .5 - ay);
  let r = Math.hypot(1 - ax, .5 - ay);
  let min = Math.min(u, d, l, r);

  if (u == min) {
    return new Wire(Math.floor(wx), Math.floor(wy), "horizontal");
  } else if (d == min) {
    return new Wire(Math.floor(wx), Math.floor(wy) + 1, "horizontal");
  } else if (l == min) {
    return new Wire(Math.floor(wx), Math.floor(wy), "vertical");
  } else if (r == min) {
    return new Wire(Math.floor(wx) + 1,  Math.floor(wy), "vertical");
  }
}
