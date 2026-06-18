/* ───────────────────────────────────────────────────────────
   모바일 청첩장 — 인터랙션.
   디자인 시스템 UI 키트 동작을 바닐라 JS로 옮긴 코드.
   ─────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  var ICON_COPY  = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>';
  var ICON_CHECK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>';
  var ICON_PHOTO = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { fallbackCopy(text); });
    }
    fallbackCopy(text);
    return Promise.resolve();
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ── 캘린더 ──────────────────────────────────────────────── */
  function renderCalendar(el) {
    var year = +el.dataset.year, month = +el.dataset.month, day = +el.dataset.day;
    var time = el.dataset.time || '';
    var WEEK = ['일', '월', '화', '수', '목', '금', '토'];
    var first = new Date(year, month - 1, 1).getDay();
    var daysInMonth = new Date(year, month, 0).getDate();
    var weekdayKo = WEEK[new Date(year, month - 1, day).getDay()];

    var target = new Date(year, month - 1, day).setHours(0, 0, 0, 0);
    var today = new Date().setHours(0, 0, 0, 0);
    var dDay = Math.ceil((target - today) / 86400000);

    var html = '';
    html += '<div style="text-align:center">';
    html += '  <div class="calendar__date">' + year + '. ' + pad(month) + '. ' + pad(day) + '</div>';
    html += '  <div class="calendar__sub">' + weekdayKo + '요일' + (time ? ' · ' + time : '') + '</div>';
    html += '</div>';

    html += '<div class="calendar__grid"><div class="calendar__week">';
    WEEK.forEach(function (w, i) {
      var cls = i === 0 ? ' sun' : i === 6 ? ' sat' : '';
      html += '<div class="cal-cell' + cls + '">' + w + '</div>';
    });
    html += '</div><div class="calendar__days">';
    for (var b = 0; b < first; b++) html += '<div class="cal-cell"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var col = (first + d - 1) % 7;
      var cls2 = col === 0 ? ' sun' : col === 6 ? ' sat' : '';
      var isDay = d === day;
      html += '<div class="cal-cell' + cls2 + (isDay ? ' is-day' : '') + '">' +
              '<span class="cal-cell__mark">' + d + '</span></div>';
    }
    html += '</div></div>';

    if (dDay >= 0) {
      html += '<div class="calendar__countdown">결혼식까지 <strong>' +
              (dDay === 0 ? 'D-DAY' : dDay + '일') + '</strong></div>';
    }
    el.innerHTML = html;
  }
  function pad(n) { return String(n).padStart(2, '0'); }

  /* ── 갤러리 + 라이트박스 ────────────────────────────────── */
  var GALLERY = [
    './images/01_hanbok_01.jpg',
    './images/02_outdoor_01.jpg',
    './images/03_sea_01.jpg',
    './images/04_sea_02.jpg',
    './images/05_mountain_01.jpg',
    './images/06_mountain_02.jpg',
    './images/07_sea_03.jpg',
    './images/08_sea_04.jpg',
    './images/09_sea_05.jpg',
    './images/10_wedding_01.jpg',
    './images/11_wedding_02.jpg',
    './images/12_sea_06.jpg'
  ];
  function renderGallery(el) {
    var html = '';
    GALLERY.forEach(function (src, i) {
      html += '<button type="button" class="gallery__cell" data-index="' + i + '">' +
              '<img src="' + src + '" alt="갤러리 사진 ' + (i + 1) + '" loading="lazy" /></button>';
    });
    el.innerHTML = html;
    el.addEventListener('click', function (e) {
      var cell = e.target.closest('.gallery__cell');
      if (cell) openLightbox(+cell.dataset.index);
    });
  }
  function openLightbox(i) {
    var box = $('[data-lightbox]');
    var img = $('[data-lightbox-img]');
    img.src = GALLERY[i];
    img.alt = '갤러리 사진 ' + (i + 1);
    box.hidden = false;
  }
  function closeLightbox() { $('[data-lightbox]').hidden = true; }

  /* ── 복사 버튼 ──────────────────────────────────────────── */
  function wireCopy() {
    $$('[data-copy]').forEach(function (btn) {
      var hasIcon = btn.hasAttribute('data-copy-icon');
      if (hasIcon) btn.innerHTML = ICON_COPY + '복사';
      btn.addEventListener('click', function () {
        copyText(btn.dataset.copy);
        if (btn._t) clearTimeout(btn._t);
        if (hasIcon) {
          btn.classList.add('is-copied');
          btn.innerHTML = ICON_CHECK + '복사됨';
          btn._t = setTimeout(function () {
            btn.classList.remove('is-copied');
            btn.innerHTML = ICON_COPY + '복사';
          }, 1600);
        } else {
          btn.textContent = btn.dataset.copyDone || '복사되었어요';
          btn._t = setTimeout(function () {
            btn.textContent = btn.dataset.copyDefault || '복사';
          }, 1600);
        }
      });
    });
  }

  /* ── 아코디언 (계좌 그룹) ───────────────────────────────── */
  function wireAccordion() {
    $$('[data-accordion] .acc-group').forEach(function (group) {
      var toggle = $('.acc-group__toggle', group);
      toggle.addEventListener('click', function () {
        var open = group.classList.contains('is-open');
        // 프로토타입과 동일하게 한 번에 하나만 열리는 동작
        $$('[data-accordion] .acc-group').forEach(function (g) {
          g.classList.remove('is-open');
          $('.acc-group__toggle', g).setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          group.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── 라이트박스 닫기 연결 ───────────────────────────────── */
  function wireLightbox() {
    var box = $('[data-lightbox]');
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('[data-lightbox-close]')) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ── 공유 ───────────────────────────────────────────────── */
  function wireShare() {
    var btn = $('[data-share]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var data = { title: document.title, text: '한진호 ❤ 믄따리 결혼합니다', url: location.href };
      if (navigator.share) { navigator.share(data).catch(function () {}); }
      else { copyText(location.href); flash(btn); }
    });
  }
  function flash(btn) {
    var prev = btn.getAttribute('aria-label');
    btn.setAttribute('aria-label', '링크가 복사되었어요');
    setTimeout(function () { btn.setAttribute('aria-label', prev); }, 1600);
  }

  /* ── 카카오맵 ───────────────────────────────────────────── */
  function wireMap() {
    var el = $('[data-map]');
    if (!el) return;
    var fb = $('[data-map-fallback]', el);
    var lat = parseFloat(el.dataset.lat);
    var lng = parseFloat(el.dataset.lng);
    var name = el.dataset.name || '';

    // SDK 미로드(appkey 미설정/도메인 미등록 등) 시 안내 후 종료
    if (!window.kakao || !window.kakao.maps) {
      if (fb) {
        var label = $('.map__label', fb);
        if (label) label.textContent = '지도를 표시하려면 카카오 appkey가 필요해요';
      }
      return;
    }

    window.kakao.maps.load(function () {
      var maps = window.kakao.maps;
      var canvas = document.getElementById('kakaoMap');
      if (!canvas) return;
      var center = new maps.LatLng(lat, lng);
      var map = new maps.Map(canvas, { center: center, level: 3 });
      var marker = new maps.Marker({ position: center, map: map });
      var info = new maps.InfoWindow({
        content: '<div style="padding:6px 10px;font-size:12px;white-space:nowrap;color:#2B2926;">' + name + '</div>'
      });
      info.open(map, marker);

      // 등록된 장소명으로 정확한 위치 보정
      if (maps.services && name) {
        var places = new maps.services.Places();
        places.keywordSearch(name, function (data, status) {
          if (status === maps.services.Status.OK && data[0]) {
            var pos = new maps.LatLng(data[0].y, data[0].x);
            map.setCenter(pos);
            marker.setPosition(pos);
            info.open(map, marker);
          }
        });
      }

      if (fb) fb.style.display = 'none';
    });
  }

  /* ── 스크롤 등장 효과 ───────────────────────────────────── */
  function wireReveal() {
    var items = $$('.inv-reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ── 초기화 ─────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    $$('[data-calendar]').forEach(renderCalendar);
    $$('[data-gallery]').forEach(renderGallery);
    wireCopy();
    wireAccordion();
    wireLightbox();
    wireShare();
    wireMap();
    wireReveal();
  });
})();
