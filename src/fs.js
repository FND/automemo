let supported = !!window.showSaveFilePicker;

export let TextFile = supported && class TextFile {
	static async select(ext = ".txt") {
		let types = [{
			accept: {
				"text/plain": ext.pop ? ext : [ext]
			}
		}];
		try { // eslint-disable-next-line no-var
			var fh = await window.showSaveFilePicker({ types });
		} catch(err) {
			if(err.name === "AbortError") {
				return null;
			}
			throw err;
		}
		return new this(fh);
	}

	constructor(fh) {
		this._fh = fh;
	}

	async write(content) {
		let stream = await this._fh.createWritable();
		try {
			await stream.write(content);
		} finally {
			await stream.close();
		}
	}

	get name() {
		return this._fh.name;
	}
};
