// const fs = require("fs");

class Manager {
	constructor () {
		this.tasks = [];
		this.defaultCallback = async () => {
			return console.log("task completed");
		}
		this.defaultTime = 3000;
		this.types = ["add", "fullStamp", "specify"];
		this.dirName = __dirname;
	} 

	/*


	@ TITLE - Task name
	@ TIME - The parameter accepts a numeric value in milliseconds indicating how long or when the event will occur
	@ TYPE - Timer type. Accepts values: add; fullStamp, specify
	@ CALLBACK - Function to execute when the timer expires
	*/

	add (title = "Task", time = this.defaultTime, type = "add", callback = this.defaultCallback) {

		if(!this.types.includes(type)) {
			throw TypeError("The type parameter takes 3 values: " + this.types.join(", "));
		}

		if(type === "fullStamp") {
			if(!Number(time) || time <= Date.now()) {
				throw TypeError("The time parameter takes a numeric value greater than or equal to the current date");
			}
		}

		let scopes = {};


		if(type === "specify") {
			if(/через|after/.test(time)) {
				scopes["after"] = checkDate(time);
			} else {
				if(/[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]/.test(time)) {
					scopes["date"] = time.match(/[0-9][0-9]\.[0-9][0-9]\.[0-9][0-9][0-9][0-9]/)[0];
				} else if (/today|сегодня/.test(time)) {
					scopes["date"] = `${new Date().getFullYear()}.${new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}.${new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate()}`;
				} else if (/завтра|tomorrow/.test(time)) {
					scopes["date"] = `${new Date(Date.now() + 86400000).getFullYear()}.${new Date(Date.now() + 86400000).getMonth() < 10 ? "0" + (new Date(Date.now() + 86400000).getMonth() + 1) : new Date(Date.now() + 86400000).getMonth() + 1}.${new Date(Date.now() + 86400000).getDate() < 10 ? "0" + new Date(Date.now() + 86400000).getDate() : new Date(Date.now() + 86400000).getDate()}`;
				} else {
					scopes["date"] = `${new Date().getFullYear()}.${new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}.${new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate()}`;
				}

				if(/[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]/.test(time)) {
					scopes["time"] = time.match(/[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]/)[0];
				} else if(/[0-9][0-9]\:[0-9][0-9]/.test(time)) {
					scopes["time"] = time.match(/[0-9][0-9]\:[0-9][0-9]/)[0] + ":00";
				} else {
					scopes["time"] = String(new Date(Date.now() + 60000)).match(/[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]/)[0];
				}
			}
		}

		let id = this.tasks.length;

		if(type !== "specify") {
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
		} else {
			if(/через|after/.test(time)) {
				this.tasks.push({
					id,
					type,
					title,
					time: scopes["after"],
					fullTime: Date.now() + time,
					callback,
					status: false,
				});

				setTimeout(() => {
					if(this.tasks.find(x => x.id === id)) {
						callback();
						this.tasks.find(x => x.id === id).status = true;
					}
				}, scopes["after"]);
			} else {
				let time = Date.parse(new Date(`${scopes.date.replace(/(\.)/ig, "-")}T${Number(scopes.time.split(":")[0]) - 3}:${scopes.time.split(":")[1]}:${scopes.time.split(":")[2]}.000Z`));
				console.log(`${scopes.date.replace(/(\.)/ig, "-")}T${scopes.time}.000Z`);
				if(time - Date.now() <= 0) {
					throw TypeError("The time parameter takes a numeric value greater than or equal to the current date");
				}
				this.tasks.push({
					id,
					type,
					title,
					time: time - Date.now(),
					fullTime: time,
					callback,
					status: false,
				});

				setTimeout(() => {
					if(this.tasks.find(x => x.id === id)) {
						callback();
						this.tasks.find(x => x.id === id).status = true;
					}
				}, time - Date.now());
			}
		}
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
		let items = this.tasks.filter(task => task.title != title);

		this.tasks = this.tasks.filter(task => task.title != title);

		return {
			count: {
				deleted: items.length,
				left: this.tasks.length
			},
			items,
		}
	}

	deleteToID (id) {
		let items = this.tasks.filter(task => task.id != id);

		this.tasks = this.tasks.filter(task => task.id != id);

		return {
			count: {
				deleted: items.length,
				left: this.tasks.length
			},
			items,
		}
	}

	deleteToType (type) {
		let items = this.tasks.filter(task => task.type != type);

		this.tasks = this.tasks.filter(task => task.type != type);

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

function checkDate (string) {
	let res = 0;
	if(/через/.test(string)) {
		if(/час/.test(string)) {
			if(/[0-9]+\sчас/.test(string)) {
				res += Number(string.match(/[0-9]+\sчас/)[0].split("час")[0]) * 3600000;
			} else {
				res += 3600000;
			}
		}

		if(/мин/.test(string)) {
			if(/[0-9]+\sмин/.test(string)) {
				res += Number(string.match(/[0-9]+\sмин/)[0].split("мин")[0]) * 60000;
			} else {
				res += 60000;
			}
		}

		if(/сек/.test(string)) {
			if(/[0-9]+\sсек/.test(string)) {
				res += Number(string.match(/[0-9]+\sсек/)[0].split("сек")[0]) * 1000;
			} else {
				res += 1000;
			}
		}
	}

	return res;
}

module.exports = Manager;