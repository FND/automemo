let supported = !!window.showSaveFilePicker;

export let TextFile = supported && class TextFile {
	static async select(ext = ".txt") {
		let fh = await window.showSaveFilePicker({
			types: [{
				accept: {
					"text/plain": ext.pop ? ext : [ext]
				}
			}]
		});
		return new this(fh);
	}

	constructor(fh) {
		this._fh = fh;
	}

	async write(content) {
		let writable = await this._fh.createWritable();
		await writable.write(content);
		await writable.close();
	}

	get name() {
		return this._fh.name;
	}
};
