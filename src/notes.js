/* eslint-env browser */
import { makeForm } from "./local_form.js";
import { createElement } from "./html.js";
import { dispatchEvent } from "./util.js";

export class NotesManager extends HTMLElement {
	connectedCallback() {
		let form = makeForm({ event: "notes:new", reset: "" },
				createElement("input", { type: "text", name: "description" }),
				createElement("button", null, { text: "add" }));
		this.insertBefore(form, this.firstChild);

		this._list = this.querySelector("ul") ||
				createElement("ul", null, { parent: this });

		this.addEventListener("notes:new", this.onCreate);
	}

	onCreate(ev) {
		createElement("li", null, {
			text: ev.detail.get("description"),
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
