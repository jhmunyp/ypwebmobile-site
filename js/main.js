let sliderTimer = null;

const TAP_DURATION = 180; // CSS tapPop 0.18s

/* ===== 카톡/크롬/삼성인터넷: 실제 보이는 화면 높이 고정 ===== */
function setAppHeight() {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const h = vv ? vv.height : window.innerHeight;
  root.style.setProperty("--appH", `${Math.floor(h)}px`);
}

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
  setTimeout(() => {
    window.location.href = href;
  }, TAP_DURATION);
}

/* ===== 슬라이더 자동 ===== */
function initSlider() {
  const slides = document.querySelector(".slides");
  if (!slides) return;

  let index = 0;
  slides.style.transform = "translate3d(0,0,0)";

  if (sliderTimer) clearInterval(sliderTimer);

  const total = slides.children.length;
  sliderTimer = setInterval(() => {
    index = (index + 1) % total;
    slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }, 3000);
}

/* ===== 탭: 애니메이션 후 이동 (tel: 등은 즉시) ===== */
function bindTapNavigate(el) {
  const href = el.getAttribute("href") || "";

  const handler = (e) => {
    if (!href || href === "#") {
      e.preventDefault();
      playTapAnimation(el);
      return;
    }

    if (isSystemScheme(href)) {
      // 시스템 스킴은 iOS/웹뷰에서 지연 이동이 불안정할 수 있어 막지 않음
      return;
    }

    e.preventDefault();
    goAfterAnim(el, href);
  };

  let touched = false;

  el.addEventListener("touchstart", (e) => {
    touched = true;

    if (isSystemScheme(href)) {
      playTapAnimation(el); // 애니만 보여주고 기본 동작 유지
      return;
    }

    handler(e);
  }, { passive: false });

  el.addEventListener("click", (e) => {
    if (touched) {
      touched = false;
      return;
    }
    handler(e);
  });
}

function initTaps() {
  document.querySelectorAll(".menu a").forEach(bindTapNavigate);
  document.querySelectorAll(".footer-banner").forEach(bindTapNavigate);
}

/* ===== 뒤로가기 복귀 시 초기화 ===== */
function resetUI() {
  document.querySelectorAll(".tap-anim").forEach(el => el.classList.remove("tap-anim"));
  const slides = document.querySelector(".slides");
  if (slides) slides.style.transform = "translate3d(0,0,0)";
}

function initAll() {
  setAppHeight();
  initSlider();
  initTaps();
}

/* 최초 진입 */
window.addEventListener("DOMContentLoaded", initAll);

/* 주소창/툴바 변화 대응 */
window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);

window.addEventListener("pageshow", () => {
  setAppHeight();
  resetUI();
  initSlider();
});

if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setAppHeight);
  window.visualViewport.addEventListener("scroll", setAppHeight);
}
