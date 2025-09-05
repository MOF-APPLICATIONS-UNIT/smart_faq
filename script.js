document.addEventListener('DOMContentLoaded', () => {
    const fab = document.querySelector('.fab');
    const faqPanel = document.querySelector('.faq-panel');
    const closeBtn = document.querySelector('.close-btn');
    const searchInput = document.querySelector('.search-input');
    const suggestionsContainer = document.querySelector('.suggestions');
    const faqList = document.querySelector('.faq-list');
    let faqs = [];
  
    // Toggle FAQ panel
    fab.addEventListener('click', () => {
      faqPanel.style.display = faqPanel.style.display === 'flex' ? 'none' : 'flex';
    });
  
    closeBtn.addEventListener('click', () => {
      faqPanel.style.display = 'none';
      searchInput.value = '';
      updateSuggestions('');
    });
  
    // Fetch FAQs
    fetch('faqs.json')
      .then(response => response.json())
      .then(data => {
        faqs = data;
        renderFAQs(faqs);
      });
  
    // Render FAQs
    function renderFAQs(faqs) {
      faqList.innerHTML = '';
      faqs.forEach(faq => {
        const card = document.createElement('div');
        card.className = 'faq-card';
        card.innerHTML = `<h3>${faq.question}</h3><p>${faq.answer}</p>`;
        faqList.appendChild(card);
      });
    }
  
    // Update suggestions
    function updateSuggestions(query) {
      suggestionsContainer.innerHTML = '';
      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(query.toLowerCase())
      );
  
      filtered.forEach(faq => {
        const chip = document.createElement('div');
        chip.className = 'suggestion-chip';
        chip.textContent = faq.question;
        chip.addEventListener('click', () => {
          searchInput.value = faq.question;
          updateSuggestions(faq.question);
          renderFAQs([faq]);
        });
        suggestionsContainer.appendChild(chip);
        setTimeout(() => chip.style.opacity = '1', 0);
      });
  
      // Fade out removed suggestions
      suggestionsContainer.querySelectorAll('.suggestion-chip').forEach(chip => {
        if (!filtered.some(faq => faq.question === chip.textContent)) {
          chip.classList.add('fade-out');
          setTimeout(() => chip.remove(), 200);
        }
      });
    }
  
    // Search input handler
    searchInput.addEventListener('input', () => {
      const query = searchInput.value;
      updateSuggestions(query);
      const filtered = faqs.filter(faq =>
        faq.question.toLowerCase().includes(query.toLowerCase())
      );
      renderFAQs(filtered.length ? filtered : faqs);
    });
  });