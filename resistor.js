let RESISTORS = [];

class Resistor {
  constructor(x, y, direction) {
    this.x = x;
    this.y = y;
    this.direction = direction;

    this.node_in = -1;
    this.node_out = -1;
  }

  draw(color = "red") {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    ctx.moveTo(this.x * COMPONENT_SEGMENT_LENGTH, this.y * COMPONENT_SEGMENT_LENGTH);

    if (this.direction == "left" || this.direction == "right") {
      ctx.lineTo((this.x + 1) * COMPONENT_SEGMENT_LENGTH, this.y * COMPONENT_SEGMENT_LENGTH);
    } else if (this.direction == "up" || this.direction == "down") {
      ctx.lineTo(this.x * COMPONENT_SEGMENT_LENGTH, (this.y + 1) * COMPONENT_SEGMENT_LENGTH);
    }

    ctx.stroke();

    if (this.direction == "left") {
      ctx.fillRect((this.x * COMPONENT_SEGMENT_LENGTH) + 5, (this.y * COMPONENT_SEGMENT_LENGTH) - 5, 10, 10);
    } else if (this.direction == "right") {
      ctx.fillRect(((this.x + 1) * COMPONENT_SEGMENT_LENGTH) - 15, (this.y * COMPONENT_SEGMENT_LENGTH) - 5, 10, 10);
    } else if (this.direction == "down") {
      ctx.fillRect((this.x * COMPONENT_SEGMENT_LENGTH) - 5, ((this.y + 1) * COMPONENT_SEGMENT_LENGTH) - 15, 10, 10);
    } else if (this.direction == "up") {
      ctx.fillRect((this.x * COMPONENT_SEGMENT_LENGTH) - 5, (this.y * COMPONENT_SEGMENT_LENGTH) + 5, 10, 10);
    }
  }

  getNodesTouching() {
    //forgive me
    WIRES.forEach(wire => {
      if (this.direction == "down") {
        if (wire.direction == "vertical" && this.x == wire.x) {
          if (this.y == wire.y + 1) {
            this.node_in = wire.node;
          } else if (this.y == wire.y - 1) {
            this.node_out = wire.node;
          }
        } else if (wire.direction == "horizontal" && (this.x == wire.x || this.x == wire.x + 1)) {
          if (this.y == wire.y) {
            this.node_in = wire.node;
          } else if (this.y == wire.y - 1) {
            this.node_out = wire.node;
          }
        }
      } else if (this.direction == "up") {
        if (wire.direction == "vertical" && this.x == wire.x) {
          if (this.y == wire.y + 1) {
            this.node_out = wire.node;
          } else if (wire.y == this.y + 1) {
            this.node_in = wire.node;
          }
        } else if (wire.direction == "horizontal" && (this.x == wire.x || this.x == wire.x + 1)) {
          if (this.y == wire.y) {
            this.node_out = wire.node;
          } else if (this.y == wire.y - 1) {
            this.node_in = wire.node;
          }
        }
      } else if (this.direction == "left") {
        if (wire.direction == "horizontal" && this.y == wire.y) {
          if (this.x == wire.x + 1) {
            this.node_out = wire.node;
          } else if (wire.x = this.x + 1) {
            this.node_in = wire.node;
          }
        } else if (wire.direction == "vertical" && (this.y == wire.y || this.y == wire.y + 1)) {
          if (this.x == wire.x) {
            this.node_out = wire.node;
          } else if (this.x == wire.x - 1) {
            this.node_in = wire.node;
          }
        }
      } else if (this.direction == "right") {
        if (wire.direction == "horizontal" && this.y == wire.y) {
          if (this.x == wire.x + 1) {
            this.node_in = wire.node;
          } else if (wire.x = this.x + 1) {
            this.node_out = wire.node;
          }
        } else if (wire.direction == "vertical" && (this.y == wire.y || this.y == wire.y + 1)) {
          if (this.x == wire.x) {
            this.node_in = wire.node;
          } else if (this.x == wire.x - 1) {
            this.node_out = wire.node;
          }
        }
      }
    });
  }

  onTopOf(other) {
    let thisHoriz = (this.direction == "left" || this.direction == "right");
    let otherHoriz = (other.direction == "left" || other.direction == "right" || other.direction == "horizontal");

    return this.x == other.x && this.y == other.y && thisHoriz == otherHoriz;
  }
}

function getGhostResistor() {
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
    if (ax < .5) {
      return new Resistor(Math.floor(wx), Math.floor(wy), "left");
    } else {
      return new Resistor(Math.floor(wx), Math.floor(wy), "right");
    }
  } else if (d == min) {
    if (ax < .5) {
      return new Resistor(Math.floor(wx), Math.floor(wy) + 1, "left");
    } else {
      return new Resistor(Math.floor(wx), Math.floor(wy) + 1, "right");
    }
  } else if (l == min) {
    if (ay < .5) {
      return new Resistor(Math.floor(wx), Math.floor(wy), "up");
    } else {
      return new Resistor(Math.floor(wx), Math.floor(wy), "down");
    }
  } else if (r == min) {
    if (ay < .5) {
      return new Resistor(Math.floor(wx) + 1, Math.floor(wy), "up");
    } else {
      return new Resistor(Math.floor(wx) + 1, Math.floor(wy), "down");
    }
  }
}
