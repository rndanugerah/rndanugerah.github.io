class LogoLoop {
    constructor(element) {
        this.el = element;
        this.track = this.el.querySelector('.logoloop__track');
        this.seq = this.el.querySelector('.logoloop__list');
        
        if (!this.track || !this.seq) return;

        this.options = {
            speed: parseFloat(this.el.dataset.speed) || 120,
            direction: this.el.dataset.direction || 'left',
            pauseOnHover: this.el.dataset.pauseOnHover !== 'false',
            gap: parseFloat(this.el.dataset.gap) || 32,
            logoHeight: parseFloat(this.el.dataset.logoHeight) || 28,
        };

        this.el.style.setProperty('--logoloop-gap', `${this.options.gap}px`);
        this.el.style.setProperty('--logoloop-logoHeight', `${this.options.logoHeight}px`);

        this.isHovered = false;
        this.rafId = null;
        this.lastTimestamp = null;
        this.offset = 0;
        this.velocity = 0;
        this.seqWidth = 0;
        
        this.SMOOTH_TAU = 0.25;

        this.init();
    }

    init() {
        // Wait for images to load before calculation
        const images = this.seq.querySelectorAll('img');
        let loaded = 0;
        
        if (images.length === 0) {
            this.setup();
        } else {
            images.forEach(img => {
                if (img.complete) {
                    loaded++;
                    if (loaded === images.length) this.setup();
                } else {
                    img.addEventListener('load', () => {
                        loaded++;
                        if (loaded === images.length) this.setup();
                    }, { once: true });
                    img.addEventListener('error', () => {
                        loaded++;
                        if (loaded === images.length) this.setup();
                    }, { once: true });
                }
            });
        }
    }

    setup() {
        this.calculateDimensions();
        
        // Resize listener
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => this.calculateDimensions(), 100);
        });

        // Hover events
        if (this.options.pauseOnHover) {
            this.track.addEventListener('mouseenter', () => this.isHovered = true);
            this.track.addEventListener('mouseleave', () => this.isHovered = false);
        }

        this.startAnimation();
    }

    calculateDimensions() {
        // Clear old duplicates if any
        const duplicates = this.track.querySelectorAll('.logoloop__list.duplicate');
        duplicates.forEach(dup => dup.remove());

        const containerWidth = this.el.clientWidth;
        const sequenceWidth = this.seq.getBoundingClientRect().width;
        this.seqWidth = sequenceWidth;

        if (sequenceWidth === 0) return;

        // Calculate needed copies to fill and animate smoothly
        const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + 2;

        for (let i = 1; i < Math.max(2, copiesNeeded); i++) {
            const clone = this.seq.cloneNode(true);
            clone.classList.add('duplicate');
            clone.setAttribute('aria-hidden', 'true');
            this.track.appendChild(clone);
        }
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (this.lastTimestamp === null) {
                this.lastTimestamp = timestamp;
            }
            
            const deltaTime = Math.max(0, timestamp - this.lastTimestamp) / 1000;
            this.lastTimestamp = timestamp;
            
            const directionMultiplier = this.options.direction === 'left' ? 1 : -1;
            const targetVelocity = Math.abs(this.options.speed) * directionMultiplier * (this.options.speed < 0 ? -1 : 1);
            
            const target = this.isHovered ? 0 : targetVelocity;
            
            const easingFactor = 1 - Math.exp(-deltaTime / this.SMOOTH_TAU);
            this.velocity += (target - this.velocity) * easingFactor;
            
            if (this.seqWidth > 0) {
                let nextOffset = this.offset + this.velocity * deltaTime;
                nextOffset = ((nextOffset % this.seqWidth) + this.seqWidth) % this.seqWidth;
                this.offset = nextOffset;
                
                this.track.style.transform = `translate3d(${-this.offset}px, 0, 0)`;
            }
            
            this.rafId = requestAnimationFrame(animate);
        };
        
        this.rafId = requestAnimationFrame(animate);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loops = document.querySelectorAll('.logoloop');
    loops.forEach(el => new LogoLoop(el));
});
