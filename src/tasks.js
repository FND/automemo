/* eslint-env browser */
import { makeForm } from "./local_form.js";
import { createElement } from "./html.js";
import { dispatchEvent } from "./util.js";

let EVENT = "tasks:new";

export class TasksManager extends HTMLElement {
	connectedCallback() {
		let form = makeForm({ event: EVENT, reset: "" },
				createElement("input", { type: "text", name: "description" }),
				createElement("button", null, { text: "add" }));
		this.insertBefore(form, this.firstChild);

		this._list = this.querySelector("ul") ||
				createElement("ul", null, { parent: this });

		this.addEventListener(EVENT, this.onCreate);
		this.addEventListener("change", this.onChange);
	}

	onChange(ev) {
		let el = ev.target;
		if(!el.matches("input[type=checkbox]")) { // event delegation
			return;
		}

		if(el.checked) {
			el.setAttribute("checked", "");
		} else {
			el.removeAttribute("checked");
		}

		this.save();
		ev.stopPropagation();
	}

	onCreate(ev) {
		let el = document.createElement("li");
		let label = createElement("label", null, { parent: el });
		createElement("input", { type: "checkbox" }, { parent: label });
		createElement("span", null, {
			text: ev.detail.get("description"),
			parent: label
		});
		this._list.appendChild(el);

		this.save();
		ev.stopPropagation();
	}

	save() {
		dispatchEvent(document.body, "document:save", {
			store: this.store,
			payload: this._list.outerHTML
		});
	}

	get store() {
		return this.getAttribute("data-store");
	}
}
