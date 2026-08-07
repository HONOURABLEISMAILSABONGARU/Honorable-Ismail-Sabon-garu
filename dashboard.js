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

const totalApplications = document.getElementById("totalApplications");
const applicantsList = document.getElementById("applicantsList");

async function loadApplications(){

const snapshot = await getDocs(collection(db,"registrations"));

totalApplications.textContent = snapshot.size + " Applications";

applicantsList.innerHTML = "";
  snapshot.forEach((documentItem)=>{

const data = documentItem.data();

applicantsList.innerHTML += `

<div style="
background:#fff;
border-radius:12px;
padding:15px;
margin-bottom:15px;
box-shadow:0 2px 8px rgba(0,0,0,.1);
display:flex;
justify-content:space-between;
align-items:center;
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

<h3>${data.firstName} ${data.middleName} ${data.lastName}</h3>

<p><b>ID:</b> ${data.applicationId}</p>

<p><b>Phone:</b> ${data.phoneNumber}</p>

<p>
Status:
<b style="color:${data.status==="Approved"?"green":"orange"};">
${data.status}
</b>
</p>

</div>

</div>

<div>
${data.status === "Pending" ? `

<button
onclick="approveApplication('${documentItem.id}')"
style="
padding:10px 15px;
background:#16a34a;
color:#fff;
border:none;
border-radius:8px;
cursor:pointer;
margin-bottom:10px;
width:100%;
">
✅ Approve
</button>

` : `

<p style="
color:green;
font-weight:bold;
margin-bottom:10px;
text-align:center;
">
✅ Approved
</p>

`}

<button
onclick="deleteApplication('${documentItem.id}')"
style="
padding:10px 15px;
background:#dc2626;
color:#fff;
border:none;
border-radius:8px;
cursor:pointer;
width:100%;
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

}

window.deleteApplication = async function(id){

const ok = confirm("Are you sure you want to delete this application?");

if(!ok) return;

await deleteDoc(doc(db,"registrations",id));

loadApplications();

}

loadApplications();
