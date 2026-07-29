(function () {
  'use strict';

  /* ==========================================================================
     Demo phone number — the ONE place to edit when the real GHL line is live.
     ========================================================================== */
  var CONFIG = {
    demoPhoneDisplay: '(555) 000-0000',
    demoPhoneTel: '+15550000000'
  };

  document.querySelectorAll('[data-demo-tel]').forEach(function (el) {
    el.setAttribute('href', 'tel:' + CONFIG.demoPhoneTel);
  });
  document.querySelectorAll('[data-demo-phone]').forEach(function (el) {
    el.textContent = CONFIG.demoPhoneDisplay;
  });

  /* ==========================================================================
     Hero SMS thread animation
     ========================================================================== */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var thread = document.getElementById('sms-thread');
  if (!thread) return;

  var bubbles = Array.prototype.slice.call(thread.querySelectorAll('.sms-bubble, .sms-system'));
  var typers = Array.prototype.slice.call(thread.querySelectorAll('.sms-typing'));

  function showFinalState() {
    bubbles.forEach(function (el) { el.classList.add('visible'); });
    typers.forEach(function (el) { el.classList.remove('visible'); });
  }

  if (reduceMotion) {
    showFinalState();
    return;
  }

  // Uneven, human-feeling delays between beats (ms).
  var timeline = [
    { type: 'bubble', step: '0', delay: 500 },
    { type: 'typing', forStep: '1', delay: 900 },
    { type: 'bubble', step: '1', delay: 1300 },
    { type: 'typing', forStep: '2', delay: 1100 },
    { type: 'bubble', step: '2', delay: 2200 },
    { type: 'typing', forStep: '3', delay: 700 },
    { type: 'bubble', step: '3', delay: 1600 },
    { type: 'typing', forStep: '4', delay: 900 },
    { type: 'bubble', step: '4', delay: 800 },
    { type: 'bubble', step: '5', delay: 1300 }
  ];
  var pauseAtEnd = 4000;

  var byStep = {};
  bubbles.forEach(function (el) { byStep[el.getAttribute('data-step')] = el; });
  var typingByStep = {};
  typers.forEach(function (el) { typingByStep[el.getAttribute('data-typing-for')] = el; });

  var timers = [];

  function reset() {
    bubbles.forEach(function (el) { el.classList.remove('visible'); });
    typers.forEach(function (el) { el.classList.remove('visible'); });
  }

  function runOnce() {
    var elapsed = 0;
    timeline.forEach(function (beat) {
      elapsed += beat.delay;
      timers.push(setTimeout(function () {
        if (beat.type === 'typing') {
          var typingEl = typingByStep[beat.forStep];
          if (typingEl) typingEl.classList.add('visible');
        } else {
          var bubbleEl = byStep[beat.step];
          if (bubbleEl) bubbleEl.classList.add('visible');
          var priorTyping = typingByStep[beat.step];
          if (priorTyping) priorTyping.classList.remove('visible');
        }
      }, elapsed));
    });
    timers.push(setTimeout(function () {
      reset();
      runOnce();
    }, elapsed + pauseAtEnd));
  }

  var started = false;
  var phoneEl = document.getElementById('phone-mockup');

  function start() {
    if (started) return;
    started = true;
    runOnce();
  }

  if (phoneEl && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          start();
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });
    observer.observe(phoneEl);
  } else {
    start();
  }
})();
