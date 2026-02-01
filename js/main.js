let sliderTimer = null;

function playTapAnimation(el) {
  el.classList.remove('tap-anim');
  void el.offsetWidth; // reflow
  el.classList.add('tap-anim');
}

function goAfterAnim(el, href, durationMs) {
  playTapAnimation(el);
  setTimeout(() => {
    window.location.href = href;
  }, durationMs);
}

/* ===== 슬라이더 ===== */
function initSlider() {
  const slides = document.querySelector('.slides');
  if (!slides) return;

  // 초기화
  let index = 0;
  slides.style.transform = 'translate3d(0,0,0)';

  // 타이머 중복 방지
  if (sliderTimer) clearInterval(sliderTimer);

  const total = slides.children.length;
  sliderTimer = setInterval(() => {
    index = (index + 1) % total;
    slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }, 3000);
}

/* ===== 메뉴 버튼: 애니메이션 끝나고 이동 ===== */
function initMenuButtons() {
  const DURATION = 180; // CSS tapPop 0.18s
  document.querySelectorAll('.menu a').forEach(a => {
    const href = a.getAttribute('href');

    const handler = (e) => {
      // 링크 이동 지연
      e.preventDefault();
      goAfterAnim(a, href, DURATION);
    };

    // iOS에서 touchstart + click 중복 방지
    let touched = false;

    a.addEventListener('touchstart', (e) => {
      touched = true;
      handler(e);
    }, { passive: false });

    a.addEventListener('click', (e) => {
      if (touched) {
        touched = false;
        return;
      }
      handler(e);
    });
  });
}

/* ===== 하단 배너(BI/CI): 애니메이션 끝나고 이동 ===== */
function initFooterBanners() {
  const DURATION = 180; // CSS tapPop 0.18s
  document.querySelectorAll('.footer-banner').forEach(banner => {
    const href = banner.getAttribute('href');

    const handler = (e) => {
      e.preventDefault();
      goAfterAnim(banner, href, DURATION);
    };

    let touched = false;

    banner.addEventListener('touchstart', (e) => {
      touched = true;
      handler(e);
    }, { passive: false });

    banner.addEventListener('click', (e) => {
      if (touched) {
        touched = false;
        return;
      }
      handler(e);
    });
  });
}

/* ===== 뒤로가기 복귀 시 초기화 ===== */
function resetUI() {
  // 애니메이션 클래스 제거
  document.querySelectorAll('.tap-anim').forEach(el => el.classList.remove('tap-anim'));

  // 슬라이더 첫 장으로
  const slides = document.querySelector('.slides');
  if (slides) slides.style.transform = 'translate3d(0,0,0)';
}

function initAll() {
  initSlider();
  initMenuButtons();
  initFooterBanners();
}

window.addEventListener('DOMContentLoaded', initAll);

// bfcache(뒤로가기 복원) 포함: 항상 초기화+재시작
window.addEventListener('pageshow', () => {
  resetUI();
  initSlider();
});
