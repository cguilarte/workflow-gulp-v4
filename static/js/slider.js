var sliderInterval;

function slideAlreadyActive(dot) {
    return dot.classList.contains('active')
}

function removeActiveDot(classDom) {
    document.querySelector("." + classDom + " .slider .dots .dot.active").classList.remove("active");
}

function automaticSlide(classDom) {
    sliderInterval = window.setInterval(() => {
        swipeTo('next', classDom);
    }, 8000)
}

function resetSliderInterval() {
    window.clearInterval(sliderInterval);
    automaticSlide();
}

function moveSlides(activeSlideIndex, classDom) {
    let slides = document.querySelectorAll("." + classDom + " .slider .slideItem");
    slides.forEach(function(slide) {
        slide.style.transform = `translateX(-${100 * activeSlideIndex}vw)`;
    })
}

function swipeTo(direction, classDom) {
    let dotsContainer = document.querySelector("." + classDom + " .slider .dots");
    let activeSlideDot = document.querySelector("." + classDom  + " .slider .dots .dot.active");
    let nextSlide = activeSlideDot[`${direction}ElementSibling`];
   
    if (!nextSlide) {
        nextSlide = direction == 'next' ? dotsContainer.children[0] : dotsContainer.children[dotsContainer.children.length - 1];
    }
    
    let nextSlideIndex = Array.prototype.indexOf.call(dotsContainer.children, nextSlide);

    changeActiveSlide(nextSlide, nextSlideIndex, classDom);
}

function addSliderSwipe(classDom) {
    let slidesContainer = document.querySelector("." + classDom +" .slider");
    var startTouchX = 0
    slidesContainer.addEventListener('touchstart', event => { startTouchX = event.touches[0].clientX}, {passive: true})
    slidesContainer.addEventListener('touchend', event => {
        let movement = startTouchX - event.changedTouches[0].clientX;
        if (movement > 70) {
            swipeTo('next', classDom);
            resetSliderInterval();					
        }
        if (movement < -70) {
            swipeTo('previous', classDom);
            resetSliderInterval();					
        }
    }, {passive: true})
}

function changeActiveSlide(dotElement, index, classDom) {
    if(!slideAlreadyActive(dotElement)) {
        removeActiveDot(classDom);
        moveSlides(index, classDom);
        dotElement.className += " active";
    }
}

function addSliderDotsEvents(classDom) {
    let sliderDots = document.querySelectorAll("." + classDom  +" .slider .dots .dot");
    
    sliderDots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            changeActiveSlide(dot, index, classDom);
            resetSliderInterval();            
        })
    })
}

function initSlider(classDom) {
    addSliderDotsEvents(classDom);
    addSliderSwipe(classDom);
    //automaticSlide(classDom);
}

initSlider('slider-desktop');
initSlider('slider-mobile');