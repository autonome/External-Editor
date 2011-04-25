console.log('add-on running');
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
        console.log('launching editor');
        try {
        editor.launch(message.text, function(text) {
          console.log('got edited text from the editor');
          worker.postMessage({
            id: message.id,
            text: text
          });
        });
        } catch(e) {
          console.log('error launching editor: ' + e);
        }
        if (editor.editorPath)
          prefs.set(PREFNAME, editor.editorPath);
      }
    });
  }
});
