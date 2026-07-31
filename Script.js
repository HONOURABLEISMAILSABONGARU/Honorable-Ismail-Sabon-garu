document.addEventListener("DOMContentLoaded", function () {

  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const appId = "TTT-SBNGR-2027-APP-00121";

alert(
  "Application Submitted Successfully!\n\n" +
  "Application ID: " + appId + "\n\n" +
  "IMPORTANT NOTICE:\n" +
  "Please save your Application ID or print it. You will be required to present it when collecting your ID Card."
);
