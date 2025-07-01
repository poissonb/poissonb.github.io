// Configuration des compétences prioritaires par profil
const skillsConfig = {
    'chef-projet': {
        name: 'Chef de projet cybersécurité',
        priorities: ['cybersécurité opérationnelle', 'gestion de projet', 'administration système', 'programmation']
    },
    'consultant-grc': {
        name: 'Consultant GRC',
        priorities: ['gouvernance', 'intelligence artificielle', 'gestion de projet']
    },
    'rssi': {
        name: 'RSSI',
        priorities: ['gouvernance', 'cybersécurité opérationnelle', 'gestion de projet', 'administration système']
    }
};

// Variables globales pour le layout
let layoutTimeout;

// Fonction de layout des colonnes
function layoutColumns() {
    if (window.innerWidth >= 1600) {
        const container = document.querySelector('.layout-flexible');
        if (!container) return;
        
        const leftElements = ['.propos', '.experiences', '.qualites', '.langues'];
        const rightElements = ['.formations', '.competences', '.certifications', '.interets'];
        
        let leftY = 0;
        let rightY = 0;
        const gap = 40;
        
        // Positionne colonne gauche
        leftElements.forEach(selector => {
            const element = container.querySelector(selector);
            if (element) {
                element.style.position = 'absolute';
                element.style.left = '0';
                element.style.width = 'calc(50% - 20px)';
                element.style.top = leftY + 'px';
                leftY += element.offsetHeight + gap;
            }
        });
        
        // Positionne colonne droite  
        rightElements.forEach(selector => {
            const element = container.querySelector(selector);
            if (element) {
                element.style.position = 'absolute';
                element.style.right = '0';
                element.style.width = 'calc(50% - 20px)';
                element.style.top = rightY + 'px';
                rightY += element.offsetHeight + gap;
            }
        });
        
        container.style.height = Math.max(leftY - gap, rightY - gap) + 'px';
        container.style.position = 'relative';
    } else {
        // Reset pour mobile
        const container = document.querySelector('.layout-flexible');
        if (container) {
            const articles = container.querySelectorAll('article');
            articles.forEach(article => {
                article.style.position = '';
                article.style.top = '';
                article.style.left = '';
                article.style.right = '';
                article.style.width = '';
            });
            container.style.height = '';
            container.style.position = '';
        }
    }
}

// Layout avec débounce pour éviter trop de recalculs
function debouncedLayoutColumns() {
    clearTimeout(layoutTimeout);
    layoutTimeout = setTimeout(() => {
        layoutColumns();
    }, 50);
}

// Fonction pour plier/déplier les sections
function toggleSection(header) {
    const content = header.parentElement.parentElement.querySelector('.section-content');
    const icon = header.querySelector('.collapse-icon');
    
    if (content.classList.contains('collapsed')) {
        content.classList.remove('collapsed');
        icon.classList.remove('rotated');
    } else {
        content.classList.add('collapsed');
        icon.classList.add('rotated');
    }
    
    // Recalculer le layout après le changement - Plus rapide avec requestAnimationFrame
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            layoutColumns();
        });
    });
}

// Initialisation des sections pliables
function initCollapsibleSections() {
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
        header.addEventListener('click', function(e) {
            e.preventDefault();
            toggleSection(this);
        });
    });
}

// Fonction pour plier/déplier toutes les sections
function toggleAllSections(collapse = true) {
    const contents = document.querySelectorAll('.section-content');
    const icons = document.querySelectorAll('.collapse-icon');
    
    contents.forEach(content => {
        if (collapse) {
            content.classList.add('collapsed');
        } else {
            content.classList.remove('collapsed');
        }
    });
    
    icons.forEach(icon => {
        if (collapse) {
            icon.classList.add('rotated');
        } else {
            icon.classList.remove('rotated');
        }
    });
    
    // Recalculer le layout après le changement - Plus rapide
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            layoutColumns();
        });
    });
}

// Fonction pour réorganiser les compétences selon le profil métier
function filterSkills(profile) {
    const categories = document.querySelectorAll('.competence-category');
    const buttons = document.querySelectorAll('.filter-btn');
    const container = document.getElementById('competences-content');
    
    // Mise à jour des boutons
    buttons.forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.querySelector(`[data-profile="${profile}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // S'assurer que TOUTES les catégories sont visibles
    categories.forEach(category => {
        category.style.display = 'block';
        category.classList.remove('priority');
        // Réinitialiser les styles au cas où
        category.style.opacity = '1';
        category.style.transform = 'translateY(0)';
    });
    
    if (profile === 'all') {
        // Affichage par ordre original - TOUTES LES COMPETENCES VISIBLES
        const sortedCategories = Array.from(categories).sort((a, b) => {
            const priorityA = parseInt(a.getAttribute('data-priority-all')) || 999;
            const priorityB = parseInt(b.getAttribute('data-priority-all')) || 999;
            return priorityA - priorityB;
        });
        
        // Réorganiser les éléments
        sortedCategories.forEach(category => {
            container.appendChild(category);
        });
    } else {
        // Trier par priorité pour le profil sélectionné mais GARDER TOUTES LES COMPETENCES VISIBLES
        const sortedCategories = Array.from(categories).sort((a, b) => {
            const priorityA = parseInt(a.getAttribute(`data-priority-${profile}`)) || 999;
            const priorityB = parseInt(b.getAttribute(`data-priority-${profile}`)) || 999;
            return priorityA - priorityB;
        });
        
        // Ajouter la classe priority aux compétences importantes pour ce profil
        categories.forEach(category => {
            const priority = parseInt(category.getAttribute(`data-priority-${profile}`));
            
            // Mettre en évidence les 3 premières compétences pour ce profil
            if (priority && priority <= 3) {
                category.classList.add('priority');
            }
        });
        
        // Réorganiser les éléments
        sortedCategories.forEach(category => {
            container.appendChild(category);
        });
    }
    
    // Animation de réorganisation
    if (container) {
        container.style.opacity = '0.7';
        setTimeout(() => {
            container.style.opacity = '1';
            // Recalculer le layout après le filtre - Plus rapide
            requestAnimationFrame(() => {
                layoutColumns();
            });
        }, 150);
    }
}

// Fonction pour le smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const header = document.querySelector('.header');
                const alertMsg = document.querySelector('.alert-message');
                const headerHeight = header ? header.offsetHeight : 0;
                const alertHeight = alertMsg ? alertMsg.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - alertHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Fonction pour détecter si un élément est visible
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

// Animation d'apparition au scroll
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.certification-item:not(.animated), .interet-item:not(.animated), .qualite-item:not(.animated), .langue-item:not(.animated)');
    elements.forEach(element => {
        if (isInViewport(element)) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.classList.add('animated');
        }
    });
}

// Gestion responsive du menu
function handleResponsiveMenu() {
    if (window.innerWidth <= 768) {
        const headerMenu = document.querySelector('.header-menu');
        if (headerMenu) {
            headerMenu.style.flexWrap = 'wrap';
        }
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation...');
    
    // Initialiser les sections pliables
    initCollapsibleSections();
    
    // S'assurer que toutes les sections sont ouvertes au démarrage
    const allSections = document.querySelectorAll('.section-content');
    allSections.forEach(section => {
        section.classList.remove('collapsed');
        section.style.maxHeight = 'none';
        section.style.overflow = 'visible';
        section.style.opacity = '1';
    });
    
    const allIcons = document.querySelectorAll('.collapse-icon');
    allIcons.forEach(icon => {
        icon.classList.remove('rotated');
    });
    
    // Initialiser le smooth scrolling
    initSmoothScrolling();
    
    // Initialiser les animations pour certains éléments
    const animatedElements = document.querySelectorAll('.certification-item, .interet-item, .qualite-item, .langue-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
    
    // Déclencher l'animation initiale
    handleScrollAnimation();
    
    // Gestion responsive initiale
    handleResponsiveMenu();
    
    // Ajouter les event listeners aux boutons de filtre
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const profile = this.getAttribute('data-profile');
            filterSkills(profile);
        });
    });
    
    // S'assurer que toutes les compétences sont visibles au chargement
    const categories = document.querySelectorAll('.competence-category');
    categories.forEach(category => {
        category.style.display = 'block';
        category.style.opacity = '1';
        category.style.transform = 'translateY(0)';
        category.style.overflow = 'visible';
        category.style.maxHeight = 'none';
    });
    
    // NOUVEAU : Initialiser le layout des colonnes
    setTimeout(() => {
        layoutColumns();
        console.log('Layout colonnes initialisé');
    }, 100);
    
    // NOUVEAU : Observer les changements de taille des éléments
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(entries => {
            debouncedLayoutColumns();
        });
        
        // Observer le container principal
        const container = document.querySelector('.layout-flexible');
        if (container) {
            resizeObserver.observe(container);
        }
    }
});

// Event listeners pour la responsive
window.addEventListener('resize', function() {
    handleResponsiveMenu();
    debouncedLayoutColumns();
});

// Throttle pour optimiser les performances du scroll
let scrollTicking = false;
window.addEventListener('scroll', function() {
    if (!scrollTicking) {
        requestAnimationFrame(function() {
            handleScrollAnimation();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// Event listener pour le chargement complet (images, etc.)
window.addEventListener('load', function() {
    console.log('Page complètement chargée, recalcul layout...');
    setTimeout(() => {
        layoutColumns();
    }, 100);
});

// Export des fonctions pour utilisation externe
window.CVApp = {
    filterSkills: filterSkills,
    skillsConfig: skillsConfig,
    toggleSection: toggleSection,
    toggleAllSections: toggleAllSections,
    layoutColumns: layoutColumns,
    debouncedLayoutColumns: debouncedLayoutColumns
};

console.log('Script CV chargé avec succès !');