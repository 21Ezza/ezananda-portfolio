
var typed = new Typed(".text", {
    strings: ["Manual Testing","Automation Testing", "Performance Testing"],
    typeSpeed:100,
    backSpeed:100,
    backDelay:1000,
    loop:true
});


const toTop = document.querySelector(".top");
window.addEventListener("scroll",() =>{
    if (window.pageYOffset > 100){
        toTop.classList.add("active");
    }
    else{
        toTop.classList.remove("active");
    }
})

function sendMail(event) {
    event.preventDefault(); // Prevent default form submission behavior

    var params = {
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

document.addEventListener("DOMContentLoaded", function() {
    // Handle multiple modals
    const modalElements = document.querySelectorAll("[id^=errorModal]");
    const linkElements = document.querySelectorAll("[id^=fileLink]");
    const closeButtons = document.querySelectorAll(".close");

    linkElements.forEach((link, index) => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            event.stopPropagation();
            modalElements[index].style.display = "flex";
        });
    });

    closeButtons.forEach((button, index) => {
        button.onclick = function() {
            modalElements[index].style.display = "none";
        }
    });

    window.onclick = function(event) {
        modalElements.forEach((modal) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        });
    }
});
