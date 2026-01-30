// ===== 배너 슬라이드 =====
const slider = document.getElementById('slider');
const slides = document.getElementById('slides');
const dots = document.querySelectorAll('.dot');
const total = dots.length;

let index = 0;
let startX = 0;
let timer;

function showSlide(i) {
  slides.style.transform = `translateX(-${i * 100}%)`;
  dots.forEach(dot => dot.classList.remove('active'));
  dots[i].classList.add('active');
}

function startAuto() {
  timer = setInterval(() => {
    index = (index + 1) % total;
    showSlide(index);
  }, 3000);
}

startAuto();

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
document.querySelectorAll('.menu-item').forEach(button => {
  button.addEventListener('click', e => {
    e.preventDefault();
    const link = button.dataset.link;
    location.href = link;
  });
});
