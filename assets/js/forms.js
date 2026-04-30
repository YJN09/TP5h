// Lightweight client-side form validation
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.setAttribute('novalidate', 'novalidate');
  form.addEventListener('submit', (e) => {
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      const errEl = input.parentElement.querySelector('.field-error');
      let msg = '';
      if (!input.value.trim()) msg = 'Dit veld is verplicht.';
      else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = 'Geen geldig e-mailadres.';
      else if (input.type === 'tel' && !/^[\d\s+()-]{7,}$/.test(input.value)) msg = 'Geen geldig telefoonnummer.';
      if (msg) {
        valid = false;
        input.setAttribute('aria-invalid', 'true');
        if (errEl) errEl.textContent = msg;
      } else {
        input.setAttribute('aria-invalid', 'false');
        if (errEl) errEl.textContent = '';
      }
    });
    if (!valid) {
      e.preventDefault();
      form.querySelector('[aria-invalid="true"]').focus();
    } else {
      e.preventDefault();
      const ok = form.querySelector('.form-success');
      if (ok) {
        form.querySelectorAll('.field, .form-section, .btn').forEach(el => el.style.display = 'none');
        ok.hidden = false;
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
});
