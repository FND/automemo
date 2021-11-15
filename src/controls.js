/* eslint-env browser */
import { FileDocument } from "./document.js";
import { generateDownloadLink, createElement } from "./html.js";

export class DocumentControls extends HTMLElement {
	connectedCallback() {
		let doc = this._doc = new FileDocument();
		this._filename = doc.filename; // optimization

		let onSave = this.onSave = this.onSave.bind(this);
		document.body.addEventListener("document:save", onSave);
	}

	disconnectedCallback() {
		document.body.removeEventListener("document:save", this.onSave);
	}

	async onSave(ev) {
		ev.stopPropagation();

		let { store, payload } = ev.detail;
		let html = await this._doc.update(store, payload);

		let link = this.querySelector("a");
		if(link) {
			link.parentNode.removeChild(link);
		}

		let filename = this._filename;
		link = generateDownloadLink(filename, html);
		link.textContent = "download ";
		createElement("code", null, {
			text: filename,
			parent: link
		});
		this.appendChild(link);
	}
}
