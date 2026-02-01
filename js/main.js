let sliderTimer = null;
const AUTO_MS = 3000;

const TAP_DURATION = 180; // CSS tapPop 0.18s

// ===== 버튼 탭 애니 =====
function playTapAnimation(el) {
  el.classList.remove("tap-anim");
  void el.offsetWidth; // reflow
  el.classList.add("tap-anim");
}

function isSystemScheme(href = "") {
  const h = href.trim().toLowerCase();
  return (
    h.startsWith("tel:") ||
    h.startsWith("mailto:") ||
    h.startsWith("sms:") ||
    h.startsWith("facetime:") ||
    h.startsWith("facetime-audio:")
  );
}

function goAfterAnim(el, href) {
  playTapAnimation(el);
  setTimeout(() => (window.location.href = href), TAP_DURATION);
}

function bindTapNavigate(el) {
  const href = el.getAttribute("href") || "";

  const handler = (e) => {
    if (!href || href === "#") {
      e.preventDefault();
      playTapAnimation(el);
      return;
    }
    if (isSystemScheme(href)) return; // 전화 등은 즉시
    e.preventDefault();
    goAfterAnim(el, href);
  };

  let touched = false;

  el.addEventListener("touchstart", (e) => {
    touched = true;
    if (isSystemScheme(href)) {
      playTapAnimation(el);
      return;
    }
    handler(e);
  }, { passive: false });

  el.addEventListener("click", (e) => {
    if (touched) { touched = false; return; }
    handler(e);
  });
}

function initTaps() {
  document.querySelectorAll(".menu a").forEach(bindTapNavigate);
  document.querySelectorAll(".footer-banner").forEach(bindTapNavigate);
}

// ===== 카톡 인앱 포함: 안전한 화면높이 + footer높이 계산 =====
function setLayoutVars() {
  const root = document.documentElement;
  const vv = window.visualViewport;

  const h1 = window.innerHeight || 0;
  const h2 = root.clientHeight || 0;
  const h3 = vv ? Math.floor(vv.height) : 999999;

  // 카톡에서 과대 높이 방지: 최소값 사용
  const appH = Math.max(0, Math.min(h1, h2, h3));
  root.style.setProperty("--appH", `${appH}px`);

  // footer 높이(이미지 로딩 전에는 0일 수 있어 load에서 재호출)
  const footer = document.querySelector(".footer-fixed");
  const footerH = footer ? Math.ceil(footer.getBoundingClientRect().height) : 0;
  root.style.setProperty("--footerH", `${footerH}px`);
}

// ===== 슬라이더: 자동 + 스와이프 =====
function initSlider() {
  const slider = document.querySelector("#slider");
  const slides = document.querySelector("#slides");
  if (!slider || !slides) return;

  const total = slides.children.length;
  let index = 0;

  const setTransition = (on) => {
    slides.style.transition = on ? "transform 0.35s ease" : "none";
  };

  const goTo = (i) => {
    index = (i + total) % total;
    slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  };

  const stopAuto = () => {
    if (sliderTimer) clearInterval(sliderTimer);
    sliderTimer = null;
  };

  const startAuto = () => {
    stopAuto();
    sliderTimer = setInterval(() => goTo(index + 1), AUTO_MS);
  };

  // 초기화
  setTransition(true);
  goTo(0);
  startAuto();

  // ---- 스와이프 로직 ----
  let startX = 0, startY = 0;
  let deltaX = 0;
  let dragging = false;
  let lock = null; // 'h' or 'v'

  const getX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);
  const getY = (e) => (e.touches ? e.touches[0].clientY : e.clientY);

  const onStart = (e) => {
    stopAuto();
    dragging = true;
    lock = null;
    startX = getX(e);
    startY = getY(e);
    deltaX = 0;
    setTransition(false);
  };

  const onMove = (e) => {
    if (!dragging) return;

    const x = getX(e);
    const y = getY(e);
    deltaX = x - startX;
    const dy = y - startY;

    // 방향 잠금(처음엔 수평/수직 판단)
    if (!lock) {
      if (Math.abs(deltaX) > 6 || Math.abs(dy) > 6) {
        lock = Math.abs(deltaX) > Math.abs(dy) ? "h" : "v";
      } else {
        return;
      }
    }

    // 수평 스와이프면 기본 스크롤/제스처 막고 슬라이더를 따라 움직임
    if (lock === "h") {
      e.preventDefault();

      const w = slider.clientWidth || 1;
      const percent = (deltaX / w) * 100; // 드래그 비율
      slides.style.transform = `translate3d(calc(-${index * 100}% + ${percent}%), 0, 0)`;
    }
  };

  const onEnd = () => {
    if (!dragging) return;
    dragging = false;

    setTransition(true);

    // lock이 수평이 아니면 그냥 원위치
    if (lock !== "h") {
      goTo(index);
      startAuto();
      return;
    }

    // 임계치: 화면의 20% 이상이면 페이지 전환
    const w = slider.clientWidth || 1;
    const threshold = w * 0.2;

    if (deltaX <= -threshold) goTo(index + 1);
    else if (deltaX >= threshold) goTo(index - 1);
    else goTo(index);

    startAuto();
  };

  // 터치
  slider.addEventListener("touchstart", onStart, { passive: true });
  slider.addEventListener("touchmove", onMove, { passive: false });
  slider.addEventListener("touchend", onEnd);
  slider.addEventListener("touchcancel", onEnd);

  // 마우스(PC 테스트용)
  slider.addEventListener("mousedown", (e) => { onStart(e); });
  window.addEventListener("mousemove", (e) => { onMove(e); });
  window.addEventListener("mouseup", onEnd);

  // 외부에서 재초기화할 수 있게 반환
  return { startAuto, stopAuto, goTo: (i) => goTo(i) };
}

// ===== 뒤로가기 복귀 초기화 =====
function resetUI() {
  document.querySelectorAll(".tap-anim").forEach(el => el.classList.remove("tap-anim"));
  const slides = document.querySelector("#slides");
  if (slides) slides.style.transform = "translate3d(0,0,0)";
}

// ===== 초기화 =====
let sliderApi = null;

function initAll() {
  setLayoutVars();
  initTaps();
  sliderApi = initSlider();
}

window.addEventListener("DOMContentLoaded", initAll);
window.addEventListener("load", () => { setLayoutVars(); });

window.addEventListener("resize", () => { setLayoutVars(); });
window.addEventListener("orientationchange", () => { setLayoutVars(); });

window.addEventListener("pageshow", () => {
  setLayoutVars();
  resetUI();
  // 슬라이더 타이머 중복 방지 위해 재초기화
  if (sliderApi?.stopAuto) sliderApi.stopAuto();
  sliderApi = initSlider();
});

// 카톡/크롬 주소창 변화 대응
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setLayoutVars);
  window.visualViewport.addEventListener("scroll", setLayoutVars);
}
