/* ==========================================================================
   Portfolio interactions
   Loaded with `defer`, so the DOM is ready when this runs.

   Contracts with index.html:
   - Modal triggers carry  data-modal-target="#modal-id"
   - Modal close buttons carry  data-modal-close
   - Gallery images inside modals use  data-src  (swapped to src on first open,
     so ~MBs of screenshots are never downloaded until a gallery is viewed)
   - The open state is the  .modal.is-open  CSS class
   ========================================================================== */

/* ---------- Typed.js headline (with static fallback if the CDN fails) ---------- */

const typedTarget = document.querySelector(".text");
if (typedTarget) {
    if (window.Typed) {
        new Typed(".text", {
            strings: ["Manual Testing", "Automation Testing", "Performance Testing"],
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true,
        });
    } else {
        typedTarget.textContent = "Manual, Automation & Performance Testing";
    }
}

/* ---------- Modal system ---------- */

const modalStack = [];          // supports the lightbox opening on top of a gallery
const triggerFor = new WeakMap(); // modal -> element to restore focus to on close

function hydrateImages(modal) {
    modal.querySelectorAll("img[data-src]").forEach((img) => {
        img.src = img.dataset.src;
        img.removeAttribute("data-src");
    });
}

function openModal(modal, trigger) {
    if (!modal || modal.classList.contains("is-open")) return;
    hydrateImages(modal);
    modal.classList.add("is-open");
    modalStack.push(modal);
    if (trigger) triggerFor.set(modal, trigger);
    const closeBtn = modal.querySelector("[data-modal-close]");
    if (closeBtn) closeBtn.focus();
}

function closeModal(modal = modalStack[modalStack.length - 1]) {
    if (!modal) return;
    modal.classList.remove("is-open");
    const idx = modalStack.indexOf(modal);
    if (idx > -1) modalStack.splice(idx, 1);
    const trigger = triggerFor.get(modal);
    if (trigger && document.contains(trigger)) trigger.focus();
}

document.addEventListener("click", (event) => {
    // 1. Close buttons
    if (event.target.closest("[data-modal-close]")) {
        closeModal(event.target.closest(".modal"));
        return;
    }

    // 2. Real links (external sites, documents, nav anchors): let the browser handle them,
    //    even when they sit inside a card that is itself a modal trigger.
    const link = event.target.closest("a[href]");
    if (link && !link.hasAttribute("data-modal-target") && link.getAttribute("href") !== "#") {
        return;
    }

    // 3. Modal triggers (innermost wins: an icon's own target beats its card's target)
    const trigger = event.target.closest("[data-modal-target]");
    if (trigger) {
        event.preventDefault();
        openModal(document.querySelector(trigger.dataset.modalTarget), trigger);
        return;
    }

    // 4. Clicking a modal's dark backdrop closes that modal
    if (event.target.classList.contains("modal") && event.target.classList.contains("is-open")) {
        closeModal(event.target);
    }
});

/* ---------- Lightbox (opens from any gallery image, on top of the gallery modal) ---------- */

const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
let galleryImages = [];
let currentImageIndex = 0;

function updateLightboxNav() {
    const prev = lightboxModal.querySelector(".lightbox-prev");
    const next = lightboxModal.querySelector(".lightbox-next");
    prev.style.display = currentImageIndex > 0 ? "block" : "none";
    next.style.display = currentImageIndex < galleryImages.length - 1 ? "block" : "none";
}

function stepLightbox(dir) {
    const nextIndex = currentImageIndex + dir;
    if (nextIndex < 0 || nextIndex >= galleryImages.length) return;
    currentImageIndex = nextIndex;
    lightboxImg.src = galleryImages[currentImageIndex].src;
    updateLightboxNav();
}

document.querySelectorAll(".gallery-grid img").forEach((img) => {
    img.addEventListener("click", () => {
        galleryImages = Array.from(img.closest(".gallery-grid").querySelectorAll("img"));
        currentImageIndex = galleryImages.indexOf(img);
        lightboxImg.src = img.src;
        openModal(lightboxModal, img);
        updateLightboxNav();
    });
});

document.querySelectorAll("[data-lightbox-dir]").forEach((btn) => {
    btn.addEventListener("click", (event) => {
        event.stopPropagation();
        stepLightbox(Number(btn.dataset.lightboxDir));
    });
});

/* ---------- Keyboard: Escape closes the top modal, arrows navigate the lightbox ---------- */

document.addEventListener("keydown", (event) => {
    if (!modalStack.length) return;
    if (event.key === "Escape") closeModal();
    if (lightboxModal.classList.contains("is-open")) {
        if (event.key === "ArrowLeft") stepLightbox(-1);
        if (event.key === "ArrowRight") stepLightbox(1);
    }
});

/* ---------- Nav scroll-spy + back-to-top button ---------- */

const navLinks = Array.from(document.querySelectorAll(".navbar a[href^='#']"));
const spiedSections = navLinks.map((a) => document.querySelector(a.hash)).filter(Boolean);
const toTop = document.querySelector(".top");

/* A section becomes current once its top crosses a line ~28% down the viewport.
   Measuring positions directly (rather than reacting to IntersectionObserver
   entries) matters here: short sections like #education are barely taller than a
   mid-viewport observer band, so they were being overwritten by the next section. */
function updateOnScroll() {
    const line = window.innerHeight * 0.28;
    const scrolledToBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

    let current = scrolledToBottom
        ? spiedSections[spiedSections.length - 1]
        : spiedSections.reduce(
            (found, section) => (section.getBoundingClientRect().top <= line ? section : found),
            spiedSections[0]
        );

    navLinks.forEach((a) => a.classList.toggle("active", a.hash === `#${current.id}`));
    toTop.classList.toggle("active", window.scrollY > 100);
}

let scrollQueued = false;
window.addEventListener(
    "scroll",
    () => {
        if (scrollQueued) return;
        scrollQueued = true;
        requestAnimationFrame(() => {
            scrollQueued = false;
            updateOnScroll();
        });
    },
    { passive: true }
);
updateOnScroll();

/* ---------- Contact form (EmailJS), with inline status instead of alert() ---------- */

const EMAILJS_PUBLIC_KEY = "TqdISMygqylwOV_me";
const EMAILJS_SERVICE_ID = "service_04r37xh";
const EMAILJS_TEMPLATE_ID = "template_atisenq";
const CONTACT_FALLBACK = "Please email me directly at eza.nda21@gmail.com.";

if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("form-status");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!window.emailjs) {
        formStatus.textContent = `Sorry, the contact service failed to load. ${CONTACT_FALLBACK}`;
        return;
    }
    const sendButton = contactForm.querySelector(".send");
    sendButton.disabled = true;
    formStatus.textContent = "Sending…";

    const params = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value,
    };

    emailjs
        .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
        .then(() => {
            contactForm.reset();
            formStatus.textContent = "Thank you! Your message has been sent.";
        })
        .catch(() => {
            formStatus.textContent = `Sorry, your message could not be sent. ${CONTACT_FALLBACK}`;
        })
        .finally(() => {
            sendButton.disabled = false;
        });
});

/* ---------- Footer year ---------- */

document.getElementById("footer-year").textContent = new Date().getFullYear();
