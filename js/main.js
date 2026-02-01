/* ===== 슬라이더 자동 ===== */
const slides = document.querySelector('.slides');
let index = 0;

setInterval(() => {
  index = (index + 1) % slides.children.length;
  slides.style.transform = `translateX(-${index * 100}%)`;
}, 3000);

/* ===== 하단 버튼 bounce ===== */
document.querySelectorAll('.bottom-btn').forEach(btn => {
  btn.addEventListener('touchstart', () => {
    btn.classList.remove('bounce');
    void btn.offsetWidth; // reflow
    btn.classList.add('bounce');
  });
});
