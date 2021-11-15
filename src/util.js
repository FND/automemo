/* eslint-env browser */

export function dispatchEvent(emitter, name, payload, options = { bubbles: true }) {
	if(payload) {
		options.detail = payload;
	}
	let ev = new CustomEvent(name, options);
	emitter.dispatchEvent(ev);
}

export function raise(msg) {
	throw new Error(msg);
}
