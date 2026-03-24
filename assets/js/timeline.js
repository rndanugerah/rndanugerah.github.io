// timeline.js

function initTimelineAnimation() {
   if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

   gsap.registerPlugin(ScrollTrigger);

   const timelineContainer = document.querySelector('.timeline-container');
   if(!timelineContainer) return;

   const tl = gsap.timeline({
      scrollTrigger: {
         trigger: '.timeline-container',
         start: 'top center',
         end: 'bottom center',
         scrub: true,
      }
   });

   // The straight line growth
   if (document.querySelector('.timeline-line-progress')) {
      tl.to('.timeline-line-progress', {
         height: '100%',
         ease: 'none',
      }, 0);
   }

   // The star movement along the straight line
   tl.to('.timeline-star-icon', {
      top: '100%',
      ease: 'none',
   }, 0);
}

document.addEventListener('DOMContentLoaded', () => {
   setTimeout(initTimelineAnimation, 500);
});

if (typeof barba !== 'undefined') {
   barba.hooks.after(() => {
      setTimeout(initTimelineAnimation, 500);
   });
}
