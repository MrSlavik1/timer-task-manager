

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
		let id = this.intervals.length;
		this.intervals.push({
			id,
			title,
			time,
			callback,
			created: Date.now(),
			status: true
		});

		setInterval(() => {
			if(this.intervals.find(x => x.id == id) && this.intervals.find(x => x.id == id).status) {
				callback();
			}
		}, time);

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

module.exports = IntervalManager;