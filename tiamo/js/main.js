const byId = (s)=>document.querySelector(s);


const hamburger = byId('#hamburger');
const nav = byId('#nav');
const sidebar = byId('#sidebar');
if(hamburger){
  hamburger.addEventListener('click', ()=>{
    console.log("open");
    sidebar.classList.add('open');
    hamburger.setAttribute('aria-expanded', String(nav.classList.contains('open')));
    document.querySelector('.backdrop').classList.add('open');
  });
}

if(document.querySelector('.backdrop')){
  document.querySelector('.backdrop').addEventListener('click', ()=>{
    sidebar.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.querySelector('.backdrop').classList.remove('open');
  });
}

  // Simple product data (placeholder)
//   const products = Array.from({length:12}).map((_,i)=>({
//     title:`Summer Look ${i+1}`,
//     price:(19 + i).toFixed(2),
//     img:`https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=900&auto=format&fit=crop`,
//     isNew: i<4
//   }));


// function createCards(selector, items){
//     const el = byId(selector);
//     if(!el) return;
//     el.innerHTML = items.map(p=>`
//       <article class="product">
//         <img src="${p.img}" alt="${p.title}" loading="lazy" />
//         <div class="product__info">
//           <h3 class="product__title">${p.title}</h3>
//           <div class="product__meta">
//             <span class="price">$${p.price}</span>
//             ${p.isNew ? '<span class="badge--new">NEW</span>' : ''}
//           </div>
//         </div>
//       </article>`).join('');
//   }
  // Our Categories slider
  if (typeof Swiper !== 'undefined' && document.querySelector('.categories__slider')){
    new Swiper('.categories__slider', {
      slidesPerView: 4,
      spaceBetween: 18,
      speed: 500,
      grabCursor: true,
      navigation: {
        nextEl: '.categories-next',
        prevEl: '.categories-prev',
      },
      breakpoints: {
        0: { slidesPerView: 1.3, spaceBetween: 12 },
        640: { slidesPerView: 2, spaceBetween: 14 },
        980: { slidesPerView: 3, spaceBetween: 16 },
        1200: { slidesPerView: 4, spaceBetween: 18 },
      },
    });
  }

//   createCards('#shop', products);

// Initialize Swiper for hero mini-gallery
document.addEventListener('DOMContentLoaded', ()=>{
  if (typeof Swiper !== 'undefined' && document.querySelector('.hero__slider')){
    const swiper = new Swiper('.hero__slider', {
      slidesPerView: 3,
      spaceBetween: 18,
      speed: 500,
      grabCursor: true,
      breakpoints: {
        0: { slidesPerView: 1.3, spaceBetween: 12 },
        640: { slidesPerView: 2, spaceBetween: 14 },
        980: { slidesPerView: 3, spaceBetween: 18 },
      },
    });

    const prev = document.querySelector('.hero-prev');
    const next = document.querySelector('.hero-next');
    if(prev) prev.addEventListener('click', ()=> swiper.slidePrev());
    if(next) next.addEventListener('click', ()=> swiper.slideNext());
  }
  // Branded Collections slider
  if (typeof Swiper !== 'undefined' && document.querySelector('.brand__slider')){
    new Swiper('.brand__slider', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: '3',
      speed: 600,
      coverflowEffect: {
        rotate: 35,
        stretch: 0,
        depth: 160,
        modifier: 1,
        slideShadows: true,
      },
      breakpoints: {
        0: { },
        640: { },
        980: { },
      },
    });
  }
  // Countdown(s): update every element that has a data-end timestamp
  const timers = Array.from(document.querySelectorAll('[data-end]'));
  const pad = (n)=> String(n).padStart(2,'0');
  timers.forEach(container=>{
    const endAttr = container.getAttribute('data-end');
    const end = endAttr ? new Date(endAttr) : null;
    if (!end || Number.isNaN(end.getTime())) return;
    const els = {
      days: container.querySelector('[data-unit="days"]'),
      hours: container.querySelector('[data-unit="hours"]'),
      minutes: container.querySelector('[data-unit="minutes"]'),
      seconds: container.querySelector('[data-unit="seconds"]'),
    };
    const tick = ()=>{
      const now = new Date();
      let diff = Math.max(0, end - now);
      const d = Math.floor(diff / (1000*60*60*24)); diff -= d*(1000*60*60*24);
      const h = Math.floor(diff / (1000*60*60)); diff -= h*(1000*60*60);
      const m = Math.floor(diff / (1000*60)); diff -= m*(1000*60);
      const s = Math.floor(diff / 1000);
      if (els.days) els.days.textContent = pad(d);
      if (els.hours) els.hours.textContent = pad(h);
      if (els.minutes) els.minutes.textContent = pad(m);
      if (els.seconds) els.seconds.textContent = pad(s);
      if (end - now <= 0) clearInterval(timer);
    };
    tick();
    const timer = setInterval(tick, 1000);
  });
});