/* eslint-env browser */
import { TextFile } from "./fs.js";
import { serializeDOM } from "./html.js";
import { raise } from "./util.js";

export class DocumentStore {
	constructor(doc = document) {
		this._doctype = doc.doctype;

		let root = this._root = doc.documentElement.cloneNode(true);
		let stores = this._stores = new Map(); // optimization
		for(let el of root.querySelectorAll("[data-store]")) {
			let name = el.getAttribute("data-store");
			stores.set(name, el);
		}
	}

	async update(storeName, payload) {
		let storeNode = this._stores.get(storeName) ||
				raise(`invalid store name: ${storeName}`);
		if(!payload) {
			storeNode.innerHTML = "";
		} else if(!payload.substr) {
			throw new Error("invalid payload: not a string");
		} else {
			storeNode.innerHTML = payload;
		}

		// XXX: serialization is expensive; use string-based template instead?
		return serializeDOM(this._doctype, this._root);
	}
}

export class FileDocument extends DocumentStore {
	constructor(doc = document) {
		super(doc);
		this._path = doc.location.pathname;
		this._title = doc.title;
		this.file = null;
	}

	async save(storeName, payload) {
		let html = await super.update(storeName, payload);

		let { file } = this;
		if(file) {
			await file.write(html);
		}

		return {
			strategy: file ? "file" : "manual",
			html
		};
	}

	async selectFile() {
		if(this.file || !TextFile) {
			return;
		}

		this.file = await TextFile.select(".html"); // TODO: prevent repeat prompts?
	}

	get filename() {
		let { file } = this;
		if(file) {
			return file.name;
		}

		let path = this._path;
		let i = path.lastIndexOf("/") + 1;
		let fn = i && decodeURIComponent(path.substr(i));
		return fn || `${normalize(this._title)}.html`;
	}
}

function normalize(filename) {
	return filename.replace(/[^0-9A-Za-z]+/g, "_").replace(/^_|_$/g, "");
}
