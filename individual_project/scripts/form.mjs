// form.mjs - Handle contact form submission with validation and success message

const form = document.getElementById("contactForm");
const formResult = document.getElementById("formResult");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    formResult.textContent = "Please fill out all required fields correctly.";
    formResult.style.color = "red";
    return;
  }

  const formData = new FormData(form);
  // Here you would send form data to backend or API endpoint
  // For demo, just simulate success

  formResult.style.color = "green";
  formResult.textContent = "Thank you for contacting GlobalTech! We will respond shortly.";

  form.reset();
});
