(function () {
  var header = document.querySelector('header');
  var nav = header && header.querySelector('nav');
  if (!nav || header.querySelector('.cc-burger')) return;

  var style = document.createElement('style');
  style.textContent =
    '.cc-burger{display:none;background:none;border:0;color:#fff;padding:8px;cursor:pointer}' +
    '.cc-mobile{display:none;background:#193C5D;border-top:1px solid #112940;padding:8px 16px 16px;max-height:calc(100vh - 80px);overflow-y:auto}' +
    '.cc-mobile.open{display:block}' +
    '.cc-mobile a{display:block;color:#fff;padding:12px 4px;font-size:15px;font-weight:500;border-bottom:1px solid rgba(255,255,255,.1);text-decoration:none}' +
    '.cc-mobile .cc-sub a{padding-left:20px;font-size:14px;opacity:.85}' +
    '.cc-mobile .cc-label{color:#fff;opacity:.6;font-size:12px;text-transform:uppercase;letter-spacing:.05em;padding:14px 4px 4px}' +
    '@media(max-width:767px){.cc-burger{display:block}}' +
    '@media(min-width:768px){.cc-mobile{display:none!important}}';
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'cc-burger';
  btn.setAttribute('aria-label', 'Toggle menu');
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = '<svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>';
  nav.parentNode.appendChild(btn);

  var panel = document.createElement('div');
  panel.className = 'cc-mobile';
  var html = '';
  // Top-level links, then dropdown groups (Solutions, language), then the CTA.
  Array.prototype.forEach.call(nav.children, function (el) {
    if (el.tagName === 'A') {
      html += '<a href="' + el.getAttribute('href') + '">' + el.textContent.trim() + '</a>';
    } else {
      var label = el.querySelector('button');
      var links = el.querySelectorAll('a');
      if (!links.length) return;
      html += '<div class="cc-label">' + (label ? label.textContent.trim() : '') + '</div><div class="cc-sub">';
      Array.prototype.forEach.call(links, function (a) {
        html += '<a href="' + a.getAttribute('href') + '">' + a.textContent.trim() + '</a>';
      });
      html += '</div>';
    }
  });
  panel.innerHTML = html;
  header.appendChild(panel);

  btn.addEventListener('click', function () {
    var open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
})();
