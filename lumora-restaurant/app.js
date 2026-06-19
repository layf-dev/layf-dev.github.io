document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Initial Load Animations
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        // Adding the loaded class triggers the subtle zoom out effect on the background
        setTimeout(() => {
            heroSection.classList.add('loaded');
        }, 100);
    }

    // Trigger initial reveals immediately for items in viewport
    const revealElements = document.querySelectorAll('.reveal');
    
    // 2. Scroll Reveal via IntersectionObserver
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Stop observing once it has been revealed
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: "0px 0px -50px 0px" // Slight offset
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 3. Sticky Header Morphing
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 4. Parallax Background Logic (Smooth Y translation)
    const parallaxImages = document.querySelectorAll('.parallax-img');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        
        parallaxImages.forEach(img => {
            // Adjust the multiplier to change the speed of parallax
            const val = scrolled * 0.15;
            img.style.transform = `translateY(${val}px)`;
        });
    });

    // 5. Form Submission Simulation
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = bookingForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            // Loading State
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Checking availability...';
            btn.disabled = true;
            
            // Simulate API request
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Table Reserved';
                btn.style.background = '#22c55e'; // Success Green
                btn.style.color = '#fff';
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    btn.style.color = '';
                    bookingForm.reset();
                }, 3000);
            }, 1500);
        });
    }
});
