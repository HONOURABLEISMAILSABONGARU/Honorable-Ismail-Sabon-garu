import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDvjnz9N6Kfntjv8CaKK-6ENjjyYnMOWOE",
  authDomain: "honourable-ismail-sabon-garu.firebaseapp.com",
  projectId: "honourable-ismail-sabon-garu",
  storageBucket: "honourable-ismail-sabon-garu.firebasestorage.app",
  messagingSenderId: "433993330936",
  appId: "1:433993330936:web:1c289e2fdf819d4cb3cb0d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("registrationForm");


// ===============================
// APPLICATION ID
// ===============================

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

        const maxSize = 600;

        let width = img.width;
        let height = img.height;

        if (width > height) {

          if (width > maxSize) {
            height =
              Math.round(height * maxSize / width);

            width = maxSize;
          }

        } else {

          if (height > maxSize) {
            width =
              Math.round(width * maxSize / height);

            height = maxSize;
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

        // JPEG compression
        let quality = 0.7;

        let compressed =
          canvas.toDataURL(
            "image/jpeg",
            quality
          );

        // Keep reducing until small
        while (
          compressed.length > 220000 &&
          quality > 0.3
        ) {

          quality -= 0.1;

          compressed =
            canvas.toDataURL(
              "image/jpeg",
              quality
            );
        }

        resolve(compressed);

      };

      img.onerror = reject;

      img.src = event.target.result;
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}


// ===============================
// SUBMIT FORM
// ===============================

if (!form) {

  console.error(
    "Registration form not found."
  );

} else {

  form.addEventListener(
    "submit",
    async function(e) {

      e.preventDefault();


      const passportInput =
        document.getElementById("passport");


      if (!passportInput) {

        alert(
          "Passport input not found."
        );

        return;
      }


      const passport =
        passportInput.files[0];


      if (!passport) {

        alert(
          "Please upload your passport photo."
        );

        return;
      }


      // Maximum original file size: 2MB

      if (passport.size > 2 * 1024 * 1024) {

        alert(
          "Passport photo must not be larger than 2MB."
        );

        return;
      }


      // ===============================
      // SHOW SUBMITTING
      // ===============================

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


      try {

        // Compress image first

        const compressedPassport =
          await compressImage(passport);


        const applicationId =
          generateApplicationId();


        // ===============================
        // GET FORM VALUES
        // ===============================

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


        // Check required elements

        if (
          !firstName ||
          !middleName ||
          !lastName ||
          !address ||
          !phoneNumber ||
          !gender ||
          !state ||
          !lga ||
          !ward
        ) {

          throw new Error(
            "One or more form fields are missing. Please check your HTML IDs."
          );
        }


        // ===============================
        // REGISTRATION DATA
        // ===============================

        const registration = {

          applicationId:

            applicationId,

          passport:

            compressedPassport,

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

          status:

            "Pending",

          createdAt:

            new Date()

        };


        // ===============================
        // SAVE TO FIRESTORE
        // ===============================

        await addDoc(
          collection(
            db,
            "registrations"
          ),
          registration
        );


        // ===============================
        // SUCCESS PAGE
        // ===============================

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
              background:#fff;
              padding:30px;
              border-radius:20px;
              max-width:420px;
              width:100%;
              text-align:center;
              box-shadow:0 10px 30px rgba(0,0,0,.15);
            ">

              <div style="
                font-size:60px;
                color:#008000;
              ">
                ✓
              </div>


              <h2 style="
                color:#006400;
                margin-bottom:15px;
              ">
                Application Submitted Successfully
              </h2>


              <img
                src="${compressedPassport}"
                alt="Applicant Photo"
                style="
                  width:120px;
                  height:120px;
                  object-fit:cover;
                  border-radius:12px;
                  border:3px solid #006400;
                  display:block;
                  margin:10px auto 18px;
                "
              >


              <p>
                Your Application ID
              </p>


              <h3 style="
                color:#006400;
                font-size:24px;
              ">
                ${applicationId}
              </h3>


              <p style="
                color:#555;
              ">
                Please save your Application ID.
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
                font-size:60px;
                color:#dc2626;
              ">
                ✕
              </div>

              <h2 style="
                color:#dc2626;
              ">
                Registration Failed
              </h2>

              <p style="
                color:#444;
                word-break:break-word;
              ">
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
                  cursor:pointer;
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


// ===============================
// ADMIN LOGIN
// ===============================

window.adminWarning =
function() {

  const ok = confirm(
    "Administrator Access Only!\n\nDo you want to continue to the Admin Login page?"
  );

  if (ok) {

    window.location.href =
      "admin.html";

  }

};
