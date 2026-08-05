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

async function loadApplications() {

    const snapshot = await getDocs(collection(db, "registrations"));

    totalApplications.textContent = snapshot.size + " Applications";

    applicantsList.innerHTML = "";

    snapshot.forEach((documentItem) => {

        const data = documentItem.data();

        applicantsList.innerHTML += `
        <div style="border:1px solid #ddd;padding:15px;border-radius:10px;margin-bottom:15px;">
            <b>${data.firstName} ${data.lastName}</b><br>
            📞 ${data.phoneNumber}<br>
            🆔 ${data.applicationId}<br>
${data.status === "Pending"
? `
<p>🟡 <b style="color:orange;">Pending</b></p>

<button
onclick="approveApplication('${documentItem.id}')"
style="padding:10px 15px;background:#16a34a;color:white;border:none;border-radius:8px;cursor:pointer;margin-right:8px;">
Approve
</button>

<button
onclick="deleteApplication('${documentItem.id}')"
style="padding:10px 15px;background:#dc2626;color:white;border:none;border-radius:8px;cursor:pointer;">
Delete
</button>
`
: `
<p>🟢 <b style="color:green;">Approved</b></p>

<button
onclick="deleteApplication('${documentItem.id}')"
style="padding:10px 15px;background:#dc2626;color:white;border:none;border-radius:8px;cursor:pointer;">
Delete
</button>
`
                               }

loadApplications();

window.approveApplication = async function(id){

    await updateDoc(doc(db,"registrations",id),{
        status:"Approved"
    });

    location.reload();
          }
window.deleteApplication = async function(id){

const ok = confirm("Are you sure you want to delete this application?");

if(!ok) return;

await deleteDoc(doc(db,"registrations",id));

alert("Application deleted successfully.");

location.reload();

                                               }
