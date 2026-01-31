// ===== 슬라이드 =====
const slides = document.querySelector('.slides');
let index=0;
function showSlide(i){ slides.style.transform = `translateX(-${i*100}%)`; }
let autoInterval = setInterval(()=>{
  index=(index+1)%slides.children.length;
  showSlide(index);
},3000);

// ===== 터치 스와이프 =====
let startX=0,isTouching=false;
const slider=document.querySelector('.slider');
slider.addEventListener('touchstart',e=>{ startX=e.touches[0].clientX; isTouching=true; clearInterval(autoInterval); });
slider.addEventListener('touchmove',e=>{ if(isTouching) e.preventDefault(); },{passive:false});
slider.addEventListener('touchend',e=>{
  const diff=startX - e.changedTouches[0].clientX;
  if(Math.abs(diff)>50) index=diff>0?(index+1)%slides.children.length:(index-1+slides.children.length)%slides.children.length;
  showSlide(index);
  isTouching=false;
  autoInterval=setInterval(()=>{
    index=(index+1)%slides.children.length;
    showSlide(index);
  },3000);
});

// ===== 메뉴 버튼 터치 =====
document.querySelectorAll('.menu a').forEach(btn=>{
  btn.addEventListener('touchstart',()=>{ btn.style.transform='scale(0.97)'; btn.classList.add('is-active'); });
  btn.addEventListener('touchend',()=>{ btn.style.transform='scale(1)'; btn.classList.remove('is-active'); });
});

// ===== BI/CI 터치 확대 =====
document.querySelectorAll('.bi-box, .ci-box').forEach(box=>{
  box.addEventListener('touchstart', ()=>{ box.style.transform='scale(1.05)'; });
  box.addEventListener('touchend', ()=>{ box.style.transform='scale(1)'; });
});

// ===== 슬라이더 높이 동적 계산 =====
const sliderWrapper=document.querySelector('.slider-wrapper');
function adjustSliderHeight(){
  const firstImg = sliderWrapper.querySelector('img');
  if(firstImg.complete){
    sliderWrapper.style.height=firstImg.getBoundingClientRect().height+'px';
  } else {
    firstImg.onload = ()=> sliderWrapper.style.height=firstImg.getBoundingClientRect().height+'px';
  }
}
window.addEventListener('load',adjustSliderHeight);
window.addEventListener('resize',adjustSliderHeight);
