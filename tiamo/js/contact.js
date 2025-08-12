// Smooth FAQ Accordion for Contact Page
function setupContactFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-list .faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    // Set initial max-height for open item
    if (item.classList.contains('active')) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      answer.style.maxHeight = '0px';
    }
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      // Close all
      faqItems.forEach(i => {
        i.classList.remove('active');
        const ans = i.querySelector('.faq-answer');
        ans.style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.contact-faq-section')) {
    setupContactFaqAccordion();
  }
});
