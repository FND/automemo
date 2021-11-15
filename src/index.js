/* eslint-env browser */
import { DocumentControls } from "./controls.js";
import { dispatchEvent } from "./util.js";

customElements.define("document-controls", DocumentControls);

// XXX: DEBUG
let PAYLOADS = [
	"lorem ipsum",
	"lorem ipsum\ndolor sit amet"
];
document.querySelector("button").addEventListener("click", ev => {
	if(PAYLOADS.length === 0) {
		return;
	}

	dispatchEvent(document.body, "document:save", {
		store: "notes",
		payload: PAYLOADS.shift()
	});
});
