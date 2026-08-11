// RaphaAtlas site behavior — dropdown nav, mobile menu, footer year
(function () {
  // Footer year
  var y = document.getElementById('yr');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile menu toggle
  var burger = document.querySelector('.hamburger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
  }

  // Dropdown items: click to toggle (works on desktop + mobile; hover also works on desktop via CSS)
  document.querySelectorAll('.nav .item > button').forEach(function (btn) {
    var item = btn.parentElement;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = item.getAttribute('aria-open') === 'true';
      // close siblings
      document.querySelectorAll('.nav .item[aria-open="true"]').forEach(function (i) {
        if (i !== item) i.setAttribute('aria-open', 'false');
      });
      item.setAttribute('aria-open', open ? 'false' : 'true');
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function () {
    document.querySelectorAll('.nav .item[aria-open="true"]').forEach(function (i) {
      i.setAttribute('aria-open', 'false');
    });
  });
})();
