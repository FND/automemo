/* eslint-env browser */
/* global dragula */
import { makeForm } from "./local_form.js";
import { createElement } from "./html.js";
import { dispatchEvent } from "./util.js";
import "../assets/dragula.min.js";

let EVENT = "tasks:new";

export class TasksManager extends HTMLElement {
	connectedCallback() {
		let form = makeForm({ event: EVENT, reset: "" },
				createElement("input", { type: "text", name: "description" }),
				createElement("button", null, { text: "add" }));
		this.insertBefore(form, this.firstChild);

		let list = this._list = this.querySelector("ul") ||
				createElement("ul", null, { parent: this });
		dragula([list], {
			mirrorContainer: document.createElement("div"), // XXX: hacky?
			moves: (el, container, handle) => handle.classList.contains("handle")
		});
		list.querySelectorAll("li").forEach(el => {
			insertHandle(el);
		});

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
		insertHandle(el);
		this._list.appendChild(el);

		this.save();
		ev.stopPropagation();
	}

	save() {
		let list = this._list.cloneNode(true);
		list.querySelectorAll(".handle").forEach(el => {
			el.parentNode.removeChild(el);
		});
		dispatchEvent(document.body, "document:save", {
			store: this.store,
			payload: list.outerHTML
		});
	}

	get store() {
		return this.getAttribute("data-store");
	}
}

function insertHandle(parent) {
	createElement("button", { class: "handle" }, {
		text: "↕️",
		parent
	});
}
