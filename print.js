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
min-height:100vh;
background:#e9f5e9;
display:flex;
justify-content:center;
align-items:center;
padding:20px;
font-family:Arial,sans-serif;
">

<div style="
width:900px;
height:500px;
background:#ffffff;
border:4px solid #006400;
border-radius:20px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.2);
">

<div style="
background:#006400;
color:#fff;
padding:20px;
display:flex;
align-items:center;
justify-content:space-between;
">

<div style="display:flex;align-items:center;gap:15px;">

<img src="20260802_132740.png"
style="
width:70px;
height:70px;
border-radius:50%;
background:#fff;
padding:5px;
">

<div>

<h2 style="margin:0;">
HONOURABLE ISMAIL SABON GARU
</h2>

<p style="margin:0;color:#FFD700;">
OFFICIAL MEMBERSHIP ID CARD
</p>

</div>

</div>

<div style="
font-size:18px;
font-weight:bold;
background:#fff;
color:#006400;
padding:8px 15px;
border-radius:20px;
">

${found.status}

</div>

</div>

<div style="
display:flex;
padding:25px;
gap:30px;
">
<div style="
width:230px;
text-align:center;
">

<img src="${found.passport}"
style="
width:180px;
height:220px;
object-fit:cover;
border:3px solid #006400;
border-radius:10px;
">

<h3 style="
margin-top:15px;
color:#006400;
">
PASSPORT PHOTO
</h3>

</div>

<div style="
flex:1;
">

<table style="
width:100%;
border-collapse:collapse;
font-size:18px;
">

<tr>
<td><b>FULL NAME</b></td>
<td>${found.firstName} ${found.middleName} ${found.lastName}</td>
</tr>

<tr>
<td><b>APPLICATION ID</b></td>
<td>${found.applicationId}</td>
</tr>

<tr>
<td><b>PHONE NUMBER</b></td>
<td>${found.phoneNumber}</td>
</tr>

<tr>
<td><b>STATE</b></td>
<td>${found.state}</td>
</tr>

<tr>
<td><b>LGA</b></td>
<td>${found.lga}</td>
</tr>

<tr>
<td><b>WARD</b></td>
<td>${found.ward}</td>
</tr>

</table>
<hr style="margin:20px 0;">

<div style="
display:flex;
justify-content:space-between;
align-items:flex-end;
margin-top:20px;
">

<div>

<div style="
width:120px;
height:120px;
border:2px dashed #006400;
display:flex;
justify-content:center;
align-items:center;
font-size:14px;
color:#666;
">
QR CODE
</div>

</div>

<div style="text-align:center;">

<p style="
border-top:2px solid #000;
padding-top:5px;
width:180px;
margin:auto;
">
Authorized Signature
</p>

</div>

</div>

<div style="
margin-top:25px;
text-align:center;
">

<button onclick="window.print()" style="
padding:15px 35px;
background:#006400;
color:white;
border:none;
border-radius:10px;
font-size:18px;
cursor:pointer;
font-weight:bold;
">
🖨 Print ID Card
</button>

</div>

</div>

</div>

</div>
`;
const style = document.createElement("style");

style.innerHTML = `
@media print{

@page{
size: landscape;
margin:0;
}

body{
margin:0;
padding:0;
background:white;
}

button{
display:none;
}

}
`;

document.head.appendChild(style);

searchBtn.disabled = false;
searchBtn.innerHTML = "Search ID Card";

});  
