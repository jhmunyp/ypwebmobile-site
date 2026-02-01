let sliderTimer = null;

const TAP_DURATION = 180; // CSS tapPop 0.18s 와 동일

function playTapAnimation(el) {
  el.classList.remove('tap-anim');
  void el.offsetWidth; // reflow
  el.classList.add('tap-anim');
}

function isSystemScheme(href = "") {
  // iOS/모바일에서 지연 이동하면 호출이 불안정한 스킴들
  const h = href.trim().toLowerCase();
  return (
    h.startsWith("tel:") ||
    h.startsWith("mailto:") ||
    h.startsWith("sms:") ||
    h.startsWith("facetime:") ||
    h.startsWith("facetime-audio:")
  );
}

function goAfterAnim(el, href, durationMs) {
  playTapAnimation(el);
  setTimeout(() => {
    window.location.href = href;
  }, durationMs);
}

/* ===== 슬라이더 ===== */
function initSlider() {
  const slides = document.querySelector(".slides");
  if (!slides) return;

  // 초기화
  let index = 0;
  slides.style.transform = "translate3d(0,0,0)";

  // 타이머 중복 방지
  if (sliderTimer) clearInterval(sliderTimer);

  const total = slides.children.length;
  sliderTimer = setInterval(() => {
    index = (index + 1) % total;
    slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }, 3000);
}

/* ===== 공통: 링크 요소에 "애니메이션 후 이동" 또는 "즉시 이동" 적용 ===== */
function bindTapNavigate(el) {
  const href = el.getAttribute("href") || "";

  const handler = (e) => {
    if (!href || href === "#") {
      // 더미 링크면 애니메이션만
      e.preventDefault();
      playTapAnimation(el);
      return;
    }

    if (isSystemScheme(href)) {
      // ✅ tel/mailto/sms 등은 iOS 안정성을 위해 "이동 막지 않음"
      // 애니메이션은 touchstart에서 먼저 보여주고, 기본 동작은 그대로 진행
      return;
    }

    // ✅ 일반 링크는 애니메이션 끝나고 이동
    e.preventDefault();
    goAfterAnim(el, href, TAP_DURATION);
  };

  // iOS에서 touchstart + click 중복 방지
  let touched = false;

  el.addEventListener(
    "touchstart",
    (e) => {
      touched = true;

      // 시스템 스킴은 기본동작 유지하되 애니메이션은 즉시 보여주기
      if (isSystemScheme(href)) {
        playTapAnimation(el);
        return; // preventDefault 하지 않음
      }

      handler(e); // 일반 링크는 preventDefault + 지연이동
    },
    { passive: false }
  );

  el.addEventListener("click", (e) => {
    if (touched) {
      touched = false;
      return;
    }
    handler(e);
  });
}

/* ===== 메뉴 버튼 ===== */
function initMenuButtons() {
  document.querySelectorAll(".menu a").forEach(bindTapNavigate);
}

/* ===== 하단 배너(BI/CI) ===== */
function initFooterBanners() {
  document.querySelectorAll(".footer-banner").forEach(bindTapNavigate);
}

/* ===== 뒤로가기 복귀 시 초기화 ===== */
function resetUI() {
  document.querySelectorAll(".tap-anim").forEach((el) => el.classList.remove("tap-anim"));

  const slides = document.querySelector(".slides");
  if (slides) slides.style.transform = "translate3d(0,0,0)";
}

function initAll() {
  initSlider();
  initMenuButtons();
  initFooterBanners();
}

window.addEventListener("DOMContentLoaded", initAll);

// bfcache(뒤로가기 복원) 포함: 항상 초기화 + 슬라이더 재시작
window.addEventListener("pageshow", () => {
  resetUI();
  initSlider();
});
