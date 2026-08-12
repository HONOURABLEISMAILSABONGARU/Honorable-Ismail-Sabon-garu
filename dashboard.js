import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  getCountFromServer,
  deleteDoc,
  doc
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

const registrationsRef =
  collection(db, "registrations");


const totalApplications =
  document.getElementById("totalApplications");

const applicantsList =
  document.getElementById("applicantsList");


/* ======================================
   SETTINGS
====================================== */

const PAGE_SIZE = 20;

let lastDocument = null;
let loading = false;
let hasMore = true;


/* ======================================
   ESCAPE HTML
====================================== */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* ======================================
   TOTAL APPLICATIONS
====================================== */

async function loadTotalApplications() {

  try {

    const countSnapshot =
      await getCountFromServer(
        registrationsRef
      );

    totalApplications.textContent =
      countSnapshot.data().count +
      " Applications";

  } catch (error) {

    console.error(
      "Count error:",
      error
    );

    totalApplications.textContent =
      "Applications";

  }

}


/* ======================================
   LOADING MESSAGE
====================================== */

function showLoadingMessage() {

  applicantsList.innerHTML = `

    <div style="
      text-align:center;
      padding:40px 20px;
      color:#006400;
      font-weight:bold;
    ">

      <div style="
        width:45px;
        height:45px;
        margin:0 auto 15px;
        border:5px solid #ddd;
        border-top:5px solid #006400;
        border-radius:50%;
        animation:dashboardSpin 1s linear infinite;
      "></div>

      Loading applications...

    </div>

    <style>
      @keyframes dashboardSpin {
        from {
          transform:rotate(0deg);
        }

        to {
          transform:rotate(360deg);
        }
      }
    </style>

  `;

}


/* ======================================
   DISPLAY ONE APPLICATION
====================================== */

function createApplicantCard(item) {

  const data = item.data();

  const passport =
    data.passport || "logo.png";


  const card =
    document.createElement("div");


  card.style.cssText = `
    background:#fff;
    padding:12px;
    margin-bottom:12px;
    border-radius:12px;
    box-shadow:0 2px 8px rgba(0,0,0,.10);
    display:flex;
    gap:12px;
    align-items:center;
  `;


  card.innerHTML = `

    <img
      src="${escapeHTML(passport)}"
      alt="Applicant"
      loading="lazy"
      style="
        width:70px;
        height:70px;
        object-fit:cover;
        border-radius:10px;
        border:2px solid #006400;
        flex-shrink:0;
        background:#eee;
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

        ${escapeHTML(data.firstName)}
        ${escapeHTML(data.middleName)}
        ${escapeHTML(data.lastName)}

      </h3>


      <p style="
        margin:3px 0;
        font-size:13px;
        word-break:break-word;
      ">

        <b>ID:</b>
        ${escapeHTML(data.applicationId)}

      </p>


      <p style="
        margin:3px 0;
        font-size:13px;
      ">

        <b>Phone:</b>
        ${escapeHTML(data.phoneNumber)}

      </p>

    </div>


    <div style="
      width:90px;
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

  `;


  return card;

}


/* ======================================
   LOAD APPLICATIONS
====================================== */

async function loadApplications(reset = false) {

  if (loading) {
    return;
  }


  if (!hasMore && !reset) {
    return;
  }


  loading = true;


  if (reset) {

    lastDocument = null;
    hasMore = true;

    showLoadingMessage();

  }


  try {

    let applicationsQuery;


    if (
      lastDocument &&
      !reset
    ) {

      applicationsQuery =
        query(
          registrationsRef,
          orderBy("createdAt", "desc"),
          startAfter(lastDocument),
          limit(PAGE_SIZE)
        );

    } else {

      applicationsQuery =
        query(
          registrationsRef,
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE)
        );

    }


    const snapshot =
      await getDocs(
        applicationsQuery
      );


    if (reset) {

      applicantsList.innerHTML = "";

    }


    if (snapshot.empty) {

      if (reset) {

        applicantsList.innerHTML = `

          <div style="
            text-align:center;
            padding:30px;
            color:#666;
          ">

            No applications found.

          </div>

        `;

      }

      hasMore = false;

      loading = false;

      return;

    }


    const fragment =
      document.createDocumentFragment();


    snapshot.forEach((item) => {

      const card =
        createApplicantCard(item);

      fragment.appendChild(card);

    });


    applicantsList.appendChild(
      fragment
    );


    lastDocument =
      snapshot.docs[
        snapshot.docs.length - 1
      ];


    if (
      snapshot.docs.length <
      PAGE_SIZE
    ) {

      hasMore = false;

    }


    updateLoadMoreButton();


  } catch (error) {

    console.error(
      "Firestore error:",
      error
    );


    if (reset) {

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
            onclick="loadApplications(true)"
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


  loading = false;

  updateLoadMoreButton();

}


/* ======================================
   LOAD MORE BUTTON
====================================== */

function updateLoadMoreButton() {

  let button =
    document.getElementById(
      "loadMoreApplications"
    );


  if (!button) {

    button =
      document.createElement("button");

    button.id =
      "loadMoreApplications";

    button.style.cssText = `
      display:block;
      width:100%;
      max-width:300px;
      margin:20px auto;
      padding:13px;
      background:#006400;
      color:#fff;
      border:none;
      border-radius:10px;
      font-size:15px;
      font-weight:bold;
      cursor:pointer;
    `;

    button.onclick = function() {

      loadApplications(false);

    };


    applicantsList.parentElement
      .appendChild(button);

  }


  if (!hasMore) {

    button.style.display = "none";

    return;

  }


  button.style.display = "block";


  if (loading) {

    button.textContent =
      "Loading...";

  } else {

    button.textContent =
      "Load More Applications";

  }

}


/* ======================================
   DELETE APPLICATION
====================================== */

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


  document.body.appendChild(
    overlay
  );


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


      await loadTotalApplications();

      await loadApplications(true);


    } catch (error) {

      console.error(
        error
      );


      overlay.remove();


      alert(
        "Failed to delete application."
      );

    }

  };

};


/* ======================================
   START DASHBOARD
====================================== */

async function startDashboard() {

  totalApplications.textContent =
    "Loading...";


  showLoadingMessage();


  // Load total and first 20 together
  await Promise.all([
    loadTotalApplications(),
    loadApplications(true)
  ]);

}


startDashboard();
