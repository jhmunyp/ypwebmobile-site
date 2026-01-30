// ===== 배너 =====
const slider = document.getElementById('slider');
const slides = document.getElementById('slides');
const dots = document.querySelectorAll('.dot');
let index=0, startX=0, timer;

function showSlide(i){
  slides.style.transform=`translateX(-${i*100}%)`;
  dots.forEach(d=>d.classList.remove('active'));
  dots[i].classList.add('active');
}

function startAuto(){
  timer=setInterval(()=>{index=(index+1)%dots.length; showSlide(index);},3000);
}
startAuto();

// 스와이프
slider.addEventListener('touchstart', e=>{startX=e.touches[0].clientX; clearInterval(timer);});
slider.addEventListener('touchend', e=>{
  const diff=startX-e.changedTouches[0].clientX;
  if(Math.abs(diff)>50){
    index=diff>0?(index+1)%dots.length:(index-1+dots.length)%dots.length;
    showSlide(index);
  }
  startAuto();
});

// 메뉴 클릭
document.querySelectorAll('.menu-item').forEach(btn=>{
  btn.addEventListener('click', e=>{
    e.preventDefault();
    location.href=btn.dataset.link;
  });
});
