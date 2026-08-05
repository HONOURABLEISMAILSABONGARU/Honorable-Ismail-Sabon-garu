import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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

const searchBtn = document.getElementById("searchBtn");
const searchId = document.getElementById("searchId");
searchBtn.addEventListener("click", async () => {

const lastFour = searchId.value.trim();

if (lastFour.length !== 4) {
  alert("Please enter the last 4 digits.");
  return;
}

const snapshot = await getDocs(collection(db, "registrations"));

let found = null;

snapshot.forEach((document) => {

const data = document.data();
if (data.applicationId && data.applicationId.includes(lastFour)) {
  found = data;
                           }
  
});
  if (!found) {

  alert("Application ID not found.");

  return;

  }
  
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
width:350px;
background:#fff;
border:3px solid #006400;
border-radius:20px;
padding:20px;
text-align:center;
box-shadow:0 10px 20px rgba(0,0,0,.15);
">

<h2 style="color:#006400;">
HONOURABLE ISMAIL SABON GARU
</h2>

<h3>MEMBERSHIP CARD</h3>
<img
src="${found.passport}"
style="
width:120px;
height:120px;
object-fit:cover;
border-radius:10px;
border:2px solid #006400;
margin-top:10px;
">

<hr>

<p><b>Name:</b></p>

<p>
${found.firstName} ${found.middleName} ${found.lastName}
</p>

<p><b>Application ID</b></p>

<p>${found.applicationId}</p>
<p><b>Phone Number</b></p>

<p>${found.phoneNumber}</p>

<p><b>State</b></p>

<p>${found.state}</p>

<p><b>LGA</b></p>

<p>${found.lga}</p>

<p><b>Ward</b></p>

<p>${found.ward}</p>

<p><b>Status</b></p>

<p style="font-weight:bold;color:${found.status === "Approved" ? "green" : "orange"};">
${found.status}
</p>

<button onclick="window.print()" style="
padding:12px 20px;
background:#006400;
color:#fff;
border:none;
border-radius:8px;
cursor:pointer;
margin-top:15px;
">
Print ID Card
</button>

</div>

</div>
`;

});
