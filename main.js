/* =============================================================
   ILES — main.js
   Handles: mobile nav, scroll reveal, quote form validation,
   the interactive SWL / lift estimate calculator, the brochure
   download trigger, and the back-to-top control.
   No external dependencies — vanilla JS only.
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     1. Mobile menu toggle
  ----------------------------------------------------------- */
  const menuBtn = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(isOpen));
      menuBtn.querySelector('.icon-open').classList.toggle('hidden', isOpen);
      menuBtn.querySelector('.icon-close').classList.toggle('hidden', !isOpen);
    });

    // Close mobile menu after a nav link is tapped
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.querySelector('.icon-open').classList.remove('hidden');
        menuBtn.querySelector('.icon-close').classList.add('hidden');
      });
    });
  }

  /* -----------------------------------------------------------
     2. Active nav link highlight on scroll (index page only)
  ----------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href*="#"]');

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href').endsWith('#' + id));
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((section) => navObserver.observe(section));
  }

  /* -----------------------------------------------------------
     3. Scroll reveal for elements marked .reveal
  ----------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* -----------------------------------------------------------
     4. Back-to-top control
  ----------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 600);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -----------------------------------------------------------
     5. Toast helper (shared by form + brochure download)
  ----------------------------------------------------------- */
  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* -----------------------------------------------------------
     6. Brochure download trigger
     The <a id="brochureDownload"> already points at the PDF via
     href + download attributes, so the browser handles the file
     transfer natively — this just confirms it to the user.
  ----------------------------------------------------------- */
  const brochureLinks = document.querySelectorAll('.brochure-download');
  brochureLinks.forEach((link) => {
    link.addEventListener('click', () => {
      showToast('Downloading the ILES company brochure (PDF)…');
    });
  });

  /* -----------------------------------------------------------
     7. Quote / Lift Plan request form — validation
  ----------------------------------------------------------- */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    const requiredFields = quoteForm.querySelectorAll('[required]');

    function validateField(field) {
      let valid = field.checkValidity();
      // extra rule: phone must contain at least 9 digits
      if (field.id === 'phone' && valid) {
        const digitCount = (field.value.match(/\d/g) || []).length;
        valid = digitCount >= 9;
      }
      field.classList.toggle('field-invalid', !valid);
      return valid;
    }

    requiredFields.forEach((field) => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('field-invalid')) validateField(field);
      });
    });

    const submitBtn = quoteForm.querySelector('button[type="submit"]');

    quoteForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      let formValid = true;
      requiredFields.forEach((field) => {
        if (!validateField(field)) formValid = false;
      });

      if (!formValid) {
        const firstInvalid = quoteForm.querySelector('.field-invalid');
        if (firstInvalid) firstInvalid.focus();
        showToast('Please check the highlighted fields and try again.');
        return;
      }

      const accessKey = quoteForm.querySelector('input[name="access_key"]').value;
      if (!accessKey || accessKey === 'YOUR-WEB3FORMS-ACCESS-KEY') {
        showToast('Form backend not connected yet — see README.md "Quote form backend".');
        return;
      }

      const name = quoteForm.querySelector('#name').value.trim();
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      // Web3Forms: free-forever form backend (250 submissions/month, no
      // login, no card). A plain POST of the form fields as JSON is all it
      // needs — see https://docs.web3forms.com for the full API reference.
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(Object.fromEntries(new FormData(quoteForm))),
        });
        const result = await response.json();

        if (response.ok && result.success) {
          quoteForm.reset();
          document.getElementById('quoteFormWrap').classList.add('hidden');
          document.getElementById('quoteFormSuccess').classList.remove('hidden');
          document.getElementById('quoteFormSuccess').focus();
          showToast(`Thanks, ${name.split(' ')[0]} — your request has been sent.`);
        } else {
          showToast('Something went wrong sending your request — please try again or call us directly.');
        }
      } catch (err) {
        showToast('Network error — please check your connection and try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  /* -----------------------------------------------------------
     8. Interactive SWL (Safe Working Load) estimate calculator
     Rough, transparent, client-side-only estimate to help a
     prospect scope a request before a certified lift plan is
     produced by ILES engineers. Not a substitute for a lift study.
  ----------------------------------------------------------- */
  const weightRange = document.getElementById('loadWeight');
  const weightOutput = document.getElementById('loadWeightOutput');
  const radiusRange = document.getElementById('loadRadius');
  const radiusOutput = document.getElementById('loadRadiusOutput');
  const serviceSelect = document.getElementById('calcServiceType');
  const resultCapacity = document.getElementById('calcResultCapacity');
  const resultTier = document.getElementById('calcResultTier');
  const resultNote = document.getElementById('calcResultNote');
  const calcToQuoteBtn = document.getElementById('calcToQuote');

  const SERVICE_FACTOR = {
    'crane-rental': 1.25,
    'rigging': 1.4,
    'structural-steel': 1.3,
    'load-testing': 1.5,
    'preventive-maintenance': 1.1,
  };

  function runCalculator() {
    if (!weightRange || !radiusRange) return;
    const weight = Number(weightRange.value);      // tonnes
    const radius = Number(radiusRange.value);       // metres
    const factor = SERVICE_FACTOR[serviceSelect.value] || 1.25;

    weightOutput.textContent = `${weight.toFixed(1)} t`;
    radiusOutput.textContent = `${radius.toFixed(1)} m`;

    // Simplified, transparent working: required minimum rated
    // capacity scales with load weight, working radius, and a
    // service-specific safety/handling factor. This is a scoping
    // estimate only — every job is confirmed with a certified lift
    // plan and load chart before mobilisation.
    const requiredCapacity = weight * factor * (1 + radius / 20);
    resultCapacity.textContent = `${requiredCapacity.toFixed(1)} t`;

    let tier = 'Standard hydraulic crane class';
    if (requiredCapacity > 150) tier = 'Heavy crawler crane class';
    else if (requiredCapacity > 60) tier = 'Large hydraulic / crawler class';
    else if (requiredCapacity > 20) tier = 'Mid-range hydraulic crane class';

    resultTier.textContent = tier;
    resultNote.textContent =
      `Estimated for ${weight.toFixed(1)} t at ${radius.toFixed(1)} m working radius — ` +
      `figure includes a handling margin for the selected service. Final rigging and crane ` +
      `selection is always confirmed by an ILES engineer against a certified load chart.`;
  }

  [weightRange, radiusRange, serviceSelect].forEach((el) => {
    if (el) el.addEventListener('input', runCalculator);
  });
  runCalculator();

  if (calcToQuoteBtn) {
    calcToQuoteBtn.addEventListener('click', () => {
      const serviceField = document.getElementById('service');
      const messageField = document.getElementById('message');
      if (serviceField) serviceField.value = serviceSelect.value;
      if (messageField) {
        messageField.value =
          `Estimate calculator result: ${resultCapacity.textContent} required capacity ` +
          `(${weightOutput.textContent} load at ${radiusOutput.textContent} radius). ` +
          `Please confirm with a certified lift plan.`;
      }
    });
  }

  /* -----------------------------------------------------------
     9. Footer year
  ----------------------------------------------------------- */
  document.querySelectorAll('.current-year').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

});
