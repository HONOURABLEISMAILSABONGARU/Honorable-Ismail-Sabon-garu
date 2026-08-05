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

if(lastFour.length !== 4){
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
alert("Application ID not found.");
return;
}

if(found.status !== "Approved"){
alert("Your ID Card is not ready yet.\n\nPlease wait until the Admin approves your registration.");
return;
}
document.body.innerHTML = `
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#eaf4ea;
padding:20px;
font-family:Arial,sans-serif;
">

<div style="
width:380px;
background:#fff;
border-radius:20px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.18);
border:3px solid #006400;
">

<div style="
background:#006400;
color:#fff;
text-align:center;
padding:20px;
">

<img src="20260802_132740.png"
style="
width:80px;
height:80px;
border-radius:50%;
background:#fff;
padding:5px;
">

<h2 style="margin:10px 0 5px;">
HONOURABLE ISMAIL SABON GARU
</h2>

<p style="color:#FFD700;">
OFFICIAL MEMBERSHIP CARD
</p>

</div>

<div style="padding:20px;text-align:center;">

<img src="${found.passport}"
style="
width:130px;
height:130px;
border-radius:10px;
object-fit:cover;
border:4px solid #006400;
">

<h2 style="color:#006400;">
${found.firstName} ${found.middleName} ${found.lastName}
</h2>

<hr>

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

<p>
<span style="
background:#0a8f3d;
color:#fff;
padding:6px 14px;
border-radius:20px;
font-weight:bold;
">
${found.status}
</span>
</p>

<button onclick="window.print()" style="
width:100%;
padding:14px;
background:#006400;
color:white;
border:none;
border-radius:10px;
font-size:17px;
cursor:pointer;
margin-top:15px;
">
🖨 Print ID Card
</button>

</div>

</div>

</div>
`;

});  
