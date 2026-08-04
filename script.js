import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where
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
form.addEventListener("submit", async (e) => {
e.preventDefault();
    const applicationId = "TTT-" + Date.now();

    localStorage.setItem("applicationId", applicationId);

    const registration = {
        applicationId: applicationId,
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

    try {

        await addDoc(collection(db, "registrations"), registration);

    } catch (error) {

        console.error(error);
        alert("Registration failed.");
        return;

    }

    document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;background:#f4f7f6;font-family:Arial">

        <div style="width:70px;height:70px;border:8px solid #ddd;border-top:8px solid green;border-radius:50%;animation:spin 1s linear infinite"></div>

        <h2 style="margin-top:20px;color:green;">Processing Your Application...</h2>

        <p>Please wait...</p>

    </div>

    <style>
    @keyframes spin{
    from{transform:rotate(0deg);}
    to{transform:rotate(360deg);}
    }
    </style>
    `;

    setTimeout(() => {

        document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f4f7f6;padding:20px;font-family:Arial">

        <div style="background:white;padding:30px;border-radius:20px;max-width:420px;width:100%;text-align:center">

        <div style="font-size:60px;color:green;">✓</div>

        <h2>Application Received</h2>

        <p>Your registration has been submitted successfully.</p>

        <h3 style="color:green">${applicationId}</h3>

        <button onclick="location.reload()">Back To Home</button>
        </div>

        </div>
        `;
}, 5000);

});
window.showComingSoon = async function () {

    const applicationId = localStorage.getItem("applicationId");

    if (!applicationId) {
        alert("Application not found.");
        return;
    }

    const q = query(
        collection(db, "registrations"),
        where("applicationId", "==", applicationId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        alert("Application not found.");
        return;
    }

    const data = snapshot.docs[0].data();

    if (data.status === "Pending") {

        document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f4f7f6;padding:20px;font-family:Arial;">
            <div style="background:#fff;padding:30px;border-radius:20px;max-width:420px;width:100%;text-align:center;">
                <h2 style="color:orange;">🟡 ID Card Pending</h2>

                <p>
                Your ID Card has not been approved yet.<br><br>
                Please wait for the Administrator to approve your application.
                </p>

                <button onclick="location.reload()">
                    Back To Home
                </button>

            </div>
        </div>
        `;

    } else {

        document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f4f7f6;padding:20px;font-family:Arial;">

            <div style="background:white;width:360px;padding:25px;border-radius:20px;text-align:center;">

                <h2>HONOURABLE ISMAIL SABON GARU</h2>

                <h3>MEMBERSHIP ID CARD</h3>

                <hr>

                <p><b>Name:</b> ${data.firstName} ${data.lastName}</p>

                <p><b>Phone:</b> ${data.phoneNumber}</p>

                <p><b>Application ID:</b> ${data.applicationId}</p>

                <p><b>Ward:</b> ${data.ward}</p>

                <p><b>LGA:</b> ${data.lga}</p>

                <p><b>State:</b> ${data.state}</p>

                <p style="color:green;font-weight:bold;">
                🟢 APPROVED
                </p>

                <button onclick="window.print()">
                    Print ID Card
                </button>

            </div>

        </div>
        `;

    }

};

window.adminWarning = function () {
    window.location.href = "admin.html";
};
window.openIdSearch = function () {

document.body.insertAdjacentHTML("beforeend", `
<div id="idSearchPopup" style="
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
width:90%;
max-width:380px;
padding:25px;
border-radius:15px;
text-align:center;
">

<h2 style="color:#006400;">
🪪 Print Your ID Card
</h2>

<p>
Enter the last 4 digits of your Application ID
</p>

<input
id="lastFourDigits"
type="text"
maxlength="4"
placeholder="Example: 4030"
style="
width:100%;
padding:12px;
margin:15px 0;
border:2px solid #ddd;
border-radius:8px;
text-align:center;
font-size:18px;
">

<div style="display:flex;gap:10px;">

<button onclick="closePopup()"
style="
flex:1;
padding:12px;
background:#dc2626;
color:#fff;
border:none;
border-radius:8px;
cursor:pointer;
">
Cancel
</button>

<button onclick="searchApplication()"
style="
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

<h2 style="color:#006400;">
🪪 Print Your ID Card
</h2>

<p>Enter the last 4 digits of your Application ID</p>

<input
id="searchId"
type="text"
maxlength="4"
placeholder="e.g. 4030"
style="
width:100%;
padding:12px;
font-size:18px;
text-align:center;
margin:15px 0;
">

<button onclick="searchIdCard()" style="
width:100%;
padding:12px;
background:#006400;
color:#fff;
border:none;
border-radius:8px;
font-size:16px;
font-weight:bold;
">
Search
</button>

<br><br>

<button onclick="document.getElementById('idSearchModal').remove()" style="
background:#dc2626;
color:white;
padding:10px 18px;
border:none;
border-radius:8px;
">
Close
</button>

</div>

</div>
`);

};
window.closePopup = function () {
const popup = document.getElementById("idSearchPopup");
if (popup) popup.remove();
};
window.searchApplication = async function () {

const lastFour = document.getElementById("lastFourDigits").value.trim();

if(lastFour.length !== 4){
alert("Please enter the last 4 digits.");
return;
}

const snapshot = await getDocs(collection(db,"registrations"));

let found = null;

snapshot.forEach((docItem)=>{

const data = docItem.data();

if(data.applicationId &&
data.applicationId.endsWith(lastFour)){

found = data;

 
if(!found){
alert("Application ID not found.");
return;
}

closePopup();

if(found.status==="Pending"){

document.body.innerHTML=`
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f4f7f6;
font-family:Arial;
">

<div style="
background:#fff;
padding:30px;
border-radius:20px;
text-align:center;
max-width:400px;
width:90%;
">

<h2 style="color:orange;">
🪪 ID Card Pending
</h2>

<p>
Your application is still pending approval.
</p>

<button onclick="location.reload()">
Back To Home
</button>

</div>

</div>
`;

}else{

showIdCard(found);
}

};
window.showIdCard = function(found){

document.body.innerHTML = `
<div style="
min-height:100vh;
display:flex;
justify-content:center;
align-items:center;
background:#f3f6f8;
padding:20px;
font-family:Arial;
">

<div style="
width:340px;
background:white;
border-radius:18px;
overflow:hidden;
box-shadow:0 10px 30px rgba(0,0,0,.25);
">

<div style="
background:linear-gradient(135deg,#006400,#0b8f4d);
padding:20px;
text-align:center;
color:white;
">

<img src="20260802_132740.png"
style="
width:70px;
height:70px;
border-radius:50%;
background:white;
padding:5px;
">

<h2 style="margin:10px 0 5px;">
HONOURABLE ISMAIL SABON GARU
</h2>

<p style="margin:0;">
MEMBERSHIP ID CARD
</p>

</div>

<div style="padding:20px;text-align:center;">

<img src="https://via.placeholder.com/110"
style="
width:110px;
height:110px;
border-radius:10px;
border:3px solid #006400;
object-fit:cover;
">

<h3>${found.firstName} ${found.lastName}</h3>

<hr>

<p><b>Application ID:</b><br>${found.applicationId}</p>

<p><b>Phone:</b><br>${found.phoneNumber}</p>

<p><b>Ward:</b><br>${found.ward}</p>

<p><b>LGA:</b><br>${found.lga}</p>

<p><b>State:</b><br>${found.state}</p>

<p style="
color:green;
font-weight:bold;
font-size:18px;
">
✅ APPROVED
</p>

<button
onclick="window.print()"
style="
width:100%;
padding:12px;
background:#006400;
color:white;
border:none;
border-radius:8px;
font-size:16px;
margin-top:10px;
">
Download / Print ID Card
</button>

</div>

</div>

</div>
`;

};
