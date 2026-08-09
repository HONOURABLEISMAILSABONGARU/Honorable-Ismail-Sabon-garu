import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
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


// Compress passport
function compressImage(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function(e) {

            const img = new Image();

            img.onload = function() {

                const canvas = document.createElement("canvas");

                const maxWidth = 500;
                const maxHeight = 500;

                let width = img.width;
                let height = img.height;


                if (width > height) {

                    if (width > maxWidth) {
                        height =
                            height * (maxWidth / width);

                        width = maxWidth;
                    }

                } else {

                    if (height > maxHeight) {
                        width =
                            width * (maxHeight / height);

                        height = maxHeight;
                    }
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


                // JPEG quality
                canvas.toBlob(
                    function(blob) {

                        if (!blob) {
                            reject(
                                new Error(
                                    "Image compression failed."
                                )
                            );

                            return;
                        }


                        const compressedReader =
                            new FileReader();


                        compressedReader.onload =
                            function() {

                                resolve(
                                    compressedReader.result
                                );

                            };


                        compressedReader.onerror =
                            reject;

                        compressedReader.readAsDataURL(blob);

                    },
                    "image/jpeg",
                    0.65
                );

            };


            img.onerror = reject;

            img.src = e.target.result;

        };


        reader.onerror = reject;

        reader.readAsDataURL(file);

    });

}


if (!form) {

    console.log(
        "Registration form not found."
    );

} else {

    form.addEventListener(
        "submit",
        async function(e) {

            e.preventDefault();


            const passportInput =
                document.getElementById("passport");

            const passport =
                passportInput.files[0];


            if (!passport) {

                alert(
                    "Please upload your passport photo."
                );

                return;
            }


            // Maximum original file size = 2MB
            if (
                passport.size >
                2 * 1024 * 1024
            ) {

                alert(
                    "Passport photo must not be larger than 2MB."
                );

                return;
            }


            // Processing screen
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
                    animation:spin .7s linear infinite;
                "></div>

                <h2 style="
                    color:#006400;
                    margin-top:20px;
                ">
                    Processing...
                </h2>

                <p>
                    Please wait...
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

                // Compress passport first
                const compressedPassport =
                    await compressImage(
                        passport
                    );


                const applicationId =
                    generateApplicationId();


                const registration = {

                    applicationId:
                        applicationId,

                    passport:
                        compressedPassport,

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

                    status:
                        "Pending",

                    createdAt:
                        serverTimestamp()
                };


                await addDoc(
                    collection(
                        db,
                        "registrations"
                    ),
                    registration
                );


                // SUCCESS
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
                        box-shadow:
                        0 10px 30px
                        rgba(0,0,0,.15);
                    ">

                        <img
                            src="${compressedPassport}"
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
                        box-shadow:
                        0 10px 30px
                        rgba(0,0,0,.15);
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

        }
    );

}


window.adminWarning = function() {

    const ok = confirm(
        "Administrator Access Only!\n\nDo you want to continue to the Admin Login page?"
    );

    if (ok) {
        window.location.href =
            "admin.html";
    }

};
