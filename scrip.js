
AOS.init({
    easing: 'ease-out-cubic',
    once: true, // Animation khi scroll
    offset: 50,
    duration: 600,
    mirror: false,
    disable: window.innerWidth < 768
});

// Check hướng scroll
let lastScrollTop = 0;
let scrollDirection = 'down';
let currentSection = 0;
const sections = document.querySelectorAll('.snap-section');
let isScrolling = false;

window.addEventListener('scroll', () => {
    const header = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll > lastScrollTop) {
        scrollDirection = 'down';
        header.classList.add('scrolling-down');
        header.classList.remove('scrolling-up');
    } else {
        scrollDirection = 'up';
        header.classList.add('scrolling-up');
        header.classList.remove('scrolling-down');
    }
    lastScrollTop = currentScroll;

    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (currentScroll > 200) {
        if (scrollDirection === 'down') {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
    } else {
        header.style.transform = 'translateY(0)';
    }
});

document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation cho các elements khi load
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrolled = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const progressBarElement = document.querySelector('.scroll-progress-bar');
        if (progressBarElement) {
            progressBarElement.style.width = scrolled + '%';
        }
    });

    // Class fade-in-up cho các elements
    const elements = document.querySelectorAll('.course-card, .testimonial, .stat, .category-card, .featured-card, .channel-card, .faq-item');
    elements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-in-up');
        }, index * 100);
    });

    initCardMotion();

    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        setTimeout(typeWriter, 1000);
    }

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                // Trigger section-specific animations
                triggerSectionAnimations(entry.target);
            } else {
                entry.target.classList.remove('section-visible');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            if (!isScrolling) {
                scrollToNextSection();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isScrolling) {
                scrollToPrevSection();
            }
        }
    });

    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
            if (isScrolling) return;
            if (e.deltaY > 0) {
                scrollToNextSection();
            } else {
                scrollToPrevSection();
            }
        }, 50);
    });
});

function scrollToNextSection() {
    if (currentSection < sections.length - 1) {
        isScrolling = true;
        currentSection++;
        sections[currentSection].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

function scrollToPrevSection() {
    if (currentSection > 0) {
        isScrolling = true;
        currentSection--;
        sections[currentSection].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }
}

function triggerSectionAnimations(section) {
    const sectionId = section.id;

    switch(sectionId) {
        case 'hero':
            animateHeroStats();
            break;
        case 'courses':
            animateCourseCategories();
            break;
        case 'student-channels':
            animateChannelCards();
            break;
        case 'testimonials':
            animateTestimonials();
            break;
    }
}

// hero stats
function animateHeroStats() {
    const stats = document.querySelectorAll('.stat-item h3');
    stats.forEach((stat, index) => {
        setTimeout(() => {
            animateCounter(stat, 0, parseInt(stat.textContent), 2000);
        }, index * 200);
    });
}

// course categories
function animateCourseCategories() {
    const categories = document.querySelectorAll('.category-card');
    categories.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'bounceIn 0.8s ease-out';
        }, index * 150);
    });
}

// channel cards
function animateChannelCards() {
    const channels = document.querySelectorAll('.channel-card');
    channels.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'slideInUp 0.6s ease-out';
        }, index * 100);
    });
}

// testimonials
function animateTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    testimonials.forEach((testimonial, index) => {
        setTimeout(() => {
            testimonial.style.animation = 'fadeInScale 0.8s ease-out';
        }, index * 200);
    });
}

//  animate counter
function animateCounter(element, start, end, duration) {
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const currentValue = Math.floor(progress * (end - start) + start);
        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Parallax effect cho hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.backgroundPosition = `center ${rate}px`;
    }

    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
        heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
    }

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.05}px)`;
    }

    const allSections = document.querySelectorAll('section');
    allSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight && rect.bottom > 0) {
            const progress = (windowHeight - rect.top) / windowHeight;
            const opacity = Math.min(Math.max(progress, 0.3), 1);
            section.style.opacity = opacity;
        }
    });

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            currentSection = index;
        }
    });
});

document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputs = contactForm.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '#e2e8f0';
            }
        });

        if (isValid) {
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
            contactForm.reset();
        } else {
            alert('Vui lòng điền đầy đủ thông tin.');
        }
    });
}

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

document.querySelectorAll('.stat, .testimonial').forEach(el => {
    observer.observe(el);
});

function initCardMotion() {
    const cards = document.querySelectorAll('.category-card, .featured-card, .channel-card, .testimonial, .faq-item');
    if (!cards.length) return;

    cards.forEach((card, index) => {
        card.classList.add('motion-card');
        card.style.transitionDelay = `${(index % 4) * 70}ms`;
    });

    const cardObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px'
    });

    cards.forEach(card => cardObserver.observe(card));
}
