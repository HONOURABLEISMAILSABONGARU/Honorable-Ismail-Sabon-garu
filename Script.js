import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.17.0/firebase-firestore.js";

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

const form = document.getElementById("registrationForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const appId =
    "TTT-SBNGR-2027-APP-" +
    Math.floor(10000 + Math.random() * 90000);

  try {
    await addDoc(collection(db, "applications"), {
      applicationId: appId,
      firstName: document.getElementById("firstName").value,
      middleName: document.getElementById("middleName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      gender: document.getElementById("gender").value,
      state: document.getElementById("state").value,
      lga: document.getElementById("lga").value,
      ward: document.getElementById("ward").value,
      createdAt: new Date()
    });

    alert("Application Submitted Successfully!\n\nApplication ID: " + appId);

    form.reset();

  } catch (error) {
    alert("Error: " + error.message);
    console.log(error);
  }
});
