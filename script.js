import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
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


function generateApplicationId() {

    let lastNumber =
        Number(localStorage.getItem("lastApplicationId")) || 1000;

    lastNumber++;

    localStorage.setItem(
        "lastApplicationId",
        lastNumber
    );

    return `TTT/SBNGR/${lastNumber}`;
}


if (!form) {

    console.log("Registration form not found.");

} else {

    form.addEventListener("submit", async function(e) {

        e.preventDefault();


        const passportInput =
            document.getElementById("passport");

        const passport =
            passportInput.files[0];


        if (!passport) {

            alert("Please upload your passport photo.");

            return;
        }


        // Maximum 2MB
        if (passport.size > 2 * 1024 * 1024) {

            alert(
                "Passport photo must not be larger than 2MB."
            );

            return;
        }


        // Show processing
        document.body.innerHTML = `

        <div style="
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            flex-direction:column;
            background:#f4f7f6;
            font-family:Arial;
            text-align:center;
            padding:20px;
        ">

            <div style="
                width:55px;
                height:55px;
                border:6px solid #ddd;
                border-top:6px solid #006400;
                border-radius:50%;
                animation:spin 0.8s linear infinite;
            "></div>

            <h2 style="
                margin-top:20px;
                color:#006400;
            ">
                Submitting...
            </h2>

            <p>
                Please wait a moment.
            </p>

            <style>
                @keyframes spin {
                    from {
                        transform:rotate(0deg);
                    }

                    to {
                        transform:rotate(360deg);
                    }
                }
            </style>

        </div>

        `;


        try {

            // Create unique Application ID
            const applicationId =
                generateApplicationId();


            // Create unique image name
            const imageName =
                `passport_${applicationId.replaceAll("/", "_")}_${Date.now()}`;


            // Firebase Storage location
            const storageRef =
                ref(storage, `passports/${imageName}`);


            // Upload passport to Storage
            await uploadBytes(
                storageRef,
                passport
            );


            // Get passport URL
            const passportURL =
                await getDownloadURL(storageRef);


            // Save only URL in Firestore
            const registration = {

                applicationId: applicationId,

                passport: passportURL,

                firstName:
                    document
                    .getElementById("firstName")
                    .value
                    .trim(),

                middleName:
                    document
                    .getElementById("middleName")
                    .value
                    .trim(),

                lastName:
                    document
                    .getElementById("lastName")
                    .value
                    .trim(),

                address:
                    document
                    .getElementById("address")
                    .value
                    .trim(),

                phoneNumber:
                    document
                    .getElementById("phoneNumber")
                    .value
                    .trim(),

                gender:
                    document
                    .getElementById("gender")
                    .value,

                state:
                    document
                    .getElementById("state")
                    .value,

                lga:
                    document
                    .getElementById("lga")
                    .value,

                ward:
                    document
                    .getElementById("ward")
                    .value,

                status: "Pending",

                createdAt: serverTimestamp()
            };


            // Save registration
            await addDoc(
                collection(db, "registrations"),
                registration
            );


            // SUCCESS PAGE
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
                    background:white;
                    padding:30px;
                    border-radius:20px;
                    max-width:420px;
                    width:100%;
                    text-align:center;
                    box-shadow:0 10px 30px rgba(0,0,0,.15);
                ">

                    <img
                        src="${passportURL}"
                        style="
                            width:110px;
                            height:110px;
                            object-fit:cover;
                            border-radius:12px;
                            border:3px solid #006400;
                            margin-bottom:15px;
                        "
                    >

                    <div style="
                        font-size:55px;
                        color:green;
                    ">
                        ✓
                    </div>

                    <h2>
                        Application Submitted Successfully
                    </h2>

                    <p>
                        Your Application ID
                    </p>

                    <h3 style="
                        color:#006400;
                        font-size:22px;
                    ">
                        ${applicationId}
                    </h3>

                    <p style="
                        color:#555;
                    ">
                        Please save your Application ID
                        for future reference.
                    </p>

                    <button
                        onclick="location.reload()"
                        style="
                            padding:12px 25px;
                            background:#006400;
                            color:#fff;
                            border:none;
                            border-radius:8px;
                            cursor:pointer;
                            font-weight:bold;
                        "
                    >
                        Back To Home
                    </button>

                </div>

            </div>

            `;


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            document.body.innerHTML = `

            <div style="
                min-height:100vh;
                display:flex;
                justify-content:center;
                align-items:center;
                background:#f4f7f6;
                padding:20px;
                font-family:Arial;
                text-align:center;
            ">

                <div style="
                    background:white;
                    padding:30px;
                    border-radius:20px;
                    max-width:420px;
                    width:100%;
                    box-shadow:0 10px 30px rgba(0,0,0,.15);
                ">

                    <div style="
                        font-size:55px;
                        color:#dc2626;
                    ">
                        ✕
                    </div>

                    <h2 style="
                        color:#dc2626;
                    ">
                        Registration Failed
                    </h2>

                    <p>
                        ${error.message}
                    </p>

                    <button
                        onclick="location.reload()"
                        style="
                            padding:12px 25px;
                            background:#006400;
                            color:white;
                            border:none;
                            border-radius:8px;
                            font-weight:bold;
                        "
                    >
                        Try Again
                    </button>

                </div>

            </div>

            `;

        }

    });

}


window.adminWarning = function() {

    const ok = confirm(
        "Administrator Access Only!\n\nDo you want to continue to the Admin Login page?"
    );

    if (ok) {

        window.location.href = "admin.html";

    }

};
