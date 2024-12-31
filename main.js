// Scroll animasyonları
let isScrolling = false;
let lastScrollTime = 0;
const scrollCooldown = 1000; // 1 saniye bekleme süresi
const wheelSensitivity = 60; // Yarım scroll için hassasiyet değeri

// Wheel event için scroll kontrolü
window.addEventListener('wheel', function(e) {
    e.preventDefault();
    
    const currentTime = new Date().getTime();
    if (isScrolling || currentTime - lastScrollTime < scrollCooldown) return;
    
    const direction = e.deltaY > 0 ? 1 : -1;
    const sections = Array.from(document.querySelectorAll('section'));
    const currentSection = sections.find(section => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom > 100;
    });
    
    if (currentSection) {
        const currentIndex = sections.indexOf(currentSection);
        let targetIndex;
        
        if (Math.abs(e.deltaY) >= wheelSensitivity) {
            if (direction > 0 && currentIndex < sections.length - 1) {
                targetIndex = currentIndex + 1;
            } else if (direction < 0 && currentIndex > 0) {
                targetIndex = currentIndex - 1;
            }
            
            if (targetIndex !== undefined) {
                smoothScrollTo('#' + sections[targetIndex].id);
                lastScrollTime = currentTime;
            }
        }
    }
}, { passive: false });

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        smoothScrollTo(targetId);
    });
});

// Enhanced smooth scroll function
function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    const headerOffset = 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const targetPosition = elementPosition + startPosition - headerOffset;
    
    const duration = 1000;
    let start = null;
    
    isScrolling = true;
    window.requestAnimationFrame(step);

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percentage = Math.min(progress / duration, 1);
        
        const easing = easeInOutCubic(percentage);
        const position = startPosition + (targetPosition - startPosition) * easing;
        
        window.scrollTo({
            top: position,
            behavior: 'auto'
        });
        
        if (progress < duration) {
            window.requestAnimationFrame(step);
        } else {
            isScrolling = false;
        }
    }
}

// Manuel scroll için smooth efekt
let lastScrollTop = 0;
let scrollTimeout;

window.addEventListener('scroll', function() {
    if (isScrolling) return;

    clearTimeout(scrollTimeout);
    
    const currentScroll = window.pageYOffset;
    const sections = document.querySelectorAll('section');
    let targetSection = null;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            targetSection = section;
        }
    });
    
    if (targetSection) {
        scrollTimeout = setTimeout(() => {
            smoothScrollTo('#' + targetSection.id);
        }, 50);
    }
    
    lastScrollTop = currentScroll;
}, { passive: true });

// Easing function
function easeInOutCubic(t) {
    return t < 0.5 
        ? 4 * t * t * t 
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Scroll-based animations
const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '-50px'
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            updateNavLinks(entry.target.id);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Update active nav link
function updateNavLinks(currentId) {
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentId) {
            link.classList.add('active');
        }
    });
}

// Form submission handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Simple form validation
        if (!name || !email || !message) {
            alert('Lütfen tüm alanları doldurun.');
            return;
        }
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert('Mesajınız başarıyla gönderildi!');
        this.reset();
    });
}

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Restore scrolling when modal is closed
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === "Escape") {
        const modals = document.getElementsByClassName('modal');
        for (let modal of modals) {
            if (modal.style.display === "block") {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        }
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Typing Animation
const titles = ["Grafik Tasarımcı", "Yazılım Geliştirici"];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;
let erasingDelay = 50;
let newTitleDelay = 1000;

function typeEffect() {
    const currentTitle = titles[titleIndex];
    const typedText = document.querySelector('.typed-text');
    
    if (isDeleting) {
        // Silme efekti
        typedText.textContent = currentTitle.substring(0, charIndex-1);
        charIndex--;
        typingDelay = erasingDelay;
    } else {
        // Yazma efekti
        typedText.textContent = currentTitle.substring(0, charIndex+1);
        charIndex++;
        typingDelay = 100;
    }
    
    // Yazma tamamlandığında
    if (!isDeleting && charIndex === currentTitle.length) {
        typingDelay = newTitleDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
    }
    
    setTimeout(typeEffect, typingDelay);
}

// Start the typing animation
document.addEventListener('DOMContentLoaded', function() {
    if(document.querySelector('.typed-text')) {
        setTimeout(typeEffect, 500);
    }
});

// Instagram post hover effect
document.querySelectorAll('.insta-post').forEach(post => {
    post.addEventListener('mouseenter', function() {
        this.querySelector('.overlay').style.opacity = '1';
    });
    
    post.addEventListener('mouseleave', function() {
        this.querySelector('.overlay').style.opacity = '0';
    });
}); 