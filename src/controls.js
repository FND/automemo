/* eslint-env browser */
import { FileDocument } from "./document.js";
import { generateDownloadLink, createElement } from "./html.js";

export class DocumentControls extends HTMLElement {
	connectedCallback() {
		this._doc = new FileDocument();

		let onSave = this.onSave = this.onSave.bind(this);
		document.body.addEventListener("document:save", onSave);
	}

	disconnectedCallback() {
		document.body.removeEventListener("document:save", this.onSave);
	}

	async onSave(ev) {
		ev.stopPropagation();

		let doc = this._doc;
		await doc.selectFile(); // FIXME: ensure concurrent events are not lost

		let { store, payload } = ev.detail;
		let { strategy, html } = await doc.save(store, payload);

		let link = this.querySelector("a");
		if(link) {
			link.parentNode.removeChild(link);
		}

		let filename = doc.filename;
		link = generateDownloadLink(filename, html);
		link.textContent = strategy === "file" ? "backup " : "download "; // XXX: crude
		createElement("code", null, {
			text: filename,
			parent: link
		});
		this.appendChild(link);
	}
}
