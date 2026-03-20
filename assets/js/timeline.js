// timeline.js

function initTimelineAnimation() {
   if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || typeof MotionPathPlugin === 'undefined') return;

   gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

   const timelineContainer = document.querySelector('.timeline-container');
   if(!timelineContainer) return;

   // The straight line growth
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

   // The star movement along straight line
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

   const pathFill = document.querySelector('#timeline-path-fill');
   if(pathFill) {
      // Setup the SVG path trace animation
      const length = pathFill.getTotalLength();
      gsap.set(pathFill, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(pathFill, {
         strokeDashoffset: 0,
         ease: 'none',
         scrollTrigger: {
            trigger: '.timeline-container',
            start: 'top center',
            end: 'bottom center',
            scrub: true,
         }
      });
   }
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
