/**
 * KitchHub - Industrial Skeuomorphism Design System
 * Mechanical Physics · Neumorphic Shadows · Interactive Details
 * Handles: mobile menu, FAQ accordion, pricing selector, form validation
 */

(function() {
  'use strict';

  // ============================================
  // MOBILE MENU - Neumorphic Toggle
  // ============================================
  const initMobileMenu = function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !navList) return;

    // Toggle menu
    menuToggle.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      this.classList.toggle('active');
      navList.classList.toggle('active');

      // Update aria-label
      const label = isExpanded ? 'Ouvrir le menu' : 'Fermer le menu';
      this.setAttribute('aria-label', label);
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!menuToggle.contains(event.target) && !navList.contains(event.target)) {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
      }
    });
  };

  // ============================================
  // FAQ ACCORDION - Mechanical Toggle
  // ============================================
  const initFaqAccordion = function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
      question.addEventListener('click', function() {
        const faqItem = this.closest('.faq-item');
        const isActive = faqItem.classList.contains('active');

        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
          item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        // Toggle current item
        if (!isActive) {
          faqItem.classList.add('active');
          this.setAttribute('aria-expanded', 'true');
        }
      });

      // Keyboard support
      question.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    });
  };

  // ============================================
  // PRICING SELECTOR
  // ============================================
  const initPricingSelector = function() {
    const citySelect = document.getElementById('city-select');
    const durationSelect = document.getElementById('duration-select');
    const priceStarter = document.getElementById('price-starter');
    const priceDisplay = document.querySelector('.price-display');
    const priceText = priceDisplay ? priceDisplay.querySelector('p') : null;

    if (!citySelect || !durationSelect || !priceStarter) return;

    // Base prices by city
    const cityPrices = {
      paris: { starter: 590, pro: 990, premium: 1490 },
      lyon: { starter: 490, pro: 890, premium: 1290 },
      marseille: { starter: 490, pro: 850, premium: 1250 },
      lille: { starter: 440, pro: 790, premium: 1190 },
      bordeaux: { starter: 490, pro: 890, premium: 1290 }
    };

    // Duration discounts
    const durationDiscounts = {
      monthly: 1,
      quarterly: 0.95,
      annual: 0.85
    };

    const updatePrices = function() {
      const city = citySelect.value;
      const duration = durationSelect.value;

      const basePrice = cityPrices[city].starter;
      const discount = durationDiscounts[duration];
      const finalPrice = Math.round(basePrice * discount);

      // Update price display
      priceStarter.textContent = finalPrice + '€';

      // Update estimate text
      const cityLabel = citySelect.options[citySelect.selectedIndex].text;
      const durationLabel = durationSelect.options[durationSelect.selectedIndex].text;

      if (priceText) {
        priceText.textContent = 'Estimation pour ' + cityLabel + ' - ' + durationLabel;
      }
    };

    // Event listeners
    citySelect.addEventListener('change', updatePrices);
    durationSelect.addEventListener('change', updatePrices);

    // Initial call
    updatePrices();
  };

  // ============================================
  // CONTACT FORM VALIDATION - Recessed Inputs
  // ============================================
  const initContactForm = function() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');

    if (!contactForm) return;

    // Set minimum date for visit date picker
    const visitDateInput = document.getElementById('visit-date');
    if (visitDateInput) {
      const today = new Date().toISOString().split('T')[0];
      visitDateInput.setAttribute('min', today);
    }

    // Validation functions
    const validators = {
      lastname: function(value) {
        return value.trim().length >= 2;
      },
      firstname: function(value) {
        return value.trim().length >= 2;
      },
      email: function(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value.trim());
      },
      phone: function(value) {
        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        const digitsOnly = value.replace(/\s/g, '');
        return digitsOnly.length === 10 && /^\d+$/.test(digitsOnly);
      },
      city: function(value) {
        return value !== '';
      },
      offer: function(value) {
        return value !== '';
      },
      consent: function(checkbox) {
        return checkbox.checked;
      }
    };

    // Show/hide error
    const setFieldError = function(field, hasError) {
      const formGroup = field.closest('.form-group');
      const errorElement = document.getElementById(field.id + '-error');

      if (hasError) {
        field.classList.add('error');
        formGroup.classList.add('has-error');
        if (errorElement) {
          errorElement.style.display = 'block';
        }
      } else {
        field.classList.remove('error');
        formGroup.classList.remove('has-error');
        if (errorElement) {
          errorElement.style.display = 'none';
        }
      }
    };

    // Validate single field
    const validateField = function(field) {
      const fieldName = field.name;
      const value = field.type === 'checkbox' ? field : field.value;

      if (!validators[fieldName]) return true;

      const isValid = validators[fieldName](value);
      setFieldError(field, !isValid);

      return isValid;
    };

    // Real-time validation
    const formFields = contactForm.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
      if (validators[field.name]) {
        field.addEventListener('blur', function() {
          validateField(this);
        });

        field.addEventListener('input', function() {
          if (this.classList.contains('error')) {
            validateField(this);
          }
        });
      }
    });

    // Form submission
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      let isFormValid = true;

      // Validate all fields
      formFields.forEach(field => {
        if (validators[field.name]) {
          if (!validateField(field)) {
            isFormValid = false;
          }
        }
      });

      if (isFormValid) {
        // Collect form data
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        // Log form data (in production, send to server)
        console.log('Form submitted successfully:', data);

        // Hide form and show success message
        contactForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.classList.add('visible');

          // Create summary
          const summary = document.createElement('div');
          summary.style.marginTop = 'var(--space-md)';
          summary.style.paddingTop = 'var(--space-md)';
          summary.style.borderTop = '1px solid var(--accent)';
          summary.innerHTML = `
            <p style="margin: var(--space-xs) 0; font-size: 0.9375rem; color: var(--text-primary);">
              <strong>Récapitulatif de votre demande :</strong>
            </p>
            <p style="margin: var(--space-xs) 0; font-size: 0.875rem; color: var(--text-primary);">
              Nom : ${data.lastname} ${data.firstname}
            </p>
            <p style="margin: var(--space-xs) 0; font-size: 0.875rem; color: var(--text-primary);">
              Email : ${data.email}
            </p>
            <p style="margin: var(--space-xs) 0; font-size: 0.875rem; color: var(--text-primary);">
              Ville : ${data.city}
            </p>
            <p style="margin: var(--space-xs) 0; font-size: 0.875rem; color: var(--text-primary);">
              Offre : ${data.offer}
            </p>
            ${data['visit-date'] ? `
            <p style="margin: var(--space-xs) 0; font-size: 0.875rem; color: var(--text-primary);">
              Date de visite souhaitée : ${new Date(data['visit-date']).toLocaleDateString('fr-FR')}
            </p>
            ` : ''}
          `;
          formSuccess.appendChild(summary);
        }

        // Scroll to success message
        if (formSuccess) {
          formSuccess.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // In production, you would send the data to your server here:
        // fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data)
        // }).then(...)
      } else {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.focus();
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  };

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  const initSmoothScroll = function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        if (href === '#' || href === '#!') return;

        const target = document.querySelector(href);

        if (target) {
          e.preventDefault();

          // Account for fixed header
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Set focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    });
  };

  // ============================================
  // HERO CAROUSEL
  // ============================================
  const initHeroCarousel = function() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.carousel-indicator');
    let currentSlide = 0;
    let autoPlayInterval;

    if (slides.length === 0) return;

    const goToSlide = function(index) {
      // Remove active class from all slides and indicators
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      // Add active class to current slide and indicator
      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      currentSlide = index;
    };

    const nextSlide = function() {
      const next = (currentSlide + 1) % slides.length;
      goToSlide(next);
    };

    const startAutoPlay = function() {
      autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };

    const stopAutoPlay = function() {
      clearInterval(autoPlayInterval);
    };

    // Click handlers for indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', function() {
        stopAutoPlay();
        goToSlide(index);
        startAutoPlay();
      });
    });

    // Start autoplay
    startAutoPlay();
  };

  // ============================================
  // INITIALIZATION
  // ============================================
  const init = function() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        initMobileMenu();
        initFaqAccordion();
        initPricingSelector();
        initContactForm();
        initSmoothScroll();
        initHeroCarousel();
      });
    } else {
      // DOM already loaded
      initMobileMenu();
      initFaqAccordion();
      initPricingSelector();
      initContactForm();
      initSmoothScroll();
      initHeroCarousel();
    }
  };

  // Run initialization
  init();

})();
