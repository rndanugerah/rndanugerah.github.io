gsap.registerPlugin(ScrollTrigger);

let scroll;
let marqueeTickers = [];

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

let twinkleTimeline;

initPageTransitions();


/**
 * Main Loader Sequence for Home Page
 */
function initLoaderHome() {

  var tl = gsap.timeline();

  tl.set(".loading-screen", {
    top: "0",
  });

  if ($(window).width() > 540) {
    tl.set("main .once-in", {
      y: "50vh"
    });
  } else {
    tl.set("main .once-in", {
      y: "10vh"
    });
  }

  tl.set(".loading-words", {
    opacity: 0,
    y: -50
  });

  tl.set(".loading-words .active", {
    display: "none",
  });

  tl.set(".loading-words .home-active, .loading-words .home-active-last", {
    display: "block",
    opacity: 0
  });

  tl.set(".loading-words .home-active-first", {
    opacity: 1,
    duration: .8
  });

  if ($(window).width() > 540) {
    tl.set(".loading-screen .rounded-div-wrap.bottom", {
      height: "10vh",
    });
  } else {
    tl.set(".loading-screen .rounded-div-wrap.bottom", {
      height: "5vh",
    });
  }


  tl.call(function () {
    scroll.stop();
  });

  tl.to(".loading-words", {
    duration: .8,
    opacity: 1,
    y: -50,
    ease: "Power4.easeOut",
    delay: .5
  });

  tl.to(".loading-words .home-active", {
    duration: .02,
    opacity: 1,
    stagger: .15,
    ease: "none",
    onStart: homeActive
  }, "+=1.2");

  function homeActive() {
    gsap.to(".loading-words .home-active", {
      duration: .02,
      opacity: 0,
      stagger: .15,
      ease: "none",
      delay: .15
    });
  }

  tl.to(".loading-words .home-active-last", {
    duration: .02,
    opacity: 1,
    delay: .15
  });

  tl.to(".loading-screen", {
    duration: .8,
    top: "-100%",
    ease: "Power4.easeInOut",
    delay: .2
  });

  tl.to(".loading-screen .rounded-div-wrap.bottom", {
    duration: 1,
    height: "0vh",
    ease: "Power4.easeInOut"
  }, "=-.8");

  tl.to(".loading-words", {
    duration: .3,
    opacity: 0,
    ease: "linear"
  }, "=-.8");

  tl.set(".loading-screen", {
    top: "calc(-100%)"
  });

  tl.set(".loading-screen .rounded-div-wrap.bottom", {
    height: "0vh"
  });

  tl.to("main .once-in", {
    duration: 1.5,
    y: "0vh",
    stagger: .07,
    ease: "Expo.easeOut",
    clearProps: true
  }, "=-.8");

  tl.call(function () {
    $("body").css("overflow", "hidden");

    // Initial setup for Page 2 elements (hidden and offset)
    gsap.set("main .collection-header .collection-once-in", {
      y: "30vh",
      autoAlpha: 0
    });

    gsap.set("main .collection-header", {
      autoAlpha: 0
    });

    gsap.to(".load-icon", {
      duration: 0.5,
      scale: 1,
      ease: "Power2.easeInOut"
    }, "< 0.5");
  }, null, 0);

  tl.call(function () {
    initPowerGlitchLoading();
    startTwinkleStars();
  }, null, 1);

  tl.call(function () {
    startTextScrambleLoopH1();
    startTextScrambleLoopJobTitle();
    initPowerGlitchJobTitle();

    // Start photo glitch EXACTLY when text scramble begins
    triggerDoubleGlitchAndTransition();
  }, null, 8.1);

}

/**
 * Final Transition Cycle: Double Glitch -> Image Swap to f2f -> TV Shutdown -> Page reveal
 */
function triggerDoubleGlitchAndTransition() {
  const parent = document.querySelector('.personal-image');
  const mainImg = parent ? parent.querySelector('img:not(.glitch-layer)') : null;
  const tvOverlay = document.querySelector('.flash-close');

  const tl = gsap.timeline();

  // 1st Glitch Burst (PNG only) - Lengthened to 2.5s
  tl.call(() => playPngGlitchSequence(2500));
  tl.to({}, { duration: 2.5 });

  // 2nd Glitch Burst (PNG only) - Lengthened to 2.5s
  tl.to({}, { duration: 0.8 }); // Short pause
  tl.call(() => {
    playPngGlitchSequence(2500);
  });
  tl.to({}, { duration: 2.5 });

  // NEW: Full Screen B&W Glitch Burst before Shutdown
  tl.call(() => playFullScreenGlitch(800));
  tl.to({}, { duration: 0.8 });

  // Technical Pause before Shutdown
  tl.to({}, { duration: 0.2 });

  // TV Shutdown (Blackout) Effect
  tl.set(tvOverlay, { display: 'block', backgroundColor: 'white', opacity: 1, scaleY: 1, scaleX: 1 });

  // IMMEDIATELY hide the page behind as the shutdown strikes
  tl.set([".home-header", ".header"], { opacity: 0 });

  tl.to(tvOverlay, { scaleY: 0.005, duration: 0.3, ease: "power4.inOut" });
  tl.to(tvOverlay, { scaleX: 0, duration: 0.2, ease: "power4.in" });

  // Global Blackout before Reveal
  tl.set(tvOverlay, { scaleX: 1, scaleY: 1, backgroundColor: 'black' });

  // Reveal Page 2 (Collection Header)
  tl.call(() => {
    // Ensure display is set to none
    document.querySelector(".home-header").style.display = "none";
    document.querySelector(".header").style.display = "none";
    $("body").removeAttr('style');
    scroll.start();

    // Reveal from center
    gsap.to(tvOverlay, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => tvOverlay.style.display = 'none'
    });

    // Reveal Page 2 Container
    gsap.set("main .collection-header", { autoAlpha: 1 });

    // Reveal elements of the next section with the 'stars' slide style
    gsap.to("main .collection-header .collection-once-in", {
      duration: 2.5,
      y: "0vh",
      autoAlpha: 1,
      stagger: 0.15,
      ease: "Expo.easeInOut"
    });

    // Show footer only on page 2 with matching style
    var footerEl = document.querySelector(".footer-contact");
    if (footerEl) {
      footerEl.style.display = "";
      gsap.fromTo(footerEl,
        { autoAlpha: 0, y: "20vh" },
        { duration: 2.5, autoAlpha: 1, y: 0, ease: "Expo.easeInOut", delay: 0.2 }
      );

      // Reveal the specific socials inside the footer
      gsap.fromTo(footerEl.querySelectorAll(".socials, .credits, .time"),
        { autoAlpha: 0, y: 30 },
        { duration: 1.5, autoAlpha: 1, y: 0, stagger: 0.1, ease: "Power2.out", delay: 0.8 }
      );
    }

    // Refresh scroll after layout changes
    if (scroll) {
      scroll.update();
    }
  });
}


function startTwinkleStars() {
  // Kill existing timeline if it exists to prevent "bareng" (overlapping) bug
  if (twinkleTimeline) {
    twinkleTimeline.kill();
  }

  twinkleTimeline = gsap.timeline({ repeat: -1, repeatDelay: 4 });

  // Star 1: Snappy in, short pause, snappy out
  twinkleTimeline.to(".star-1 svg", { duration: 0.6, scale: 1, rotate: 0, ease: "Expo.easeInOut" });
  twinkleTimeline.to(".star-1 svg", { duration: 0.6, scale: 0, rotate: 45, ease: "Expo.easeInOut", delay: 0.5 });

  // Star 2: Starts IMMEDIATELY after Star 1 finishes its fade out
  twinkleTimeline.to(".star-2 svg", { duration: 0.6, scale: 1, rotate: 0, ease: "Expo.easeInOut" });
  twinkleTimeline.to(".star-2 svg", { duration: 0.6, scale: 0, rotate: 45, ease: "Expo.easeInOut", delay: 0.5 });
}

function startTextScrambleLoopH1() {
  var tl = gsap.timeline({ repeat: -1 });
  if (document.querySelector("#h1-scramble")) {
    tl.to("#h1-scramble", { duration: 2.0, scrambleText: { text: "A%!ug$rah !. R^ndy", speed: 0.3, chars: "$#%^!=_)+;{." } }, "<");
    tl.to("#h1-scramble", { duration: 2.0, scrambleText: { text: "M. @n#g3r$h R4n%y", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 4");
  }
}

function startTextScrambleLoopJobTitle() {
  var tl = gsap.timeline({ repeat: -1 });
  if (document.querySelector("#jobtitle-scramble")) {
    tl.to("#jobtitle-scramble", { duration: 2.5, scrambleText: { text: "Data Analyst", speed: 0.3, chars: "$#%^!=_)+;{." } }, "<");
    tl.to("#jobtitle-scramble", { duration: 2.5, scrambleText: { text: "Software Engineer", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 4");
    tl.to("#jobtitle-scramble", { duration: 2.5, scrambleText: { text: "Data Scientist", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
  }

  var tlPcName = gsap.timeline({ repeat: -1 });
  if (document.querySelector("#pc-name-scramble")) {
    tlPcName.to("#pc-name-scramble", { duration: 2.5, scrambleText: { text: "I'm M. Randy Anugerah", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 4");
    tlPcName.to("#pc-name-scramble", { duration: 2.5, scrambleText: { text: "I'm M. Randy Anugerah", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
    tlPcName.to("#pc-name-scramble", { duration: 2.5, scrambleText: { text: "I'm M. Randy Anugerah", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
    tlPcName.to("#pc-name-scramble", { duration: 2.5, scrambleText: { text: "I'm M. Randy Anugerah", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
    tlPcName.to("#pc-name-scramble", { duration: 2.5, scrambleText: { text: "Who Am I ?", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
  }

  var tlPc = gsap.timeline({ repeat: -1 });
  if (document.querySelector("#pc-jobtitle-scramble")) {
    tlPc.to("#pc-jobtitle-scramble", { duration: 2.5, scrambleText: { text: "as Software Engineer", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 4");
    tlPc.to("#pc-jobtitle-scramble", { duration: 2.5, scrambleText: { text: "as Data Analyst", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
    tlPc.to("#pc-jobtitle-scramble", { duration: 2.5, scrambleText: { text: "as Data Scientist", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
    tlPc.to("#pc-jobtitle-scramble", { duration: 2.5, scrambleText: { text: "as Web Developer", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
    tlPc.to("#pc-jobtitle-scramble", { duration: 2.5, scrambleText: { text: "", speed: 0.3, chars: "$#%^!=_)+;{." } }, "< 3.5");
  }
}

function playPngGlitchSequence(duration) {
  const parent = document.querySelector('.personal-image');
  if (!parent) return;
  const layers = [
    parent.querySelector('.glitch-last'),
    parent.querySelector('.glitch-1'),
    parent.querySelector('.glitch-2'),
    parent.querySelector('.glitch-3'),
    parent.querySelector('.glitch-4'),
    parent.querySelector('.glitch-5'),
    parent.querySelector('.glitch-last')
  ].filter(el => el !== null);

  let startTime = Date.now();
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      clearInterval(interval);
      layers.forEach(l => l.style.opacity = 0);
      return;
    }
    layers.forEach(l => l.style.opacity = 0);
    const randomLayer = layers[Math.floor(Math.random() * layers.length)];
    if (randomLayer) randomLayer.style.opacity = 1;
  }, 60);
}

function playFullScreenGlitch(duration) {
  const overlay = document.querySelector('.flash-close');
  if (!overlay) return;

  overlay.style.display = 'block';
  overlay.style.opacity = 1;

  let startTime = Date.now();
  const colors = ['#000000', '#ffffff', 'transparent'];

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed >= duration) {
      clearInterval(interval);
      overlay.style.backgroundColor = 'transparent';
      overlay.style.display = 'none';
      return;
    }
    overlay.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  }, 50);
}

function initLoader() {
  barba.go('./');
}

function initPageTransitions() {
  barba.hooks.before(() => select('html').classList.add('is-transitioning'));
  barba.hooks.after(() => {
    select('html').classList.remove('is-transitioning');
    scroll.init();
    scroll.stop();
  });
  barba.hooks.enter(() => scroll.destroy());
  barba.hooks.afterEnter(() => {
    window.scrollTo(0, 0);
    initCookieViews();
  });

  barba.init({
    sync: true,
    debug: false,
    timeout: 7000,
    transitions: [{
      name: 'default',
      once(data) {
        initSmoothScroll(data.next.container);
        initScript();
        initCookieViews();
        initLoader();
      },
      async leave(data) {
        initPageTransitionsIn();
        await delay(995);
        data.current.container.remove();
      },
      async enter(data) {
        initPageTransitionsOut();
        initNextWord(data);
      },
      async beforeEnter(data) {
        ScrollTrigger.getAll().forEach(t => t.kill());
        scroll.destroy();
        initSmoothScroll(data.next.container);
        initScript();
      },
    },
    {
      name: 'to-home',
      to: { namespace: ['home'] },
      once(data) {
        initSmoothScroll(data.next.container);
        initScript();
        initCookieViews();
        initLoaderHome();
      },
    }]
  });

  function initSmoothScroll(container) {
    scroll = new LocomotiveScroll({
      el: container.querySelector('[data-scroll-container]'),
      smooth: true,
    });
    window.onresize = scroll.update();
    function updateStickyNav() {
      const stickyNav = document.querySelector('.sticky-nav');
      const homeSection = document.querySelector('section#home');
      const overviewSection = document.querySelector('#overview');
      const summarySection = document.querySelector('#summary');
      
      const homeLink = document.querySelector('.nav-link-home');
      const overviewLink = document.querySelector('.nav-link-overview');
      const summaryLink = document.querySelector('.nav-link-summary');

      if (stickyNav && homeSection) {
        const homeRect = homeSection.getBoundingClientRect();
        
        // Show sticky nav when the hero section is mostly out of view
        if (homeRect.bottom < 150) {
          stickyNav.classList.add('is-visible');
        } else {
          stickyNav.classList.remove('is-visible');
        }

        // Active indicator logic
        if (overviewSection && summarySection) {
          const overviewRect = overviewSection.getBoundingClientRect();
          const summaryRect = summarySection.getBoundingClientRect();
          
          if (summaryRect.top <= (window.innerHeight / 2)) {
            summaryLink?.classList.add('nav-link-active');
            overviewLink?.classList.remove('nav-link-active');
            homeLink?.classList.remove('nav-link-active');
          } else if (overviewRect.top <= (window.innerHeight / 2)) {
            overviewLink?.classList.add('nav-link-active');
            summaryLink?.classList.remove('nav-link-active');
            homeLink?.classList.remove('nav-link-active');
          } else {
            homeLink?.classList.add('nav-link-active');
            overviewLink?.classList.remove('nav-link-active');
            summaryLink?.classList.remove('nav-link-active');
          }
        }
      }
    }

    scroll.on("scroll", (args) => {
      ScrollTrigger.update();
      updateStickyNav();
    });

    ScrollTrigger.addEventListener('refresh', () => {
      scroll.update();
      updateStickyNav();
    });

    // Initialize state immediately and after a few frames for safety
    updateStickyNav();
    setTimeout(() => updateStickyNav(), 100);
    setTimeout(() => updateStickyNav(), 500);
    setTimeout(() => updateStickyNav(), 1000);
    requestAnimationFrame(updateStickyNav);

    // Add manual click listeners for navigation links for guaranteed functionality
    document.querySelectorAll('.sticky-nav .btn-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        if (target) {
          // If it's #home, scroll to 0/top
          if (target === '#home') {
             scroll.scrollTo(0);
          } else {
             scroll.scrollTo(target);
          }
        }
      });
    });
    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: container.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
    });
    ScrollTrigger.defaults({ scroller: document.querySelector('[data-scroll-container]') });
    ScrollTrigger.addEventListener('refresh', () => scroll.update());
    ScrollTrigger.refresh();
  }
}

function initPageTransitionsIn() {
  scroll.stop();
  gsap.to(".loading-screen", { duration: 0.5, top: "0%", ease: "Power4.easeInOut" });
}

function initPageTransitionsOut() {
  gsap.to(".loading-screen", { duration: 0.5, top: "-100%", ease: "Power4.easeInOut", onComplete: () => scroll.start() });
}

function initNextWord(data) {
  let parser = new DOMParser();
  let dom = parser.parseFromString(data.next.html, 'text/html');
  let nextWords = dom.querySelector('.loading-words');
  if (nextWords && document.querySelector('.loading-words')) {
    document.querySelector('.loading-words').innerHTML = nextWords.innerHTML;
  }
}

function delay(n) {
  n = n || 2000;
  return new Promise((done) => setTimeout(() => done(), n));
}

function initScript() {
  select('body').classList.remove('is-loading');
  initWindowInnerheight();
  initCheckTouchDevice();
  initHamburgerNav();
  initMagneticButtons();
  initStickyCursorWithDelay();
  initVisualFilter();
  initScrolltriggerNav();
  initScrollLetters();
  initScrollVelocityEffect();
  startTwinkleStars();
  initTricksWords();
  initLazyLoad();
  initPlayVideoInview();
  initFlickitySlider();
  initTimeZone();
  initTrueFocus();
}


function initWindowInnerheight() {
  $(document).ready(function () {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    $('.btn-hamburger').click(function () {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  });
}

function initCheckTouchDevice() {
  function isTouchScreendevice() { return 'ontouchstart' in window || navigator.maxTouchPoints; };
  if (isTouchScreendevice()) {
    $('main').addClass('touch').removeClass('no-touch');
  } else {
    $('main').removeClass('touch').addClass('no-touch');
  }
}

function initHamburgerNav() {
  $(document).ready(function () {
    $(".btn-hamburger, .btn-menu").click(function () {
      if ($(".btn-hamburger, .btn-menu").hasClass('active')) {
        $(".btn-hamburger, .btn-menu").removeClass('active');
        $("main").removeClass('nav-active');
        scroll.start();
      } else {
        $(".btn-hamburger, .btn-menu").addClass('active');
        $("main").addClass('nav-active');
        scroll.stop();
      }
    });
    $('.fixed-nav-back').click(function () {
      $(".btn-hamburger, .btn-menu").removeClass('active');
      $("main").removeClass('nav-active');
      scroll.start();
    });
  });
}

function initMagneticButtons() {
  var magnets = document.querySelectorAll('.magnetic');
  if (window.innerWidth > 540) {
    magnets.forEach((magnet) => {
      magnet.addEventListener('mousemove', moveMagnet);
      magnet.addEventListener('mouseleave', function (event) {
        gsap.to(event.currentTarget, 1.5, { x: 0, y: 0, ease: Elastic.easeOut });
        gsap.to($(this).find(".btn-text"), 1.5, { x: 0, y: 0, ease: Elastic.easeOut });
      });
    });
    function moveMagnet(event) {
      var magnetButton = event.currentTarget;
      var bounding = magnetButton.getBoundingClientRect();
      var magnetsStrength = magnetButton.getAttribute("data-strength");
      var magnetsStrengthText = magnetButton.getAttribute("data-strength-text");
      gsap.to(magnetButton, 1.5, {
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrength,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrength,
        rotate: "0.001deg",
        ease: Power4.easeOut
      });
      gsap.to($(this).find(".btn-text"), 1.5, {
        x: (((event.clientX - bounding.left) / magnetButton.offsetWidth) - 0.5) * magnetsStrengthText,
        y: (((event.clientY - bounding.top) / magnetButton.offsetHeight) - 0.5) * magnetsStrengthText,
        rotate: "0.001deg",
        ease: Power4.easeOut
      });
    }
  }
}

function initStickyCursorWithDelay() {
  var cursorImage = $(".mouse-pos-list-image");
  var cursorBtn = $(".mouse-pos-list-btn");
  var cursorSpan = $(".mouse-pos-list-span");
  var mouseX = 0, mouseY = 0;
  var posXImage = 0, posYImage = 0;

  $(document).on("mousemove", function (e) { mouseX = e.clientX; mouseY = e.clientY; });

  if (document.querySelector(".mouse-pos-list-image")) {
    gsap.to({}, 0.008333, {
      repeat: -1,
      onRepeat: function () {
        posXImage += (mouseX - posXImage) / 12; posYImage += (mouseY - posYImage) / 12;
        gsap.set(cursorImage, { css: { left: posXImage, top: posYImage } });
      }
    });
  }
}

function initVisualFilter() {
  $('.toggle-row .btn').click(function () {
    if (!$(this).hasClass('active')) {
      $('.work-tiles li').addClass('tile-fade-out');
      setTimeout(() => {
        $('.work-tiles li').removeClass('tile-fade-out').addClass('tile-fade-in');
        scroll.scrollTo('top');
      }, 300);
    }
  });
}

function initCookieViews() {
  if (Cookies.get("view") == "columns") {
    $('.grid-columns-part').addClass('visible');
    $('.grid-rows-part').removeClass('visible');
  }
}

function initScrolltriggerNav() {
  ScrollTrigger.create({
    start: 'top -30%',
    onUpdate: self => $("main").addClass('scrolled'),
    onLeaveBack: () => $("main").removeClass('scrolled'),
  });
}

/**
 * Seamless Loop Helper (Inspired by Copy Dennis)
 */
function roll(targets, vars, reverse) {
  vars = vars || {};
  vars.ease || (vars.ease = "none");
  const tl = gsap.timeline({
    repeat: -1,
    onReverseComplete() {
      this.totalTime(this.rawTime() + this.duration() * 10);
    }
  }),
    elements = gsap.utils.toArray(targets),
    clones = elements.map(el => {
      let clone = el.cloneNode(true);
      el.parentNode.appendChild(clone);
      return clone;
    }),
    positionClones = () => elements.forEach((el, i) => gsap.set(clones[i], {
      position: "absolute",
      overwrite: false,
      top: el.offsetTop,
      left: el.offsetLeft + (reverse ? -el.offsetWidth : el.offsetWidth)
    }));

  positionClones();
  elements.forEach((el, i) => tl.to([el, clones[i]], { xPercent: reverse ? 100 : -100, ...vars }, 0));

  window.addEventListener("resize", () => {
    let time = tl.totalTime();
    tl.totalTime(0);
    positionClones();
    tl.totalTime(time);
  });

  return tl;
}

function initScrollLetters() {
}

function initScrollVelocityEffect() {
  if (window.marqueeTicker) {
    gsap.ticker.remove(window.marqueeTicker);
  }

  let lastY = 0;
  let lastTime = performance.now();
  let velocity = 0;
  let lastScrollTime = 0;
  let isScrollActive = false;

  if (scroll) {
    scroll.on('scroll', (obj) => {
      const now = performance.now();
      const delta = now - lastTime || 1;
      const y = obj.scroll.y;
      velocity = (y - lastY) / delta;
      lastY = y;
      lastTime = now;
      lastScrollTime = now;
      isScrollActive = true;

      clearTimeout(window.velocityResetTimer);
      window.velocityResetTimer = setTimeout(() => {
        velocity = 0;
        isScrollActive = false;
      }, 100);
    });
  }

  // Name marquee: Initial 'reverse: true' means it moves Rightwards (Left-to-Right)
  const nameMarquee = roll(".marquee-left .name-wrap", { duration: 30 }, true);
  // Bar marquee: Initial 'reverse: false' means it moves Leftwards (Right-to-Left)
  const barMarquee = roll(".marquee-right .name-wrap", { duration: 30 }, false);

  let activeDirection = 1;
  let currentScale = 1;

  window.marqueeTicker = () => {
    const now = performance.now();
    const timeSinceScroll = now - lastScrollTime;

    // Persistently update direction based on scroll
    if (velocity > 0.1) activeDirection = 1;
    else if (velocity < -0.1) activeDirection = -1;

    let targetScale = 0;

    if (isScrollActive) {
      // Speed up based on scroll velocity (with direction)
      targetScale = activeDirection * (1 + Math.abs(velocity) * 2.5);
    } else {
      if (timeSinceScroll < 500) {
        targetScale = 0; // The 0.5s pause
      } else {
        targetScale = activeDirection; // Resume at base auto-speed
      }
    }

    // Smoothlerp to avoid 'bouncing'
    currentScale += (targetScale - currentScale) * 0.05;

    // Apply timeScale to both marquees
    nameMarquee.timeScale(currentScale);
    barMarquee.timeScale(currentScale);
  };

  gsap.ticker.add(window.marqueeTicker);
}

function initTricksWords() {
  var spanWord = document.getElementsByClassName("span-lines");
  for (var i = 0; i < spanWord.length; i++) {
    var wordWrap = spanWord.item(i);
    wordWrap.innerHTML = wordWrap.innerHTML.replace(/(^|<\/?[^>]+>|\s+)([^\s<]+)/g, '$1<span class="span-line"><span class="span-line-inner">$2</span></span>');
  }
}

function initLazyLoad() {
  new LazyLoad({ elements_selector: ".lazy" });
}

function initPlayVideoInview() {
  gsap.utils.toArray('.playpauze').forEach((videoDiv) => {
    let videoElem = videoDiv.querySelector('video');
    ScrollTrigger.create({
      trigger: videoElem,
      onEnter: () => videoElem.play(),
      onLeave: () => videoElem.pause(),
    });
  });
}

function initPowerGlitchLoading() {
  PowerGlitch.glitch('.glitch-loading', { "shake": { "velocity": 15 }, "slice": { "count": 8 } });
}

function initPowerGlitchJobTitle() {
  PowerGlitch.glitch('.glitch-job-title', { "shake": { "velocity": 15 }, "slice": { "count": 8 } });
}

function initFlickitySlider() {
  $('.single-collection-item').each(function () {
    $(this).find('.flickity-carousel').flickity({ wrapAround: true });
  });
}

function initTimeZone() {
  const timeSpan = document.querySelector("#timeSpan");
  const optionsTime = { timeZone: 'Asia/Makassar', hour: '2-digit', minute: 'numeric', second: 'numeric' };
  const formatter = new Intl.DateTimeFormat([], optionsTime);
  setInterval(() => { if (timeSpan) timeSpan.textContent = formatter.format(new Date()); }, 1000);
}

/**
 * True Focus Effect (Vanilla JS alternative to React Bits)
 */
function initTrueFocus() {
  const container = document.querySelector('#true-focus');
  if (!container) return;

  const sentence = container.getAttribute('data-sentence') || "True Focus";
  const words = sentence.split(",");

  container.innerHTML = '';

  const spanWords = [];

  words.forEach((word) => {
    const span = document.createElement('span');
    span.className = 'focus-word manual';
    span.innerText = word.trim();
    container.appendChild(span);
    spanWords.push(span);
  });

  const focusFrame = document.createElement('div');
  focusFrame.className = 'focus-frame';
  focusFrame.innerHTML = `
    <span class="corner top-left"></span>
    <span class="corner top-right"></span>
    <span class="corner bottom-left"></span>
    <span class="corner bottom-right"></span>
  `;
  container.appendChild(focusFrame);

  let currentIndex = -1;
  let lastActiveIndex = 0;

  const updateFocus = (index) => {
    if (index === -1) {
      focusFrame.style.opacity = 0;
      spanWords.forEach(span => span.classList.remove('active'));
      return;
    }

    focusFrame.style.opacity = 1;
    spanWords.forEach((span, i) => {
      if (i === index) span.classList.add('active');
      else span.classList.remove('active');
    });

    // Set position
    const parentRect = container.getBoundingClientRect();
    const activeRect = spanWords[index].getBoundingClientRect();

    const x = activeRect.left - parentRect.left;
    const y = activeRect.top - parentRect.top;

    focusFrame.style.transform = `translate(${x}px, ${y}px)`;
    focusFrame.style.width = `${activeRect.width}px`;
    focusFrame.style.height = `${activeRect.height}px`;
  };

  spanWords.forEach((span, index) => {
    span.addEventListener('mouseenter', () => {
      currentIndex = index;
      lastActiveIndex = index;
      updateFocus(currentIndex);
    });
  });

  let autoPlayInterval;

  const startAutoPlay = () => {
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % spanWords.length;
      lastActiveIndex = currentIndex;
      updateFocus(currentIndex);
    }, 2000);
  };

  container.addEventListener('mouseenter', () => {
    clearInterval(autoPlayInterval);
  });

  container.addEventListener('mouseleave', () => {
    // Revert to last active to keep it there
    currentIndex = lastActiveIndex;
    updateFocus(currentIndex);
    startAutoPlay();
  });

  // Initialize slightly delayed to allow layout to settle
  currentIndex = 0;
  setTimeout(() => {
    updateFocus(0);
    startAutoPlay();
  }, 100);

  // Handle window resizing
  window.addEventListener('resize', () => {
    setTimeout(() => updateFocus(currentIndex), 100);
  });
}