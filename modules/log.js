export default function log() {
  var logs = document.getElementById('logs');
  var msg = [].slice.call(arguments).join(' ');

  if (logs) {
    logs.insertBefore(document.createTextNode("\n" + msg), logs.firstChild);
  }
}
