import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc
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


// ===============================
// GET FORM
// ===============================

const form = document.getElementById("registrationForm");


// ===============================
// APPLICATION ID
// ===============================

function generateApplicationId() {

    let number =
        Number(localStorage.getItem("lastApplicationId")) || 1000;

    number++;

    localStorage.setItem("lastApplicationId", number);

    return `TTT/SBNGR/${number}`;
}


// ===============================
// COMPRESS PASSPORT PHOTO
// ===============================

function compressImage(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function(event) {

            const img = new Image();

            img.onload = function() {

                const canvas = document.createElement("canvas");

                const maxWidth = 700;
                const maxHeight = 700;

                let width = img.width;
                let height = img.height;


                if (width > maxWidth) {

                    height =
                        height * (maxWidth / width);

                    width = maxWidth;
                }


                if (height > maxHeight) {

                    width =
                        width * (maxHeight / height);

                    height = maxHeight;
                }


                canvas.width = width;
                canvas.height = height;


                const ctx =
                    canvas.getContext("2d");

                ctx.drawImage(
                    img,
                    0,
                    0,
                    width,
                    height
                );


                // JPEG compression
                const compressed =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.65
                    );


                resolve(compressed);
            };


            img.onerror = function() {

                reject(
                    new Error("Unable to read image.")
                );
            };


            img.src = event.target.result;
        };


        reader.onerror = function() {

            reject(
                new Error("Unable to read passport photo.")
            );
        };


        reader.readAsDataURL(file);

    });
}


// ===============================
// SHOW ERROR
// ===============================

function showError(message) {

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
                padding:35px;
                border-radius:20px;
                max-width:420px;
                width:100%;
                text-align:center;
                box-shadow:0 10px 30px rgba(0,0,0,.15);
            ">

                <div style="
                    font-size:60px;
                    color:#dc2626;
                ">
                    ✕
                </div>

                <h2 style="color:#dc2626;">
                    Registration Failed
                </h2>

                <p style="
                    color:#555;
                    font-size:16px;
                ">
                    ${message}
                </p>

                <button
                    onclick="location.reload()"
                    style="
                        padding:13px 25px;
                        background:#006400;
                        color:white;
                        border:none;
                        border-radius:8px;
                        font-weight:bold;
                        font-size:16px;
                    "
                >
                    Try Again
                </button>

            </div>

        </div>
    `;
}


// ===============================
// SUBMIT FORM
// ===============================

if (form) {

    form.addEventListener("submit", async function(e) {

        e.preventDefault();


        try {

            // -------------------------
            // GET PASSPORT
            // -------------------------

            const passportInput =
                document.getElementById("passport");


            if (!passportInput) {

                throw new Error(
                    "Passport field was not found."
                );
            }


            const passport =
                passportInput.files[0];


            if (!passport) {

                alert(
                    "Please upload your passport photo."
                );

                return;
            }


            // -------------------------
            // COMPRESS PHOTO
            // -------------------------

            const compressedPassport =
                await compressImage(passport);


            // -------------------------
            // GET FORM VALUES
            // -------------------------

            const firstName =
                document.getElementById("firstName");

            const middleName =
                document.getElementById("middleName");

            const lastName =
                document.getElementById("lastName");

            const address =
                document.getElementById("address");

            const phoneNumber =
                document.getElementById("phoneNumber");

            const gender =
                document.getElementById("gender");

            const state =
                document.getElementById("state");

            const lga =
                document.getElementById("lga");

            const ward =
                document.getElementById("ward");


            // -------------------------
            // CHECK FIELDS
            // -------------------------

            const fields = {
                firstName,
                middleName,
                lastName,
                address,
                phoneNumber,
                gender,
                state,
                lga,
                ward
            };


            for (const [name, element] of Object.entries(fields)) {

                if (!element) {

                    throw new Error(
                        `Form field "${name}" was not found.`
                    );
                }
            }


            // -------------------------
            // SHOW SUBMITTING
            // -------------------------

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


            // -------------------------
            // CREATE APPLICATION
            // -------------------------

            const applicationId =
                generateApplicationId();


            const registration = {

                applicationId: applicationId,

                passport: compressedPassport,

                firstName:
                    firstName.value.trim(),

                middleName:
                    middleName.value.trim(),

                lastName:
                    lastName.value.trim(),

                address:
                    address.value.trim(),

                phoneNumber:
                    phoneNumber.value.trim(),

                gender:
                    gender.value,

                state:
                    state.value,

                lga:
                    lga.value,

                ward:
                    ward.value,

                status: "Pending",

                createdAt: new Date()
            };


            // -------------------------
            // SAVE TO FIREBASE
            // -------------------------

            await addDoc(
                collection(db, "registrations"),
                registration
            );


            // -------------------------
            // SUCCESS — NO 4 SECOND DELAY
            // -------------------------

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

                        <div style="
                            font-size:65px;
                            color:green;
                        ">
                            ✓
                        </div>

                        <h2 style="
                            color:#006400;
                        ">
                            Application Submitted Successfully
                        </h2>

                         <img
    src="${compressedPassport}"
    alt="Applicant Photo"
    style="
        width:110px;
        height:110px;
        object-fit:cover;
        border-radius:12px;
        border:3px solid #006400;
        margin:10px auto 15px;
        display:block;
    "
>
                        <p>
                            Your Application ID
                        </p>


                        <h2 style="
                            color:#006400;
                            letter-spacing:1px;
                        ">
                            ${applicationId}
                        </h2>


                        <p style="
                            color:#555;
                            font-size:14px;
                        ">
                            Please save your Application ID.
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
                            Back To Home
                        </button>

                    </div>

                </div>
            `;


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );

            showError(
                error.message
            );
        }

    });

} else {

    console.error(
        "registrationForm was not found."
    );
}


// ===============================
// ADMIN LOGIN
// ===============================

window.adminWarning = function() {

    const ok = confirm(
        "Administrator Access Only!\n\nDo you want to continue to the Admin Login page?"
    );

    if (ok) {

        window.location.href =
            "admin.html";
    }

};
