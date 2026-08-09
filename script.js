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

const form = document.getElementById("registrationForm");


// ========================================
// APPLICATION ID
// ========================================

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


// ========================================
// COMPRESS PASSPORT PHOTO
// ========================================

function compressPassport(file) {

  return new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.onload = function(event) {

      const img = new Image();

      img.onload = function() {

        const canvas =
          document.createElement("canvas");

        const maxSize = 800;

        let width = img.width;
        let height = img.height;


        if (width > height) {

          if (width > maxSize) {

            height =
              height * (maxSize / width);

            width = maxSize;

          }

        } else {

          if (height > maxSize) {

            width =
              width * (maxSize / height);

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


        canvas.toBlob(
          function(blob) {

            if (!blob) {

              reject(
                new Error(
                  "Unable to compress passport photo."
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
              function() {

                reject(
                  new Error(
                    "Unable to read compressed photo."
                  )
                );

              };


            compressedReader.readAsDataURL(blob);

          },
          "image/jpeg",
          0.70
        );

      };


      img.onerror = function() {

        reject(
          new Error(
            "Invalid passport image."
          )
        );

      };


      img.src = event.target.result;

    };


    reader.onerror = function() {

      reject(
        new Error(
          "Unable to read passport photo."
        )
      );

    };


    reader.readAsDataURL(file);

  });

}


// ========================================
// SUBMIT FORM
// ========================================

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


      // ==================================
      // PROCESSING SCREEN
      // ==================================

      document.body.innerHTML = `

        <div style="
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          flex-direction:column;
          background:#f4f7f6;
          font-family:Arial,sans-serif;
          padding:20px;
          text-align:center;
        ">


          <div style="
            width:65px;
            height:65px;
            border:7px solid #ddd;
            border-top:7px solid #006400;
            border-radius:50%;
            animation:spin 0.8s linear infinite;
          "></div>


          <h2 style="
            margin-top:20px;
            color:#006400;
          ">
            Processing Your Application...
          </h2>


          <p style="
            color:#555;
          ">
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


        // ==================================
        // COMPRESS PHOTO
        // ==================================

        const compressedPassport =
          await compressPassport(passport);


        // ==================================
        // GENERATE APPLICATION ID
        // ==================================

        const applicationId =
          generateApplicationId();


        // ==================================
        // REGISTRATION DATA
        // ==================================

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
            new Date()

        };


        // ==================================
        // SAVE TO FIREBASE
        // ==================================

        await addDoc(
          collection(
            db,
            "registrations"
          ),
          registration
        );


        // ==================================
        // SUCCESS PAGE
        // ==================================

        document.body.innerHTML = `

          <div style="
            min-height:100vh;
            display:flex;
            justify-content:center;
            align-items:center;
            background:#f4f7f6;
            padding:20px;
            font-family:Arial,sans-serif;
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
                color:green;
                font-size:55px;
                margin-bottom:10px;
              ">
                ✓
              </div>


              <h2 style="
                margin:0 0 20px;
                color:#222;
              ">
                Application Submitted Successfully
              </h2>


              <!-- PASSPORT PHOTO -->

              <img
                src="${compressedPassport}"
                alt="Applicant Passport"
                style="
                  width:120px;
                  height:120px;
                  object-fit:cover;
                  border-radius:12px;
                  border:3px solid #006400;
                  margin-bottom:15px;
                "
              >


              <p style="
                margin:5px 0;
                color:#555;
              ">
                Your Application ID
              </p>


              <h3 style="
                color:#006400;
                font-size:24px;
                letter-spacing:1px;
                margin:8px 0 15px;
              ">
                ${applicationId}
              </h3>


              <p style="
                color:#555;
                font-size:14px;
                line-height:1.5;
              ">
                Please save this Application ID.
                You will need it for your registration records.
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
                  margin-top:10px;
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


        alert(
          "Registration failed: " +
          error.message
        );


        location.reload();

      }

    }

  );

}


// ========================================
// ADMIN WARNING
// ========================================

window.adminWarning =
function() {

  const ok =
    confirm(
      "Administrator Access Only!\n\nDo you want to continue to the Admin Login page?"
    );


  if (ok) {

    window.location.href =
      "admin.html";

  }

};
