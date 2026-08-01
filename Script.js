const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    alert("Application Submitted Successfully!");

    form.reset();
});
