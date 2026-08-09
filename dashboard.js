import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  getDocsFromCache,
  deleteDoc,
  doc
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

const registrationsRef = collection(db, "registrations");

const totalApplications =
  document.getElementById("totalApplications");

const applicantsList =
  document.getElementById("applicantsList");


// ======================================
// DISPLAY APPLICATIONS
// ======================================

function displayApplications(snapshot) {

  totalApplications.textContent =
    snapshot.size + " Applications";

  applicantsList.innerHTML = "";

  if (snapshot.empty) {

    applicantsList.innerHTML = `
      <div style="
        text-align:center;
        padding:30px;
        color:#666;
      ">
        No applications found.
      </div>
    `;

    return;
  }


  snapshot.forEach((item) => {

    const data = item.data();

    const passport =
      data.passport || "logo.png";


    applicantsList.innerHTML += `

      <div style="
        background:#fff;
        padding:12px;
        margin-bottom:12px;
        border-radius:12px;
        box-shadow:0 2px 8px rgba(0,0,0,.10);
        display:flex;
        gap:12px;
        align-items:center;
      ">

        <img
          src="${passport}"
          style="
            width:70px;
            height:70px;
            object-fit:cover;
            border-radius:10px;
            border:2px solid #006400;
            flex-shrink:0;
          "
        >

        <div style="
          flex:1;
          min-width:0;
        ">

          <h3 style="
            margin:0 0 6px;
            color:#006400;
            font-size:17px;
            word-break:break-word;
          ">
            ${data.firstName || ""}
            ${data.middleName || ""}
            ${data.lastName || ""}
          </h3>

          <p style="
            margin:3px 0;
            font-size:13px;
            word-break:break-word;
          ">
            <b>ID:</b>
            ${data.applicationId || ""}
          </p>

          <p style="
            margin:3px 0;
            font-size:13px;
          ">
            <b>Phone:</b>
            ${data.phoneNumber || ""}
          </p>

        </div>


        <div style="
          width:100px;
          flex-shrink:0;
        ">

          <button
            onclick="deleteApplication('${item.id}')"
            style="
              width:100%;
              padding:8px;
              background:#dc2626;
              color:white;
              border:none;
              border-radius:7px;
              cursor:pointer;
              font-size:13px;
            "
          >
            🗑 Delete
          </button>

        </div>

      </div>

    `;

  });

}


// ======================================
// LOAD APPLICATIONS
// ======================================

async function loadApplications() {

  totalApplications.textContent = "Loading...";

  applicantsList.innerHTML = `
    <div style="
      text-align:center;
      padding:30px;
      color:#006400;
      font-weight:bold;
    ">
      Loading applications...
    </div>
  `;


  // First try local cache
  try {

    const cached =
      await getDocsFromCache(registrationsRef);

    if (!cached.empty) {
      displayApplications(cached);
    }

  } catch (cacheError) {

    console.log("No local cache yet.");

  }


  // Then get latest data from Firebase
  try {

    const fresh =
      await getDocs(registrationsRef);

    displayApplications(fresh);

  } catch (error) {

    console.error(
      "Firestore error:",
      error
    );


    if (
      totalApplications.textContent === "Loading..."
    ) {

      totalApplications.textContent =
        "Unable to load";

      applicantsList.innerHTML = `
        <div style="
          text-align:center;
          padding:30px;
        ">

          <div style="
            font-size:40px;
            margin-bottom:10px;
          ">
            ⚠️
          </div>

          <h3 style="
            color:#dc2626;
          ">
            Unable to load applications
          </h3>

          <p style="
            color:#555;
            font-size:14px;
          ">
            Please check your internet connection.
          </p>

          <button
            onclick="loadApplications()"
            style="
              padding:10px 20px;
              background:#006400;
              color:white;
              border:none;
              border-radius:8px;
              cursor:pointer;
              font-weight:bold;
            "
          >
            🔄 Try Again
          </button>

        </div>
      `;

    }

  }

}


// ======================================
// DELETE APPLICATION
// ======================================

window.deleteApplication =
async function(id) {

  const overlay =
    document.createElement("div");


  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,.65);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:99999;
    padding:20px;
  `;


  overlay.innerHTML = `

    <div style="
      width:100%;
      max-width:380px;
      background:#fff;
      border-radius:20px;
      padding:25px;
      text-align:center;
      font-family:Arial,sans-serif;
      box-shadow:0 15px 40px rgba(0,0,0,.3);
    ">

      <div style="
        font-size:40px;
        margin-bottom:10px;
      ">
        🗑️
      </div>

      <h2 style="
        color:#006400;
        margin:0 0 10px;
      ">
        Delete Application
      </h2>

      <p style="
        color:#555;
        line-height:1.5;
        margin-bottom:25px;
      ">
        Are you sure you want to delete this application?
        <br>
        <b>This action cannot be undone.</b>
      </p>

      <div style="
        display:flex;
        gap:10px;
      ">

        <button
          id="cancelDelete"
          style="
            flex:1;
            padding:13px;
            border:none;
            border-radius:10px;
            background:#e5e7eb;
            color:#333;
            font-weight:bold;
          "
        >
          Cancel
        </button>

        <button
          id="confirmDelete"
          style="
            flex:1;
            padding:13px;
            border:none;
            border-radius:10px;
            background:#dc2626;
            color:#fff;
            font-weight:bold;
          "
        >
          Delete
        </button>

      </div>

    </div>

  `;


  document.body.appendChild(overlay);


  document.getElementById(
    "cancelDelete"
  ).onclick = function() {

    overlay.remove();

  };


  document.getElementById(
    "confirmDelete"
  ).onclick = async function() {

    this.disabled = true;

    this.textContent =
      "Deleting...";


    try {

      await deleteDoc(
        doc(
          db,
          "registrations",
          id
        )
      );

      overlay.remove();

      await loadApplications();

    } catch (error) {

      console.error(error);

      overlay.remove();

      alert(
        "Failed to delete application."
      );

    }

  };

};


// ======================================
// START
// ======================================

loadApplications();
