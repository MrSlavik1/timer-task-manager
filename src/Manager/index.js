// const fs = require("fs");

class Manager {
	constructor () {
		this.tasks = [];
		this.defaultCallback = async () => {
			return console.log("task completed");
		}
		this.defaultTime = 3000;
		this.types = ["add", "fullStamp"];
		this.dirName = __dirname;
	} 

	/*


	@ TITLE - Task name
	@ TIME - The parameter accepts a numeric value in milliseconds indicating how long or when the event will occur
	@ TYPE - Timer type. Accepts values: add; fullStamp
	@ CALLBACK - Function to execute when the timer expires
	*/

	add (title = "Task", time = this.defaultTime, type = "add", callback = this.defaultCallback) {

		if(!this.types.includes(type)) {
			throw TypeError("The type parameter takes 2 values: " + this.types.join(", "));
		}

		if(type === "fullStamp") {
			if(!Number(time) || time <= Date.now()) {
				throw TypeError("The time parameter takes a numeric value greater than or equal to the current date");
			}
		}

		let id = this.tasks.length;

		this.tasks.push({
			id,
			type,
			title,
			time: type === "add" ? time : time - Date.now(),
			fullTime: type === "add" ? Date.now() + time : time,
			callback,
			status: false,
		});

		setTimeout(() => {
			if(this.tasks.find(x => x.id === id)) {
				callback();
				this.tasks.find(x => x.id === id).status = true;
			}
		}, type === "add" ? time : time - Date.now());
	}

	list () {
		return {
			count: {
				all: this.tasks.length,
				completed: this.tasks.filter(x => x.status).length
			},
			items: {
				completed: this.tasks.filter(x => x.status),
				unfulfilled: this.tasks.filter(x => !x.status)
			}
		}
	}

	deleteToTitle (title) {
		let items = this.tasks.filter(task => task.title !== title);

		this.tasks = this.tasks.filter(task => task.title !== title);

		return {
			count: {
				deleted: items.length,
				left: this.tasks.length
			},
			items,
		}
	}

	deleteToID (id) {
		let items = this.tasks.filter(task => task.id !== id);

		this.tasks = this.tasks.filter(task => task.id !== id);

		return {
			count: {
				deleted: items.length,
				left: this.tasks.length
			},
			items,
		}
	}

	deleteToType (type) {
		let items = this.tasks.filter(task => task.type !== type);

		this.tasks = this.tasks.filter(task => task.type !== type);

		return {
			count: {
				deleted: items.length,
				left: this.tasks.length
			},
			items,
		}
	}

	// dirName () {
	// 	return this.dirName;
	// }

	// saveTasks () {
	// 	fs.writeFileSync(this.dirName + "/tasks.json", JSON.stringify(this.tasks.map(x => { return { ...x, callback: x.callback.toString() }}), null, '\t'));
	// 	return {
	// 		count: this.tasks.length,
	// 		items: this.tasks
	// 	}
	// }

	// loadTasks () {
	// 	this.tasks = require(this.dirName + "/tasks.json");

	// 	this.tasks.filter(x => !x.status).map(x => {
	// 		new Function(`setTimeout(() => {
	// 		if(this.tasks.find(x => x.id === ${x.id})) {
	// 			(${x.callback})();
	// 			this.tasks.find(x => x.id === ${x.id}).status = true;
	// 		}
	// 	}, ${x.type} === "add" ? ${x.time} : ${x.time} - Date.now());`);
	// 	});

	// 	return this.tasks;
	// }

}

module.exports = Manager;