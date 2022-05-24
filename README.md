timer-task-manager
=====================
timer-task-manager - task scheduling package, improved version of built-in setTimeout
=====================
**`Installation`**
```node
npm install timer-task-manager
```

`Usage example`
```node
const { Manager } = require("timer-task-manager"), 
manager = new Manager();

manager.add(); // add default task

manager.add(
  "MyTitle", // Title task
   10000, // The parameter accepts a numeric value in milliseconds indicating how long or when the event will occur
   "add", // Timer type. Accepts values: add; fullStamp
   async () => { return console.log("successfully!"); } // Function to execute when the timer expires
);

console.log(manager.list()) // List your tasks

manager.deleteToTitle("MyTitle"); // Deleting tasks with the specified title
manager.deleteToID(0); // Deleting tasks with the specified ID
manager.deleteToType("add"); // Deleting tasks with the specified type
```

