// timeline.js

function initTimelineAnimation() {
   if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

   const timelineContainer = document.querySelector('.timeline-container');
   if(!timelineContainer) return;

   // The line growth
   gsap.to('.timeline-line-progress', {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
         trigger: '.timeline-container',
         start: 'top center',
         end: 'bottom center',
         scrub: true,
      }
   });

   // The star movement
   gsap.to('.timeline-star-icon', {
      top: '100%',
      ease: 'none',
      scrollTrigger: {
         trigger: '.timeline-container',
         start: 'top center',
         end: 'bottom center',
         scrub: true,
      }
   });

   // Fill nodes
   const items = document.querySelectorAll('.timeline-item');
   items.forEach(item => {
      gsap.to(item, {
         scrollTrigger: {
            trigger: item,
            start: 'center center',
            toggleClass: 'active'
         }
      });
   });
}

// Ensure it initializes when Barba page transition completes, or on direct render.
document.addEventListener('DOMContentLoaded', () => {
   // Slight delay to ensure Locomotive/ScrollTrigger base logic runs first
   setTimeout(initTimelineAnimation, 500);
});

// If Barba is present, re-initialize on views
if (typeof barba !== 'undefined') {
   barba.hooks.after(() => {
      setTimeout(initTimelineAnimation, 500);
   });
}
