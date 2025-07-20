'use strict';

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }


// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });


// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// Add a custom message box element (replace alert/confirm)
const messageBox = document.createElement('div');
messageBox.classList.add('custom-message-box');
messageBox.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: var(--eerie-black-2);
    border: 1px solid var(--jet);
    border-radius: 14px;
    padding: 25px;
    box-shadow: var(--shadow-3);
    color: var(--white-2);
    font-size: var(--fs-5);
    text-align: center;
    z-index: 1000;
    display: none; /* Hidden by default */
    max-width: 300px;
    line-height: 1.5;
`;
document.body.appendChild(messageBox);

const showMessageBox = (message, isSuccess = true) => {
    messageBox.textContent = message;
    messageBox.style.borderColor = isSuccess ? 'var(--orange-yellow-crayola)' : 'var(--bittersweet-shimmer)';
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000); // Hide after 3 seconds
};


// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}

// Handle form submission
form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent default form submission

    formBtn.setAttribute("disabled", ""); // Disable button to prevent multiple submissions
    formBtn.textContent = 'Sending...'; // Update button text

    const formData = {
        fullname: form.elements.fullname.value,
        email: form.elements.email.value,
        message: form.elements.message.value
    };

    try {
        const response = await fetch('http://localhost:3000/send-message', { // IMPORTANT: Use your backend URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            showMessageBox(result.message, true);
            form.reset(); // Clear the form on success
        } else {
            showMessageBox(result.message || 'An error occurred.', false);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessageBox('Network error or server is down. Please try again later.', false);
    } finally {
        formBtn.removeAttribute("disabled"); // Re-enable button
        formBtn.innerHTML = '<ion-icon name="paper-plane"></ion-icon><span>Send Message</span>'; // Restore button text and icon
    }
});


// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// Add event to all nav links for smooth scroll and page activation
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default jump behavior

    const targetPageId = this.innerHTML.toLowerCase();
    const targetPage = document.querySelector(`[data-page="${targetPageId}"]`);

    if (targetPage) {
      // Deactivate all pages and nav links first
      for (let j = 0; j < pages.length; j++) {
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }

      // Activate the clicked page and nav link
      targetPage.classList.add("active");
      this.classList.add("active");

      // Scroll to the top of the main content area smoothly
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }
  });
}


// Back to Top Button logic
const backToTopBtn = document.querySelector("[data-back-to-top]");
const mainContentScrollable = document.querySelector(".main-content"); // Assuming main-content is scrollable

if (mainContentScrollable) {
  mainContentScrollable.addEventListener("scroll", function () {
    if (mainContentScrollable.scrollTop > 200) { // Show button after scrolling 200px
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }
  });
} else {
  // Fallback for window scroll if main-content is not the primary scroll area
  window.addEventListener("scroll", function () {
    if (window.scrollY > 200) { // Show button after scrolling 200px
      backToTopBtn.classList.add("active");
    } else {
      backToTopBtn.classList.remove("active");
    }
  });
}


backToTopBtn.addEventListener("click", function () {
  if (mainContentScrollable) {
    mainContentScrollable.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }
});


// Project Modal Logic (Basic Placeholder)
// This section assumes a project modal structure exists in index.html
// and is intended for displaying more details about projects.
const projectItems = document.querySelectorAll(".timeline-item"); // Assuming project items are within timeline-item
const projectModal = document.getElementById("project-modal"); // Ensure you add this element to index.html
const projectModalCloseBtn = document.querySelector("[data-project-modal-close-btn]"); // Ensure you add this button
const projectModalOverlay = document.getElementById("project-modal-overlay"); // Ensure you add this element

// Function to open modal
const openProjectModal = function (title, description) {
  // Check if modal elements exist before trying to access them
  if (projectModal && projectModalOverlay) {
    const modalTitle = projectModal.querySelector(".project-modal-title");
    const modalDescription = projectModal.querySelector(".project-modal-description");

    if (modalTitle) modalTitle.textContent = title;
    if (modalDescription) modalDescription.textContent = description;

    projectModal.classList.add("active");
    projectModalOverlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent body scroll
  } else {
    console.warn("Project modal elements not found. Please add them to index.html.");
    // Fallback to a simple alert if modal elements are missing
    showMessageBox(`Project: ${title}\nDetails: ${description}`, true);
  }
};

// Function to close modal
const closeProjectModal = function () {
  if (projectModal) projectModal.classList.remove("active");
  if (projectModalOverlay) projectModalOverlay.classList.remove("active");
  document.body.style.overflow = ""; // Restore body scroll
};

// Add click event to each project item
projectItems.forEach(item => {
  item.addEventListener("click", function () {
    const title = this.querySelector(".timeline-item-title") ? this.querySelector(".timeline-item-title").textContent : "Project Title";
    const description = this.querySelector(".timeline-text") ? this.querySelector(".timeline-text").textContent : "No description available.";
    openProjectModal(title, description);
  });
});

// Add event listeners for closing the modal, only if elements exist
if (projectModalCloseBtn) projectModalCloseBtn.addEventListener("click", closeProjectModal);
if (projectModalOverlay) projectModalOverlay.addEventListener("click", closeProjectModal);
