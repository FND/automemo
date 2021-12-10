/* eslint-env browser */
import { DocumentControls } from "./controls.js";
import { TasksManager } from "./tasks.js";
import { NotesManager } from "./notes.js";
import * as form from "./local_form.js";

customElements.define("document-controls", DocumentControls);
customElements.define("tasks-manager", TasksManager);
customElements.define("notes-manager", NotesManager);
customElements.define(form.TAG, form.LocalForm);
