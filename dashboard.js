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


/* ======================================
   FIREBASE
====================================== */

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


/* ======================================
   HTML ELEMENTS
====================================== */

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

  if (
    value === null ||
    value === undefined
  ) {
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

    const count =
      countSnapshot.data().count;

    totalApplications.textContent =
      `${count} Applications`;

  } catch (error) {

    console.error(
      "TOTAL COUNT ERROR:",
      error
    );

    totalApplications.textContent =
      "Unable to count applications";

  }

}


/* ======================================
   LOADING
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
   ERROR MESSAGE
====================================== */

function showErrorMessage(error) {

  console.error(
    "DASHBOARD ERROR:",
    error
  );

  applicantsList.innerHTML = `

    <div style="
      text-align:center;
      padding:30px 20px;
    ">

      <div style="
        font-size:45px;
        margin-bottom:10px;
      ">
        ⚠️
      </div>

      <h3 style="
        color:#dc2626;
        margin-bottom:10px;
      ">
        Unable to load applications
      </h3>

      <p style="
        color:#555;
        font-size:14px;
        line-height:1.5;
        word-break:break-word;
      ">
        ${escapeHTML(error?.message || "Unknown error")}
      </p>

      <button
        id="retryApplications"
        style="
          margin-top:15px;
          padding:11px 20px;
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


  const retryButton =
    document.getElementById(
      "retryApplications"
    );


  if (retryButton) {

    retryButton.onclick =
      function() {

        loadApplications(true);

      };

  }

}


/* ======================================
   CREATE APPLICANT CARD
====================================== */

function createApplicantCard(item) {

  const data = item.data();

  const passport =
    data.passport || "logo.png";

  const voterCard =
    data.voterCard || "";


  const card =
    document.createElement("div");


  card.style.cssText = `
    background:#fff;
    padding:10px;
    margin-bottom:10px;
    border-radius:12px;
    box-shadow:0 2px 6px rgba(0,0,0,.10);
    max-width:360px;
    margin-left:auto;
    margin-right:auto;
`;


  card.innerHTML = `

    <!-- APPLICANT HEADER -->

    <div style="
      display:flex;
      gap:12px;
      align-items:center;
    ">

      <img
        src="${escapeHTML(passport)}"
        alt="Applicant Passport"
        loading="lazy"
        style="
          width:58px;
          height:58px;
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
          ${data.middleName
            ? " " + escapeHTML(data.middleName)
            : ""}
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
          word-break:break-word;
        ">

          <b>Phone:</b>
          ${escapeHTML(data.phoneNumber)}

        </p>

      </div>

    </div>


    <!-- VOTER CARD -->

    <div style="
      margin-top:15px;
      padding-top:15px;
      border-top:1px solid #ddd;
    ">

      <h4 style="
        margin:0 0 10px;
        color:#006400;
        font-size:15px;
      ">

        Voter's Card

      </h4>


      ${
        voterCard

        ? `

          <img
            src="${escapeHTML(voterCard)}"
            alt="Voter's Card"
            loading="lazy"
            style="
              width:100%;
              max-width:320px;
              max-height:220px;
              object-fit:contain;
              display:block;
              margin:auto;
              border:2px solid #006400;
              border-radius:10px;
              background:#f3f4f6;
            "
          >

        `

        : `

          <div style="
            padding:15px;
            background:#f3f4f6;
            border-radius:8px;
            color:#777;
            text-align:center;
            font-size:13px;
          ">

            No Voter's Card uploaded

          </div>

        `
      }

    </div>


    <!-- DELETE -->

    <button
      onclick="deleteApplication('${escapeHTML(item.id)}')"
      style="
        width:100%;
        margin-top:15px;
        padding:10px;
        background:#dc2626;
        color:white;
        border:none;
        border-radius:8px;
        cursor:pointer;
        font-size:14px;
        font-weight:bold;
      "
    >

      🗑 Delete Application

    </button>

  `;


  return card;

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


    button.onclick =
      function() {

        loadApplications(false);

      };


    applicantsList.parentElement
      .appendChild(button);

  }


  if (!hasMore) {

    button.style.display =
      "none";

    return;

  }


  button.style.display =
    "block";


  if (loading) {

    button.disabled =
      true;

    button.textContent =
      "Loading...";

  } else {

    button.disabled =
      false;

    button.textContent =
      "Load More Applications";

  }

}


/* ======================================
   LOAD APPLICATIONS
====================================== */

async function loadApplications(
  reset = false
) {

  if (loading) {
    return;
  }


  if (
    !reset &&
    !hasMore
  ) {
    return;
  }


  loading = true;


  if (reset) {

    lastDocument = null;

    hasMore = true;

    showLoadingMessage();

  }


  updateLoadMoreButton();


  try {

    let applicationsQuery;


    /* FIRST 20 */

    if (
      reset ||
      !lastDocument
    ) {

      applicationsQuery =
        query(
          registrationsRef,
          orderBy(
            "createdAt",
            "desc"
          ),
          limit(PAGE_SIZE)
        );

    }


    /* NEXT 20 */

    else {

      applicationsQuery =
        query(
          registrationsRef,
          orderBy(
            "createdAt",
            "desc"
          ),
          startAfter(
            lastDocument
          ),
          limit(PAGE_SIZE)
        );

    }


    const snapshot =
      await getDocs(
        applicationsQuery
      );


    /* RESET LIST */

    if (reset) {

      applicantsList.innerHTML =
        "";

    }


    /* NO DATA */

    if (snapshot.empty) {

      hasMore =
        false;


      if (reset) {

        applicantsList.innerHTML = `

          <div style="
            text-align:center;
            padding:30px;
            color:#666;
          ">

            <div style="
              font-size:40px;
              margin-bottom:10px;
            ">
              📋
            </div>

            <h3>
              No applications found
            </h3>

          </div>

        `;

      }


      loading =
        false;

      updateLoadMoreButton();

      return;

    }


    /* CREATE CARDS */

    const fragment =
      document.createDocumentFragment();


    snapshot.forEach(
      function(item) {

        const card =
          createApplicantCard(item);

        fragment.appendChild(card);

      }
    );


    applicantsList.appendChild(
      fragment
    );


    /* SAVE LAST DOCUMENT */

    lastDocument =
      snapshot.docs[
        snapshot.docs.length - 1
      ];


    /* CHECK IF THERE ARE MORE */

    if (
      snapshot.docs.length <
      PAGE_SIZE
    ) {

      hasMore =
        false;

    }


  } catch (error) {

    showErrorMessage(error);

  }


  loading =
    false;


  updateLoadMoreButton();

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

        <br><br>

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
            cursor:pointer;
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
            cursor:pointer;
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
  ).onclick =
    function() {

      overlay.remove();

    };


  document.getElementById(
    "confirmDelete"
  ).onclick =
    async function() {

      this.disabled =
        true;

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

        await loadApplications(
          true
        );


      } catch (error) {

        console.error(
          "DELETE ERROR:",
          error
        );


        overlay.remove();


        alert(
          "Failed to delete application:\n\n" +
          error.message
        );

      }

    };

};


/* ======================================
   START DASHBOARD
====================================== */

async function startDashboard() {

  if (
    !totalApplications ||
    !applicantsList
  ) {

    console.error(
      "Dashboard HTML elements not found."
    );

    return;

  }


  totalApplications.textContent =
    "Loading...";


  showLoadingMessage();


  await Promise.all([
    loadTotalApplications(),
    loadApplications(true)
  ]);

}


startDashboard();
