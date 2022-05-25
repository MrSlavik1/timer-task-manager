let fetch = require("node-fetch");

async function latest () {
	let v = require("../package.json").version;

	let r = await fetch("https://www.npmjs.com/package/timer-task-manager").then(e => e.text());

	r = r
	.split('latest":"')[1]
	.split('"')[0];

	if(v != r) {
		console.log(`Great news!`);
		console.log(`A new version of the timer-task-manager module is available`);
		console.log(`Download: `);
		console.log(`npm install timer-task-manager
			OR 
		npm install timer-task-manager@${v}`);

		console.log(`GitHub: https://github.com/MrSlavik0/timer-task-manager`);
	}
}

latest();