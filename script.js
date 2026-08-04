import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvjnzN9K6fntjv8CaKK-6ENjjyYnMOWOE",
  authDomain: "honourable-ismail-sabon-garu.firebaseapp.com",
  projectId: "honourable-ismail-sabon-garu",
  storageBucket: "honourable-ismail-sabon-garu.firebasestorage.app",
  messagingSenderId: "433993330936",
  appId: "1:433993330936:web:1c289e2fdf819d4cb3cb0d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const form = document.getElementById("registrationForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const applicationId = "TTT-" + Date.now();

      const passportFile = document.getElementById("passport").files[0];

      if (!passportFile) {
        alert("Please upload your passport.");
        return;
      }

      const extension = passportFile.name.split(".").pop();

      const storageRef = ref(
        storage,
        `passports/${applicationId}.${extension}`
      );

      await uploadBytes(storageRef, passportFile);

      const passportURL = await getDownloadURL(storageRef);

      const registration = {
        applicationId,
        passport: passportURL,
        firstName: document.getElementById("firstName").value,
        middleName: document.getElementById("middleName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        gender: document.getElementById("gender").value,
        state: document.getElementById("state").value,
        lga: document.getElementById("lga").value,
        ward: document.getElementById("ward").value,
        status: "Pending",
        createdAt: new Date()
      };

      await addDoc(collection(db, "registrations"), registration);
      document.body.innerHTML = `
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f4f7f6;
font-family:Arial;
padding:20px;
">

<div style="
background:#fff;
padding:30px;
border-radius:20px;
max-width:420px;
width:100%;
text-align:center;
box-shadow:0 10px 30px rgba(0,0,0,.15);
">

<div style="font-size:60px;color:green;">✓</div>

<h2>Application Received</h2>

<p>Your registration has been submitted successfully.</p>

<p><b>Application ID</b></p>

<h3 style="color:#006400;">${applicationId}</h3>

<button onclick="location.reload()" style="
padding:12px 20px;
background:#006400;
color:#fff;
border:none;
border-radius:8px;
cursor:pointer;
">
Back To Home
</button>

</div>

</div>
`;
