'use strict';

/* ============================================================
   BBB英会話スクール
   1) 全画面メニュー（フェードで開閉）
   2) スクロールで要素を表示（IntersectionObserver）
      ※ カンプ元の指示は jQuery の inview プラグインだが、
        同じ挙動を依存なしで実装している。
   ============================================================ */

(function () {

  /* ---------- 1. 全画面メニュー ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  var closeBtn = document.getElementById('drawerClose');
  var lastFocus = null;

  function openMenu() {
    lastFocus = document.activeElement;
    drawer.hidden = false;
    // hidden を外した直後に class を足してフェードさせる
    window.requestAnimationFrame(function () {
      drawer.classList.add('is-open');
    });
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeMenu() {
    drawer.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
    var done = function () { drawer.hidden = true; };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      done();
    } else {
      window.setTimeout(done, 350);   // CSS の transition と同じ時間
    }
    if (lastFocus) { lastFocus.focus(); }
  }

  if (burger && drawer && closeBtn) {
    burger.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });
    closeBtn.addEventListener('click', closeMenu);

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) { closeMenu(); }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) { closeMenu(); }
    });

    // PC 幅に戻したら閉じる
    var mq = window.matchMedia('(min-width: 901px)');
    var onChange = function (e) {
      if (e.matches && drawer.classList.contains('is-open')) { closeMenu(); }
    };
    if (mq.addEventListener) { mq.addEventListener('change', onChange); }
    else if (mq.addListener) { mq.addListener(onChange); }
  }

  /* ---------- 2. スクロールで表示 ---------- */
  var targets = document.querySelectorAll('.js-inview, .voice');

  if (!('IntersectionObserver' in window)) {
    // 未対応ブラウザでは最初から表示しておく（内容が見えなくならないように）
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-inview'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        io.unobserve(entry.target);      // 一度出したら戻さない
      }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  Array.prototype.forEach.call(targets, function (el) { io.observe(el); });

})();
