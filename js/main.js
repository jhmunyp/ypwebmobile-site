// ===== 슬라이드 =====
const slides = document.querySelector('.slides');
const totalSlides = slides.children.length;
let index = 0;
let autoInterval;

if (totalSlides > 1) {  // 1장일 땐 슬라이드 비활성
  startAutoSlide();
}

// 슬라이드 이동 함수
function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
}

// 자동 슬라이드 시작
function startAutoSlide() {
  clearInterval(autoInterval);
  autoInterval = setInterval(() => {
    index = (index + 1) % totalSlides;
    showSlide(index);
  }, 3000);
}

// ===== 스와이프 처리 =====
let startX = 0;
const slider = document.querySelector('.slider');

slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  clearInterval(autoInterval);
});

slider.addEventListener('touchmove', e => {
  e.preventDefault(); // iOS 화면 흔들림 방지
}, { passive: false });

slider.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    index = diff > 0
      ? (index + 1) % totalSlides
      : (index - 1 + totalSlides) % totalSlides;
  }
  showSlide(index);
  startAutoSlide();
});

// ===== 메뉴 터치 효과 =====
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('touchstart', () => btn.classList.add('is-active'));
  btn.addEventListener('touchend', () => btn.classList.remove('is-active'));
});

// ===== 페이지 비활성 시 자동슬라이드 정지 =====
document.addEventListener('visibilitychange', () => {
  document.hidden ? clearInterval(autoInterval) : startAutoSlide();
});
