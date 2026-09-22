document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate Starry Background
    // Helper function to create randomized box-shadows for a single pixel
    const generateStars = (n) => {
        let value = `${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
        for (let i = 2; i <= n; i++) {
            value += `, ${Math.floor(Math.random() * 2000)}px ${Math.floor(Math.random() * 2000)}px #FFF`;
        }
        return value;
    };

    // Create a dynamic stylesheet to append the generated star maps
    const style = document.createElement('style');
    style.innerHTML = `
        #stars {
            width: 1px;
            height: 1px;
            box-shadow: ${generateStars(700)};
            animation: animStar 50s linear infinite;
        }
        #stars::after {
            content: " ";
            position: absolute;
            top: 2000px;
            width: 1px;
            height: 1px;
            box-shadow: ${generateStars(700)};
        }
        
        #stars2 {
            width: 2px;
            height: 2px;
            box-shadow: ${generateStars(200)};
            animation: animStar 100s linear infinite;
        }
        #stars2::after {
            content: " ";
            position: absolute;
            top: 2000px;
            width: 2px;
            height: 2px;
            box-shadow: ${generateStars(200)};
        }
        
        #stars3 {
            width: 3px;
            height: 3px;
            box-shadow: ${generateStars(100)};
            animation: animStar 150s linear infinite;
        }
        #stars3::after {
            content: " ";
            position: absolute;
            top: 2000px;
            width: 3px;
            height: 3px;
            box-shadow: ${generateStars(100)};
        }
        
        @keyframes animStar {
            from { transform: translateY(0px); }
            to { transform: translateY(-2000px); }
        }
    `;
    document.head.appendChild(style);

    // 2. Scroll Reveal Logic using Intersection Observer
    // We want the story to appear paragraph by paragraph as the user scrolls
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px', // Trigger slightly before it hits the bottom
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Unobserve once it becomes visible so it doesn't animate out when scrolling up
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements that we want to reveal on scroll
    const elementsToReveal = document.querySelectorAll('p, .countdown, .explosion, blockquote, .inevitable');
    
    // Stagger the initial viewport elements slightly
    let delay = 0;
    elementsToReveal.forEach((el, index) => {
        // If it's near the top of the page, add a tiny stagger to the first few paragraphs
        if (index < 3) {
            el.style.transitionDelay = `${0.3 + (index * 0.2)}s`;
        }
        observer.observe(el);
    });
});
