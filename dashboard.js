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
  AIzaSyDvjnzN9K6fntjv8CaKK-6ENjjyYnMOWOE
  authDomain: "honourable-ismail-sabon-garu.firebaseapp.com",
  projectId: "honourable-ismail-sabon-garu",
  storageBucket: "honourable-ismail-sabon-garu.firebasestorage.app",
  messagingSenderId: "433993330936",
  appId: "1:433993330936:web:1c289e2fdf819d4cb3cb0d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const totalApplications = document.getElementById("totalApplications");
const applicantsList = document.getElementById("applicantsList");
async function loadApplications() {

  const snapshot = await getDocs(collection(db, "registrations"));

  totalApplications.textContent = snapshot.size + " Applications";

  applicantsList.innerHTML = "";

  snapshot.forEach((documentItem) => {

    const data = documentItem.data();

    applicantsList.innerHTML += `

    <div style="
      border:1px solid #ddd;
      border-radius:12px;
      padding:15px;
      margin-bottom:15px;
      background:#fff;
    ">

      <div style="display:flex;gap:15px;align-items:center;">

        <img src="${data.passport}"
        style="
        width:80px;
        height:80px;
        border-radius:10px;
        object-fit:cover;
        border:2px solid #006400;
        ">

        <div>

          <h3>${data.firstName} ${data.lastName}</h3>

          <p>🆔 ${data.applicationId}</p>

          <p>📞 ${data.phoneNumber}</p>

          <p>Status:
          <b style="color:${data.status==="Approved"?"green":"orange"}">
          ${data.status}
          </b>
          </p>

        </div>

      </div>

      <div id="btn-${documentItem.id}" style="margin-top:15px;">
            ${data.status === "Pending" ? `

      <button
      onclick="approveApplication('${documentItem.id}')"
      style="
      padding:10px 18px;
      background:#16a34a;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      margin-right:10px;
      ">
      ✅ Approve
      </button>

      ` : `

      <span style="
      color:green;
      font-weight:bold;
      margin-right:15px;
      ">
      ✅ Approved
      </span>

      `}

      <button
      onclick="deleteApplication('${documentItem.id}')"
      style="
      padding:10px 18px;
      background:#dc2626;
      color:white;
      border:none;
      border-radius:8px;
      cursor:pointer;
      ">
      🗑 Delete
      </button>

      </div>

    </div>

    `;
  });

  }
window.approveApplication = async function(id){

  await updateDoc(doc(db,"registrations",id),{
    status:"Approved"
  });

  loadApplications();

};

window.deleteApplication = async function(id){

  const confirmDelete = confirm("Are you sure you want to delete this application?");

  if(!confirmDelete) return;

  await deleteDoc(doc(db,"registrations",id));

  loadApplications();

};
async function loadApplications() {

try{

const snapshot = await getDocs(collection(db,"registrations"));

totalApplications.textContent = snapshot.size + " Applications";

applicantsList.innerHTML = "";

// duk code ɗin da ke cikin loadApplications ya ci gaba kamar yadda yake

}catch(error){

console.error(error);

totalApplications.textContent = "Error loading data";

applicantsList.innerHTML = `
<div style="
padding:20px;
background:#fee2e2;
border-radius:10px;
color:#b91c1c;
font-weight:bold;
">
❌ Failed to load applications.<br><br>
Check your Firebase configuration or Firestore Rules.
</div>
`;

}

    }
