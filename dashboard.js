import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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

    totalApplications.innerHTML = snapshot.size + " Applications";

    applicantsList.innerHTML = "";

    snapshot.forEach((doc) => {

        const data = doc.data();

        applicantsList.innerHTML += `
        <div style="border:1px solid #ddd;padding:15px;border-radius:10px;margin-bottom:15px;">
            <b>${data.firstName} ${data.lastName}</b><br>
            📞 ${data.phoneNumber}<br>
            🆔 ${data.applicationId}<br>
            Status: ${data.status}
        </div>
        `;
    });

}

loadApplications();
