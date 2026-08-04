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

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const applicationId = "TTT-" + Date.now();

    localStorage.setItem("applicationId", applicationId);

    const passportFile = document.getElementById("passport").files[0];

    if (!passportFile) {
        alert("Please upload your passport photo.");
        return;
    }

    const storageRef = ref(storage, "passports/" + applicationId + ".jpg");

    await uploadBytes(storageRef, passportFile);

    const passportURL = await getDownloadURL(storageRef);
      const registration = {
        applicationId: applicationId,
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

    try {
        await addDoc(collection(db, "registrations"), registration);
    } catch (error) {
        console.error(error);
        alert("Registration failed.");
        return;
    }

    document.body.innerHTML = `
    <div style="min-height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;background:#f4f7f6;font-family:Arial">

        <div style="width:70px;height:70px;border:8px solid #ddd;border-top:8px solid green;border-radius:50%;animation:none"></div>

        <h2 style="margin-top:20px;color:green;">Processing Your Application...</h2>

        <p>Please wait...</p>

    </div>
    `;

    setTimeout(() => {

        document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f4f7f6;padding:20px;font-family:Arial">

            <div style="background:white;padding:30px;border-radius:20px;max-width:420px;width:100%;text-align:center">

                <div style="font-size:60px;color:green;">✓</div>

                <h2>Application Received</h2>

                <p>Your registration has been submitted successfully.</p>

                <h3 style="color:green;">${applicationId}</h3>

                <button onclick="location.reload()">
                    Back To Home
                </button>

            </div>

        </div>
        `;

    }, 5000);

});
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
style="
width:100%;
padding:12px;
font-size:18px;
text-align:center;
margin:15px 0;
">

<button onclick="searchIdCard()"
style="
width:100%;
padding:12px;
background:#006400;
color:#fff;
border:none;
border-radius:8px;
font-size:16px;
font-weight:bold;
cursor:pointer;
">
Search
</button>

<br><br>

<button onclick="document.getElementById('idSearchModal').remove()"
style="
background:#dc2626;
color:white;
padding:10px 18px;
border:none;
border-radius:8px;
cursor:pointer;
">
Close
</button>

</div>

</div>
`);
};
window.searchIdCard = async function () {

    const last4 = document.getElementById("searchId").value.trim();

    if (last4.length !== 4) {
        alert("Please enter the last 4 digits of your Application ID.");
        return;
    }

    const snapshot = await getDocs(collection(db, "registrations"));

    let found = null;

    snapshot.forEach((docItem) => {
        const data = docItem.data();

        if (data.applicationId && data.applicationId.slice(-4) === last4) {
            found = data;
        }
    });

    if (!found) {
        alert("Application ID not found.");
        return;
    }

    document.getElementById("idSearchModal").remove();

    if (found.status !== "Approved") {

        document.body.innerHTML = `
        <div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f4f7f6;font-family:Arial;">
            <div style="background:#fff;padding:30px;border-radius:20px;text-align:center;max-width:400px;width:90%;">
                <h2 style="color:orange;">🪪 ID Card Pending</h2>
                <p>Your application is still pending approval.</p>
                <button onclick="location.reload()">Back To Home</button>
            </div>
        </div>
        `;
        return;
    }

    showIdCard(found);
};

window.showIdCard = function(found){

document.body.innerHTML = `
<div style="min-height:100vh;display:flex;justify-content:center;align-items:center;background:#f3f
