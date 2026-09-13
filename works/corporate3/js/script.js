'use strict';

/* ============================================================
   明るいHOUSE
   1) ハンバーガーメニュー（SP）
   2) ページトップへ戻るボタン（700px スクロールで表示）
   ============================================================ */

(function () {

  /* ---------- 1. ハンバーガーメニュー ---------- */
  var sidebar   = document.getElementById('sidebar');
  var hamburger = document.getElementById('hamburger');
  var drawer    = document.getElementById('drawer');

  /* ---------- スクロールロック ----------
     iOS Safari では body { overflow: hidden } が効かず背面が動いてしまう。
     body を position:fixed にして、閉じたときに元の位置へ戻す。 */
  var lockedY = 0;
  var isLocked = false;

  function lockScroll() {
    if (isLocked) { return; }
    isLocked = true;
    lockedY = window.scrollY || window.pageYOffset || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = (-lockedY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    if (!isLocked) { return; }   // 閉じた状態で呼ばれても先頭へ飛ばさない
    isLocked = false;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, lockedY);
  }

  function setMenu(open) {
    sidebar.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    if (open) { lockScroll(); } else { unlockScroll(); }
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', function () {
      setMenu(sidebar.classList.contains('is-open') === false);
    });

    // ドロワー内のリンクを押したら閉じる
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    // Esc で閉じる
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        setMenu(false);
        hamburger.focus();
      }
    });

    // PC 幅に戻したら状態をリセット
    var mq = window.matchMedia('(min-width: 961px)');
    var onChange = function (e) { if (e.matches) setMenu(false); };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
  }

  /* ---------- 2. ページトップへ戻る ---------- */
  var totop = document.getElementById('totop');
  var THRESHOLD = 700;

  if (totop) {
    var ticking = false;
    var update = function () {
      totop.classList.toggle('is-visible', window.scrollY > THRESHOLD);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

})();
