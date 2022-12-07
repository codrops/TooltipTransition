import { preloadImages } from './utils';
import { Tooltip } from './tooltip';
import { LinesController } from './linesController';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
gsap.registerPlugin(Flip);

// .content element
const content = document.querySelector('.content');

// link that when hovered triggers the effect
const link = document.querySelector('a[data-tooltip]');

// object representing the images slideshow that animates on hover.
const tooltip = new Tooltip(document.querySelector('aside.tooltip'));

// 4 lines that move around
const lineController = new LinesController([...document.querySelectorAll('.line')]);

// .gallery element
const gallery = document.querySelector('.gallery');

// gallery title inner text element: .gallery__title > .oh__inner
const galleryTitle = document.querySelector('.gallery__title > .oh__inner');

// .content__pretitle text elements:
// back control to main page and title
const pretitle = {
    back: document.querySelector('.content__pretitle > .back > .oh__inner'),
    title: document.querySelector('.content__pretitle > .oh:not(.back) > .oh__inner')
};

// .nav and .nav__img elements
const nav = document.querySelector('.nav');
const navImages = [...nav.querySelectorAll('.nav__img')];

// gsap timelines
let entertl, leavetl, clicktl, zoomintl, zoomouttl, backtl;

// true after clicking the link and showing the gallery
let isGalleryOpen = false;

// true after zooming/clicking the gallery image 
let isFullscreen = false;

// window size
let winsize = { width: window.innerWidth, height: window.innerHeight };

let isAnimating = false;

// zoom in / zoom out
const toggleZoom = _ => isFullscreen ? zoomOut() : zoomIn();

const zoomIn = () => {
    
    if ( isAnimating ) return;
    isAnimating = true;

    const flipstateNav = Flip.getState(navImages, {simple: true});
    const flipstateGallery = Flip.getState(tooltip.DOM.images[tooltip.current], {simple: true});
    
    // add fullscreen classes to both the gallery and nav elements
    gallery.classList.add('gallery--fullscreen');
    nav.classList.add('nav--fullscreen');

    // lines final positions
    const imageRect = tooltip.DOM.images[tooltip.current].getBoundingClientRect();
    const linePos = {
        // first and second horizontal lines y translations
        horizontal: [imageRect.top, -winsize.height + (imageRect.top + tooltip.DOM.images[tooltip.current].offsetHeight)],
        // first and second vertical lines x translations
        vertical: [imageRect.left, -winsize.width + (imageRect.left + tooltip.DOM.images[tooltip.current].offsetWidth)]
    };

    zoomintl = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: 'power4'
        },
        onStart: () => isFullscreen = true,
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    .add(() => {
        const flipOpts = {
            duration: zoomintl.vars.defaults.duration,
            ease: zoomintl.vars.defaults.ease,
            scale: true
        };
        Flip.from(flipstateNav, flipOpts)
        Flip.from(flipstateGallery, flipOpts);
    }, 'start')
    .to(lineController.DOM.linesHorizontal[0], {
        y: linePos.horizontal[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesHorizontal[1], {
        y: linePos.horizontal[1],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[0], {
        x: linePos.vertical[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[1], {
        x: linePos.vertical[1],
        opacity: 1
    }, 'start');

};

const zoomOut = () => {

    if ( isAnimating ) return;
    isAnimating = true;

    const flipstateNav = Flip.getState(navImages, {simple: true});
    const flipstateGallery = Flip.getState(tooltip.DOM.images[tooltip.current], {simple: true});
    
    gallery.classList.remove('gallery--fullscreen');
    nav.classList.remove('nav--fullscreen');
    
    // lines final positions
    const galleryRect = gallery.getBoundingClientRect();
    const linePos = {
        // first and second horizontal lines y translations
        horizontal: [galleryRect.top, -winsize.height + (galleryRect.top + gallery.offsetHeight)],
        // first and second vertical lines x translations
        vertical: [galleryRect.left, -winsize.width + (galleryRect.left + gallery.offsetWidth)]
    };
    
    zoomouttl = gsap.timeline({
        defaults: {
            duration: 0.7,
            ease: 'power4'
        },
        onStart: () => isFullscreen = false,
        onComplete: () => isAnimating = false
    })
    .addLabel('start', 0)
    .add(() => {
        const flipOpts = {
            duration: zoomouttl.vars.defaults.duration,
            ease: zoomouttl.vars.defaults.ease,
            scale: true
        };
        Flip.from(flipstateNav, flipOpts);
        Flip.from(flipstateGallery, flipOpts);
    }, 'start')
    .to(lineController.DOM.linesHorizontal[0], {
        y: linePos.horizontal[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesHorizontal[1], {
        y: linePos.horizontal[1],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[0], {
        x: linePos.vertical[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[1], {
        x: linePos.vertical[1],
        opacity: 1
    }, 'start');

};

// hover effect (show auto slideshow)
link.addEventListener('mouseenter', () => {

    // disable the mouse hover events after clicking on the link
    if ( isGalleryOpen ) return;

    // kill the mouseleave event timeline if active
    if ( leavetl ) {
        leavetl.kill();
    }

    // line final positions
    const linePos = {
        // first and second horizontal lines y translations
        horizontal: [tooltip.rect.top, -winsize.height + (tooltip.rect.top + tooltip.DOM.images[tooltip.current].offsetHeight)],
        // first and second vertical lines x translations
        vertical: [tooltip.rect.left, -winsize.width + (tooltip.rect.left + tooltip.DOM.images[tooltip.current].offsetWidth)]
    };

    entertl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'power4.inOut'
        }
    })
    .addLabel('start', 0)
    .to(lineController.DOM.linesHorizontal[0], {
        startAt: {
            y: linePos.horizontal[0]-100, 
            opacity: 0
        },
        y: linePos.horizontal[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesHorizontal[1], {
        startAt: {
            y: linePos.horizontal[1]+100, 
            opacity: 0
        },
        y: linePos.horizontal[1],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[0], {
        startAt: {
            x: linePos.vertical[0]-100,
            opacity: 0
        },
        x: linePos.vertical[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[1], {
        startAt: {
            x:linePos.vertical[1]+100, 
            opacity: 0
        },
        x: linePos.vertical[1],
        opacity: 1
    }, 'start')
    .to(tooltip.DOM.el, {
        opacity: 1
    }, 'start+=0.2')
    .add(() => {
        tooltip.startSlideshow();
    }, 'start+=0.7')

});

link.addEventListener('mouseleave', () => {
    
    // disable the mouse hover events after clicking on the link
    if ( isGalleryOpen ) return;

    // kill the mouseenter event timeline if active
    if ( entertl ) {
        entertl.kill();
    }

    leavetl = gsap.timeline({
        defaults: {
            duration: 1,
            ease: 'power4.inOut'
        },
        onStart: () => tooltip.stopSlideshow(),
        onComplete: () => tooltip.reset(),
    })
    .addLabel('start', 0)
    .to(tooltip.DOM.el, {
        duration: 0.6,
        opacity: 0
    }, 'start')
    .to(lineController.DOM.lines, {
        x: 0,
        y: 0,
        opacity: 0
    }, 'start');

});

// click effect (show gallery)
link.addEventListener('click', () => {
    
    if ( isAnimating ) return;
    isAnimating = true;

    isGalleryOpen = true;

    if ( entertl ) {
        entertl.kill();
    }
    if ( leavetl ) {
        leavetl.kill();
    }

    tooltip.stopSlideshow();

    // line final positions
    const galleryRect = gallery.getBoundingClientRect();
    const linePos = {
        // first and second horizontal lines y translations
        horizontal: [galleryRect.top, -winsize.height + (galleryRect.top + gallery.offsetHeight)],
        // first and second vertical lines x translations
        vertical: [galleryRect.left, -winsize.width + (galleryRect.left + gallery.offsetWidth)]
    };

    clicktl = gsap.timeline({
        onStart: () => {
            content.classList.add('content--open');

            // hide all navImages initially so we can animate them in later
            gsap.set(navImages, {opacity: 0});

            // set nav current
            const navCurrent = navImages.find(img => img.classList.contains('nav__img--selected'));
            if ( navCurrent ) {
                navCurrent.classList.remove('nav__img--selected');
            }
            navImages[tooltip.current].classList.add('nav__img--selected');
        },
        onComplete: () => isAnimating = false,
        defaults: {
            duration: 0.7,
            ease: 'power4'
        }
    })
    .addLabel('start', 0)
    .to(lineController.DOM.linesHorizontal[0], {
        y: linePos.horizontal[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesHorizontal[1], {
        y: linePos.horizontal[1],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[0], {
        x: linePos.vertical[0],
        opacity: 1
    }, 'start')
    .to(lineController.DOM.linesVertical[1], {
        x: linePos.vertical[1],
        opacity: 1
    }, 'start')
    .add(() => {
        const flipstate = Flip.getState(tooltip.DOM.images[tooltip.current], {simple: true});
        
        gallery.prepend(tooltip.DOM.images[tooltip.current]);
        
        const flipOpts = {
            duration: clicktl.vars.defaults.duration,
            ease: clicktl.vars.defaults.ease,
            scale: true
        };
        Flip.from(flipstate, flipOpts);

        // zoom in/out when clicking on the current tooltip image
        tooltip.DOM.images[tooltip.current].addEventListener('click', toggleZoom);
    }, 'start')
    .to(tooltip.DOM.el, {
        duration: 0.4,
        opacity: 0
    }, 'start')
    .to(navImages, {
        startAt: {xPercent: 50},
        opacity: 1,
        xPercent: 0,
        stagger: 0.06
    }, 'start')
    .to(galleryTitle, {
        y: 0
    }, 'start')
    .to(pretitle.back, {
        y: 0
    }, 'start')
    .to(pretitle.title, {
        y: '-100%'
    }, 'start');

});

// back to main page
pretitle.back.addEventListener('click', () => {

    if ( isAnimating ) return;
    isAnimating = true;

    // remove the click event (zoom in/out) for the current tooltip image
    tooltip.DOM.images[tooltip.current].removeEventListener('click', toggleZoom);

    isGalleryOpen = false;

    const linePos = {
        // first and second horizontal lines y translations
        horizontal: [winsize.height, -winsize.height],
        // first and second vertical lines x translations
        vertical: [winsize.width, -winsize.width]
    };

    backtl = gsap.timeline({
        onComplete: () => {
            isAnimating = false;
        },
        defaults: {
            duration: 1,
            ease: 'power4.inOut'
        }
    })
    .addLabel('start', 0)
    .to(navImages, {
        duration: 0.5,
        opacity: 0,
        xPercent: 150,
        onComplete: () => content.classList.remove('content--open')
    }, 'start+=0.15')
    .to(pretitle.back, {
        y: '100%'
    }, 'start')
    .to(pretitle.title, {
        y: 0
    }, 'start')
    .to(galleryTitle, {
        y: '100%'
    }, 'start')
    .to(lineController.DOM.linesHorizontal[0], {
        y: linePos.horizontal[0]
    }, 'start')
    .to(lineController.DOM.linesHorizontal[1], {
        y: linePos.horizontal[1]
    }, 'start')
    .to(lineController.DOM.linesVertical[0], {
        x: linePos.vertical[0]
    }, 'start')
    .to(lineController.DOM.linesVertical[1], {
        x: linePos.vertical[1]
    }, 'start')
    .to(tooltip.DOM.images[tooltip.current], {
        duration: 0.85,
        //ease: 'expo',
        scale: 0,
        opacity: 0,
        onComplete: () => {
            tooltip.DOM.wrap.prepend(tooltip.DOM.images[tooltip.current]);
            gsap.set(tooltip.DOM.images[tooltip.current], {scale: 1, opacity: 1});
        }
    }, 'start');
    
});

// resize event
window.addEventListener('resize', () => {

    // update winsize
    winsize = { width: window.innerWidth, height: window.innerHeight };

    if ( !isGalleryOpen || isFullscreen ) return;

    // line final positions
    const galleryRect = gallery.getBoundingClientRect();
    const linePos = {
        // first and second horizontal lines y translations
        horizontal: [galleryRect.top, -winsize.height + (galleryRect.top + gallery.offsetHeight)],
        // first and second vertical lines x translations
        vertical: [galleryRect.left, -winsize.width + (galleryRect.left + gallery.offsetWidth)]
    };

    gsap.set(lineController.DOM.linesHorizontal[0], { y: linePos.horizontal[0] });
    gsap.set(lineController.DOM.linesHorizontal[1], { y: linePos.horizontal[1] });
    gsap.set(lineController.DOM.linesVertical[0], { x: linePos.vertical[0] });
    gsap.set(lineController.DOM.linesVertical[1], { x: linePos.vertical[1] });

});

// Preload images
preloadImages('.tooltip__img-inner, nav__img-inner').then(() => document.body.classList.remove('loading'));