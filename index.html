// ===== 배너 슬라이드 =====
const slides = document.querySelector('.slides');
let index = 0;

function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
}

// 자동 슬라이드
let autoInterval = setInterval(() => {
  index = (index + 1) % slides.children.length;
  showSlide(index);
}, 3000);

// ===== 스와이프 처리 =====
let startX = 0;
const slider = document.querySelector('.slider');

slider.addEventListener('touchstart', e => { 
  startX = e.touches[0].clientX;
  clearInterval(autoInterval);
});

slider.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    index = diff > 0
      ? (index + 1) % slides.children.length
      : (index - 1 + slides.children.length) % slides.children.length;
  }
  showSlide(index);
  autoInterval = setInterval(() => {
    index = (index + 1) % slides.children.length;
    showSlide(index);
  }, 3000);
});

// ===== 메뉴 터치 효과 =====
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('touchstart', () => {
    btn.style.transform = 'translateY(-0.5vw)';
    btn.classList.add('is-active');
  });
  btn.addEventListener('touchend', () => {
    btn.style.transform = 'translateY(0)';
    btn.classList.remove('is-active');
  });
});
