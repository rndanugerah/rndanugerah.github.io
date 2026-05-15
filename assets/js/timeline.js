function initTimelineAnimation() {
   if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

   gsap.registerPlugin(ScrollTrigger);

   const container = document.querySelector('.timeline-container');
   const star = document.querySelector('.timeline-star-icon');
   const progressLine = document.querySelector('.timeline-line-progress');
   const courseTitle = document.querySelector('#course-title-break');

   if (!container || !star || !progressLine || !courseTitle) return;

   const containerHeight = container.offsetHeight;
   const titleTop = courseTitle.offsetTop;
   const titleHeight = courseTitle.offsetHeight;
   const gap = 16;

   const breakStart = ((titleTop - gap) / containerHeight) * 100;
   const breakEnd = ((titleTop + titleHeight + gap) / containerHeight) * 100;

   // Animation durations (relative to 100% timeline)
   const animDuration = 2; // Duration of the spin in percentage points

   const tl = gsap.timeline({
      scrollTrigger: {
         trigger: '.timeline-container',
         start: 'top center',
         end: 'bottom center',
         scrub: true,
      }
   });

   // Part 1: Normal Travel to Break
   tl.to(progressLine, { height: breakStart + '%', ease: 'none', duration: breakStart }, 0);
   tl.to(star, { top: breakStart + '%', ease: 'none', duration: breakStart }, 0);

   // Part 2: Spin & Shrink (Disappear)
   tl.to(star, { 
      scale: 0, 
      rotation: 360, 
      duration: animDuration,
      ease: 'power1.in'
   });

   // Part 3: Teleport & Stay Hidden
   tl.set(progressLine, { height: breakEnd + '%' });
   tl.set(star, { 
      top: breakEnd + '%',
      rotation: 0 // Reset rotation for the next spin
   });

   // Part 4: Spin & Grow (Reappear)
   tl.to(star, { 
      scale: 1, 
      rotation: 360, 
      duration: animDuration,
      ease: 'power1.out'
   });

   // Part 5: Continue Travel to End
   const remaining = 100 - (breakEnd + animDuration);
   tl.to(progressLine, { height: '100%', ease: 'none', duration: remaining });
   tl.to(star, { top: '100%', ease: 'none', duration: remaining }, "<");
}

document.addEventListener('DOMContentLoaded', () => {
   setTimeout(initTimelineAnimation, 500);
});

if (typeof barba !== 'undefined') {
   barba.hooks.after(() => {
      setTimeout(initTimelineAnimation, 500);
   });
}
