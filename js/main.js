/* =========================================================
   PORTFOLIO — Main JavaScript
   Ejeh Kaodilichi Emmanuel (Odili)
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Typing Effect (Hero) ---------- */
  const typingEl = document.getElementById('typing');
  const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Fintech & EdTech Builder',
    'Data Science Enthusiast',
    'Backend Engineer',
    'AI-Powered Product Builder'
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function type() {
    const current = roles[roleIndex];
    if (deleting) {
      charIndex--;
    } else {
      charIndex++;
    }
    typingEl.textContent = current.substring(0, charIndex);

    let delay = deleting ? 50 : 90;
    if (!deleting && charIndex === current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();

  /* ---------- Header Scrolled State & Back-to-Top ---------- */
  const header = document.querySelector('.site-header');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
      backToTop.classList.add('show');
    } else {
      header.classList.remove('scrolled');
      backToTop.classList.remove('show');
    }

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = 'hero';
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close mobile menu on link click
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Scroll Reveal Animation ---------- */
  const revealEls = document.querySelectorAll(
    '.about-grid, .projects-grid, .services-grid, .blog-grid, .testimonials-grid, .contact-grid, .section-head'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Project Card Animation ---------- */
  const cards = document.querySelectorAll('.project-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach((card, index) => {
    card.style.animationDelay = (index * 0.06) + 's';
    cardObserver.observe(card);
  });

  /* ---------- Project Filtering ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectsGrid = document.getElementById('projectsGrid');

  function filterProjects(filter) {
    const allCards = projectsGrid.querySelectorAll('.project-card');
    let matched = 0;

    allCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      const show = filter === 'all' || categories.includes(filter);

      if (show) {
        matched++;
        card.classList.remove('animate-out');
        card.style.display = 'flex';
        card.classList.add('visible');
      } else {
        card.classList.add('animate-out');
        setTimeout(() => { card.style.display = 'none'; }, 300);
      }
    });

    // Remove any existing "no-results" message
    const existingMsg = projectsGrid.querySelector('.no-results');
    if (existingMsg) existingMsg.remove();

    if (matched === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'No projects found in this category yet.';
      projectsGrid.appendChild(noResults);
    }
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      filterProjects(btn.dataset.filter);
    });
  });

  /* ---------- Blog Modals ---------- */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  const blogContent = {
    blog1: {
      title: 'Building LearnQuest AI: Gamification, AI Content, and Scale',
      body: `LearnQuest AI is an AI-powered learning platform designed for Nigerian secondary school students. The core idea is to make learning engaging and personalized at scale.

Architecture: A Go/Gin backend exposes a REST API consumed by a React + TypeScript frontend. Firebase handles authentication and storage, while PostgreSQL stores curriculum, quiz, and user progress data.

The standout features are:
- AI Content Generation: Google Gemini generates lesson content, quiz questions, and tailored explanations for individual students.
- Gamification Engine: XP points, badges, and daily streaks keep students motivated and engaged.
- Curated Learning Paths: Structured curricula guide students through subjects in a logical progression.
- Progress Tracking: Users can see their learning journey and identify areas for improvement.

Key lessons: designing for scale from day one, choosing the right tools for AI integration, and building a product that students actually enjoy using.`
    },
    blog2: {
      title: 'Event-Driven Architecture with Apache Kafka in Fintech',
      body: `FeeBridge, a school fee management system, taught me how powerful (and how challenging) event-driven architecture can be in fintech.

Why Kafka? Payment processing involves many coordinated steps — authorize, capture, notify, reconcile. A synchronous request/response model becomes a bottleneck and a single point of failure. Kafka lets us decouple producers from consumers: when a payment event is emitted, multiple services can react independently.

What I learned:
- Idempotency matters: payment events can be delivered more than once, so consumers must handle duplicates gracefully.
- Ordering and partitioning: Kafka partitions guarantee ordering within a partition, which is critical for financial sequences.
- Spring Kafka integration: consumer groups, retries, and dead-letter topics for failed handling.
- Event schemas: versioning events to avoid breaking consumers over time.

The result was a resilient, scalable payment pipeline that could handle high throughput without blocking the user interface.`
    },
    blog3: {
      title: 'Real-Time Fintech Transaction Monitoring with FastAPI & WebSockets',
      body: `I built a real-time transaction monitoring dashboard using FastAPI and WebSockets to track Paystack/Flutterwave sandbox webhooks as they happen.

The Problem: Traditional polling means seconds of latency and excess server load. For transaction monitoring, users want to see payments appear the instant they occur.

The Solution: WebSockets provide a persistent, bidirectional connection between the frontend dashboard and the backend. When a payment webhook arrives at the API, the backend pushes the transaction data to all connected clients in real time.

Implementation highlights:
- FastAPI's async WebSocket support for handling multiple concurrent connections.
- A pub/sub pattern so any authenticated client receives transaction events.
- Frontend reconnection logic with exponential backoff for reliability.
- Defense against malformed webhook payloads.

This pattern generalizes to any live-updating financial interface — monitoring dashboards, order trackers, and real-time analytics.`
    },
    blog4: {
      title: 'Voice-First Banking for Native Nigerian Languages',
      body: `Most banking apps are built for English-first, text-driven interaction. But millions of Nigerians are more comfortable speaking their native languages — Yoruba, Igbo, Hausa, and Pidgin. VoicePay (ALAT Voice) explores a voice-first banking experience that understands you.

The Stack:
- Frontend: Flutter mobile app with speech-to-text and text-to-speech.
- Backend: FastAPI with an NLU engine parsing intents from voice input.
- Native Language Support: Intent keywords are defined per language (e.g., balance requests in Yoruba: "wo owo mi"), so the app understands commands in the user's preferred language.

How It Works: A user speaks a command like "check my balance" (or its Yoruba/Igbo/Hausa/Pidgin equivalent). The speech is converted to text, the NLU engine parses the intent (balance, transfer, etc.), executes the action, and responds using text-to-speech in the same language.

Why It Matters: Financial inclusion means meeting users where they are. Voice and native-language support can bring banking to millions who find text-based, English-only interfaces inaccessible. This project is a step toward that future.`
    }
  };

  document.querySelectorAll('.read-more').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const key = link.dataset.modal;
      const content = blogContent[key];
      if (content) {
        modalTitle.textContent = content.title;
        modalBody.textContent = content.body;
        modalOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  function setInvalid(input, isInvalid) {
    const group = input.closest('.form-group');
    input.classList.toggle('invalid', isInvalid);
    group.classList.toggle('error', isInvalid);
    return isInvalid;
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    let valid = true;
    valid = !setInvalid(name, !name.value.trim()) && valid;
    valid = !setInvalid(email, !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) && valid;
    valid = !setInvalid(message, !message.value.trim()) && valid;

    if (valid) {
      const FORMSPREE_URL = 'https://formspree.io/f/xwlkopaq';

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      
      fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name.value.trim(),
          email: email.value.trim(),
          subject: document.getElementById('subject').value.trim(),
          message: message.value.trim()
        })
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Network response was not ok');
        })
        .then(() => {
          formSuccess.textContent = '✓ Message sent! I\'ll get back to you soon.';
          formSuccess.hidden = false;
          contactForm.reset();
        })
        .catch(() => {
          formSuccess.textContent = '⚠ Something went wrong. Please email me directly at kaodilichiejeh02@gmail.com.';
          formSuccess.style.color = '#fbbf24';
          formSuccess.hidden = false;
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
          setTimeout(() => {
            formSuccess.hidden = true;
            formSuccess.style.color = '';
            formSuccess.textContent = '✓ Message sent! I\'ll get back to you soon.';
          }, 6000);
        });
    }
  });

  contactForm.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) {
        setInvalid(field, false);
      }
    });
  });

});
