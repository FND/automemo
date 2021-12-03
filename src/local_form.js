/* eslint-env browser */
import { createElement } from "./html.js";
import { dispatchEvent } from "./util.js";

export let TAG = "local-form";

export class LocalForm extends HTMLElement {
	connectedCallback() {
		this.form.addEventListener("submit", this.onSubmit.bind(this));
	}

	onSubmit(ev) {
		ev.preventDefault();

		let { form } = this;
		let payload = new FormData(form);
		payload = [...new Set(payload.keys())].reduce((memo, key) => { // normalize
			let values = payload.getAll(key);
			memo.set(key, values.length > 1 ? values : values[0]);
			return memo;
		}, new Map());

		if(payload.size) {
			dispatchEvent(this, this.event, payload);
		}

		if(this.reset) {
			form.reset();
		}
	}

	get event() {
		return this.getAttribute("event");
	}

	get reset() {
		return this.hasAttribute("reset");
	}

	get form() {
		return this.querySelector("form");
	}
}

export function makeForm(attribs, ...children) {
	let el = createElement(TAG, attribs);
	let form = createElement("form", { action: "#" }, { parent: el });
	for(let node of children) {
		form.appendChild(node);
	}
	return el;
}
