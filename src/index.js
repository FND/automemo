/* eslint-env browser */
import { DocumentControls } from "./controls.js";
import { NotesManager } from "./manager.js";
import { NotesForm } from "./form.js";

customElements.define("document-controls", DocumentControls);
customElements.define("notes-manager", NotesManager);
customElements.define("notes-form", NotesForm);
