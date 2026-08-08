import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
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

const totalApplications =
  document.getElementById("totalApplications");

const applicantsList =
  document.getElementById("applicantsList");

function showLoading() {

  totalApplications.textContent = "Loading...";

  applicantsList.innerHTML = `
    <div style="
      text-align:center;
      padding:25px;
      color:#006400;
      font-weight:bold;
    ">
      ⏳ Loading applications...
    </div>
  `;
}

showLoading();
Promise.race([
  getDocs(collection(db, "registrations")),

  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), 5000)
  )
]);
window.approveApplication = async function(id) {

  try {

    await updateDoc(
      doc(db, "registrations", id),
      {
        status: "Approved"
      }
    );

    loadApplications();

  } catch (error) {

    console.error(error);

    alert("Failed to approve application.");

  }

};


window.deleteApplication = async function(id) {

  const overlay = document.createElement("div");

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
      background:white;
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

        <button id="cancelDelete" style="
          flex:1;
          padding:13px;
          border:none;
          border-radius:10px;
          background:#e5e7eb;
          color:#333;
          font-weight:bold;
          cursor:pointer;
        ">
          Cancel
        </button>

        <button id="confirmDelete" style="
          flex:1;
          padding:13px;
          border:none;
          border-radius:10px;
          background:#dc2626;
          color:white;
          font-weight:bold;
          cursor:pointer;
        ">
          Delete
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(overlay);


  document.getElementById("cancelDelete").onclick = function() {

    overlay.remove();

  };


  document.getElementById("confirmDelete").onclick = async function() {

    this.disabled = true;
    this.textContent = "Deleting...";

    try {

      await deleteDoc(
        doc(db, "registrations", id)
      );

      overlay.remove();

      loadApplications();

    } catch (error) {

      console.error(error);

      overlay.remove();

      alert("Failed to delete application.");

    }

  };

};


// Start loading after dashboard opens

setTimeout(() => {

  loadApplications();

}, 100);
