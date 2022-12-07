import { gsap } from 'gsap';

/**
 * Class representing the tooltip / slideshow
 */
 export class Tooltip {
	// DOM elements
	DOM = {
		// the main element (.tooltip)
		el: null,
        // .tooltip__img-wrap
        wrap: null,
        // tooltip images (.tooltip__img)
        images: null,
        // tooltiop text (.tooltip__text)
        text: null,
	};
    // current tooltip image
    current = 0;
    // total images
    imagesTotal = -1;
    // interval of time between each image display (slideshow)
    slideshowInterval = 0.4
	
	/**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.tooltip)
	 */
	constructor(DOM_el) {
		this.DOM.el = DOM_el;
        this.DOM.wrap = this.DOM.el.querySelector('.tooltip__img-wrap');
        this.DOM.images = [...this.DOM.el.querySelectorAll('.tooltip__img')];
        this.imagesTotal = this.DOM.images.length;
        this.DOM.text = this.DOM.el.querySelector('.tooltip__text');

        // set current class for the first image
        this.DOM.images[this.current].classList.add('tooltip__img--current');

        this.calcRect(); 
        window.addEventListener('resize', () => this.calcRect());
	}
    /**
     * Get positions
     */
    calcRect() {
        this.rect = this.DOM.el.getBoundingClientRect();
    }
    /**
     * Starts the auto slideshow
     */
    startSlideshow() {
        this.showNextImage();
    }
    /**
     * change current image
     */
    showNextImage() {
        this.slideshow = gsap.delayedCall(this.slideshowInterval, () => {
            // update current
            this.DOM.images[this.current].classList.remove('tooltip__img--current');
            this.current = this.current < this.imagesTotal-1 ? ++this.current : 0;
            this.DOM.images[this.current].classList.add('tooltip__img--current');

            this.showNextImage();
        });
    }
    /**
     * Stops the auto slideshow
     */
    stopSlideshow() {
        if ( this.slideshow ) {
            this.slideshow.kill();
        }
    }
    /**
     * resets and update current to the original value 
     */
    reset() {
        // update current
        this.DOM.images[this.current].classList.remove('tooltip__img--current');
        this.current = 0;
        this.DOM.images[this.current].classList.add('tooltip__img--current');
    }
}
