// Basic interactivity for Tiamo homepage
(function(){
  const byId = (s)=>document.querySelector(s);

  // Mobile nav toggle
  const hamburger = byId('#hamburger');
  const nav = byId('#nav');
  if(hamburger){
    hamburger.addEventListener('click', ()=>{
      const open = nav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', String(open));
    });
  }

  // Back to top
  const backToTop = byId('#backtotop');
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', ()=>{
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // Newsletter
  const nlForm = byId('#newsletter-form');
  const nlMsg = byId('#newsletter-msg');
  if(nlForm){
    nlForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      nlMsg.textContent = 'Thanks for subscribing!';
      nlForm.reset();
    });
  }

  // Year in footer
  const y = new Date().getFullYear();
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = y;

  // Simple product data (placeholder)
  const sampleProducts = Array.from({length:12}).map((_,i)=>({
    title:`Summer Look ${i+1}`,
    price:(19 + i).toFixed(2),
    img:`https://images.unsplash.com/photo-1520975661595-6453be3f7070?q=80&w=900&auto=format&fit=crop`,
    isNew: i<4
  }));

  function renderCarousel(selector, items){
    const el = byId(selector);
    if(!el) return;
    el.innerHTML = items.map(p=>`
      <article class="product">
        <img src="${p.img}" alt="${p.title}" loading="lazy" />
        <div class="product__info">
          <h3 class="product__title">${p.title}</h3>
          <div class="product__meta">
            <span class="price">$${p.price}</span>
            ${p.isNew ? '<span class="badge--new">NEW</span>' : ''}
          </div>
        </div>
      </article>`).join('');
  }

  renderCarousel('#new-carousel', sampleProducts);
  renderCarousel('#best-carousel', sampleProducts.slice().reverse());

  // Carousel scroll controls
  function setupCarouselControls(){
    document.querySelectorAll('.carousel__prev,.carousel__next').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const targetSel = btn.getAttribute('data-target');
        const target = document.querySelector(targetSel);
        if(!target) return;
        const delta = target.clientWidth * 0.8;
        target.scrollBy({
          left: btn.classList.contains('carousel__next') ? delta : -delta,
          behavior:'smooth'
        });
      });
    });
  }
  setupCarouselControls();
})();
