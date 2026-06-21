// ================================================================
// FILE: script.js - Consolidated JavaScript for The Glenwood Bakery
// AUTHOR: Samkelo Xaba
// STUDENT #: ST10537795
// PURPOSE: All interactive functionality for the website
// ================================================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================================
    // 1. TABS (index.html)
    // ============================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const target = this.dataset.tab;
                tabContents.forEach(c => c.classList.remove('active'));
                document.getElementById(target).classList.add('active');
            });
        });
    }

    // ============================================================
    // 2. ACCORDION (about.html)
    // ============================================================
    document.addEventListener('click', function(e) {
        const header = e.target.closest('.accordion-header');
        if (header) {
            header.classList.toggle('active');
            const body = header.nextElementSibling;
            if (body) body.classList.toggle('open');
        }
    });

    // ============================================================
    // 3. LIGHTBOX (shared across index, menu, gallery)
    // ============================================================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('closeLightbox');

    function openLightbox(src) {
        if (lightbox && lightboxImg) {
            lightboxImg.src = src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightboxFunc() {
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (closeLightbox) {
        closeLightbox.addEventListener('click', closeLightboxFunc);
    }
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === this) closeLightboxFunc();
        });
    }
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeLightboxFunc();
    });

    // Bind lightbox to gallery images (index, gallery, menu)
    document.querySelectorAll('.gallery-item img, .menu-item-card img').forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openLightbox(this.src);
        });
    });

    // ============================================================
    // 4. MAP (index.html)
    // ============================================================
    if (typeof L !== 'undefined' && document.getElementById('map')) {
        const map = L.map('map').setView([-29.8587, 30.9953], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
        L.marker([-29.8587, 30.9953]).addTo(map)
            .bindPopup('The Glenwood Bakery<br>396 Esther Roberts Road')
            .openPopup();
    }

    // ============================================================
    // 5. DYNAMIC PRODUCTS & SEARCH (index.html)
    // ============================================================
    const searchInput = document.getElementById('searchInput');
    const productList = document.getElementById('productList');
    if (productList && searchInput) {
        const products = [
            { name: 'Butter Croissant', price: 'R14', img: 'images/croissant.jpg' },
            { name: 'Almond Croissant', price: 'R18', img: 'images/croissant.jpg' },
            { name: 'Chocolate Croissant', price: 'R16', img: 'images/croissant.jpg' },
            { name: 'Vanilla Slice', price: 'R12', img: 'images/cake.jpg' },
            { name: 'Red Velvet Cake', price: 'R25', img: 'images/cake.jpg' },
            { name: 'Caramel Latte', price: 'R23', img: 'images/drinks.jpg' },
            { name: 'Fresh Orange Juice', price: 'R20', img: 'images/drinks.jpg' },
        ];

        function renderProducts(filter = '') {
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(filter.toLowerCase())
            );
            productList.innerHTML = '';
            if (filtered.length === 0) {
                productList.innerHTML = '<p style="text-align:center; grid-column:1/-1;">No products found.</p>';
                return;
            }
            filtered.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="${p.img}" alt="${p.name}" loading="lazy">
                    <h4>${p.name}</h4>
                    <p style="color:#C68E4A; font-weight:bold;">${p.price}</p>
                `;
                productList.appendChild(card);
            });
        }

        renderProducts();
        searchInput.addEventListener('input', function() {
            renderProducts(this.value);
        });
    }

    // ============================================================
    // 6. MENU SEARCH / FILTER (menu.html)
    // ============================================================
    const menuSearch = document.getElementById('menuSearch');
    if (menuSearch) {
        const menuCards = document.querySelectorAll('.menu-item-card');
        const noResults = document.getElementById('noResults');
        const categorySections = document.querySelectorAll('.menu-category');

        function filterMenu() {
            const query = menuSearch.value.toLowerCase().trim();
            let anyVisible = false;

            menuCards.forEach(card => {
                const name = card.querySelector('h4')?.textContent?.toLowerCase() || '';
                const desc = card.querySelector('.description')?.textContent?.toLowerCase() || '';
                const price = card.querySelector('.price')?.textContent?.toLowerCase() || '';
                const combined = name + ' ' + desc + ' ' + price;
                const matches = query === '' || combined.includes(query);
                card.style.display = matches ? 'block' : 'none';
                if (matches) anyVisible = true;
            });

            categorySections.forEach(section => {
                const grid = section.querySelector('.menu-grid');
                const visibleCards = grid.querySelectorAll('.menu-item-card[style*="display: block"]');
                const h3 = section.querySelector('h3');
                if (visibleCards.length === 0 && query !== '') {
                    h3.style.display = 'none';
                } else {
                    h3.style.display = 'inline-block';
                }
            });

            if (noResults) {
                noResults.style.display = (anyVisible || query === '') ? 'none' : 'block';
            }
        }

        menuSearch.addEventListener('input', filterMenu);
    }

    // ============================================================
    // 7. GALLERY FILTER (gallery.html)
    // ============================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (filterBtns.length && galleryItems.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filter = this.dataset.filter;

                galleryItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // ============================================================
    // 8. CONTACT FORM (contact.html)
    // ============================================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.querySelectorAll('.error').forEach(el => el.textContent = '');
            document.getElementById('formStatus').textContent = '';

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const msgType = document.getElementById('msgType').value;
            const message = document.getElementById('message').value.trim();

            let isValid = true;

            if (name.length < 2) {
                document.getElementById('nameError').textContent = 'Name must be at least 2 characters.';
                isValid = false;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                document.getElementById('emailError').textContent = 'Please enter a valid email address.';
                isValid = false;
            }
            if (phone.length > 0) {
                const phonePattern = /^(\+27|0)[6-8][0-9]{8}$/;
                if (!phonePattern.test(phone.replace(/\s/g, ''))) {
                    document.getElementById('phoneError').textContent = 'Enter a valid SA phone number (e.g. 0821234567).';
                    isValid = false;
                }
            }
            if (!msgType) {
                document.getElementById('msgTypeError').textContent = 'Please select a message type.';
                isValid = false;
            }
            if (message.length < 10) {
                document.getElementById('messageError').textContent = 'Message must be at least 10 characters.';
                isValid = false;
            }

            if (!isValid) return;

            const subject = encodeURIComponent(`Contact from ${name} - ${msgType}`);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage Type: ${msgType}\n\nMessage:\n${message}`);
            window.location.href = `mailto:info@glenwoodbakery.co.za?subject=${subject}&body=${body}`;
            document.getElementById('formStatus').textContent = '✅ Your message has been sent (check your email client).';
        });
    }

});
