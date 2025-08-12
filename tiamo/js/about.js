// about.js: inject header/footer and build About section

// Copy header/footer from index.html (assume static for now)
function injectHeaderFooter() {
  fetch('./index.html')
    .then(res => res.text())
    .then(html => {
      // Extract header/footer from index.html
      const headerMatch = html.match(/<header[\s\S]*?<\/header>/);
      const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/);
      if (headerMatch) document.getElementById('main-header').innerHTML = headerMatch[0];
      if (footerMatch) document.getElementById('main-footer').innerHTML = footerMatch[0];
    });
}

function buildAboutSection() {
  const aboutMain = document.getElementById('about-main');
  aboutMain.innerHTML = `
    <section class="about-section">
      <div class="about-section__top">
        <div class="about-section__intro">
          <div class="about-eyebrow">SOME WORDS ABOUT US</div>
          <h2>Well-coordinated teamwork speaks About Us</h2>
        </div>
        <div class="about-section__feature-list">
          <div class="about-feature">
            <h4>We love what we do</h4>
            <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
            <a href="#" class="about-feature-link">READ MORE</a>
          </div>
          <div class="about-feature">
            <h4>Our working process</h4>
            <p>She packed her seven versalia, put her initial into the belt and made herself on the way.</p>
            <a href="#" class="about-feature-link">READ MORE</a>
          </div>
        </div>
      </div>
      <div class="about-section__main">
        <div class="about-section__image">
          <img src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=900&auto=format&fit=crop" alt="Team working" />
        </div>
        <div class="about-section__content">
          <div class="about-section__subtitle">SEEMINGLY ELEGANT DESIGN</div>
          <div class="about-section__title">About our online store</div>
          <div class="about-section__desc">Risus suspendisse a orci penatibus a felis suscipit consectetur vestibulum sodales dui cum ultricies lacus interdum.</div>
          <div class="about-section__text">One morning, when Gregor Samsa woke from troubled dreams, he found himself transformed in his bed into a horrible vermin. He lay on his armour-like back, and if he lifted his head a little he could see his brown belly, slightly domed and divided by arches into stiff.</div>
          <div class="about-section__text">Dictumst per ante cras suscipit nascetur ullamcorper in nullam fermentum condimentum torquent iaculis redin posuere potenti viverra condimentum dictumst id tellus suspendisse</div>
          <div class="about-section__footer">
            Developed by Xtemos Studio © 2024
            <span class="about-socials">
              <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" aria-label="X"><i class="fa-brands fa-x-twitter"></i></a>
              <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
              <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
            </span>
          </div>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  injectHeaderFooter();
  buildAboutSection();
});
