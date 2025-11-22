// ===== NAVIGATION =====
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinksContainer = document.getElementById('navLinks');

    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });
    }

    // Page navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.dataset.page;

            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
                }
            });

            // Close mobile menu
            if (navLinksContainer) {
                navLinksContainer.classList.remove('active');
            }

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // CTA button - navigate to vision board
    const ctaBtn = document.getElementById('ctaBtn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const visionBoardLink = document.querySelector('[data-page="vision-board"]');
            if (visionBoardLink) visionBoardLink.click();
        });
    }
}

// ===== VISION BOARD =====
function initVisionBoard() {
    const visionBoard = document.getElementById('visionBoard');
    let itemCounter = 0;

    // Load saved items from localStorage
    loadSavedItems();

    // Add image
    document.getElementById('addImageBtn')?.addEventListener('click', () => {
        document.getElementById('imageUpload').click();
    });

    document.getElementById('imageUpload')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                addBoardItem('image', event.target.result, null, true);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    });

    // Add quote
    document.getElementById('addQuoteBtn')?.addEventListener('click', () => {
        const quote = prompt('Enter your inspirational quote:');
        if (quote && quote.trim()) {
            addBoardItem('quote', quote.trim(), null, true);
        }
    });

    // Add affirmation
    document.getElementById('addAffirmationBtn')?.addEventListener('click', () => {
        const affirmations = [
            "I am worthy of all my dreams",
            "I attract abundance in all forms",
            "Every day I grow stronger and wiser",
            "I am creating the life I love",
            "My potential is limitless",
            "I trust the journey of my life",
            "I am grateful for all that I have",
            "Success flows to me naturally"
        ];
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        addBoardItem('affirmation', randomAffirmation, null, true);
    });

    // Clear all items
    document.getElementById('clearBoardBtn')?.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear your entire vision board? This cannot be undone.')) {
            const userItems = visionBoard.querySelectorAll('.board-item[data-type]');
            userItems.forEach(item => item.remove());
            saveVisionBoard();
            alert('Vision board cleared! Your saved items have been deleted.');
        }
    });

    function addBoardItem(type, content, gradientClass = null, shouldSave = false) {
        const item = document.createElement('div');
        item.className = 'board-item';
        item.setAttribute('data-aos', 'fade-up');
        item.setAttribute('data-aos-delay', (itemCounter * 100).toString());
        item.setAttribute('data-type', type);
        item.setAttribute('data-content', content);

        const itemContent = document.createElement('div');
        itemContent.className = 'board-item-content';

        // Determine gradient for quotes/affirmations
        let selectedGradient = gradientClass;
        if (!selectedGradient && (type === 'quote' || type === 'affirmation')) {
            const gradients = ['', 'gradient-bg-1', 'gradient-bg-2'];
            selectedGradient = gradients[Math.floor(Math.random() * gradients.length)];
        }

        if (type === 'image') {
            const img = document.createElement('img');
            img.src = content;
            img.style.width = '100%';
            img.style.borderRadius = 'var(--radius-md)';
            itemContent.appendChild(img);
        } else if (type === 'quote') {
            itemContent.className += ' quote-item';
            if (selectedGradient) {
                itemContent.classList.add(selectedGradient);
                item.setAttribute('data-gradient', selectedGradient);
            }

            const quoteText = document.createElement('p');
            quoteText.className = 'quote-text';
            quoteText.textContent = `"${content}"`;
            itemContent.appendChild(quoteText);
        } else if (type === 'affirmation') {
            itemContent.className += ' affirmation-item';
            if (selectedGradient) {
                itemContent.classList.add(selectedGradient);
                item.setAttribute('data-gradient', selectedGradient);
            }

            const affirmationText = document.createElement('p');
            affirmationText.className = 'affirmation-text';
            affirmationText.textContent = content;

            const sparkle = document.createElement('div');
            sparkle.className = 'affirmation-sparkle';
            sparkle.textContent = '✨';

            itemContent.appendChild(affirmationText);
            itemContent.appendChild(sparkle);
        }

        // Add delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-board-item';
        deleteBtn.innerHTML = '×';
        deleteBtn.setAttribute('aria-label', 'Delete item');
        deleteBtn.addEventListener('click', () => {
            item.remove();
            saveVisionBoard();
        });
        itemContent.appendChild(deleteBtn);

        item.appendChild(itemContent);
        visionBoard.appendChild(item);

        // Trigger animation
        setTimeout(() => {
            item.classList.add('aos-animate');
        }, 100);

        itemCounter++;

        // Save to localStorage
        if (shouldSave) {
            saveVisionBoard();
        }
    }

    function saveVisionBoard() {
        const items = [];
        const boardItems = visionBoard.querySelectorAll('.board-item');

        boardItems.forEach(item => {
            const type = item.getAttribute('data-type');
            const content = item.getAttribute('data-content');
            const gradient = item.getAttribute('data-gradient') || '';

            if (type && content) {
                items.push({
                    type: type,
                    content: content,
                    gradient: gradient
                });
            }
        });

        localStorage.setItem('visionBoardItems', JSON.stringify(items));
        console.log('Vision board saved!', items.length + ' items');
    }

    function loadSavedItems() {
        const savedItems = localStorage.getItem('visionBoardItems');

        if (savedItems) {
            try {
                const items = JSON.parse(savedItems);
                console.log('Loading saved items:', items.length);

                // Clear existing user-added items (keep example items from HTML)
                const existingItems = visionBoard.querySelectorAll('.board-item[data-type]');
                existingItems.forEach(item => item.remove());

                // Add saved items
                items.forEach(itemData => {
                    addBoardItem(itemData.type, itemData.content, itemData.gradient, false);
                });
            } catch (e) {
                console.error('Error loading saved items:', e);
            }
        }
    }

    // Expose save function globally for manual saves
    window.saveVisionBoard = saveVisionBoard;
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('[data-aos]');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== PROGRESS BARS ANIMATION =====
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';

                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);

                observer.unobserve(progressBar);
            }
        });
    }, observerOptions);

    progressBars.forEach(bar => observer.observe(bar));
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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
}

// ===== HOVER EFFECTS =====
function initHoverEffects() {
    const cards = document.querySelectorAll('.value-card, .goal-card, .board-item-content');

    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

// ===== GOAL MODAL =====
function initGoalModal() {
    const goalModal = document.getElementById('goalModal');
    const goalModalOverlay = document.getElementById('goalModalOverlay');
    const goalModalClose = document.getElementById('goalModalClose');
    const goalModalCancel = document.getElementById('goalModalCancel');
    const goalModalSave = document.getElementById('goalModalSave');
    const goalModalTitle = document.getElementById('goalModalTitle');
    const goalModalDeadline = document.getElementById('goalModalDeadline');
    const goalModalNotes = document.getElementById('goalModalNotes');
    
    let currentGoalId = null;

    // Get goal card data
    function getGoalCardData(goalCard) {
        const goalId = goalCard.getAttribute('data-goal-id');
        const title = goalCard.querySelector('.goal-title')?.textContent || '';
        const deadline = goalCard.querySelector('.goal-deadline')?.textContent || '';
        return { goalId, title, deadline };
    }

    // Open modal
    function openModal(goalCard) {
        const { goalId, title, deadline } = getGoalCardData(goalCard);
        currentGoalId = goalId;
        
        goalModalTitle.textContent = title;
        goalModalDeadline.textContent = deadline;
        
        // Load saved notes
        const savedNotes = loadGoalNotes(goalId);
        goalModalNotes.value = savedNotes || '';
        
        goalModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus on textarea after animation
        setTimeout(() => {
            goalModalNotes.focus();
        }, 300);
    }

    // Close modal
    function closeModal() {
        goalModal.classList.remove('active');
        document.body.style.overflow = '';
        currentGoalId = null;
        goalModalNotes.value = '';
    }

    // Save notes to localStorage
    function saveGoalNotes(goalId, notes) {
        const goalData = {
            notes: notes,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`goal_${goalId}`, JSON.stringify(goalData));
        console.log(`Saved notes for goal: ${goalId}`);
    }

    // Load notes from localStorage
    function loadGoalNotes(goalId) {
        const savedData = localStorage.getItem(`goal_${goalId}`);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                return data.notes || '';
            } catch (e) {
                console.error('Error loading goal notes:', e);
                return '';
            }
        }
        return '';
    }

    // Make all goal cards clickable
    const goalCards = document.querySelectorAll('.goal-card[data-goal-id]');
    goalCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't open modal if clicking on buttons or interactive elements
            if (e.target.closest('button')) {
                return;
            }
            openModal(card);
        });
    });

    // Close modal handlers
    if (goalModalClose) {
        goalModalClose.addEventListener('click', closeModal);
    }

    if (goalModalCancel) {
        goalModalCancel.addEventListener('click', closeModal);
    }

    if (goalModalOverlay) {
        goalModalOverlay.addEventListener('click', closeModal);
    }

    // Save button handler
    if (goalModalSave) {
        goalModalSave.addEventListener('click', () => {
            if (currentGoalId) {
                const notes = goalModalNotes.value.trim();
                saveGoalNotes(currentGoalId, notes);
                
                // Show save confirmation
                const originalText = goalModalSave.innerHTML;
                goalModalSave.innerHTML = '<span>✓</span><span>Saved!</span>';
                goalModalSave.style.background = 'var(--gradient-secondary)';
                
                setTimeout(() => {
                    goalModalSave.innerHTML = originalText;
                    goalModalSave.style.background = '';
                }, 1500);
                
                // Close modal after short delay
                setTimeout(() => {
                    closeModal();
                }, 1500);
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && goalModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Prevent modal content clicks from closing modal
    const modalContent = goalModal.querySelector('.goal-modal-content');
    if (modalContent) {
        modalContent.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// ===== INITIALIZE ON DOM LOAD =====
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initVisionBoard();
    initScrollAnimations();
    initProgressBars();
    initSmoothScroll();
    initHoverEffects();
    initGoalModal();

    // Trigger initial animations
    setTimeout(() => {
        const initialElements = document.querySelectorAll('.page.active [data-aos]');
        initialElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, index * 100);
        });
    }, 200);
});

// ===== PAGE VISIBILITY CHANGE =====
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Re-trigger animations when page becomes visible
        const visibleElements = document.querySelectorAll('.page.active [data-aos]');
        visibleElements.forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('aos-animate');
            }
        });
    }
});
