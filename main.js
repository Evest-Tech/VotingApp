import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {  getAuth,  signOut,
  onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

import { verifySession, hasUserVoted } from "./database.js";


const firebaseConfig = {
  apiKey: "AIzaSyDKP3kMFIUM1B1uGKzbvbqeqXhM5iW5TdE",
  authDomain: "votingapp-5c924.firebaseapp.com",
  projectId: "votingapp-5c924",
  storageBucket: "votingapp-5c924.firebasestorage.app",
  messagingSenderId: "207343509772",
  appId: "1:207343509772:web:14386034c0d7f04e6fe929",
  measurementId: "G-09TR3JD7PK",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

let currentUserId = null;


// ✅ Prevent Redirection p
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user);
    currentUserId = user.uid;  // ✅ Get Google UUID
    if (window.location.pathname === "VotingApp/vote.html") {

    }
    // else if (window.location.pathname !== "VotingApp/index.html") {
    //   window.location.href = "index.html"; // Redirect only if not already there
    // }
    else if(!window.location.href.includes("index.html")) {
      window.location.href = "index.html";
    }
  } else {
    console.log("No user is signed in.");
    if (window.location.pathname === "VotingApp/index.html") {
      window.location.href = "signin.html"; // Redirect to login page if logged out
    }
  }
});

// ✅ Sign-Out Function
export async function SignOutHandler() {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
    window.location.href = "signin.html"; // Redirects correctly to login page
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
}

// ✅ Ensure Event Listener is Attached After DOM Loads
window.onload = function () {
  document.getElementById("sign-out")?.addEventListener("click", SignOutHandler);
};


// ✅ Handle Session Verification
document.getElementById("verify-session").addEventListener("click", async () => {
  const sessionId = document.getElementById("session-id").value;
  if (!sessionId) {
    alert("Please enter a session ID.");
    return;
  }

  const sessionCheck = await verifySession(sessionId);
  if (!sessionCheck.success) {
    alert(sessionCheck.message);
    return;
  }

  const voteCheck = await hasUserVoted(currentUserId, sessionId);
  if (voteCheck) {
    alert("You have already voted in this session.");
    return;
  }

  localStorage.setItem("sessionId", sessionId);
  alert("Verification successful! You can proceed to vote.");
  window.location.href = "vote.html";
});


