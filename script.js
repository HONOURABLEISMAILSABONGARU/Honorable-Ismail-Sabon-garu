import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";
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

const form = document.getElementById("registrationForm");
function generateApplicationId() {

let lastNumber = Number(localStorage.getItem("lastApplicationId")) || 1000;

lastNumber++;

localStorage.setItem("lastApplicationId", lastNumber);

return `TTT/SBNGR/${lastNumber}`;

}

if (!form) {

console.log("Registration form not found.");

} else {

form.addEventListener("submit", async (e) => {

e.preventDefault();

const passport = document.getElementById("passport").files[0];

if (!passport) {

alert("Please upload your passport photo.");

return;

}

const reader = new FileReader();
  reader.onload = async function () {

const applicationId = generateApplicationId();

const registration = {

applicationId: applicationId,

passport: reader.result,

firstName: document.getElementById("firstName").value.trim(),

middleName: document.getElementById("middleName").value.trim(),

lastName: document.getElementById("lastName").value.trim(),

address: document.getElementById("address").value.trim(),

phoneNumber: document.getElementById("phoneNumber").value.trim(),

gender: document.getElementById("gender").value,

state: document.getElementById("state").value,

lga: document.getElementById("lga").value,

ward: document.getElementById("ward").value,

status: "Pending",

createdAt: new Date()

};
 document.body.innerHTML = `
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
background:#f4f7f6;
font-family:Arial;
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

<p>Please wait while we submit your application.</p>

<style>
@keyframes spin{
from{transform:rotate(0deg);}
to{transform:rotate(360deg);}
}
</style>

</div>
`;

try {

await addDoc(collection(db, "registrations"), registration);
  setTimeout(() => {

document.body.innerHTML = `
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f4f7f6;
padding:20px;
font-family:Arial;
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

<h2>Application Submitted Successfully</h2>

<p>Your Application ID</p>

<h3 style="color:#006400;">${applicationId}</h3>

<p>Please save this Application ID. You will need the last 4 digits to print your ID Card.</p>

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

}, 4000);

} catch (err) {

console.error(err);

alert("Registration failed: " + err.message);

}

};

reader.readAsDataURL(passport);

});

}
