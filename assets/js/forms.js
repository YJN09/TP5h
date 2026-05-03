// Lightweight client-side form validation + Netlify Forms AJAX submission
document.querySelectorAll('form[data-validate]').forEach(form => {
  form.setAttribute('novalidate', 'novalidate');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      const errEl = input.parentElement.querySelector('.field-error');
      let msg = '';
      if (input.type === 'checkbox') {
        if (!input.checked) msg = 'Dit veld is verplicht.';
      } else if (!input.value.trim()) msg = 'Dit veld is verplicht.';
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
      const inv = form.querySelector('[aria-invalid="true"]');
      if (inv) inv.focus();
      return;
    }

    // Submit to Netlify via AJAX
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.disabled = true; submitBtn.style.opacity = '.6'; }

    const formData = new FormData(form);
    const body = new URLSearchParams(formData).toString();

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body
    }).then(res => {
      if (!res.ok) throw new Error('Netwerkfout');
      const ok = form.querySelector('.form-success');
      if (ok) {
        form.querySelectorAll('.field, .field-row, .form-section, .btn').forEach(el => el.style.display = 'none');
        ok.hidden = false;
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }).catch(() => {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.style.opacity = ''; }
      alert('Er ging iets mis bij het versturen. Probeer het opnieuw of bel ons op 023 558 30 46.');
    });
  });
});
