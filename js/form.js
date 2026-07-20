/* ============================================
   RAF Studio — Form Logic
   Validation, submission handling & UX states
   ============================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5555991057186';

  // ─── Contact Form ─────────────────────────────────
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('.form__submit');
    const successMsg = document.getElementById('form-success');

    form.addEventListener('submit', handleSubmit);

    function handleSubmit(e) {
      e.preventDefault();

      if (!validateForm(form)) return;

      // Loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        Enviando...
      `;

      // Build WhatsApp message from form data
      const data = new FormData(form);
      const name    = data.get('name')    || '';
      const email   = data.get('email')   || '';
      const phone   = data.get('phone')   || '';
      const segment = data.get('segment') || '';
      const message = data.get('message') || '';

      const waText = encodeURIComponent(
        `Olá! Vim pelo site da RAF Studio.\n\n` +
        `*Nome:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Telefone:* ${phone}\n` +
        `*Segmento:* ${segment}\n` +
        `*Mensagem:* ${message}`
      );

      // Small delay for UX, then redirect
      setTimeout(() => {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`, '_blank');

        // Show success
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
        }

        // Reset after timeout
        setTimeout(() => {
          form.reset();
          form.style.display = 'block';
          if (successMsg) successMsg.style.display = 'none';
          submitBtn.classList.remove('loading');
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Enviar mensagem <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
        }, 5000);
      }, 800);
    }
  }

  // ─── Validation ───────────────────────────────────
  function validateForm(form) {
    let isValid = true;
    clearErrors(form);

    const fields = [
      { name: 'name',    label: 'Nome',     minLength: 2 },
      { name: 'email',   label: 'Email',    isEmail: true },
      { name: 'segment', label: 'Segmento', required: true },
      { name: 'message', label: 'Mensagem', minLength: 10 },
    ];

    fields.forEach(({ name, label, minLength, isEmail, required }) => {
      const el = form.querySelector(`[name="${name}"]`);
      if (!el) return;

      const value = el.value.trim();

      if (!value) {
        showError(el, `${label} é obrigatório.`);
        isValid = false;
        return;
      }

      if (isEmail && !isValidEmail(value)) {
        showError(el, 'Informe um e-mail válido.');
        isValid = false;
        return;
      }

      if (minLength && value.length < minLength) {
        showError(el, `${label} deve ter pelo menos ${minLength} caracteres.`);
        isValid = false;
      }
    });

    return isValid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, message) {
    input.style.borderColor = '#EF4444';
    input.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.10)';

    const error = document.createElement('p');
    error.className = 'form__error';
    error.textContent = message;
    error.style.cssText = 'font-size:0.75rem;color:#EF4444;margin-top:4px;';
    input.parentNode.appendChild(error);

    input.addEventListener('input', () => {
      input.style.borderColor = '';
      input.style.boxShadow = '';
      error.remove();
    }, { once: true });
  }

  function clearErrors(form) {
    form.querySelectorAll('.form__error').forEach((el) => el.remove());
    form.querySelectorAll('input, textarea, select').forEach((el) => {
      el.style.borderColor = '';
      el.style.boxShadow = '';
    });
  }

  // ─── CSS for spinner ──────────────────────────────
  const spinStyle = document.createElement('style');
  spinStyle.textContent = `
    @keyframes spin { to { transform: rotate(360deg); } }
    .spin { animation: spin 0.8s linear infinite; }
  `;
  document.head.appendChild(spinStyle);

  // ─── Init ─────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', initContactForm);
})();
