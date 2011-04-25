var textareas = document.querySelectorAll('textarea');

// add doubleclick listener to all textareas
for (var i = 0; i < textareas.length; i++) {
  textareas[i].addEventListener('dblclick', function(e) {
    if (e.metaKey)
      loadEditor(e.target.id, e.target.value);
  }, false);
}

// Load external editor contents into textarea
onMessage = function(message) {
  if (message.id && message.text) {
    var el = document.getElementById(message.id);
    if (el)
      el.value = message.text;
  }
};

// Load textarea contents into external editor
function loadEditor(id, text) {
  postMessage({
    id: id,
    text: text
  });
}
