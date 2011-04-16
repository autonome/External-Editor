
const prefs = require("preferences-service");
const extEditor = require("ext-editor");
const pageMods = require("page-mod");

const PREFNAME = "my.editor.path";

let editorPath = prefs.get(PREFNAME);
let editor = new extEditor.Editor(editorPath);

pageMods.PageMod({
  include: "*",
  contentScriptWhen: "ready",
  contentScriptFile: require("self").data.url("textarea-listener.js"),
  onAttach: function onAttach(worker, mod) {
    worker.on("message", function(message) {
      if (message.id && message.text) {
        editor.launch(message.text, function(text) {
          worker.postMessage({
            id: message.id,
            text: text
          });
        });
        if (editor.editorPath)
          prefs.set(PREFNAME, editor.editorPath);
      }
    });
  }
});
