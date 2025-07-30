/**
 * Utility functions for animations and UI effects
 */

/**
 * Adds scroll effect to the navigation bar
 * Call this function in your component's useEffect hook
 */
export const initNavbarScrollEffect = () => {
  const handleScroll = () => {
    const navbar = document.querySelector('.nav-bar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  
  // Clean up event listener
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

/**
 * Adds animation to elements when they come into view
 * Call this function in your component's useEffect hook
 * @param {string} selector - CSS selector for elements to animate
 * @param {string} animationClass - CSS class to add for animation
 */
export const initScrollAnimations = (selector = '.animate-on-scroll', animationClass = 'animated') => {
  const elements = document.querySelectorAll(selector);
  
  const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  };
  
  const observer = new IntersectionObserver(handleIntersection, {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
  
  // Clean up observer
  return () => {
    elements.forEach(element => {
      observer.unobserve(element);
    });
  };
};

/**
 * Adds hover effect to cards
 * Call this function in your component's useEffect hook
 * @param {string} selector - CSS selector for card elements
 */
export const initCardHoverEffects = (selector = '.feature-card, .lead-card') => {
  const cards = document.querySelectorAll(selector);
  
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
  };
  
  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = '';
  };
  
  cards.forEach(card => {
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
  });
  
  // Clean up event listeners
  return () => {
    cards.forEach(card => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    });
  };
};
