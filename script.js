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
alert("Submit button is working");
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

        <button onclick="showComingSoon()">Print Your ID Card</button>

        </div>

        </div>
        `;

    },5000);

})
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
