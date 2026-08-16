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


const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);

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
   CHECK HTML ELEMENTS
====================================== */

if (!totalApplications) {

  console.error(
    "Element #totalApplications was not found."
  );

}

if (!applicantsList) {

  console.error(
    "Element #applicantsList was not found."
  );

}


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
   LOADING MESSAGE
====================================== */

function showLoadingMessage() {

  if (!applicantsList) {
    return;
  }

  applicantsList.innerHTML = `

    <div style="
      text-align:center;
      padding:30px 15px;
      color:#006400;
      font-weight:bold;
    ">

      <div style="
        width:40px;
        height:40px;
        margin:0 auto 12px;
        border:4px solid #ddd;
        border-top:4px solid #006400;
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
   TOTAL APPLICATIONS
====================================== */

async function loadTotalApplications() {

  if (!totalApplications) {
    return;
  }

  try {

    totalApplications.textContent =
      "Loading...";


    const countSnapshot =
      await getCountFromServer(
        registrationsRef
      );


    const count =
      countSnapshot.data().count;


    totalApplications.textContent =
      count + " Applications";


  } catch (error) {

    console.error(
      "Total applications error:",
      error
    );


    totalApplications.textContent =
      "Applications";

  }

}


/* ======================================
   CREATE APPLICANT CARD
====================================== */

function createApplicantCard(item) {

  const data =
    item.data();


  const passport =
    data.passport || "logo.png";


  const voterCard =
    data.voterCard || "";


  const firstName =
    data.firstName || "";


  const middleName =
    data.middleName || "";


  const lastName =
    data.lastName || "";


  const applicationId =
    data.applicationId || "";


  const phoneNumber =
    data.phoneNumber || "";


  const card =
    document.createElement("div");


  card.style.cssText = `
    background:#fff;
    padding:10px;
    margin:0 auto 12px;
    max-width:360px;
    border-radius:12px;
    box-shadow:0 2px 6px rgba(0,0,0,.10);
  `;


  card.innerHTML = `

    <!-- APPLICANT HEADER -->

    <div style="
      display:flex;
      gap:10px;
      align-items:center;
    ">


      <!-- PASSPORT -->

      <img
        src="${escapeHTML(passport)}"
        alt="Applicant Passport"
        loading="lazy"
        style="
          width:58px;
          height:58px;
          object-fit:cover;
          border-radius:9px;
          border:2px solid #006400;
          flex-shrink:0;
          background:#eee;
          display:block;
        "
      >


      <!-- APPLICANT INFORMATION -->

      <div style="
        flex:1;
        min-width:0;
      ">


        <h3 style="
          margin:0 0 5px;
          color:#006400;
          font-size:16px;
          line-height:1.2;
          word-break:break-word;
        ">

          ${escapeHTML(firstName)}
          ${middleName ? " " + escapeHTML(middleName) : ""}
          ${lastName ? " " + escapeHTML(lastName) : ""}

        </h3>


        <p style="
          margin:3px 0;
          font-size:13px;
          line-height:1.3;
          word-break:break-word;
        ">

          <b>ID:</b>
          ${escapeHTML(applicationId)}

        </p>


        <p style="
          margin:3px 0;
          font-size:13px;
          line-height:1.3;
          word-break:break-word;
        ">

          <b>Phone:</b>
          ${escapeHTML(phoneNumber)}

        </p>


      </div>


    </div>


    <!-- VOTER CARD -->

    <div style="
      margin-top:12px;
      padding-top:12px;
      border-top:1px solid #ddd;
    ">


      <h4 style="
        margin:0 0 8px;
        color:#006400;
        font-size:15px;
      ">

        Voter's Card

      </h4>


      ${
        voterCard

        ? `

          <div style="
            width:100%;
            max-width:320px;
            margin:0 auto;
            text-align:center;
          ">


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
                border-radius:9px;
                background:#f3f4f6;
              "
            >


          </div>

        `

        : `

          <div style="
            padding:14px;
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


    <!-- DELETE BUTTON -->

    <button
      onclick="deleteApplication('${escapeHTML(item.id)}')"
      style="
        width:100%;
        margin-top:12px;
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

  if (!applicantsList) {
    return;
  }


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
      max-width:280px;
      margin:15px auto 25px;
      padding:12px;
      background:#006400;
      color:#fff;
      border:none;
      border-radius:9px;
      font-size:14px;
      font-weight:bold;
      cursor:pointer;
    `;


    button.onclick =
      function() {

        loadApplications(false);

      };


    const parent =
      applicantsList.parentElement;


    if (parent) {

      parent.appendChild(button);

    }

  }


  if (!hasMore) {

    button.style.display =
      "none";

    return;

  }


  button.style.display =
    "block";


  if (loading) {

    button.textContent =
      "Loading...";

    button.disabled =
      true;

  } else {

    button.textContent =
      "Load More Applications";

    button.disabled =
      false;

  }

}


/* ======================================
   LOAD APPLICATIONS
====================================== */

async function loadApplications(
  reset = false
) {

  if (!applicantsList) {
    return;
  }


  if (loading) {
    return;
  }


  if (
    !hasMore &&
    !reset
  ) {

    return;

  }


  loading =
    true;


  updateLoadMoreButton();


  if (reset) {

    lastDocument =
      null;

    hasMore =
      true;


    showLoadingMessage();

  }


  try {

    let applicationsQuery;


    /* ==============================
       FIRST PAGE
    ============================== */

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
          limit(
            PAGE_SIZE
          )
        );

    }


    /* ==============================
       NEXT PAGE
    ============================== */

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
          limit(
            PAGE_SIZE
          )
        );

    }


    const snapshot =
      await getDocs(
        applicationsQuery
      );


    /* ==============================
       RESET LIST
    ============================== */

    if (reset) {

      applicantsList.innerHTML =
        "";

    }


    /* ==============================
       NO APPLICATIONS
    ============================== */

    if (snapshot.empty) {

      if (reset) {

        applicantsList.innerHTML = `

          <div style="
            text-align:center;
            padding:30px 15px;
            color:#666;
          ">

            <div style="
              font-size:35px;
              margin-bottom:8px;
            ">
              📋
            </div>

            <p style="
              margin:0;
              font-size:14px;
            ">

              No applications found.

            </p>

          </div>

        `;

      }


      hasMore =
        false;


      loading =
        false;


      updateLoadMoreButton();


      return;

    }


    /* ==============================
       CREATE CARDS
    ============================== */

    const fragment =
      document.createDocumentFragment();


    snapshot.forEach(
      (item) => {

        const card =
          createApplicantCard(
            item
          );


        fragment.appendChild(
          card
        );

      }
    );


    applicantsList.appendChild(
      fragment
    );


    /* ==============================
       SAVE LAST DOCUMENT
    ============================== */

    lastDocument =
      snapshot.docs[
        snapshot.docs.length - 1
      ];


    /* ==============================
       CHECK IF MORE EXISTS
    ============================== */

    if (
      snapshot.docs.length <
      PAGE_SIZE
    ) {

      hasMore =
        false;

    }


  } catch (error) {

    console.error(
      "Firestore error:",
      error
    );


    if (reset) {

      applicantsList.innerHTML = `

        <div style="
          text-align:center;
          padding:25px 15px;
        ">

          <div style="
            font-size:38px;
            margin-bottom:8px;
          ">
            ⚠️
          </div>


          <h3 style="
            color:#dc2626;
            margin:0 0 8px;
            font-size:17px;
          ">

            Unable to load applications

          </h3>


          <p style="
            color:#555;
            font-size:13px;
            margin:0 0 15px;
          ">

            Please check your internet connection
            and try again.

          </p>


          <button
            onclick="loadApplications(true)"
            style="
              padding:10px 18px;
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
      max-width:350px;
      background:#fff;
      border-radius:18px;
      padding:22px;
      text-align:center;
      font-family:Arial,sans-serif;
      box-shadow:0 15px 40px rgba(0,0,0,.3);
    ">


      <div style="
        font-size:38px;
        margin-bottom:8px;
      ">

        🗑️

      </div>


      <h2 style="
        color:#006400;
        margin:0 0 10px;
        font-size:21px;
      ">

        Delete Application

      </h2>


      <p style="
        color:#555;
        line-height:1.5;
        margin-bottom:20px;
        font-size:14px;
      ">

        Are you sure you want to delete
        this application?

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
            padding:12px;
            border:none;
            border-radius:9px;
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
            padding:12px;
            border:none;
            border-radius:9px;
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


  const cancelButton =
    document.getElementById(
      "cancelDelete"
    );


  const confirmButton =
    document.getElementById(
      "confirmDelete"
    );


  cancelButton.onclick =
    function() {

      overlay.remove();

    };


  confirmButton.onclick =
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


        /* Reload total */

        await loadTotalApplications();


        /* Reload first 20 */

        await loadApplications(
          true
        );


      } catch (error) {

        console.error(
          "Delete error:",
          error
        );


        overlay.remove();


        alert(
          "Failed to delete application. Please try again."
        );

      }

    };

};


/* ======================================
   START DASHBOARD
====================================== */

async function startDashboard() {

  if (!totalApplications ||
      !applicantsList) {

    console.error(
      "Dashboard HTML elements are missing."
    );

    return;

  }


  totalApplications.textContent =
    "Loading...";


  showLoadingMessage();


  /*
    Load total and first 20
    at the same time.
  */

  await Promise.all([
    loadTotalApplications(),
    loadApplications(true)
  ]);

}


/* ======================================
   START
====================================== */

startDashboard();
