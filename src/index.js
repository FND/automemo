import { Document } from "./document.js";
import { generateDownloadLink } from "./html.js";
import { TextFile } from "./fs.js";

let TXT = document.querySelector("textarea");
let BTN = document.querySelector("button[type=button]");
let BOX = document.querySelector("p");
let DOC = new Document();

TXT.value = DOC.store;
BTN.addEventListener("click", onSave);

async function onSave(ev) {
	let unlock = lock(document.body);
	await save(TXT.value);
	unlock();
}

async function save(payload) {
	await selectFile();
	try {
		var res = await DOC.save(payload); // eslint-disable-line no-var
	} catch(err) {
		BOX.textContent = err.message;
		return;
	}

	switch(res.strategy) {
	case "file":
		BOX.textContent = `saved as \`${res.filename}\``;
		break;
	case "manual":
		BOX.textContent = "please download new version:";
		BOX.appendChild(makeLink(res.html));
		break;
	default:
		BOX.textContent = "error: unexpected saving response";
		break;
	}

	// DEBUG
	let el = document.createElement("pre");
	el.textContent = payload;
	BOX.appendChild(el);
}

async function selectFile() {
	if(DOC.file || !TextFile) {
		return;
	}

	try {
		DOC.file = await TextFile.select(".html");
	} catch(err) {
		if(err.name !== "AbortError") {
			throw err;
		}
		// TODO: prevent repeat prompts?
	}
}

function makeLink(html) {
	return generateDownloadLink("download", DOC.filename, html);
}

function lock(el) {
	el.setAttribute("aria-busy", "true");
	return () => void el.removeAttribute("aria-busy");
}
