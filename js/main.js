// ===== 배너 슬라이드 =====
const slides = document.querySelector('.slides');
let index = 0;
let startX = 0;
let timer;

function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
}

// 자동 롤링
function startAuto() {
  timer = setInterval(() => {
    index = (index + 1) % slides.children.length;
    showSlide(index);
  }, 3000);
}
startAuto();

// ===== 스와이프 처리 =====
const slider = document.querySelector('.slider');

slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});

slider.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    index = diff > 0 
      ? (index + 1) % slides.children.length 
      : (index - 1 + slides.children.length) % slides.children.length;
    showSlide(index);
  }
});

// ===== 메뉴 클릭 이동 =====
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    location.href = btn.getAttribute('href');
  });
});

// ===== 페이지 복원 시 버튼 상태 초기화 =====
window.addEventListener('pageshow', () => {
  document.querySelectorAll('.menu a').forEach(btn => btn.style.transform = 'translateY(0)');
  window.scrollTo(0, 0); // 스크롤 맨 위
});
