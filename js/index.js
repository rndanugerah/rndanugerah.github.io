const selectAll = (e) => document.querySelectorAll(e);

initPageTransitions();

function initPageTransitions() {
  barba.init({sync: true, debug: false, timeout:7000, transitions: [{
      name: 'default',
      once(data) {
        // do something once on the initial page load
        initSmoothScroll(data.next.container);
        initTimeZone();
        initLoader();
      },
    }, 
    {
      name: 'to-home',
      from: {
      },
      to: {
        namespace: ['home']
      },
      once(data) {
        // do something once on the initial page load
        initSmoothScroll(data.next.container);
        initTimeZone();
        initLoaderHome();
      },
    }]
  });

  // Animation - First Page Load
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

  tl.set("html", { 
		cursor: "wait"
	});

  tl.call(function() {
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
		duration: .01,
		opacity: 1,
    stagger: .20,
    ease: "none",
    onStart: homeActive
  },"=-.4");

  function homeActive() {
    gsap.to(".loading-words .home-active", {
      duration: .01,
      opacity: 0,
      stagger: .20,
      ease: "none",
      delay: .20
    });
  }

  tl.to(".loading-words .home-active-last", {
		duration: .01,
		opacity: 1,
    delay: .20
  });
  
	tl.to(".loading-screen", {
		duration: .8,
		top: "-100%",
		ease: "Power4.easeInOut",
    delay: .70
  });

  tl.to(".loading-screen .rounded-div-wrap.bottom", {
		duration: 1.5,
		height: "0vh",
		ease: "Power4.easeInOut"
	},"=-.8");
  
}

// Animation - Page transition Out
function pageTransitionOut() {
	var tl = gsap.timeline();

  if ($(window).width() > 540) { 
    tl.set("main .once-in", {
      y: "50vh",
    });
  } else {
    tl.set("main .once-in", {
      y: "20vh"
    });
  }
  
  tl.call(function() {
    scroll.start();
  });

  tl.to("main .once-in", {
    duration: 1,
    y: "0vh",
    stagger: .05,
    ease: "Expo.easeOut",
    delay: .8,
    clearProps: "true"
  });

}

  function initSmoothScroll(container) {

    scroll = new LocomotiveScroll({
      el: container.querySelector('[data-scroll-container]'),
      smooth: true,
    });

    window.onresize = scroll.update();

    scroll.on("scroll", () => ScrollTrigger.update());

    ScrollTrigger.scrollerProxy('[data-scroll-container]', {
      scrollTop(value) {
        return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
      }, // we don't have to define a scrollLeft because we're only scrolling vertically.
      getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
      },
      // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
      pinType: container.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
    });

    ScrollTrigger.defaults({
      scroller: document.querySelector('[data-scroll-container]'),
    });

    const scrollbar = selectAll('.c-scrollbar');

    if(scrollbar.length > 1) {
      scrollbar[0].remove();
    }

    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener('refresh', () => scroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();
  }  
}

function initNextWord(data) {
  let parser = new DOMParser();
  let dom = parser.parseFromString(data.next.html, 'text/html');
  let nextProjects = dom.querySelector('.loading-words');
  document.querySelector('.loading-words').innerHTML = nextProjects.innerHTML;
}

// scroll section
function setActiveLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('header nav a');

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionId = section.getAttribute('id');

    if (pageYOffset >= sectionTop - sectionHeight / 3) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.onscroll = () => {
  window.addEventListener('scroll', setActiveLink);
  // sticky header
  let header = document.querySelector('header')

  header.classList.toggle('sticky', window.scrollY > 100);
};

// typing animation
var typed = new Typed ('#text-animate', {
    strings: ['Software Developer/Engineer', 'Web Programmer', 'Backend Programmer', 'Machine Learning Enthusiast'],
    backSpeed: 100,
    typeSpeed: 100,
    backDelay: 600,
    loop: true
});

$('.copy_text').click(function (e) {
  e.preventDefault();
  var copyText = $(this).attr('href');

  document.addEventListener('copy', function(e) {
     e.clipboardData.setData('text/plain', copyText);
     e.preventDefault();
  }, true);

  document.execCommand('copy');  
  console.log('copied text : ', copyText);
  alert('copied text: ' + copyText); 
});

//about section
$(function() {
  $('#aboutSection').load('sections/about.html');
});

//skills section
$(function() {
  $('#skillsSection').load('sections/skills.html');
});

//portfolio section
$(function() {
  $('#portfolioSection').load('sections/portfolio.html');
});

//contact section
$(function() {
  $('#contactSection').load('sections/contact.html');
});

function initTimeZone() {

  const timeSpan = document.querySelector("#timeSpan");

  const optionsTime = {
    timeZone: 'Asia/Makassar',
    timeZoneName: 'short',
    hour: '2-digit',
    minute: 'numeric',
    second: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat([], optionsTime);
  updateTime();
  setInterval(updateTime, 1000);

  function updateTime() {
      const dateTime = new Date();
      const formattedDateTime = formatter.format(dateTime);
      timeSpan.textContent = formattedDateTime;
  }

}
