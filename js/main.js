const slides = document.getElementById('slide-row');
const slider = document.getElementById('main-slider');
const slideItems = document.querySelectorAll('.slide');
let index = 0;
let timer;

// 슬라이드 이동 (300% 너비 기준 계산)
function showSlide(i) {
  slides.style.transform = `translateX(-${(i * 100) / slideItems.length}%)`;
}

// 자동 재생 시작
function startTimer() {
  timer = setInterval(() => {
    index = (index + 1) % slideItems.length;
    showSlide(index);
  }, 3000);
}

// 초기 실행
startTimer();

// ===== 스와이프 처리 =====
let startX = 0;
slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  clearInterval(timer); // 사용자가 만지면 자동 정지
}, {passive: true});

slider.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) index = (index + 1) % slideItems.length;
    else index = (index - 1 + slideItems.length) % slideItems.length;
  }
  showSlide(index);
  startTimer(); // 다시 자동 재생
}, {passive: true});

// ===== 메뉴 효과 (페이지 이동 방해 금지) =====
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('touchstart', () => btn.style.transform = 'scale(0.97)');
  btn.addEventListener('touchend', () => btn.style.transform = 'scale(1)');
  // click 이벤트의 preventDefault()를 제거하여 정상 이동하게 함
});

// 페이지 복원 시 초기화
window.addEventListener('pageshow', () => {
  index = 0;
  showSlide(index);
});
