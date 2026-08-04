import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
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

const applicationId = "TTT-" + Date.now();

localStorage.setItem("applicationId", applicationId);

const passportFile = document.getElementById("passport").files[0];

if (!passportFile) {
alert("Please upload your passport photo.");
return;
}

try {

const storageRef = ref(storage, "passports/" + applicationId);

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
<div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f4f7f6;font-family:Arial;padding:20px;">

<div style="background:#fff;padding:30px;border-radius:20px;max-width:420px;width:100%;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.15);">

<div style="font-size:60px;color:green;">✓</div>

<h2>Application Received</h2>

<p>Your registration has been submitted successfully.</p>

<p><b>Application ID</b></p>

<h3 style="color:#006400;">${applicationId}</h3>

<button onclick="location.reload()" style="padding:12px 20px;background:#006400;color:#fff;border:none;border-radius:8px;cursor:pointer;">
Back To Home
</button>

</div>

</div>
`;

} catch(err) {

console.error(err);

alert("Registration failed. Please try again.");

}

});

}

window.adminWarning = function () {
    window.location.href = "admin.html";
};

window.openIdSearch = function () {

document.body.insertAdjacentHTML("beforeend", `
<div id="idSearchModal" style="
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.6);
display:flex;
justify-content:center;
align-items:center;
z-index:9999;
">

<div style="
background:#fff;
padding:25px;
border-radius:15px;
width:90%;
max-width:350px;
text-align:center;
">

<h2 style="color:#006400;">🪪 Print Your ID Card</h2>

<p>Enter the last 4 digits of your Application ID</p>

<input
id="searchId"
type="text"
maxlength="4"
placeholder="e.g. 4030"
style="width:100%;padding:12px;margin:15px 0;font-size:18px;text-align:center;">

<button onclick="searchIdCard()" style="width:100%;padding:12px;background:#006400;color:white;border:none;border-radius:8px;cursor:pointer;">
Search
</button>

<br><br>

<button onclick="document.getElementById('idSearchModal').remove()" style="padding:10px 20px;background:#dc2626;color:white;border:none;border-radius:8px;cursor:pointer;">
Close
</button>

</div>
</div>
`);
};

window.searchIdCard = async function () {

const last4 = document.getElementById("searchId").value.trim();

if(last4.length !== 4){
alert("Enter the last 4 digits.");
return;
}

const snapshot = await getDocs(collection(db,"registrations"));

let found = null;

snapshot.forEach((doc)=>{
const data = doc.data();

if(data.applicationId &&
data.applicationId.slice(-4) === last4){
found = data;
}

});

if(!found){
alert("Application ID not found.");
return;
}

document.getElementById("idSearchModal").remove();

if(found.status !== "Approved"){

document.body.innerHTML=`
<div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f4f7f6;font-family:Arial;">
<div style="background:white;padding:30px;border-radius:20px;text-align:center;max-width:400px;">
<h2 style="color:orange;">🟡 ID Card Pending</h2>
<p>Your ID Card has not been approved yet.</p>
<button onclick="location.reload()">Back To Home</button>
</div>
</div>
`;
return;

}

showIdCard(found);

};

window.showIdCard = function(found){

document.body.innerHTML=`
<div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#eef2f3;padding:20px;font-family:Arial;">

<div style="width:340px;background:white;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.25);">

<div style="background:linear-gradient(135deg,#006400,#0b8f4d);padding:20px;text-align:center;color:white;">

<img src="20260802_132740.png"
style="width:70px;height:70px;border-radius:50%;background:white;padding:5px;">

<h2>HONOURABLE ISMAIL SABON GARU</h2>
<p>MEMBERSHIP ID CARD</p>

</div>

<div style="padding:20px;text-align:center;">

<img src="${found.passport}"
style="width:110px;height:110px;border-radius:10px;border:3px solid #006400;object-fit:cover;">

<h3>${found.firstName} ${found.lastName}</h3>

<hr>

<p><b>Application ID</b><br>${found.applicationId}</p>

<p><b>Phone</b><br>${found.phoneNumber}</p>

<p><b>Ward</b><br>${found.ward}</p>

<p><b>LGA</b><br>${found.lga}</p>

<p><b>State</b><br>${found.state}</p>

<p style="color:green;font-weight:bold;font-size:18px;">
✅ APPROVED
</p>

<button onclick="window.print()" style="width:100%;padding:12px;background:#006400;color:white;border:none;border-radius:8px;font-size:16px;">
Download / Print ID Card
</button>

</div>

</div>

</div>
`;

};
