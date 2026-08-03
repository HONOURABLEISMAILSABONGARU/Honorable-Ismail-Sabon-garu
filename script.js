import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "honourable-ismail-sabon-garu.firebaseapp.com",
  projectId: "honourable-ismail-sabon-garu",
  storageBucket: "honourable-ismail-sabon-garu.firebasestorage.app",
  messagingSenderId: "433993330936",
  appId: "1:433993330936:web:1c289e2fdf819d4cb3cb0d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const form = document.getElementById("registrationForm");

form.addEventListener("submit", async function (e) {
    e.preventDefault();
localStorage.setItem("applicationId", applicationId);
  const firstName = document.getElementById("firstName").value;
const middleName = document.getElementById("middleName").value;
const lastName = document.getElementById("lastName").value;
const address = document.getElementById("address").value;
const phoneNumber = document.getElementById("phoneNumber").value;
const gender = document.getElementById("gender").value;
const state = document.getElementById("state").value;
const lga = document.getElementById("lga").value;
const ward = document.getElementById("ward").value;
    try {
    await addDoc(collection(db, "registrations"), {
        applicationId: applicationId,
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        address: address,
        phoneNumber: phoneNumber,
        gender: gender,
        state: state,
        lga: lga,
        ward: ward,
        status: "Pending",
        createdAt: new Date()
    });
} catch (error) {
    console.error(error);
    alert("Registration could not be saved. Please try again.");
    return;
}
    document.body.innerHTML = `
    <div style="
        min-height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background:#f4f7f6;
        font-family:Arial,sans-serif;
        flex-direction:column;
    ">
        <div style="
            width:70px;
            height:70px;
            border:8px solid #ddd;
            border-top:8px solid #006400;
            border-radius:50%;
            animation:spin 1s linear infinite;
        "></div>

        <h2 style="margin-top:20px;color:#006400;">
            Processing Your Application...
        </h2>

        <p>Please wait...</p>
    </div>

    <style>
    @keyframes spin{
        0%{transform:rotate(0deg);}
        100%{transform:rotate(360deg);}
    }
    </style>
    `;

    setTimeout(function () {
      document.body.innerHTML = `
<div style="
    min-height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background:#f4f7f6;
    font-family:Arial,sans-serif;
    padding:20px;
">
    <div style="
        background:#fff;
        max-width:420px;
        width:100%;
        border-radius:20px;
        padding:30px;
        text-align:center;
        box-shadow:0 10px 30px rgba(0,0,0,.15);
    ">

        <div style="
            width:90px;
            height:90px;
            margin:auto;
            border-radius:50%;
            background:#16a34a;
            color:#fff;
            font-size:50px;
            display:flex;
            justify-content:center;
            align-items:center;
        ">✓</div>

        <h2 style="margin-top:20px;color:#0f172a;">
            Application Received
        </h2>

        <p style="color:#555;">
            Thank you for registering with
            <b>Honourable Ismail Sabon Garu Membership Registration Portal.</b>
            Your application has been received successfully.
        </p>

        <div style="
            background:#e8f8ee;
            padding:18px;
            border-radius:12px;
            margin:20px 0;
        ">
            <small>APPLICATION ID</small>
            <h3 style="color:#006400;">
                ${applicationId}
            </h3>
        </div>

        <div style="display:flex;gap:10px;">

            <button onclick="location.reload()" style="
                flex:1;
                padding:14px;
                background:#006400;
                color:#fff;
                border:none;
                border-radius:10px;
                cursor:pointer;
            ">
                Back To Home
            </button>

            <button onclick="showComingSoon()" style="
                flex:1;
                padding:14px;
                background:#1d4ed8;
                color:#fff;
                border:none;
                border-radius:10px;
                cursor:pointer;
            ">
                Print Your ID Card
            </button>

        </div>

    </div>
</div>
`;

    }, 5000);

});

window.showComingSoon = function () {

document.body.innerHTML = `
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f4f7f6;
font-family:Arial,sans-serif;
padding:20px;
">

<div style="
background:#fff;
max-width:420px;
width:100%;
padding:30px;
border-radius:20px;
text-align:center;
box-shadow:0 10px 30px rgba(0,0,0,.15);
">
<h2 style="color:#f59e0b;">
🪪 ID Card Pending
</h2>

<p style="margin:20px 0;color:#555;line-height:1.8;">
Your ID Card is currently <b>Pending</b>.<br><br>

Please wait until the Administrator approves your ID Card.
</p>
<button onclick="location.reload()" style="
padding:14px 20px;
background:#006400;
color:#fff;
border:none;
border-radius:10px;
cursor:pointer;
">
Back To Home
</button>

</div>
</div>
`;
}

window.adminWarning = function () {
    window.location.href = "admin.html";
}
