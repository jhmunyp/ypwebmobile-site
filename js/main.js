// ===== 배너 슬라이드 =====
const slides = document.querySelector('.slides');
let index = 0;

// 슬라이드 표시
function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
}

// 자동 슬라이드
setInterval(() => {
  index = (index + 1) % slides.children.length;
  showSlide(index);
}, 3000);

// ===== 스와이프 처리 =====
let startX = 0;
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

// ===== 메뉴 터치 효과 + 클릭 이동 =====
document.querySelectorAll('.menu a').forEach(btn => {
  // 눌린 버튼만 살짝 올라가게
  btn.addEventListener('touchstart', e => {
    e.stopPropagation(); // 다른 버튼으로 이벤트 전파 차단
    btn.style.transform = 'translateY(-0.5vw)';
  });
  btn.addEventListener('touchend', e => {
    e.stopPropagation();
    btn.style.transform = 'translateY(0)';
  });

  // 메뉴 클릭 이동
  btn.addEventListener('click', e => {
    e.preventDefault();
    location.href = btn.getAttribute('href');
  });
});

// ===== 페이지 복원 시 초기화 =====
window.addEventListener('pageshow', () => {
  document.querySelectorAll('.menu a').forEach(btn => btn.style.transform = 'translateY(0)');
  window.scrollTo(0, 0);
});
