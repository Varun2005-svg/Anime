// DOM Element References
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const yearSpan = document.getElementById('current-year');
const navLinks = document.querySelectorAll('.nav-menu a, .footer-section.links a');
const content = document.getElementById('content');

// Set current year in footer copyright
yearSpan.textContent = new Date().getFullYear();

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.querySelector('i').classList.toggle('fa-bars');
    menuToggle.querySelector('i').classList.toggle('fa-times');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.querySelector('i').classList.add('fa-bars');
        menuToggle.querySelector('i').classList.remove('fa-times');
    }
});

// Navigation handling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(item => {
            item.parentElement.classList.remove('active');
        });
        
        // Add active class to clicked link
        link.parentElement.classList.add('active');
        
        // Get the page to load
        const page = link.getAttribute('data-page');
        openPage(page);
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        }
    });
});

// Function to open page content via AJAX
function openPage(pageName) {
    // Show loading animation
    content.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i></div>';
    
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
    
    // Define what happens on successful data submission
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Delay content update slightly for smooth transition
            setTimeout(() => {
                content.innerHTML = xhr.responseText;
                
                // Initialize any dynamic content in the loaded page
                initializePageContent();
            }, 500);
        } else {
            content.innerHTML = `<div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h2>Oops! Something went wrong</h2>
                <p>We couldn't load the page. Please try again later.</p>
            </div>`;
        }
    };
    
    // Define what happens in case of error
    xhr.onerror = function() {
        content.innerHTML = `<div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Connection Error</h2>
            <p>We couldn't connect to the server. Please check your internet connection.</p>
        </div>`;
    };
    
    // Set up the request
    xhr.open('GET', 'pages/' + pageName + '.html', true);
    
    // Send the request
    xhr.send();
}

// Function to initialize dynamic content after page load
function initializePageContent() {
    // Anime slider functionality
    const sliders = document.querySelectorAll('.anime-slider');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2;
            slider.scrollLeft = scrollLeft - walk;
        });
    });
    
    // Initialize other interactive elements
    initAnimeCards();
}

// Function to add event listeners to anime cards
function initAnimeCards() {
    const animeCards = document.querySelectorAll('.anime-card');
    
    animeCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('watch-btn')) {
                e.preventDefault();
                openPage('anime-details');
            }
        });
    });
}

// Initialize the page when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show preloader
    document.body.innerHTML += '<div id="preloader"><div class="loader"></div></div>';
    
    // Hide preloader after page loads
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });
    
    // Initialize sliders and other interactive elements
    initializePageContent();
});

// Create periodic animations to highlight content
setInterval(() => {
    const featuredAnime = document.querySelectorAll('.anime-card');
    if (featuredAnime.length) {
        const randomIndex = Math.floor(Math.random() * featuredAnime.length);
        featuredAnime[randomIndex].classList.add('pulse');
        
        setTimeout(() => {
            featuredAnime[randomIndex].classList.remove('pulse');
        }, 1000);
    }
}, 5000);