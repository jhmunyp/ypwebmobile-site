let sliderTimer = null;

const TAP_DURATION = 180; // CSS tapPop 0.18s

function playTapAnimation(el) {
  el.classList.remove('tap-anim');
  void el.offsetWidth; // reflow
  el.classList.add('tap-anim');
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

  let index = 0;
  slides.style.transform = "translate3d(0,0,0)";

  if (sliderTimer) clearInterval(sliderTimer);

  const total = slides.children.length;
  sliderTimer = setInterval(() => {
    index = (index + 1) % total;
    slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }, 3000);
}

/* ===== footer 높이 측정 → wrapper padding-bottom 반영 ===== */
function updateFooterHeightVar() {
  const footer = document.querySelector(".footer-fixed");
  if (!footer) return;

  // 이미지 로딩 전/후 모두 대응
  const h = Math.ceil(footer.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--footerH", `${h}px`);
}

/* ===== 남은 높이에 맞춰 메뉴 스케일 자동 조정 ===== */
function fitMenuToScreen() {
  const wrapper = document.querySelector(".wrapper");
  const menu = document.querySelector(".menu");
  if (!wrapper || !menu) return;

  // 초기 스케일로 측정
  document.documentElement.style.setProperty("--menuScale", "1");

  // footer 높이 반영
  updateFooterHeightVar();

  // 현재 wrapper 안에서 메뉴가 넘치는지 확인
  // (wrapper는 footer 높이만큼 padding-bottom 확보한 상태)
  const wrapperH = wrapper.getBoundingClientRect().height;
  const contentH = wrapper.scrollHeight;

  // 넘치면 메뉴를 축소 (최소 0.85까지)
  if (contentH > wrapperH) {
    const ratio = wrapperH / contentH;
    const scale = Math.max(0.85, Math.min(1, ratio));
    document.documentElement.style.setProperty("--menuScale", String(scale));
  }
}

/* ===== 공통: 탭 애니메이션 + 이동(메뉴/배너 동일) ===== */
function bindTapNavigate(el) {
  const href = el.getAttribute("href") || "";

  const handler = (e) => {
    if (!href || href === "#") {
      e.preventDefault();
      playTapAnimation(el);
      return;
    }

    if (isSystemScheme(href)) {
      // 전화/메일/SMS는 iOS 안정성을 위해 이동을 막지 않음
      return;
    }

    e.preventDefault();
    goAfterAnim(el, href, TAP_DURATION);
  };

  let touched = false;

  el.addEventListener("touchstart", (e) => {
    touched = true;

    if (isSystemScheme(href)) {
      // 애니메이션은 보여주고, 기본 동작 유지
      playTapAnimation(el);
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

  // 레이아웃 맞춤(이미지 로딩/주소창 변화/회전 대응)
  updateFooterHeightVar();
  fitMenuToScreen();
}

window.addEventListener("DOMContentLoaded", initAll);
window.addEventListener("load", () => { updateFooterHeightVar(); fitMenuToScreen(); });
window.addEventListener("resize", () => { updateFooterHeightVar(); fitMenuToScreen(); });

// bfcache(뒤로가기 복원) 포함: 항상 초기화 + 슬라이더 재시작 + 레이아웃 재맞춤
window.addEventListener("pageshow", () => {
  resetUI();
  initSlider();
  updateFooterHeightVar();
  fitMenuToScreen();
});
