const selectAll = (e) => document.querySelectorAll(e);

initPageTransitions();

function initPageTransitions() {
    barba.init({
        sync: true, debug: false, timeout: 7000, transitions: [{
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

        // TOTAL LOCKDOWN of Interaction and Scroll (User Requested)
        tl.call(function () {
            document.documentElement.classList.add("no-interact");
            document.body.classList.add("no-interact");
            if (typeof scroll !== 'undefined') scroll.stop();
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
            stagger: .40, // Slower (was .20)
            ease: "none",
            onStart: homeActive
        }, "=-.4");

        function homeActive() {
            gsap.to(".loading-words .home-active", {
                duration: .01,
                opacity: 0,
                stagger: .40, // Slower (was .20)
                ease: "none",
                delay: .40
            });
        }

        tl.to(".loading-words .home-active-last", {
            duration: .01,
            opacity: 1,
            delay: .40
        });

        tl.to(".loading-screen", {
            duration: 1.2, // Slower (was .8)
            top: "-100%",
            ease: "Power4.easeInOut",
            delay: 1.0 // Longer pause on last word
        });

        tl.to(".loading-screen .rounded-div-wrap.bottom", {
            duration: 1.5,
            height: "0vh",
            ease: "Power4.easeInOut"
        }, "=-.8");

        tl.call(function () {
            // Start the decrypted text on the main title with 1s delay
            const title = document.querySelector('.home-content h1');
            const subTitle = document.querySelector('.home-content h2');
            const description = document.querySelector('.home-content p');

            if (title) {
                scrambleText(title, title.innerText, 1.0, 1.0, 3, 40); // Fast reveal
            }
            if (subTitle) {
                scrambleText(subTitle, subTitle.innerText, 1.0, 1.2, 2, 40); // Even faster
            }
            if (description) {
                scrambleText(description, description.innerText, 1.0, 1.5, 1, 30); // Instant flicker
            }

            // Trigger Glitch System after 5 seconds (User Requested)
            setTimeout(triggerGlitchSystem, 5000);
        });
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

        tl.call(function () {
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
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
            pinType: container.querySelector('[data-scroll-container]').style.transform ? "transform" : "fixed"
        });

        ScrollTrigger.defaults({
            scroller: document.querySelector('[data-scroll-container]'),
        });

        const scrollbar = selectAll('.c-scrollbar');

        if (scrollbar.length > 1) {
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
var typed = new Typed('#text-animate', {
    strings: ['Software Developer/Engineer', 'Web Programmer', 'Backend Programmer', 'Machine Learning Enthusiast'],
    backSpeed: 100,
    typeSpeed: 100,
    backDelay: 600,
    loop: true
});

$('.copy_text').click(function (e) {
    e.preventDefault();
    var copyText = $(this).attr('href');

    document.addEventListener('copy', function (e) {
        e.clipboardData.setData('text/plain', copyText);
        e.preventDefault();
    }, true);

    document.execCommand('copy');
    console.log('copied text : ', copyText);
    alert('copied text: ' + copyText);
});

//about section
$(function () {
    $('#aboutSection').load('sections/about.html');
});

//portfolio section
$(function () {
    $('#projectsSection').load('sections/projects.html');
});

//contact section
$(function () {
    $('#contactSection').load('sections/contact.html');
});

function scrambleText(element, targetText, duration = 1.5, delay = 0, customIterations = 8, customInterval = 60) {
    const chars = "!@#$%^&*()_+{}:<>?0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const originalContent = targetText || element.innerHTML;

    // Create a temporary container to parse HTML if any
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalContent;

    // Get only text nodes and wrap their words in spans for granular control
    // If you want ONLY specific words, we'll iterate through child nodes
    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const targets = [];

    while (node = walk.nextNode()) {
        const words = node.nodeValue.split(/(\s+)/); // Preserve spaces
        const parent = node.parentNode;

        words.forEach(word => {
            if (word.trim().length > 0) {
                const span = document.createElement('span');
                span.innerText = word;
                span.style.display = 'inline-block';
                parent.insertBefore(span, node);
                targets.push({ el: span, text: word });
            } else {
                parent.insertBefore(document.createTextNode(word), node);
            }
        });
        parent.removeChild(node);
    }

    element.innerHTML = tempDiv.innerHTML;
    // Map the new spans back
    const spans = element.querySelectorAll('span');

    setTimeout(() => {
        targets.forEach((target, wordIndex) => {
            const el = spans[wordIndex];
            const textArray = target.text.split("");
            const revealedIndices = new Set();
            let iterationCount = 0;

            const interval = setInterval(() => {
                const scrambled = textArray.map((char, i) => {
                    if (revealedIndices.has(i)) return char;
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("");

                el.innerText = scrambled;

                if (iterationCount >= customIterations) {
                    if (revealedIndices.size < textArray.length) {
                        revealedIndices.add(revealedIndices.size);
                        iterationCount = 0;
                    } else {
                        el.innerText = target.text;
                        clearInterval(interval);
                    }
                }
                iterationCount++;
            }, customInterval + (wordIndex * 2)); // Slightly vary speed
        });
    }, delay * 1000);
}

function triggerGlitchSystem() {
    const body = document.body;
    const tvOverlay = document.createElement('div');
    tvOverlay.className = 'tv-shutdown-overlay';
    body.appendChild(tvOverlay);

    const tlCombined = gsap.timeline();

    // Glitch Sequence 1
    tlCombined.add(createGlitchSequence());
    // Short Pause
    tlCombined.to({}, { duration: 0.5 });
    // Glitch Sequence 2
    tlCombined.add(createGlitchSequence());

    // TV Shutdown Effect
    tlCombined.to(tvOverlay, {
        display: 'block',
        duration: 0
    });

    // Line shrink (horizontal)
    tlCombined.to(tvOverlay, {
        scaleY: 0.005,
        duration: 0.3,
        ease: "power4.inOut"
    });

    // Dot shrink (vertical)
    tlCombined.to(tvOverlay, {
        scaleX: 0,
        duration: 0.2,
        ease: "power4.in"
    });

    // Final Transition to Version 2
    tlCombined.call(() => {
        body.classList.add("version-2");
        body.classList.remove("no-interact");
        document.documentElement.classList.remove("no-interact"); // Enable interaction for V2

        const v2Container = document.querySelector('.v2-container');
        if (v2Container) {
            gsap.set(v2Container, { display: 'block', opacity: 0 });
            gsap.to(v2Container, { opacity: 1, duration: 1, ease: "power2.out" });
        }

        // Re-open TV effect (optional or keep it dark for a bit)
        gsap.to(tvOverlay, {
            scaleX: 1,
            scaleY: 1,
            opacity: 0,
            duration: 0.5,
            ease: "power4.out",
            onComplete: () => {
                tvOverlay.remove();
                initV2Interactions(); // Initialize V2 specific logic
                // Restart scroll if needed for V2
                if (typeof scroll !== 'undefined') {
                    scroll.update();
                    scroll.start();
                }
            }
        });
    });
}

function initV2Interactions() {
    const badge = document.querySelector('.v2-badge');
    const container = document.querySelector('.v2-container');

    if (!badge || !container) return;

    container.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Calculate rotation based on mouse position
        const xRotation = ((clientY / innerHeight) - 0.5) * 30; // Max 15 deg
        const yRotation = ((clientX / innerWidth) - 0.5) * -30; // Max -15 deg

        gsap.to(badge, {
            rotateX: xRotation,
            rotateY: yRotation,
            duration: 0.5,
            ease: "power2.out"
        });

        // Move the glow inside the badge
        const badgeRect = badge.getBoundingClientRect();
        const relX = clientX - badgeRect.left;
        const relY = clientY - badgeRect.top;

        gsap.to('.badge-glow', {
            x: relX - (badgeRect.width / 2),
            y: relY - (badgeRect.height / 2),
            duration: 1
        });
    });

    // Reset rotation when mouse leaves
    container.addEventListener('mouseleave', () => {
        gsap.to(badge, {
            rotateX: 0,
            rotateY: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)"
        });
    });
}


function createGlitchSequence() {
    const body = document.body;
    const tl = gsap.timeline();
    tl.call(() => body.classList.add("glitching"));

    for (let i = 0; i < 15; i++) {
        tl.to(body, {
            filter: `invert(${Math.random() > 0.5 ? 1 : 0}) hue-rotate(${Math.random() * 360}deg) contrast(${1 + Math.random() * 2})`,
            duration: 0.05,
            x: (Math.random() - 0.5) * 50,
            y: (Math.random() - 0.5) * 20,
            ease: "none"
        });
    }

    tl.to(body, {
        filter: "none",
        x: 0,
        y: 0,
        duration: 0.1,
        onComplete: () => body.classList.remove("glitching")
    });
    return tl;
}

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

