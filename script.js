// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
});

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Hero Canvas Animation with Three.js
const initHeroCanvas = () => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 200;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        // Position
        posArray[i] = (Math.random() - 0.5) * 20;
        posArray[i + 1] = (Math.random() - 0.5) * 20;
        posArray[i + 2] = (Math.random() - 0.5) * 20;

        // Colors (mix of pink, purple, and cyan)
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
            // Pink
            colorArray[i] = 1;
            colorArray[i + 1] = 0.2;
            colorArray[i + 2] = 0.4;
        } else if (colorChoice < 0.66) {
            // Purple
            colorArray[i] = 0.42;
            colorArray[i + 1] = 0.36;
            colorArray[i + 2] = 0.9;
        } else {
            // Cyan
            colorArray[i] = 0;
            colorArray[i + 1] = 0.83;
            colorArray[i + 2] = 1;
        }
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create connecting lines
    const linesGeometry = new THREE.BufferGeometry();
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0xff3366,
        transparent: true,
        opacity: 0.1
    });

    camera.position.z = 5;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) / 100;
        mouseY = (event.clientY - windowHalfY) / 100;
    });

    // Animation loop
    const clock = new THREE.Clock();

    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        // Smooth camera movement
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        particlesMesh.rotation.y += 0.001;
        particlesMesh.rotation.x += 0.0005;

        // Add wave effect to particles
        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += Math.sin(elapsedTime * 0.5 + positions[i3] * 0.5) * 0.002;
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// GSAP Scroll Animations
const initScrollAnimations = () => {
    // Hero parallax
    gsap.to('.hero-title', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 200,
        opacity: 0
    });

    gsap.to('.hero-subtitle', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 150,
        opacity: 0
    });

    gsap.to('.hero-stats', {
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        },
        y: 100,
        opacity: 0
    });

    // Feature cards animation
    const isMobile = window.innerWidth <= 768;
    gsap.from('.feature-card', {
        scrollTrigger: {
            trigger: '.features',
            start: 'top 80%',
            end: 'center center',
            scrub: isMobile ? false : 1,
            toggleActions: isMobile ? 'play none none reverse' : undefined
        },
        y: 100,
        opacity: 0,
        stagger: 0.2,
        rotateX: isMobile ? 0 : 45,
        duration: isMobile ? 0.8 : undefined
    });

    // Product showcase animation
    gsap.from('.product-model', {
        scrollTrigger: {
            trigger: '.product-showcase',
            start: 'top 80%',
            end: 'center center',
            scrub: 1
        },
        x: -200,
        opacity: 0,
        rotateY: -45
    });

    gsap.from('.specs-content', {
        scrollTrigger: {
            trigger: '.product-showcase',
            start: 'top 80%',
            end: 'center center',
            scrub: 1
        },
        x: 200,
        opacity: 0
    });

    // Spec items stagger
    gsap.from('.spec-item', {
        scrollTrigger: {
            trigger: '.specs-list',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        x: 50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power2.out'
    });

    // Gallery parallax
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        const speed = item.dataset.speed || 0.5;
        gsap.to(item, {
            scrollTrigger: {
                trigger: '.gallery',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1
            },
            y: -100 * speed,
            ease: 'none'
        });
    });

    gsap.from('.gallery-card', {
        scrollTrigger: {
            trigger: '.gallery',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });

    // CTA section animation
    gsap.from('.cta-content h2', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power2.out'
    });

    gsap.from('.cta-price', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 70%',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        ease: 'power2.out'
    });

    gsap.from('.cta-button', {
        scrollTrigger: {
            trigger: '.cta-section',
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.6,
        delay: 0.4,
        ease: 'back.out(1.7)'
    });
};

// 3D Tilt Effect for Cards
const initTiltEffect = () => {
    const cards = document.querySelectorAll('[data-tilt]');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            const card3d = card.querySelector('.card-3d');
            if (card3d) {
                card3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            const card3d = card.querySelector('.card-3d');
            if (card3d) {
                card3d.style.transform = 'rotateX(0) rotateY(0)';
            }
        });
    });
};

// Navbar scroll effect
const initNavbarEffect = () => {
    const navbar = document.querySelector('.navbar');
    const isMobile = () => window.innerWidth <= 768;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            // Don't change padding on mobile - let CSS handle it
            if (!isMobile()) {
                navbar.style.padding = '1rem 4rem';
            }
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            // Don't change padding on mobile - let CSS handle it
            if (!isMobile()) {
                navbar.style.padding = '1.5rem 4rem';
            }
        }
    });
};

// Smooth scroll for anchor links
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
};

// Product model 3D rotation on scroll
const initProductRotation = () => {
    const productModel = document.querySelector('.product-model');
    if (!productModel) return;

    gsap.to(productModel, {
        scrollTrigger: {
            trigger: '.product-showcase',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        rotateY: 360,
        ease: 'none'
    });
};

// Text scramble effect for hero title
const initTextScramble = () => {
    const titleLines = document.querySelectorAll('.title-line');
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = chars;
            this.update = this.update.bind(this);
        }
        
        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];
            
            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        
        update() {
            let output = '';
            let complete = 0;
            
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }
            
            this.el.innerHTML = output;
            
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Apply scramble effect on load
    titleLines.forEach((line, index) => {
        const fx = new TextScramble(line);
        const originalText = line.innerText;
        
        setTimeout(() => {
            fx.setText(originalText);
        }, index * 500);
    });
};

// Magnetic button effect
const initMagneticButtons = () => {
    const buttons = document.querySelectorAll('.cta-button, .hero-cta');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
};

// Back to Top Button
const initBackToTop = () => {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Smooth scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initScrollAnimations();
    initTiltEffect();
    initNavbarEffect();
    initSmoothScroll();
    initProductRotation();
    initTextScramble();
    initMagneticButtons();
    initBackToTop();
});

// Handle visibility change for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause expensive animations when tab is hidden
        gsap.globalTimeline.pause();
    } else {
        gsap.globalTimeline.resume();
    }
});