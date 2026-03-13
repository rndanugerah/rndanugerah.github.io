let scroll;

function initPageTransitions() {
    // Start loader animation
    initLoader();

    // Time
    initTimeZone();
}

function initLoader() {
    var tl = gsap.timeline();

    tl.set(".loading-screen", { top: "0" });
    tl.set("html", { cursor: "wait" });

    // Stagger text
    const words = document.querySelectorAll('.loading-words h2');
    tl.set(words, { opacity: 0 });

    words.forEach((word, index) => {
        // Only don't fade out the very last word immediately if we want it to stay a bit
        let isLast = index === words.length - 1;

        tl.to(word, {
            opacity: 1,
            duration: 0.05
        }, index * 0.15)
            .to(word, {
                opacity: 0,
                duration: 0.05
            }, (index * 0.15) + (isLast ? 0.3 : 0.1));
    });

    // Reveal main page
    tl.to(".loading-screen", {
        duration: 1,
        yPercent: -100,
        ease: "power4.inOut",
    }, "+=0.3");

    // Retract the curved path bottom div
    tl.to(".loading-screen .rounded-div-wrap.bottom", {
        duration: 1,
        height: "0vh",
        ease: "power4.inOut",
    }, "-=1");

    tl.set(".loading-container", { display: "none" });

    // Initiate locomotive scroll and page animations
    tl.call(function () {
        initLocomotiveScroll();
        animateHome();
        initCursor();
        initMagneticButtons();
        initWaves();
        $("html").css("cursor", "none"); // reset cursor
    }, null, "-=0.8");
}

function prepareText() {
    const title = document.querySelector("#hero-name");
    if (title && !title.classList.contains("prepared")) {
        const text = title.innerText.trim();
        title.innerHTML = "";
        text.split("").forEach(char => {
            const span = document.createElement("span");
            span.className = "char";
            span.innerText = char === " " ? "\u00A0" : char;
            title.appendChild(span);
        });
        title.classList.add("prepared");
    }
}

function animateHome() {
    prepareText();

    gsap.to(".hero-title .char", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.out",
        delay: 0.1
    });

    gsap.to(".hero-roles-wrapper", {
        opacity: 1,
        duration: 1,
        delay: 0.8
    });

    initRoleSelector();
}

function initRoleSelector() {
    const roles = document.querySelectorAll(".role-item");
    const box = document.querySelector(".role-selector-box");
    if (!box || roles.length === 0) return;

    let currentIndex = 0;

    function moveBox(target) {
        const roleRect = target.getBoundingClientRect();
        const parentRect = target.parentElement.getBoundingClientRect();

        box.style.width = `${roleRect.width + 10}px`;
        box.style.height = `${roleRect.height + 10}px`;
        box.style.transform = `translate(${roleRect.left - parentRect.left - 5}px, ${roleRect.top - parentRect.top - 5}px)`;
    }

    // Initialize box position on first active element
    setTimeout(() => moveBox(roles[0]), 100);

    // Click to select
    roles.forEach((role, i) => {
        // Handle Hover/Click
        role.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                roles.forEach(r => r.classList.remove('active'));
                role.classList.add('active');
                moveBox(role);
                currentIndex = i;
            }
        });
        role.addEventListener('click', () => {
            roles.forEach(r => r.classList.remove('active'));
            role.classList.add('active');
            moveBox(role);
            currentIndex = i;
        });
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        if (roles[currentIndex]) {
            moveBox(roles[currentIndex]);
        }
    });
}

function initWaves() {
    const canvas = document.getElementById('bg-waves');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight; // full screen
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    let time = 0;

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const lines = 8;
        const waveBaseY = height * 0.5; // exactly in the middle

        for (let i = 0; i < lines; i++) {
            ctx.beginPath();
            ctx.moveTo(0, waveBaseY);

            const amplitude = 40 + i * 20; // bigger amplitude
            const frequency = 0.001 + i * 0.0003;
            const phase = time * (0.01 + i * 0.005);

            for (let x = 0; x <= width; x += 15) {
                const y = waveBaseY
                    - (Math.sin(x * frequency + phase) * amplitude)
                    - (Math.cos(x * 0.0005 - phase) * (amplitude * 0.5));
                ctx.lineTo(x, y);
            }

            // White lines with varying opacity
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 + (i * 0.015)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        time++;
        requestAnimationFrame(draw);
    }

    draw();
}

// Removed MatterJS logic as we use ReactBits Lanyard now

// Cursor and other initializations continue below...

function initLocomotiveScroll() {
    const scrollContainer = document.querySelector('[data-scroll-container]');

    scroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        multiplier: 1,
        class: 'is-reveal'
    });

    // Update ScrollTrigger when LocomotiveScroll updates
    scroll.on("scroll", ScrollTrigger.update);

    // Proxy LocomotiveScroll methods to ScrollTrigger
    ScrollTrigger.scrollerProxy(scrollContainer, {
        scrollTop(value) {
            return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed"
    });

    // Refresh after setup
    ScrollTrigger.addEventListener("refresh", () => scroll.update());
    ScrollTrigger.refresh();
}

function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    // Only init if not touch device
    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        const hoverElements = document.querySelectorAll('a, button, [data-magnetic]');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }
}

function initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const position = btn.getBoundingClientRect();
            const x = e.pageX - position.left - position.width / 2;
            const y = e.pageY - position.top - position.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        btn.addEventListener('mouseleave', function () {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });
}

function initTimeZone() {
    const timeSpan = document.querySelector("#timeSpan");
    if (!timeSpan) return;

    const optionsTime = {
        timeZone: 'Asia/Makassar',
        timeZoneName: 'short',
        hour: '2-digit',
        minute: 'numeric',
        second: 'numeric',
    };

    const formatter = new Intl.DateTimeFormat([], optionsTime);

    function updateTime() {
        const dateTime = new Date();
        const formattedDateTime = formatter.format(dateTime);
        timeSpan.textContent = formattedDateTime;
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// Init everything
$(document).ready(function () {
    initPageTransitions();
});
