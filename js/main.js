const TAP_DURATION = 180;

function playTapAnimation(el) {
  el.classList.remove("tap-anim");
  void el.offsetWidth;
  el.classList.add("tap-anim");
}

/* ✅ 배너 높이: 첫 배너 이미지의 natural 비율로 고정 */
function setBannerHeightByImage() {
  const root = document.documentElement;
  const slider = document.getElementById("slider");
  const firstImg = document.querySelector("#slides .slide img");
  if (!slider || !firstImg) return;

  const w = slider.clientWidth || 0;
  if (!w) return;

  const nw = firstImg.naturalWidth;
  const nh = firstImg.naturalHeight;
  if (!nw || !nh) return; // 로딩 전이면 다음 호출에서 잡힘

  const h = Math.round(w * (nh / nw));
  root.style.setProperty("--bannerH", `${h}px`);
}

/* ✅ iOS(사파리/카톡) + 삼성인터넷 중심 레이아웃 계산 */
function setLayoutVars() {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  const appH = isIOS ? Math.floor(vv?.height || window.innerHeight) : window.innerHeight;
  root.style.setProperty("--appH", `${appH}px`);

  // 배너 높이(이미지 비율)
  setBannerHeightByImage();

  const sliderWrap = document.querySelector(".slider-wrapper");
  const subtitleWrap = document.querySelector(".subtitle-container");
  const footer = document.querySelector(".footer-bar");
  const gapEl = document.querySelector(".menu-footer-gap");
  const container = document.querySelector(".container");
  const menu = document.querySelector(".menu");
  const links = document.querySelectorAll(".menu a");

  if (!sliderWrap || !subtitleWrap || !footer || !container || !menu || links.length === 0) return;

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

  const menuAvail = appH - topH - footerH - gapH - padTop - padBot;

  // ✅ 항상 2열 기준으로만 계산
  const cols = 2;
  const rows = Math.ceil(links.length / cols);

  let itemH = Math.floor((menuAvail - rowGap * (rows - 1)) / rows);
  itemH = Math.max(itemH, 36);

  root.style.setProperty("--menuItemH", `${itemH}px`);
}

/* ✅ 전화는 기본 tel 동작 유지, 나머지는 탭 애니 후 이동 */
function initTaps() {
  document.querySelectorAll(".menu a, .footer-banner").forEach((el) => {
    const href = (el.getAttribute("href") || "").trim();
    const lower = href.toLowerCase();

    // 전화: 기본 동작
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

    el.addEventListener("touchstart", (e) => {
      touched = true;
      if (!href || href === "#") {
        e.preventDefault();
        playTapAnimation(el);
        return;
      }
      e.preventDefault();
      playTapAnimation(el);
      setTimeout(go, TAP_DURATION);
    }, { passive: false });

    el.addEventListener("click", (e) => {
      if (touched) { touched = false; return; }
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

/* ✅ 슬라이더: 스와이프 + 5초 자동 */
function initSlider() {
  const AUTO_SLIDE_MS = 5000;
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

  const fix = () => { setTransition(false); goTo(index); setTransition(true); };

  window.addEventListener("resize", () => { setLayoutVars(); fix(); });
  window.addEventListener("orientationchange", () => setTimeout(() => { setLayoutVars(); fix(); }, 50));
  window.visualViewport?.addEventListener("resize", () => { setLayoutVars(); fix(); });
}

/* ===== init ===== */
function initAll() {
  setLayoutVars();
  initTaps();
  initSlider();

  // 이미지/폰트 적용 등으로 높이 변하면 한 번 더 보정
  setTimeout(setLayoutVars, 80);
  setTimeout(setLayoutVars, 220);

  // 배너/푸터 이미지 로딩으로 높이 바뀌는 경우 자동 보정
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => setLayoutVars());
    const sliderWrap = document.querySelector(".slider-wrapper");
    const footer = document.querySelector(".footer-bar");
    if (sliderWrap) ro.observe(sliderWrap);
    if (footer) ro.observe(footer);
  }
}

window.addEventListener("DOMContentLoaded", initAll);
window.addEventListener("load", () => { setBannerHeightByImage(); setLayoutVars(); });

window.addEventListener("resize", setLayoutVars);
window.addEventListener("orientationchange", () => setTimeout(setLayoutVars, 50));
window.visualViewport?.addEventListener("scroll", setLayoutVars);
