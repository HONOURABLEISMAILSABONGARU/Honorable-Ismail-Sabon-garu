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

searchBtn.disabled = true;
searchBtn.innerHTML = "Processing...";

await new Promise(resolve => setTimeout(resolve, 1000));

const lastFour = searchId.value.trim();

if(lastFour.length !== 4){

searchBtn.disabled = false;
searchBtn.innerHTML = "Search ID Card";

alert("Please enter the last 4 digits of your Application ID.");

return;

}

const snapshot = await getDocs(collection(db,"registrations"));

let found = null;

snapshot.forEach((doc)=>{

const data = doc.data();

if(data.applicationId && data.applicationId.endsWith(lastFour)){

found = data;

}

});

if(!found){

searchBtn.disabled = false;
searchBtn.innerHTML = "Search ID Card";

alert("Application ID not found.");

return;

}

if(found.status !== "Approved"){

searchBtn.disabled = false;
searchBtn.innerHTML = "Search ID Card";

alert("Your ID Card is not ready yet.\n\nPlease wait until the Admin approves your registration.");

return;

}
document.body.innerHTML = `

<div style="
width:100%;
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#eef5ee;
padding:20px;
">

<div style="
width:950px;
height:560px;
background:white;
border-radius:20px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.25);
border:3px solid #006400;
">

<div style="
height:120px;
background:#006400;
display:flex;
align-items:center;
padding:20px;
color:white;
">

<img src="20260802_132740.png"
style="
width:80px;
height:80px;
border-radius:50%;
background:white;
padding:5px;
">

<div style="margin-left:20px;">

<h1 style="
margin:0;
font-size:34px;
">
HONOURABLE ISMAIL SABON GARU
</h1>

<p style="
margin-top:8px;
font-size:20px;
color:#FFD700;
">
OFFICIAL MEMBERSHIP ID CARD
</p>

</div>

</div>
<div style="
display:grid;
grid-template-columns:280px 1fr;
gap:30px;
padding:25px;
height:440px;
">

<div style="text-align:center;">

<img src="${found.passport}"
style="
width:220px;
height:250px;
object-fit:cover;
border:4px solid #006400;
border-radius:15px;
">

<h2 style="
margin-top:15px;
color:#006400;
font-size:28px;
">
${found.firstName} ${found.middleName} ${found.lastName}
</h2>

<p style="
margin-top:8px;
font-size:18px;
font-weight:bold;
color:#555;
">
PASSPORT PHOTO
</p>

</div>

<div>
<table style="
width:100%;
border-collapse:collapse;
font-size:20px;
">

<tr>
<td style="padding:12px;font-weight:bold;">Application ID</td>
<td>${found.applicationId}</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;">Phone Number</td>
<td>${found.phoneNumber}</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;">State</td>
<td>${found.state}</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;">LGA</td>
<td>${found.lga}</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;">Ward</td>
<td>${found.ward}</td>
</tr>

<tr>
<td style="padding:12px;font-weight:bold;">Status</td>
<td style="
color:green;
font-weight:bold;
">
${found.status}
</td>
</tr>

</table>
<div style="
margin-top:40px;
display:flex;
justify-content:space-between;
align-items:flex-end;
">

<div style="text-align:center;">

<div style="
width:220px;
border-top:2px solid #000;
margin-bottom:8px;
"></div>

<b>Authorized Signature</b>

</div>

<div style="text-align:center;">

<div style="
width:120px;
height:120px;
border:2px dashed #006400;
display:flex;
align-items:center;
justify-content:center;
color:#888;
font-weight:bold;
">
QR CODE
</div>

</div>

</div>

</div>

</div>

</div>

`;
