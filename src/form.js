/* eslint-env browser */
import { createElement } from "./html.js";
import { dispatchEvent } from "./util.js";

export class NotesForm extends HTMLElement {
	connectedCallback() {
		let form = createElement("form", { action: "#" }, { parent: this });
		createElement("input", { type: "text" }, { parent: form });
		createElement("button", null, { text: "add", parent: form });

		form.addEventListener("submit", this.onSubmit.bind(this));
	}

	onSubmit(ev) {
		ev.preventDefault();

		let { desc } = this;
		if(!desc) {
			return;
		}

		dispatchEvent(this, "notes:new", { description: desc });
		this.desc = "";
	}

	get desc() {
		let { value } = this._desc;
		return value.trim();
	}

	set desc(value) {
		this._desc.value = value;
	}

	get _desc() {
		return this.querySelector("input[type=text]");
	}
}
