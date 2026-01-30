// ===== 배너 슬라이드 =====
const slider = document.getElementById('slider');
const slides = document.querySelector('.slides');
const dots = document.querySelectorAll('.dot');
const total = dots.length;

let index = 0;
let startX = 0;
let timer;

// 슬라이드 이동
function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[i].classList.add('active');
}

// 자동 롤링
function startAuto() {
  timer = setInterval(() => {
    index = (index + 1) % total;
    showSlide(index);
  }, 3000);
}
startAuto();

// 모바일 스와이프
slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
  clearInterval(timer);
});
slider.addEventListener('touchend', e => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    index = diff > 0
      ? (index + 1) % total
      : (index - 1 + total) % total;
    showSlide(index);
  }
  startAuto();
});

// ===== 메뉴 버튼 클릭 =====
// .no-js 클래스 제외 (전화 버튼 안전)
document.querySelectorAll('.menu-item:not(.no-js)').forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    const link = button.dataset.link;
    if (link) location.href = link;
  });
});
