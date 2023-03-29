const { lusolve } = require("mathjs");

const BATTERY = {
  node_out: "N1",
  node_in: "N4",
  voltage: 24
}

const RESISTORS = [
  {name: "R5", node_in: "N1", node_out: "N4", resistance: 6},
  {name: "R3", node_in: "N1", node_out: "N2", resistance: 1},
  {name: "R1", node_in: "N2", node_out: "N3", resistance: 2},
  {name: "R2", node_in: "N3", node_out: "N4", resistance: 10},
  {name: "R4", node_in: "N2", node_out: "N4", resistance: 4},
];

function makeSystem() {
  let uniqueNodes = [];
  RESISTORS.forEach(resistor => {
    uniqueNodes.push(resistor.node_in, resistor.node_out);
  });
  uniqueNodes = [...new Set(uniqueNodes)];

  let uniqueVariables = [...uniqueNodes, ...RESISTORS.map(resistor => resistor.name)];

  let systemMatrix = [];
  let solutions = [];

  function addConstraint(coefficients, solution) {
    let row = new Array(uniqueVariables.length).fill(0);

    Object.entries(coefficients).forEach(([name, coeff]) => {
        row[uniqueVariables.indexOf(name)] = coeff;
    });

    systemMatrix.push(row);
    solutions.push(solution);
  }

  addConstraint({[BATTERY.node_out]: 1}, 0);
  addConstraint({[BATTERY.node_in]: 1}, BATTERY.voltage);

  uniqueNodes.forEach(node => {
    let goingIn = RESISTORS.filter(x => x.node_out == node);
    let goingOut = RESISTORS.filter(x => x.node_in == node);

    if (goingIn.length > 0 && goingOut.length > 0) {
      let coefficients = {};

      goingIn.map(x => x.name).forEach(r => {
        coefficients[r] = 1;
      });
      goingOut.map(x => x.name).forEach(r => {
        coefficients[r] = -1;
      });

      addConstraint(coefficients, 0);
    }
  });

  RESISTORS.forEach(resistor => {
    addConstraint({[resistor.node_in]: 1, [resistor.name]: resistor.resistance, [resistor.node_out]: -1}, 0);
  });

  return { systemMatrix, solutions, names: uniqueVariables };
}

function solveSystem({ systemMatrix, solutions, names }) {
  let solved = lusolve(systemMatrix, solutions);
  let out = {};

  for (let i = 0; i < names.length; i++) {
    out[names[i]] = solved[i][0];
  }

  return out;
}

let system = makeSystem();
let solution = solveSystem(system);
console.log(solution);
