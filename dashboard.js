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

    totalApplications.textContent = "Loading...";

    applicantsList.innerHTML = `
        <div style="
            text-align:center;
            padding:25px;
            color:#006400;
            font-weight:bold;
        ">
            Loading applications...
        </div>
    `;

    try {

        const snapshot = await Promise.race([
            getDocs(collection(db, "registrations")),

            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("timeout")), 5000)
            )
        ]);

        totalApplications.textContent =
            snapshot.size + " Applications";

        applicantsList.innerHTML = "";

        snapshot.forEach((documentItem) => {

            const data = documentItem.data();

            if (!data.passport) {
                data.passport = "logo.png";
            }

            applicantsList.innerHTML += `
                <div style="
                    background:#fff;
                    border-radius:12px;
                    padding:15px;
                    margin-bottom:15px;
                    box-shadow:0 2px 8px rgba(0,0,0,0.1);
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:15px;
                ">

                    <div style="
                        display:flex;
                        gap:15px;
                        align-items:center;
                    ">

                        <img
                            src="${data.passport}"
                            style="
                                width:80px;
                                height:80px;
                                border-radius:10px;
                                object-fit:cover;
                                border:2px solid #006400;
                            "
                        >

                        <div>

                            <h3 style="
                                margin:0 0 10px;
                                color:#006400;
                            ">
                                ${data.firstName}
                                ${data.middleName || ""}
                                ${data.lastName || ""}
                            </h3>

                            <p>
                                <b>ID:</b>
                                ${data.applicationId}
                            </p>

                            <p>
                                <b>Phone:</b>
                                ${data.phoneNumber}
                            </p>

                            <p>
                                Status:
                                <b style="
                                    color:${data.status === "Approved"
                                        ? "green"
                                        : "orange"};
                                ">
                                    ${data.status}
                                </b>
                            </p>

                        </div>
                    </div>

                    <div>

                        ${
                            data.status === "Pending"
                            ? `
                                <button
                                    onclick="approveApplication('${documentItem.id}')"
                                    style="
                                        padding:10px 15px;
                                        background:#16a34a;
                                        color:#fff;
                                        border:none;
                                        border-radius:8px;
                                        cursor:pointer;
                                    "
                                >
                                    ✅ Approve
                                </button>
                            `
                            : `
                                <p style="
                                    color:green;
                                    font-weight:bold;
                                    margin-bottom:10px;
                                    text-align:center;
                                ">
                                    ✅ Approved
                                </p>
                            `
                        }

                        <button
                            onclick="deleteApplication('${documentItem.id}')"
                            style="
                                padding:10px 15px;
                                background:#dc2626;
                                color:#fff;
                                border:none;
                                border-radius:8px;
                                cursor:pointer;
                            "
                        >
                            🗑️ Delete
                        </button>

                    </div>

                </div>
            `;

        });

    } catch (error) {

        console.error("Loading error:", error);

        totalApplications.textContent = "Unable to load";

        applicantsList.innerHTML = `
            <div style="
                text-align:center;
                padding:25px;
            ">

                <div style="
                    font-size:40px;
                    margin-bottom:10px;
                ">
                    ⚠️
                </div>

                <h3 style="color:#dc2626;">
                    Unable to load applications
                </h3>

                <p style="color:#555;">
                    Please check your internet connection
                    and try again.
                </p>

                <button
                    onclick="loadApplications()"
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
                    🔄 Try Again
                </button>

            </div>
        `;
    }
}

const data = documentItem.data();
if (!data.passport) {
    data.passport = "logo.png";
  }
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

    // Create custom confirmation popup
    const overlay = document.createElement("div");

    overlay.style.cssText = `
        position:fixed;
        inset:0;
        background:rgba(0,0,0,0.65);
        display:flex;
        align-items:center;
        justify-content:center;
        z-index:99999;
        padding:20px;
    `;

    overlay.innerHTML = `
        <div style="
            background:white;
            width:100%;
            max-width:380px;
            border-radius:20px;
            padding:25px;
            text-align:center;
            box-shadow:0 15px 40px rgba(0,0,0,0.3);
            font-family:Arial,sans-serif;
        ">

            <div style="
                width:65px;
                height:65px;
                margin:0 auto 15px;
                border-radius:50%;
                background:#fee2e2;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:32px;
            ">
                
            </div>

            <h2 style="
                margin:0 0 10px;
                color:#006400;
                font-size:24px;
            ">
                Delete Application
            </h2>

            <p style="
                margin:0 0 25px;
                color:#555;
                font-size:16px;
                line-height:1.5;
            ">
                Are you sure you want to delete this application?
                <br>
                <b>This action cannot be undone.</b>
            </p>

            <div style="
                display:flex;
                gap:12px;
            ">

                <button id="cancelDelete" style="
                    flex:1;
                    padding:13px;
                    border:none;
                    border-radius:10px;
                    background:#e5e7eb;
                    color:#333;
                    font-size:16px;
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
                    font-size:16px;
                    font-weight:bold;
                    cursor:pointer;
                ">
                    Delete
                </button>

            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Cancel
    document.getElementById("cancelDelete").onclick = function(){
        overlay.remove();
    };

    // Confirm Delete
    document.getElementById("confirmDelete").onclick = async function(){

        this.disabled = true;
        this.textContent = "Deleting...";

        try {

            await deleteDoc(
                doc(db, "registrations", id)
            );

            overlay.remove();

            loadApplications();

        } catch(error) {

            console.error(error);

            alert("Failed to delete application.");

            overlay.remove();
        }
    };
};

loadApplications();
