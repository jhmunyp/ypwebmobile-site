/* ===== 슬라이더 자동 ===== */
const slides = document.querySelector('.slides');
let index = 0;

if (slides) {
  const total = slides.children.length;

  setInterval(() => {
    index = (index + 1) % total;
    slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
  }, 3000);
}

/* ===== 하단 배너 bounce 후 링크 이동 ===== */
document.querySelectorAll('.footer-banner').forEach(banner => {
  const link = banner.getAttribute('href');
  const DURATION = 250; // CSS 애니메이션 시간(ms)과 동일하게

  const handleTap = (e) => {
    e.preventDefault(); // ❗ 즉시 이동 막기

    banner.classList.remove('bounce');
    void banner.offsetWidth; // reflow
    banner.classList.add('bounce');

    setTimeout(() => {
      window.location.href = link;
    }, DURATION);
  };

  banner.addEventListener('touchstart', handleTap, { passive: false });
  banner.addEventListener('click', handleTap);
});
