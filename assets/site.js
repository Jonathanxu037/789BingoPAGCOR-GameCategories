(function () {
  var views = { prototype: document.getElementById('view-prototype'), doc: document.getElementById('view-doc') };
  var navLinks = document.querySelectorAll('nav.views a');
  var tocBox = document.getElementById('toc');
  var scroller = document.getElementById('doc-scroll');
  var article = document.getElementById('doc');
  var frame = document.getElementById('proto-frame');

  // 目录：取文档里的二、三级标题
  var heads = Array.prototype.slice.call(article.querySelectorAll('h2[id], h3[id]'));
  heads.forEach(function (h) {
    var a = document.createElement('a');
    a.href = '#doc/' + h.id;
    a.textContent = h.textContent;
    a.className = h.tagName === 'H3' ? 'l3' : 'l2';
    a.dataset.id = h.id;
    tocBox.appendChild(a);
  });
  var tocLinks = Array.prototype.slice.call(tocBox.querySelectorAll('a'));

  function show(name) {
    Object.keys(views).forEach(function (k) { views[k].classList.toggle('on', k === name); });
    navLinks.forEach(function (a) { a.classList.toggle('on', a.dataset.view === name); });
    if (name === 'prototype' && !frame.getAttribute('src')) frame.setAttribute('src', frame.dataset.src);
  }
  function scrollToId(id, smooth) {
    var el = document.getElementById(id);
    if (!el) return;
    scroller.scrollTo({ top: el.offsetTop - 24, behavior: smooth ? 'smooth' : 'auto' });
  }
  function route(smooth) {
    var h = location.hash.replace(/^#/, '');
    if (h.indexOf('doc') === 0) {
      show('doc');
      var id = h.split('/')[1];
      if (id) requestAnimationFrame(function () { scrollToId(id, smooth); });
    } else {
      show('prototype');
    }
  }
  window.addEventListener('hashchange', function () { route(true); });

  // 同一条目再次点击也滚动过去
  tocLinks.forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (location.hash === a.getAttribute('href')) { e.preventDefault(); show('doc'); scrollToId(a.dataset.id, true); }
    });
  });

  // 滚动时高亮当前章节
  function spy() {
    var y = scroller.scrollTop + 60, cur = heads[0];
    for (var i = 0; i < heads.length; i++) { if (heads[i].offsetTop <= y) cur = heads[i]; else break; }
    tocLinks.forEach(function (a) { a.classList.toggle('on', cur && a.dataset.id === cur.id); });
  }
  scroller.addEventListener('scroll', spy, { passive: true });

  // 原型缩放
  var fitBtn = document.getElementById('fit-btn'), realBtn = document.getElementById('real-btn');
  function setFit(fit) {
    fitBtn.classList.toggle('on', fit); realBtn.classList.toggle('on', !fit);
    var base = frame.dataset.src;
    frame.setAttribute('src', fit ? base : base + '#fit=0');
  }
  fitBtn.addEventListener('click', function () { setFit(true); });
  realBtn.addEventListener('click', function () { setFit(false); });

  route(false);
  spy();
})();
