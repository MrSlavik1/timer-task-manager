const { IntervalManager } = require("../index.js"),
interval = new IntervalManager();

interval.create("MyInterval", "каждую секунду");

interval.create("MyInterval", "каждые 3 секунды", () => console.log("3 sec"));

interval.create("MyInterval", "каждый день в 15:10:00", () => console.log("OK!"));