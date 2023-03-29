const nerdamer = require("nerdamer/all.min");
nerdamer.set("SOLUTIONS_AS_OBJECT", true)

const BATTERY = {
  node_out: "N1",
  node_in: "N4",
  voltage: 24
}

const NODES = ["N1", "N2", "N3", "N4"];

function makeResistor(name, node_in, node_out, resistance) {
  return {
    name,
    node_in,
    node_out,
    resistance
  };
}

const RESISTORS = [
  makeResistor("R5", "N1", "N4", 6),
  makeResistor("R3", "N1", "N2", 1),
  makeResistor("R1", "N2", "N3", 2),
  makeResistor("R2", "N3", "N4", 10),
  makeResistor("R4", "N2", "N4", 4),
];

//make the linear system of equations representing the circuit
function makeSystem() {
  let system = [];

  system.push(`${BATTERY.node_out} = 0`);
  system.push(`${BATTERY.node_in} = ${BATTERY.voltage}`);

  NODES.forEach(node => {
    let goingIn = RESISTORS.filter(x => x.node_out == node);
    let goingOut = RESISTORS.filter(x => x.node_in == node);

    if (goingIn.length > 0 && goingOut.length > 0) {
      let eq = `${goingIn.map(x => x.name).join(" + ")} = ${goingOut.map(x => x.name).join(" + ")}`;
      system.push(eq);
    }
  });

  RESISTORS.forEach(resistor => {
    let eq = `${resistor.node_in} + ${resistor.name} * ${resistor.resistance} = ${resistor.node_out}`;
    system.push(eq);
  });

  return system
}

let system = makeSystem();
console.log(system);
console.log(nerdamer.solveEquations(system));
