/* eslint-env browser */

// adapted from TiddlyWiki <http://tiddlywiki.com>
export function generateDownloadLink(label, filename, html) {
	try {
		let blob = new Blob([html], { type: "text/html" });
		var uri = URL.createObjectURL(blob); // eslint-disable-line no-var
	} catch(err) { // XXX: obsolete?
		uri = `data:text/html,${encodeURIComponent(html)}`;
	}

	let el = document.createElement("a");
	el.setAttribute("download", filename);
	el.setAttribute("href", uri);
	el.textContent = label;
	return el;
}

// adapted from TiddlyWiki <http://tiddlywiki.com> and Python 3's `html` module
export function encode(str, isAttribute) {
	let res = str.replace(/&/g, "&amp;").
		replace(/</g, "&lt;").
		replace(/>/g, "&gt;");
	if(isAttribute) {
		return res.replace(/"/g, "&quot;").
			replace(/'/g, "&#x27;");
	}
	return res;
}
