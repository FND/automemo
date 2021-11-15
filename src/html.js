/* eslint-env browser */

// adapted from TiddlyWiki <http://tiddlywiki.com>
export function generateDownloadLink(filename, html) {
	try {
		let blob = new Blob([html], { type: "text/html" });
		var uri = URL.createObjectURL(blob); // eslint-disable-line no-var
	} catch(err) { // XXX: obsolete?
		uri = `data:text/html,${encodeURIComponent(html)}`;
	}

	let el = document.createElement("a");
	el.setAttribute("download", filename);
	el.setAttribute("href", uri);
	return el;
}

export function serializeDOM(doctype, documentElement) {
	doctype = new XMLSerializer().serializeToString(doctype);
	return [doctype, documentElement.outerHTML].join("\n");
}

export function createElement(tag, attribs, { text, parent } = {}) {
	let el = document.createElement(tag);
	if(attribs) {
		Object.entries(attribs).forEach(([name, value]) => {
			el.setAttribute(name, value);
		});
	}
	if(text) {
		el.textContent = text;
	}
	if(parent) {
		parent.appendChild(el);
	}
	return el;
}
