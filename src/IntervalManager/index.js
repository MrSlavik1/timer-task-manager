

class IntervalManager {

	constructor () {
		this.intervals = [];
		this.defaultCallback = () => {
			return console.log("Interval worked!");
		}
		this.defaultTimeout = 3000;
		this.defaultTitle = "MyInterval";
	}

	create (title = this.defaultTitle, time = this.defaultTimeout, callback = this.defaultCallback) {

		if(!Number(time)) {
			time = checkInterval(time);

			if(typeof time === "object") {
				time = time.time;
			}
		} 


		if(typeof time == "number" && time <= 0) {
			throw TypeError("The time parameter takes a numeric value greater than or equal to the current date");
		} 


		let id = this.intervals.length;
		this.intervals.push({
			id,
			title,
			time,
			callback,
			created: Date.now(),
			status: true
		});

		if(typeof time == "number") {
			setInterval(() => {
				if(this.intervals.find(x => x.id == id) && this.intervals.find(x => x.id == id).status) {
					callback();
				}
			}, time);
		} else {
			setTimeout(() => {
				setInterval(() => {
					if(this.intervals.find(x => x.id == id) && this.intervals.find(x => x.id == id).status) {
						callback();
					}
				}, 86400000);
				callback();
			}, time);
		}

		return {
			count: {
				all: this.intervals.length,
				worked: this.intervals.filter(interval => interval.status).length,
			},
			items: this.intervals,
			nowItem: this.intervals.find(x => x.id == id),
		}
	}

	deleteToTitle (title) {
		let items = this.intervals.filter(interval => interval.title !== title);

		this.intervals = this.intervals.filter(interval => interval.title !== title);

		return {
			count: {
				deleted: items.length,
				left: this.intervals.length
			},
			items,
		}
	}

	deleteToID (id) {
		let items = this.intervals.filter(interval => interval.id !== id);

		this.intervals = this.intervals.filter(interval => interval.id !== id);

		return {
			count: {
				deleted: items.length,
				left: this.intervals.length
			},
			items,
		}
	}

	stop (id) {
		this.intervals.find(interval => interval.id === id).status = false;

		return {
			status: "off",
			items: this.intervals.filter(interval => interval.id === id)
		}
	}

	start (id) {
		this.intervals.find(interval => interval.id === id).status = true;

		return {
			status: "on",
			items: this.intervals.filter(interval => interval.id === id)
		}
	}


}

function checkInterval (string) {
	let result = 0;

	if(/кажд[ыу][еюй]/.test(string)) {
		if(/час/.test(string)) {
			if(/[0-9]+\sчас/.test(string)) {
				result += Number(string.match(/[0-9]+\sчас/)[0].split("час")[0]) * 3600000;
			} else {
				result += 3600000;
			}
		}

		if(/мин/.test(string)) {
			if(/[0-9]+\sмин/.test(string)) {
				result += Number(string.match(/[0-9]+\sмин/)[0].split("мин")[0]) * 60000;
			} else {
				result += 60000;
			}
		}

		if(/сек/.test(string)) {
			if(/[0-9]+\sсек/.test(string)) {
				result += Number(string.match(/[0-9]+\sсек/)[0].split("сек")[0]) * 1000;
			} else {
				result += 1000;
			}
		}
	}

	if(/каждый\sдень/.test(string)) {
		let today = `${new Date().getFullYear()}-${new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate()}`;
		let time = "00:00:00";
		let date = Date.parse(new Date(`${today}T${time}`));
		result = {
			time: date - Date.now() > 0 ? date - Date.now() : 60000
		}
	}

	if(/каждый\sдень\sв\s[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]/.test(string)) {
		let today = `${new Date().getFullYear()}-${new Date().getMonth() < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1}-${new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate()}`;
		let time = string.match(/[0-9][0-9]\:[0-9][0-9]\:[0-9][0-9]/)[0];
		let date = Date.parse(new Date(`${today}T${time}`));
		result = {
			time: date - Date.now() > 0 ? date - Date.now() : 60000
		}
	}

	return result;
}

module.exports = IntervalManager;