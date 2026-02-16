
const typed = new Typed(".text", {
    strings: ["Manual Testing", "Automation Testing", "Performance Testing"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});


const toTop = document.querySelector(".top");
window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
        toTop.classList.add("active");
    }
    else {
        toTop.classList.remove("active");
    }
})

function sendMail(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    };

    const serviceID = "service_04r37xh";
    const templateID = "template_atisenq";

    emailjs.send(serviceID, templateID, params)
        .then(res => {
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("subject").value = "";
            document.getElementById("message").value = "";
            console.log(res);
            alert("Your message sent successfully");
        })
        .catch(err => console.error("Error sending email:", err));
}

document.getElementById("contactForm").addEventListener("submit", sendMail);

document.addEventListener("DOMContentLoaded", function () {
    // Handle multiple error modals
    const modalElements = document.querySelectorAll(".error-modal");
    const linkElements = document.querySelectorAll(".file-link");
    const closeButtons = document.querySelectorAll(".close");

    linkElements.forEach((link, index) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();
            modalElements[index].style.display = "flex";
        });
    });

    closeButtons.forEach((button, index) => {
        button.onclick = function () {
            modalElements[index].style.display = "none";
        }
    });

    // Handle Referit Gallery Modal
    const referitModal = document.getElementById("referit-modal");
    const referitLink = document.getElementById("referit-link");
    const referitClose = document.querySelector(".close-referit");

    if (referitLink) {
        referitLink.addEventListener("click", function (event) {
            event.preventDefault();
            referitModal.style.display = "flex";
        });
    }

    if (referitClose) {
        referitClose.onclick = function () {
            referitModal.style.display = "none";
        }
    }

    // Handle Duo Gallery Modal
    const duoModal = document.getElementById("duo-modal");
    const duoLink = document.getElementById("duo-link");
    const duoClose = document.querySelector(".close-duo");

    if (duoLink) {
        duoLink.addEventListener("click", function (event) {
            event.preventDefault();
            duoModal.style.display = "flex";
        });
    }

    if (duoClose) {
        duoClose.onclick = function () {
            duoModal.style.display = "none";
        }
    }

    // Handle Duo Restricted Modal
    const duoRestrictedModal = document.getElementById("duo-restricted-modal");
    const duoActionLink = document.getElementById("duo-action-link");
    const duoRestrictedClose = document.querySelector(".close-restricted");

    if (duoActionLink) {
        duoActionLink.addEventListener("click", function (event) {
            event.preventDefault();
            duoRestrictedModal.style.display = "flex";
        });
    }

    if (duoRestrictedClose) {
        duoRestrictedClose.onclick = function () {
            duoRestrictedModal.style.display = "none";
        }
    }

    // Handle Suncorp Gallery Modal
    const suncorpModal = document.getElementById("suncorp-modal");
    const suncorpLink = document.getElementById("suncorp-link");
    const suncorpClose = document.querySelector(".close-suncorp");

    if (suncorpLink) {
        suncorpLink.addEventListener("click", function (event) {
            event.preventDefault();
            suncorpModal.style.display = "flex";
        });
    }

    if (suncorpClose) {
        suncorpClose.onclick = function () {
            suncorpModal.style.display = "none";
        }
    }

    // Handle Suncorp Restricted Modal
    const suncorpRestrictedModal = document.getElementById("suncorp-restricted-modal");
    const suncorpActionLink = document.getElementById("suncorp-action-link");
    // We can reuse close-restricted logic if they share the class, but we need to ensure the right modal closes
    // Actually, .close-restricted is used for multiple modals, so we should querySelectorAll or just rely on the onclick handler closing its parent or specific ID.
    // The previous implementation for duoRestrictedClose used `document.querySelector(".close-restricted")`, which only selects the FIRST one.
    // We need to fix this to handle multiple restricted close buttons.

    // Let's select all close-restricted buttons and add listeners to close their respective parent modals
    const restrictedCloseButtons = document.querySelectorAll(".close-restricted");
    restrictedCloseButtons.forEach(btn => {
        btn.onclick = function () {
            // Find the closest modal parent and hide it
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = "none";
            }
        }
    });

    if (suncorpActionLink) {
        suncorpActionLink.addEventListener("click", function (event) {
            event.preventDefault();
            suncorpRestrictedModal.style.display = "flex";
        });
    }

    // Handle Lightbox
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    let galleryImages = []; // Changed to let and empty array initially
    const lightboxClose = document.querySelector(".close-lightbox");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    let currentImageIndex = 0;

    // Helper to update navigation buttons visibility
    function updateNavButtons() {
        if (!galleryImages.length) return;

        // Hide prev button if at start
        if (currentImageIndex <= 0) {
            prevBtn.style.display = "none";
        } else {
            prevBtn.style.display = "block";
        }

        // Hide next button if at end
        if (currentImageIndex >= galleryImages.length - 1) {
            nextBtn.style.display = "none";
        } else {
            nextBtn.style.display = "block";
        }
    }

    // Attach click listeners to all potential gallery images
    const allGalleryImages = document.querySelectorAll(".gallery-grid img");
    allGalleryImages.forEach((img) => {
        img.addEventListener("click", function () {
            // Find the specific gallery container for this image
            const container = this.closest('.gallery-grid');
            if (container) {
                // Set the current gallery context
                galleryImages = Array.from(container.querySelectorAll('img'));
                currentImageIndex = galleryImages.indexOf(this);

                lightboxModal.style.display = "flex";
                lightboxImg.src = this.src;
                updateNavButtons();
            }
        });
    });

    if (lightboxClose) {
        lightboxClose.onclick = function () {
            lightboxModal.style.display = "none";
        }
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent modal close
            if (currentImageIndex > 0) {
                currentImageIndex--;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                updateNavButtons();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
            e.stopPropagation(); // Prevent modal close
            if (currentImageIndex < galleryImages.length - 1) {
                currentImageIndex++;
                lightboxImg.src = galleryImages[currentImageIndex].src;
                updateNavButtons();
            }
        });
    }

    window.onclick = function (event) {
        // Close error modals
        modalElements.forEach((modal) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });

        // Close referit modal
        if (event.target == referitModal) {
            referitModal.style.display = "none";
        }

        // Close duo modal
        if (event.target == duoModal) {
            duoModal.style.display = "none";
        }

        // Close duo restricted modal
        if (event.target == duoRestrictedModal) {
            duoRestrictedModal.style.display = "none";
        }

        // Close suncorp modal
        if (event.target == suncorpModal) {
            suncorpModal.style.display = "none";
        }

        // Close suncorp restricted modal
        if (event.target == suncorpRestrictedModal) {
            suncorpRestrictedModal.style.display = "none";
        }

        // Close lightbox modal
        if (event.target == lightboxModal) {
            lightboxModal.style.display = "none";
        }
    }
});
