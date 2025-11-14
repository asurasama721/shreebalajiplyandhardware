// Side Menu Functions
function openSideMenu() {
    document.getElementById('nav-bar').classList.add('open');
    document.getElementById('overlay').classList.add('show');
}

function closeSideMenu() {
    document.getElementById('nav-bar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

// Slider Functions - Seamless Infinite Loop
// Slider Functions - True Infinite Loop
let currentSlide = 1; // Start at 1 because we cloned slides
let isTransitioning = false;
const sliderWrapper = document.getElementById('sliderWrapper');
const slides = document.querySelectorAll('.slide');
const totalOriginalSlides = slides.length;

// Clone first and last slides for seamless looping
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[totalOriginalSlides - 1].cloneNode(true);

firstClone.classList.add('clone');
lastClone.classList.add('clone');

sliderWrapper.appendChild(firstClone);
sliderWrapper.insertBefore(lastClone, slides[0]);

// Update slides reference after cloning
const allSlides = document.querySelectorAll('.slide');
const totalSlides = allSlides.length;

// Start at the first original slide (position 1)
sliderWrapper.style.transform = `translateX(-100%)`;

function showSlide(index) {
    if (isTransitioning) return;

    isTransitioning = true;
    currentSlide = index;
    sliderWrapper.style.transition = 'transform 0.5s ease';
    sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;

    updateDots();
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

function goToSlide(index) {
    showSlide(index + 1); // +1 because we have cloned first slide
}

function updateDots() {
    const dotsContainer = document.getElementById('sliderControls');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalOriginalSlides; i++) {
            const dot = document.createElement('span');
            const slideIndex = (currentSlide - 1 + totalOriginalSlides) % totalOriginalSlides;
            dot.className = `slider-dot ${i === slideIndex ? 'active' : ''}`;
            dot.onclick = () => goToSlide(i);
            dotsContainer.appendChild(dot);
        }
    }
}

// Handle transition end for seamless looping
sliderWrapper.addEventListener('transitionend', () => {
    isTransitioning = false;

    // If we're on the first clone (index 0), jump to last original slide
    if (currentSlide === 0) {
        sliderWrapper.style.transition = 'none';
        currentSlide = totalOriginalSlides;
        sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    // If we're on the last clone, jump to first original slide
    else if (currentSlide === totalSlides - 1) {
        sliderWrapper.style.transition = 'none';
        currentSlide = 1;
        sliderWrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
});

// Auto-play slider
let sliderInterval = setInterval(() => {
    changeSlide(1);
}, 4000);

// Pause on hover
const sliderContainer = document.querySelector('.slider-container');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(sliderInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        sliderInterval = setInterval(() => {
            changeSlide(1);
        }, 4000);
    });
}

// Initialize
updateDots();

// Scroll to top functionality
window.addEventListener('scroll', () => {
    const scrollTop = document.getElementById('scrollTop');
    if (window.pageYOffset > 300) {
        scrollTop.classList.add('visible');
    } else {
        scrollTop.classList.remove('visible');
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            closeSideMenu();
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .contact-card').forEach(card => {
    observer.observe(card);
});
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
});