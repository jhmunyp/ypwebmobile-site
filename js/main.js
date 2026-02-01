const TAP_DURATION = 180;

// ===== Tap animation =====
function playTapAnimation(el) {
  el.classList.remove("tap-anim");
  void el.offsetWidth;
  el.classList.add("tap-anim");
}

// ===== 실제 보이는 화면 높이 + 메뉴 버튼 높이 자동 계산 =====
function setLayoutVars() {
  const root = document.documentElement;
  const vv = window.visualViewport;

  // ✅ 크롬만 튀는 문제 해결: 안드 크롬은 innerHeight 우선
  const ua = navigator.userAgent.toLowerCase();
  const isAndroid = ua.includes("android");
  const isSamsung = ua.includes("samsungbrowser");
  const isChrome = ua.includes("chrome") && !isSamsung;
  const isAndroidChrome = isAndroid && isChrome;

  const hInner = window.innerHeight || 0;
  const hClient = root.clientHeight || 0;

  let appH;
  if (isAndroidChrome) {
    // ✅ 안드 크롬: innerHeight가 가장 안정
    appH = hInner || hClient;
  } else {
    // ✅ iOS/카톡 인앱/삼성인터넷 등: visualViewport 우선
    appH = vv ? Math.floor(vv.height) : (hInner || hClient);
  }

  root.style.setProperty("--appH", `${appH}px`);

  const sliderWrap = document.querySelector(".slider-wrapper");
  const subtitleWrap = document.querySelector(".subtitle-container");
  const footer = document.querySelector(".footer-bar");
  const gapEl = document.querySelector(".menu-footer-gap");
  const container = document.querySelector(".container");
  const menu = document.querySelector(".menu");
  const links = document.querySelectorAll(".menu a");

  if (!sliderWrap || !subtitleWrap || !footer || !container || !menu || links.length === 0) return;

  const rows = Math.ceil(links.length / 2);

  const topH =
    Math.ceil(sliderWrap.getBoundingClientRect().height) +
    Math.ceil(subtitleWrap.getBoundingClientRect().height);

  const footerH = Math.ceil(footer.getBoundingClientRect().height);
  const gapH = gapEl ? Math.ceil(gapEl.getBoundingClientRect().height) : 0;

  const cs = getComputedStyle(container);
  const padTop = parseFloat(cs.paddingTop) || 0;
  const padBot = parseFloat(cs.paddingBottom) || 0;

  const ms = getComputedStyle(menu);
  const rowGap = parseFloat(ms.rowGap) || 0;

  // ✅ 고정 간격(6px)도 뺀 남은 높이를 메뉴가 사용
  const menuAvail = appH - topH - footerH - gapH - padTop - padBot;

  const gapsTotal = rowGap * (rows - 1);
  let itemH = Math.floor((menuAvail - gapsTotal) / rows);

  // 너무 작아지는 걸 방지
  itemH = Math.max(itemH, 36);

  root.style.setProperty("--menuItemH", `${itemH}px`);
}

// ===== 링크 처리: tel은 기본 동작 유지(가로채지 않음) =====
function initTaps() {
  d
