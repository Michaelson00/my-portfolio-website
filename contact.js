/* Contact: build an email from the form and open the visitor's own email app. */
(function () {
  'use strict';
  var form = document.getElementById('msg-form');
  if (!form) return;
  var status = document.getElementById('copy-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var topic = form.querySelector('input[name="topic"]:checked');
    var name = document.getElementById('msg-name').value.trim();
    var body = document.getElementById('msg-body').value.trim();
    if (!body) { status.textContent = 'Please write a short message first.'; document.getElementById('msg-body').focus(); return; }
    var subject = (topic ? topic.value : 'Hello') + (name ? ' from ' + name : '');
    var text = body + (name ? '\n\n' + name : '');
    window.location.href = 'mailto:kelvinapau00@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
  });
})();
