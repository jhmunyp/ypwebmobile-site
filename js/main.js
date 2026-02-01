let sliderTimer = null;

const TAP_DURATION = 180; // CSS tapPop 0.18s

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

/* ===== 슬라이더 ===== */
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

/* ===== 버튼 탭: 애니메이션 후 이동(단, tel: 등은 즉시) ===== */
function bindTapNavigate(el) {
  const href = el.getAttribute("href") || "";

  const handler = (e) => {
    if (!href || href === "#") {
      e.preventDefault();
      playTapAnimation(el);
      return;
    }

    if (isSystemScheme(href)) {
      // 시스템 스킴은 iOS 안정성 위해 이동 막지 않음
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
  initSlider();
  initTaps();
}

window.addEventListener("DOMContentLoaded", initAll);

// bfcache(뒤로가기 복원) 포함: 항상 초기화 + 슬라이더 재시작
window.addEventListener("pageshow", () => {
  resetUI();
  initSlider();
});
