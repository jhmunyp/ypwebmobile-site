const TAP_DURATION = 180;

// ===== Tap animation =====
function playTapAnimation(el) {
  el.classList.remove("tap-anim");
  void el.offsetWidth;
  el.classList.add("tap-anim");
}

// ===== 실제 보이는 화면 높이 + 메뉴 버튼 높이 자동 계산 =====
function setLayoutVars() {
  const root = document.documentElement;
  const vv = window.visualViewport;

  // ✅ 크롬만 튀는 문제 해결: 안드 크롬은 innerHeight 우선
  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = ua.includes("android");
  const isSamsung = ua.includes("samsungbrowser");
  const isChrome = ua.includes("chrome") && !isSamsung;
  const isAndroidChrome = isAndroid && isChrome;

  const hInner = window.innerHeight || 0;
  const hClient = root.clientHeight || 0;

  let appH;
  if (isAndroidChrome) {
    // ✅ 안드 크롬: innerHeight가 가장 안정
    appH = hInner || hClient;
  } else {
    // ✅ iOS/카톡 인앱/삼성인터넷 등: visualViewport 우선
    appH = vv ? Math.floor(vv.height) : (hInner || hClient);
  }

  root.style.setProperty("--appH", `${appH}px`);

  const sliderWrap = document.querySelector(".slider-wrapper");
  const subtitleWrap = document.querySelector(".subtitle-container");
  const footer = document.querySelector(".footer-bar");
  const gapEl = document.querySelector(".menu-footer-gap");
  const container = document.querySelector(".container");
  const menu = document.querySelector(".menu");
  const links = document.querySelectorAll(".menu a");

  if (!sliderWrap || !subtitleWrap || !footer || !container || !menu || links.length === 0) return;

  const rows = Math.ceil(links.length / 2);

  const topH =
    Math.ceil(sliderWrap.getBoundingClientRect().height) +
    Math.ceil(subtitleWrap.getBoundingClientRect().height);

  const footerH = Math.ceil(footer.getBoundingClientRect().height);
  const gapH = gapEl ? Math.ceil(gapEl.getBoundingClientRect().height) : 0;

  const cs = getComputedStyle(container);
  const padTop = parseFloat(cs.paddingTop) || 0;
  const padBot = parseFloat(cs.paddingBottom) || 0;

  const ms = getComputedStyle(menu);
  const rowGap = parseFloat(ms.rowGap) || 0;

  // ✅ 고정 간격(6px)도 뺀 남은 높이를 메뉴가 사용
  const menuAvail = appH - topH - footerH - gapH - padTop - padBot;

  const gapsTotal = rowGap * (rows - 1);
  let itemH = Math.floor((menuAvail - gapsTotal) / rows);

  // 너무 작아지는 걸 방지
  itemH = Math.max(itemH, 36);

  root.style.setProperty("--menuItemH", `${itemH}px`);
}

// ===== 링크 처리: tel은 기본 동작 유지(가로채지 않음) =====
function initTaps() {
  document.querySelectorAll(".menu a, .footer-banner").forEach((el) => {
    const href = (el.getAttribute("href") || "").trim();
    const lower = href.toLowerCase();

    // ✅ 전화는 브라우저 기본 동작
    if (lower.startsWith("tel:")) {
      el.addEventListener("touchstart", () => playTapAnimation(el), { passive: true });
      el.addEventListener("click", () => playTapAnimation(el));
      return;
    }

    let touched = false;

    const go = () => {
      if (!href || href === "#") return;
      window.location.href = href;
    };

    el.addEventListener(
      "touchstart",
      (e) => {
        touched = true;
        if (!href || href === "#") {
          e.preventDefault();
          playTapAnimation(el);
          return;
        }
        e.preventDefault();
        playTapAnimation(el);
        setTimeout(go, TAP_DURATION);
      },
      { passive: false }
    );

    el.addEventListener("click", (e) => {
      if (touched) {
        touched = false;
        return;
      }
      if (!href || href === "#") {
        e.preventDefault();
        playTapAnimation(el);
        return;
      }
      e.preventDefault();
      playTapAnimation(el);
      setTimeout(go, TAP_DURATION);
    });
  });
}

// ===== 슬라이더: 스와이프 + 5초 자동, 튐 방지(px 기반) =====
function initSliderSwipeOnly() {
  const AUTO_SLIDE_MS = 5000; // 5초
  const slider = document.getElementById("slider");
  const slides = document.getElementById("slides");
  if (!slider || !slides) return;

  const total = slides.children.length;
  let index = 0;
  let autoTimer = null;

  const setTransition = (on) => {
    slides.style.transition = on ? "transform 0.25s ease" : "none";
  };

  const goTo = (i) => {
    index = (i + total) % total;
    const w = slider.clientWidth || 1;
    slides.style.transform = `translate3d(${-index * w}px, 0, 0)`;
  };

  const stopAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => goTo(index + 1), AUTO_SLIDE_MS);
  };

  setTransition(true);
  goTo(0);
  startAuto();

  let startX = 0, startY = 0;
  let dragging = false;
  let lock = null;
  let lastDX = 0;

  const onDown = (e) => {
    stopAuto();
    dragging = true;
    lock = null;
    lastDX = 0;
    startX = e.clientX;
    startY = e.clientY;
    setTransition(false);
    slider.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e) => {
    if (!dragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    lastDX = dx;

    if (!lock) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      lock = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }

    if (lock === "h") {
      e.preventDefault?.();
      const w = slider.clientWidth || 1;
      const base = -index * w;
      slides.style.transform = `translate3d(${base + dx}px, 0, 0)`;
    }
  };

  const onUp = () => {
    if (!dragging) return;
    dragging = false;

    setTransition(true);

    if (lock === "h") {
      const w = slider.clientWidth || 1;
      const threshold = w * 0.2;

      if (lastDX <= -threshold) goTo(index + 1);
      else if (lastDX >= threshold) goTo(index - 1);
      else goTo(index);
    } else {
      goTo(index);
    }

    startAuto();
  };

  slider.style.touchAction = "pan-y";
  slider.addEventListener("pointerdown", onDown, { passive: true });
  slider.addEventListener("pointermove", onMove, { passive: false });
  slider.addEventListener("pointerup", onUp);
  slider.addEventListener("pointercancel", onUp);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAuto();
    else startAuto();
  });

  // 폭 바뀌면 현재 index 재정렬
  const fix = () => { setTransition(false); goTo(index); setTransition(true); };

  window.addEventListener("resize", () => { setLayoutVars(); fix(); });
  window.addEventListener("orientationchange", () => setTimeout(() => { setLayoutVars(); fix(); }, 50));
  window.visualViewport?.addEventListener("resize", () => { setLayoutVars(); fix(); });
}

// ===== init =====
function initAll() {
  setLayoutVars();
  initTaps();
  initSliderSwipeOnly();

  // ✅ 크롬에서 첫 렌더 후 viewport 값이 늦게 안정되는 케이스 보정
  setTimeout(setLayoutVars, 200);
  setTimeout(setLayoutVars, 600);

  // ✅ footer/배너 이미지 로딩으로 높이가 바뀌면 재계산
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => setLayoutVars());
    const sliderWrap = document.querySelector(".slider-wrapper");
    const footer = document.querySelector(".footer-bar");
    if (sliderWrap) ro.observe(sliderWrap);
    if (footer) ro.observe(footer);
  }
}

window.addEventListener("DOMContentLoaded", initAll);
window.addEventListener("load", setLayoutVars);

// 카톡/사파리 주소창 변화 대응
window.visualViewport?.addEventListener("scroll", setLayoutVars);
