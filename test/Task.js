const { Manager } = require("../index.js"),
manager = new Manager();

manager.add();

// manager.deleteToTitle("Task");
// manager.deleteToID(0);
// manager.deleteToType("add");

console.log(manager.list());