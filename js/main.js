// ===== 슬라이드 =====
const slides = document.querySelector('.slides');
const totalSlides = slides.children.length;
let index = 0;
let autoInterval;

if (totalSlides > 1) startAutoSlide();

function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
}

function startAutoSlide() {
  clearInterval(autoInterval);
  autoInterval = setInterval(() => {
    index = (index + 1) % totalSlides;
    showSlide(index);
  }, 3000);
}

// ===== 스와이프 =====
let startX = 0;
const slider = document.querySelector('.slider');

slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  clearInterval(autoInterval);
});

slider.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

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

// ===== 메뉴 터치 =====
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('touchstart', () => btn.classList.add('is-active'));
  btn.addEventListener('touchend', () => btn.classList.remove('is-active'));
});

// ===== CI 이미지 터치 효과 =====
const ciBox = document.querySelector('.ci-box');
ciBox.addEventListener('touchstart', () => ciBox.style.transform = 'scale(1.05)');
ciBox.addEventListener('touchend', () => ciBox.style.transform = 'scale(1)');

// ===== 페이지 숨김 시 자동슬라이드 정지 =====
document.addEventListener('visibilitychange', () => {
  document.hidden ? clearInterval(autoInterval) : startAutoSlide();
});
