// TODO: Paste your Firebase Config here!
const firebaseConfig = {
  apiKey: "AIzaSyCOFRuPFoWkFIv4z9VbNXVaZixddkFIB_I",
  authDomain: "incognitohacks-26e88.firebaseapp.com",
  projectId: "incognitohacks-26e88",
  storageBucket: "incognitohacks-26e88.firebasestorage.app",
  messagingSenderId: "639077213400",
  appId: "1:639077213400:web:a315105c184da076bee3ad"
};

// Initialize Firebase using Compat SDK
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Deployed Google Sheets Web App URL for https://docs.google.com/spreadsheets/d/1EgvSjLOkqPWTlrvCOB6r6ikdnh0qmynRNH278Y8qpNU/edit?usp=sharing
const GOOGLE_SHEETS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyBGKNVL_SINW5m_vNq-jQhfjURk1LYtBze9L3u0ita-uE0UQYDvTMdmcrlAOhrSaQl/exec";

let auth = null;
let provider = null;

// Firebase Auth has cross-origin limitations under the local file:// protocol. 
// We initialize it conditionally to completely eliminate iframe and postMessage console errors during local file testing.
if (window.location.protocol.startsWith('http')) {
    auth = firebase.auth();
    provider = new firebase.auth.GoogleAuthProvider();
} else {
    console.warn("INCOGNITO: Bypassing Firebase Auth under local file:// protocol. Use a local HTTP/HTTPS server for authentication features.");
    auth = {
        currentUser: null,
        onAuthStateChanged: (callback) => callback(null),
        signInWithPopup: () => Promise.reject(new Error("Firebase Auth is disabled under local file:// protocol.")),
        signOut: () => Promise.resolve()
    };
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Boot Loader Sequence ---
    document.body.classList.add('loading');
    const loaderWrapper = document.getElementById('loader-wrapper');
    const loaderText = document.getElementById('loader-text');
    const loaderLine = document.getElementById('loader-line');
    const loaderCounter = document.getElementById('loader-counter');
    const finalWord = "INCOGNITO";
    const symbols = ['@', '#', '&', '*', 'X'];

    // Phase 1: 0 - 800ms
    loaderLine.style.transition = 'width 0.8s cubic-bezier(0.075, 0.82, 0.165, 1)';
    requestAnimationFrame(() => {
        loaderLine.style.width = '100px';
    });

    // Phase 2: 800 - 2200ms (Duration: 1400ms)
    setTimeout(() => {
        loaderText.style.opacity = '1';
        loaderCounter.style.opacity = '1';
        
        let iterations = 0;
        const maxIterations = 60; // roughly for 1400ms at 60 frames per sec
        
        const shuffleInterval = setInterval(() => {
            loaderText.innerText = finalWord.split('').map((letter, index) => {
                if (index < (iterations / maxIterations) * finalWord.length) {
                    return letter;
                }
                return symbols[Math.floor(Math.random() * symbols.length)];
            }).join('');
            
            iterations++;
            if (iterations >= maxIterations) {
                clearInterval(shuffleInterval);
                loaderText.innerText = finalWord;
            }
        }, 1400 / maxIterations);
        
        let startTime = null;
        function updateCounter(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / 1400;
            
            if (progress < 1) {
                let currentNum;
                if (progress < 0.8) {
                    // Starts fast, reaches 80% quickly
                    let p = progress / 0.8;
                    currentNum = Math.floor((p * (2 - p)) * 80);
                } else if (progress < 0.95) {
                    // Slows down drastically, trickling from 80 to 99
                    let p = (progress - 0.8) / 0.15;
                    currentNum = 80 + Math.floor(p * 19);
                } else {
                    // Snaps to 100 at the very end
                    currentNum = 100;
                }
                loaderCounter.innerText = currentNum.toString().padStart(2, '0');
                requestAnimationFrame(updateCounter);
            } else {
                loaderCounter.innerText = '100';
            }
        }
        requestAnimationFrame(updateCounter);
    }, 800);

    // Phase 3: 2200 - 2800ms
    setTimeout(() => {
        loaderWrapper.classList.add('loader-glow');
        loaderWrapper.classList.add('loader-vibrate');
        setTimeout(() => {
            loaderWrapper.classList.remove('loader-vibrate');
        }, 200);
    }, 2200);

    // Phase 4: 2800 - 3500ms
    setTimeout(() => {
        loaderWrapper.classList.remove('loader-vibrate');
        loaderWrapper.classList.add('loader-split');
        document.getElementById('loader-content').style.opacity = '0';
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
        
        // Trigger Entry Sequence for Hero
        const textContainer = document.getElementById('video-text-container');
        const heroContent = document.querySelector('.hero-content');
        if (textContainer) textContainer.classList.add('active');
        if (heroContent) heroContent.classList.add('active');

        // Start videos
        const bgVideo = document.getElementById('bg-video');
        const fgVideo = document.getElementById('fg-video');
        if (bgVideo) { bgVideo.playbackRate = 0.75; bgVideo.play(); }
        if (fgVideo) { fgVideo.playbackRate = 0.75; fgVideo.play(); }
    }, 2800);

    // Cleanup
    setTimeout(() => {
        if(loaderWrapper) loaderWrapper.remove();
    }, 3500);

    // 1. Custom Cursor Glow
    const cursor = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Add glow effect on interactive elements
    const interactables = document.querySelectorAll('a, button, .service-card, .stack-card, .tech-item, .team-member, label');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '400px';
            cursor.style.height = '400px';
            cursor.style.opacity = '0.8';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '300px';
            cursor.style.height = '300px';
            cursor.style.opacity = '0.6';
        });
    });

    // 2. Video Parallax & Speed adjustment
    const hero = document.getElementById('hero');
    const bgVideo = document.getElementById('bg-video');
    const fgVideo = document.getElementById('fg-video');
    
    if (bgVideo && fgVideo) {
        bgVideo.playbackRate = 0.75;
        fgVideo.playbackRate = 0.75;
        
        hero.addEventListener('mousemove', (e) => {
            const xAxis = (window.innerWidth / 2 - e.pageX) / 50; // max ~10px
            const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
            
            // Background shifts opposite direction
            bgVideo.style.transform = `translate(calc(-50% + ${xAxis}px), calc(-50% + ${yAxis}px))`;
            
            // Foreground shifts slightly faster
            fgVideo.style.transform = `translate(calc(-50% + ${xAxis * 2}px), calc(-50% + ${yAxis * 2}px))`;
        });

        hero.addEventListener('mouseleave', () => {
            bgVideo.style.transform = `translate(-50%, -50%)`;
            fgVideo.style.transform = `translate(-50%, -50%)`;
            bgVideo.style.transition = 'transform 0.5s ease';
            fgVideo.style.transition = 'transform 0.5s ease';
        });
        
        hero.addEventListener('mouseenter', () => {
            bgVideo.style.transition = 'none';
            fgVideo.style.transition = 'none';
        });
    }

    // 2.5 Service Menu V2 - Scroll Reveal & Hover Video
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, { threshold: 0.15 });

    const maskElements = document.querySelectorAll('.service-column, .bento-header');
    maskElements.forEach(el => revealObserver.observe(el));
    
    // Play video on hover + 3D Tilt Effect
    const serviceColumns = document.querySelectorAll('.service-column');
    serviceColumns.forEach(col => {
        const vid = col.querySelector('video');

        // Inject glare element
        const glare = document.createElement('div');
        glare.classList.add('card-glare');
        col.appendChild(glare);

        col.addEventListener('mouseenter', () => {
            if(vid) vid.play();
            col.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        });

        col.addEventListener('mousemove', (e) => {
            const rect = col.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const maxTilt = 12;
            const rotY =  (dx / (rect.width  / 2)) * maxTilt;
            const rotX = -(dy / (rect.height / 2)) * maxTilt;

            col.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.03,1.03,1.03)`;
            col.style.boxShadow = `${-rotY * 1.5}px ${rotX * 1.5}px 40px rgba(0,240,255,0.18), 0 0 60px rgba(112,0,255,0.1)`;

            // Move glare highlight
            const glareX = ((e.clientX - rect.left) / rect.width)  * 100;
            const glareY = ((e.clientY - rect.top)  / rect.height) * 100;
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 60%)`;
            glare.style.opacity = '1';
        });

        col.addEventListener('mouseleave', () => {
            if(vid) vid.pause();
            col.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s ease';
            col.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
            col.style.boxShadow = '';
            glare.style.opacity = '0';
        });
    });

    // --- Magnetic Button Effect ---
    const magneticBtns = document.querySelectorAll('.btn-initiate, .btn-glow, .btn-primary');
    const MAGNETIC_RADIUS = 90;  // px — distance at which pull starts
    const MAGNETIC_STRENGTH = 0.45; // 0 = no pull, 1 = cursor position

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            btn.style.transform = `translate(${dx * MAGNETIC_STRENGTH}px, ${dy * MAGNETIC_STRENGTH}px)`;
            btn.style.transition = 'transform 0.1s ease';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
            btn.style.transition = 'transform 0.6s cubic-bezier(0.23,1,0.32,1)';
        });
    });
    // 3.5 The Protocol Scroll Timeline
    const timelineContainer = document.querySelector('.timeline-container');
    const timelineProgress = document.getElementById('timeline-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineWheel = document.getElementById('timeline-wheel');
    
    if (timelineContainer && timelineProgress) {
        const handleTimelineScroll = () => {
            const containerRect = timelineContainer.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Compute progress based on viewport position
            const totalScrollable = containerRect.height;
            const currentScrolled = windowHeight * 0.7 - containerRect.top;
            
            let scrollPercent = currentScrolled / (totalScrollable * 0.8);
            if (scrollPercent < 0) scrollPercent = 0;
            if (scrollPercent > 1) scrollPercent = 1;
            
            timelineProgress.style.height = (scrollPercent * 100) + '%';
            
            if (timelineWheel) {
                const wheelTop = scrollPercent * totalScrollable;
                const rotation = window.scrollY * 0.6;
                timelineWheel.style.top = wheelTop + 'px';
                timelineWheel.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
            }
            
            timelineItems.forEach((item) => {
                const itemRect = item.getBoundingClientRect();
                // Trigger item activation when its top enters the lower-middle part of screen (65%)
                if (itemRect.top < windowHeight * 0.65) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        window.addEventListener('scroll', handleTimelineScroll);
        window.addEventListener('resize', handleTimelineScroll);
        // Run once on load to initialize positions
        setTimeout(handleTimelineScroll, 100);
    }

    // 2.6 The Monochrome Stream Text Reveal
    const monochromeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // Stagger light up
                const spans = entry.target.querySelectorAll('span');
                spans.forEach((span, index) => {
                    setTimeout(() => {
                        span.classList.add('lit');
                    }, index * 80);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const monochromeTitle = document.querySelector('.monochrome-title');
    if (monochromeTitle) monochromeObserver.observe(monochromeTitle);



    // 4. Multi-Step Form Logic (Conversion Engine)
    const form = document.getElementById('multi-step-form');
    const steps = document.querySelectorAll('.step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    
    let currentStep = 0;

    function showStep(index) {
        steps.forEach((step, i) => {
            if (i === index) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Transmitting...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const projectData = {};
        
        // Anti-XSS Sanitization Engine
        for (let [key, val] of formData.entries()) {
            if (val instanceof File) {
                continue; // Skip raw File objects to prevent Firestore upload rejection!
            }
            if (typeof val === 'string') {
                projectData[key] = val.replace(/<\/?[^>]+(>|$)/g, ""); // Strip HTML tags
            } else {
                projectData[key] = val;
            }
        }
        projectData.timestamp = firebase.firestore.FieldValue.serverTimestamp(); // Adds a true server timestamp

        try {
            // 1. Write directly to Firestore "leads" collection (failsafe-enabled)
            const firestorePromise = db.collection("leads").add(projectData)
                .catch(err => console.warn("Firestore save bypassed:", err));
            
            // 2. Secretly transmit to Google Sheets via Web App URL
            const sheetsPromise = fetch(GOOGLE_SHEETS_WEBAPP_URL, {
                method: 'POST',
                body: formData,
                mode: 'no-cors' // Bypasses CORS blocking
            });

            // Wait for both to finish simultaneously
            await Promise.all([firestorePromise, sheetsPromise]);
            
            currentStep = steps.length - 1; // Show success step
            showStep(currentStep);
            form.reset();
            submitBtn.textContent = originalText;
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
            
        } catch (error) {
            console.error('Transmission Error:', error);
            submitBtn.textContent = 'Failed. Check Console.';
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
        }
    });

    // 4.5 Centralized Google Sign-In Gate System
    const heroCta = document.getElementById('hero-cta');
    const authOverlay = document.getElementById('auth-overlay');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const hudOperative = document.getElementById('hud-operative');
    const formEl = document.getElementById('multi-step-form');
    let signedInUser = null;

    // Central Auth State Handler
    function handleAuthStateChange(user) {
        if (user) {
            signedInUser = user;
            
            // Fade out the lock gate overlay
            if (authOverlay) {
                authOverlay.style.opacity = '0';
                authOverlay.style.pointerEvents = 'none';
                setTimeout(() => {
                    authOverlay.style.visibility = 'hidden';
                }, 500);
            }
            
            // Unlock and unblur the form
            if (formEl) {
                formEl.style.opacity = '1';
                formEl.style.pointerEvents = 'auto';
                formEl.style.filter = 'none';
            }
            
            // Update connection HUD status
            if (hudOperative) {
                hudOperative.innerText = "AUTHORIZED";
                hudOperative.className = "val green";
                hudOperative.style.color = "#00ff66";
                hudOperative.style.textShadow = "0 0 10px rgba(0, 255, 102, 0.5)";
            }
            
            // Pre-fill name and email fields
            const nameField = formEl.querySelector('input[name="name"]');
            const emailField = formEl.querySelector('input[name="email"]');
            if (nameField && user.displayName) {
                nameField.value = user.displayName;
                nameField.style.borderColor = 'rgba(0, 240, 255, 0.5)';
                nameField.style.color = '#00f0ff';
            }
            if (emailField && user.email) {
                emailField.value = user.email;
                emailField.style.borderColor = 'rgba(0, 240, 255, 0.5)';
                emailField.style.color = '#00f0ff';
            }
        } else {
            signedInUser = null;
            
            // Fade in the lock gate overlay
            if (authOverlay) {
                authOverlay.style.visibility = 'visible';
                authOverlay.style.opacity = '1';
                authOverlay.style.pointerEvents = 'auto';
            }
            
            // Blur and lock the form
            if (formEl) {
                formEl.style.opacity = '0.05';
                formEl.style.pointerEvents = 'none';
                formEl.style.filter = 'blur(5px)';
            }
            
            // Update connection HUD status to Unauthorized
            if (hudOperative) {
                hudOperative.innerText = "UNAUTHORIZED";
                hudOperative.className = "val red";
                hudOperative.style.color = "#ff0055";
                hudOperative.style.textShadow = "0 0 10px rgba(255, 0, 85, 0.5)";
            }
        }
    }

    // Bind Firebase onAuthStateChanged
    if (auth && typeof auth.onAuthStateChanged === 'function') {
        auth.onAuthStateChanged((user) => {
            handleAuthStateChange(user);
        });
    }

    // Function to trigger login with Google
    async function triggerGoogleLogin() {
        try {
            const result = await auth.signInWithPopup(provider);
            handleAuthStateChange(result.user);
            return result.user;
        } catch (error) {
            console.error('Sign-In Error:', error);
            showNotification("UPLINK FAILED: Google Authentication was interrupted.");
            throw error;
        }
    }

    // Event listener for the Google Login Overlay button
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', async () => {
            await triggerGoogleLogin();
        });
    }

    // Start a Project Hero CTA Click Handler
    if (heroCta) {
        heroCta.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopImmediatePropagation();
            
            try {
                if (!signedInUser) {
                    await triggerGoogleLogin();
                }
                // Scroll to contact section
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    window.scrollTo({
                        top: contactSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            } catch (err) {
                // Scroll anyway so they see the lock gate
                const contactSection = document.querySelector('#contact');
                if (contactSection) {
                    window.scrollTo({
                        top: contactSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    }

    // Smooth Scroll & Intercept Auth for "Initiate" Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', async function (e) {
            if (this.id === 'hero-cta') return; // Handled by separate listener
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            if (targetId === '#contact') {
                try {
                    if (!signedInUser) {
                        await triggerGoogleLogin();
                    }
                } catch (err) {
                    // Fail silently, they'll see the lock screen overlay
                }
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3.6 Massive Wordmark Interactive Spotlight
    const wordmarkContainer = document.querySelector('.massive-wordmark-container');
    const wordmark = document.querySelector('.massive-wordmark');

    if (wordmarkContainer && wordmark) {
        wordmarkContainer.addEventListener('mousemove', (e) => {
            const rect = wordmarkContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            wordmark.style.setProperty('--x', `${x}px`);
            wordmark.style.setProperty('--y', `${y}px`);
        });

        wordmarkContainer.addEventListener('mouseleave', () => {
            wordmark.style.setProperty('--x', '50%');
            wordmark.style.setProperty('--y', '50%');
        });
    }

    // 3.7 Privacy Policy & Terms Modal Interactions
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');
    const hiringModal = document.getElementById('hiring-modal');
    const openPrivacy = document.getElementById('open-privacy');
    const openTerms = document.getElementById('open-terms');
    const openHiring = document.getElementById('open-hiring');
    const closePrivacy = document.getElementById('close-privacy');
    const closeTerms = document.getElementById('close-terms');
    const closeHiring = document.getElementById('close-hiring');
    const hiringForm = document.getElementById('hiring-modal-form');

    if (openPrivacy && privacyModal) {
        openPrivacy.addEventListener('click', (e) => {
            e.preventDefault();
            privacyModal.classList.add('active');
            document.body.classList.add('loading'); // Prevent background scrolling
        });
    }

    if (openTerms && termsModal) {
        openTerms.addEventListener('click', (e) => {
            e.preventDefault();
            termsModal.classList.add('active');
            document.body.classList.add('loading'); // Prevent background scrolling
        });
    }

    if (openHiring && hiringModal) {
        openHiring.addEventListener('click', (e) => {
            e.preventDefault();
            hiringModal.classList.add('active');
            document.body.classList.add('loading'); // Prevent background scrolling
        });
    }

    if (closePrivacy && privacyModal) {
        closePrivacy.addEventListener('click', () => {
            privacyModal.classList.remove('active');
            document.body.classList.remove('loading');
        });
    }

    if (closeTerms && termsModal) {
        closeTerms.addEventListener('click', () => {
            termsModal.classList.remove('active');
            document.body.classList.remove('loading');
        });
    }

    if (closeHiring && hiringModal) {
        closeHiring.addEventListener('click', () => {
            hiringModal.classList.remove('active');
            document.body.classList.remove('loading');
        });
    }

    // Close modal on background overlay click
    window.addEventListener('click', (e) => {
        if (e.target === privacyModal) {
            privacyModal.classList.remove('active');
            document.body.classList.remove('loading');
        }
        if (e.target === termsModal) {
            termsModal.classList.remove('active');
            document.body.classList.remove('loading');
        }
        if (e.target === hiringModal) {
            hiringModal.classList.remove('active');
            document.body.classList.remove('loading');
        }
    });

    // Submit Operative Applicant Dossier to Firestore from Modal
    if (hiringForm) {
        hiringForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = hiringForm.querySelector('.submit-hiring-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'TRANSMITTING DOSSIER...';
            submitBtn.disabled = true;

            const formData = new FormData(hiringForm);
            const applicantData = {};

            // Anti-XSS Sanitization Engine
            for (let [key, val] of formData.entries()) {
                if (val instanceof File) {
                    continue; // Skip raw File objects to prevent Firestore upload rejection!
                }
                if (typeof val === 'string') {
                    applicantData[key] = val.replace(/<\/?[^>]+(>|$)/g, "");
                } else {
                    applicantData[key] = val;
                }
            }
            applicantData.timestamp = firebase.firestore.FieldValue.serverTimestamp();

            try {
                // 1. Write directly to Firestore "operatives" collection (failsafe-enabled)
                const firestorePromise = db.collection("operatives").add(applicantData)
                    .catch(err => console.warn("Firestore save bypassed:", err));
                
                // 2. Secretly transmit to Google Sheets via Web App URL
                const sheetsPromise = fetch(GOOGLE_SHEETS_WEBAPP_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors' // Bypasses CORS blocking
                });

                // Wait for both to finish simultaneously
                await Promise.all([firestorePromise, sheetsPromise]);

                // Immersive Success Message
                hiringForm.innerHTML = `
                    <h3 class="font-mono" style="color: #27c93f; text-shadow: 0 0 10px rgba(39, 201, 63, 0.4); text-align: center; margin: 30px 0 15px;">[DOSSIER_TRANSMITTED]</h3>
                    <p style="color: #a0a0b0; font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; line-height: 1.6; text-align: center;">
                        Your operative parameters have been secured inside the INCOGNITO mainframe and spreadsheet ledger. 
                        Our network establishes connections selectively. Connection closed.
                    </p>
                `;
            } catch (err) {
                console.error("Transmission Error:", err);
                submitBtn.textContent = 'TRANSMISSION FAILED';
                submitBtn.disabled = false;
                setTimeout(() => { submitBtn.textContent = originalText; }, 3000);
            }
        });
    }

    // 3.8 Mobile Hamburger Toggle Menu Logic
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    if (menuToggle && mobileDrawer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileDrawer.classList.toggle('active');
            document.body.classList.toggle('loading'); // Lock scrolling on active drawer
        });

        // Clicking any drawer link auto-closes the mobile drawer
        drawerLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mobileDrawer.classList.remove('active');
                document.body.classList.remove('loading');
            });
        });
    }

    // 3.9 Touch Move Spotlight Tracking for Massive Wordmark
    if (wordmarkContainer && wordmark) {
        wordmarkContainer.addEventListener('touchmove', (e) => {
            const rect = wordmarkContainer.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            wordmark.style.setProperty('--x', `${x}px`);
            wordmark.style.setProperty('--y', `${y}px`);
        }, { passive: true });
    }

    // 4.0 Intellectual Property & Cyber Security Shields
    // Disable right-click across the entire website to protect source assets
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        showNotification("SECURITY SHIELD: Source inspection is restricted on this portal.");
    });

    // Disable standard DevTools hotkeys (F12, Inspect, View Source)
    document.addEventListener('keydown', (e) => {
        if (
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j' || e.key === 'C' || e.key === 'c')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'u'))
        ) {
            e.preventDefault();
            showNotification("SECURITY SHIELD: Developer Tools are restricted on this portal.");
        }
    });

    // Elegant Cyberpunk HUD Notification Alerts
    function showNotification(message) {
        let notification = document.getElementById('security-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'security-notification';
            notification.className = 'glass';
            Object.assign(notification.style, {
                position: 'fixed',
                bottom: '30px',
                right: '30px',
                padding: '15px 25px',
                background: 'rgba(5, 5, 5, 0.95)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.15)',
                color: '#fff',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.85rem',
                letterSpacing: '0.05em',
                borderRadius: '8px',
                zIndex: '100000',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                opacity: '0',
                transform: 'translateY(20px)'
            });
            document.body.appendChild(notification);
        }
        notification.innerText = message;
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(20px)';
        }, 4000);
    }

    // 4.1 Anti-Data Scraping Automated Driver Shield (Blocks Selenium/Puppeteer/Playwright)
    if (false && navigator.webdriver) {
        document.body.innerHTML = `
            <div style="
                display: flex; 
                flex-direction: column;
                justify-content: center; 
                align-items: center; 
                height: 100vh; 
                background: #030305; 
                color: #ff0055; 
                font-family: 'Share Tech Mono', monospace; 
                text-align: center;
                padding: 20px;
                box-sizing: border-box;
            ">
                <h1 style="font-size: 2.5rem; margin-bottom: 20px; text-shadow: 0 0 20px rgba(255, 0, 85, 0.4);">SHIELD ACTIVE</h1>
                <p style="font-size: 1.1rem; color: #a0a0b0; max-width: 600px; line-height: 1.6; letter-spacing: 0.05em;">
                    ACCESS DENIED: Automated browser environment or scraper bot signature detected. 
                    Connection terminated by INCOGNITO Security Protocols.
                </p>
            </div>
        `;
        throw new Error("Automated scraper agent blocked.");
    }

    // 4.2 Dynamic Email Obfuscation Click Handler
    const obfuscatedEmail = document.getElementById('obfuscated-email');
    if (obfuscatedEmail) {
        obfuscatedEmail.addEventListener('click', (e) => {
            e.preventDefault();
            // Obfuscation parameters
            const user = "incognitohacks2k26";
            const domain = "gmail.com";
            // Dynamically open mail client to trick static scraper spiders
            window.location.href = `mailto:${user}@${domain}`;
        });
    }


    // 4.4 Mobile-Responsive Tech Card Touch Synthesizer & Floating Badges
    const techIcons = document.querySelectorAll('.tech-icon');
    const hudMessages = [
        "COMPILATION: 100%",
        "LOGIC INJECTED",
        "SYNTAX OK",
        "SECURE DEPLOY",
        "GRID ONLINE",
        "UPLINK STABLE"
    ];

    // Web Audio Synthesizer Function (Plays high-fidelity retro cyberpunk chimes entirely from code)
    function playCyberChime() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            
            // Harmonic Dual Oscillator Synthesis
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 Note
            osc1.frequency.exponentialRampToValueAtTime(1318.51, ctx.currentTime + 0.15); // Ramp up to E6 Note for positive feedback
            
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 Note
            osc2.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.15); // C6 Note
            
            gain.gain.setValueAtTime(0.12, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25); // Fast smooth decay
            
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);
            
            osc1.start();
            osc2.start();
            osc1.stop(ctx.currentTime + 0.25);
            osc2.stop(ctx.currentTime + 0.25);
        } catch (err) {
            // Silently absorb browser auto-play policy blocks
        }
    }

    techIcons.forEach(icon => {
        // Handle touchstart and click optimized for mobile responsive devices
        const handleInteraction = (e) => {
            // Prevent double triggers on hybrid devices
            if (e.type === 'touchstart') {
                e.stopPropagation();
            }

            // Play high-tech synthesized chime
            playCyberChime();

            // Highlight tech card
            icon.classList.add('active-tap');
            setTimeout(() => icon.classList.remove('active-tap'), 300);

            // Spawn floating neon HUD badge
            const rect = icon.getBoundingClientRect();
            const badge = document.createElement('div');
            badge.className = 'hud-badge glass';
            badge.innerText = hudMessages[Math.floor(Math.random() * hudMessages.length)];
            
            // Apply floating inline styles
            Object.assign(badge.style, {
                position: 'fixed',
                top: `${rect.top - 20}px`,
                left: `${rect.left + rect.width / 2}px`,
                transform: 'translate(-50%, 0)',
                padding: '4px 8px',
                background: 'rgba(5, 5, 10, 0.9)',
                border: '1px solid rgba(0, 240, 255, 0.5)',
                boxShadow: '0 0 10px rgba(0, 240, 255, 0.3)',
                borderRadius: '4px',
                color: '#00f0ff',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.65rem',
                letterSpacing: '0.05em',
                pointerEvents: 'none',
                zIndex: '100000',
                transition: 'transform 0.8s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.8s ease',
                opacity: '1'
            });

            document.body.appendChild(badge);

            // Trigger floating animation frame
            requestAnimationFrame(() => {
                badge.style.transform = 'translate(-50%, -30px)';
                badge.style.opacity = '0';
            });

            // Cleanup floating badge
            setTimeout(() => badge.remove(), 800);
        };

        icon.addEventListener('click', handleInteraction);
        icon.addEventListener('touchstart', handleInteraction, { passive: false });
    });

    // --- ID Card Base64 File Reader Listener ---
    const idCardInput = document.getElementById('hiring-id-card');
    const idCardBase64Input = document.getElementById('id-card-base64');
    const idCardPreviewContainer = document.getElementById('id-card-preview-container');
    const idCardPreview = document.getElementById('id-card-preview');

    if (idCardInput) {
        idCardInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    idCardBase64Input.value = event.target.result;
                    idCardPreview.src = event.target.result;
                    idCardPreviewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                idCardBase64Input.value = '';
                idCardPreviewContainer.style.display = 'none';
                idCardPreview.src = '';
            }
        });
    }


});
