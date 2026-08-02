const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Generate Application ID
    const applicationId = "TTT-" + Math.floor(100000 + Math.random() * 900000);

    alert(
        "✅ Application Submitted Successfully!\n\n" +
        "Application ID: " + applicationId +
        "\n\nPlease save your Application ID."
    );

    form.reset();
});
