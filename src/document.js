/* eslint-env browser */
import { encode } from "./html.js";

let TOKEN = "MTU3ODY5MTY0Mzg2MDQ4NTU0Mzc0NzUxODEzODc2NDE1MzcxNzA5";
if(encode(TOKEN) !== TOKEN) {
	throw new Error(`invalid token: \`${TOKEN}\``);
}

export class Document {
	constructor({ doc = document, store = "store" } = {}) {
		this.file = null; // NB: populated from outside
		this.page = doc;
		if(store.substr) {
			store = doc.getElementById(store);
		}
		if(!store.nodeType) {
			throw new Error("invalid store element");
		}

		this.store = store.textContent;
		store.textContent = TOKEN;
		this._template = serializeDOM(doc);
	}

	async save(payload) {
		if(!payload.substr) {
			throw new Error("invalid payload: not a string");
		}

		this.store = payload;
		let html = this.serialize();

		let { file } = this;
		if(!file) {
			return {
				strategy: "manual",
				html
			};
		}

		await file.write(html);
		return {
			strategy: "file",
			filename: this.filename,
			html
		};
	}

	get filename() {
		let { file } = this;
		if(file) {
			return file.name;
		}

		let { location, title } = this.page;
		let path = location.pathname;
		let i = path.lastIndexOf("/") + 1;
		return i ? decodeURIComponent(path.substr(i)) :
			`${encodeURIComponent(title)}.html`;
	}

	serialize() {
		return this._template.replace(`>${TOKEN}<`, `>${encode(this.store)}<`);
	}
}

function serializeDOM({ doctype, documentElement }) {
	doctype = new XMLSerializer().serializeToString(doctype);
	return [doctype, documentElement.outerHTML].join("\n");
}
