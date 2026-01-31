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

// ===== 스와이프 처리 + 스크롤 방지 =====
let startX = 0;
let isTouching = false;
const slider = document.querySelector('.slider');

slider.addEventListener('touchstart', e => { 
  startX = e.touches[0].clientX;
  isTouching = true;
  clearInterval(autoInterval);
});

slider.addEventListener('touchmove', e => {
  if (isTouching) e.preventDefault(); // 스크롤 방지
}, { passive: false });

slider.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    index = diff > 0
      ? (index + 1) % slides.children.length
      : (index - 1 + slides.children.length) % slides.children.length;
  }
  showSlide(index);
  isTouching = false;

  // 자동슬라이드 재시작
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

// ===== BI + CI 이미지 위치 제어 (메뉴와 겹치지 않도록) =====
const ciBox = document.querySelector('.ci-box');
const biBox = document.querySelector('.bi-box');
const container = document.querySelector('.container');

function updateBoxesPosition() {
  const viewportHeight = window.innerHeight;
  const ciHeight = ciBox.offsetHeight;
  const biHeight = biBox.offsetHeight;
  const menuBottom = container.getBoundingClientRect().bottom; // 메뉴 영역 끝

  // CI 최하단
  ciBox.style.top = (viewportHeight - ciHeight) + 'px';

  // BI 박스: CI 바로 위, 메뉴 끝에서 최소 10px 떨어지도록
  const biTop = viewportHeight - ciHeight - biHeight;
  const minTop = menuBottom + 10;
  biBox.style.top = Math.max(biTop, minTop) + 'px';
}

// 초기 위치
updateBoxesPosition();

// 리사이즈/회전 대응
window.addEventListener('resize', updateBoxesPosition);
window.addEventListener('orientationchange', updateBoxesPosition);
