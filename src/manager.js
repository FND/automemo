/* eslint-env browser */
import { createElement } from "./html.js";
import { dispatchEvent } from "./util.js";

export class NotesManager extends HTMLElement {
	connectedCallback() {
		let form = document.createElement("notes-form");
		this.insertBefore(form, this.firstChild);

		this._list = this.querySelector("ul") ||
				createElement("ul", null, { parent: this });

		this.addEventListener("notes:new", this.onCreate);
	}

	onCreate(ev) {
		createElement("li", null, {
			text: ev.detail.description,
			parent: this._list
		});

		dispatchEvent(document.body, "document:save", {
			store: this.store,
			payload: this._list.outerHTML
		});
		ev.stopPropagation();
	}

	get store() {
		return this.getAttribute("data-store");
	}
}