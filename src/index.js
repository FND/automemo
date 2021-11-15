/* eslint-env browser */
import { DocumentControls } from "./controls.js";
import { dispatchEvent } from "./util.js";

customElements.define("document-controls", DocumentControls);

// XXX: DEBUG
setTimeout(() => {
	dispatchEvent(document.body, "document:save", {
		store: "notes",
		payload: "lorem ipsum"
	});
}, 1000);
setTimeout(() => {
	dispatchEvent(document.body, "document:save", {
		store: "notes",
		payload: "lorem ipsum\ndolor sit amet"
	});
}, 2000);
