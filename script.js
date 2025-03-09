// ✅ Import Firebase SDK Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
import { castVote, checkIfUserHasVoted } from "./database.js"; // Ensure database.js exports these functions

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDKP3kMFIUM1B1uGKzbvbqeqXhM5iW5TdE",
  authDomain: "votingapp-5c924.firebaseapp.com",
  projectId: "votingapp-5c924",
  storageBucket: "votingapp-5c924.appspot.com", // Fixed storage URL
  messagingSenderId: "207343509772",
  appId: "1:207343509772:web:14386034c0d7f04e6fe929",
  measurementId: "G-09TR3JD7PK",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
let currentUserId = null;

// ✅ Handle Authentication State
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user);
    currentUserId = user.uid;

    if (window.location.pathname === "/confirm.html") {
      return;
    }
    
    if (window.location.pathname !== "/votemyi.html") {
      // window.location.href = "index.html"; // Uncomment if redirection is needed
    }
  } else {
    console.log("No user is signed in.");
    if (window.location.pathname === "/votemyi.html") {
      window.location.href = "signin.html"; // Redirect to login page if logged out
    }
  }
});

// ✅ Run Only When DOM is Ready
window.onload = function () {
  const voteButton = document.getElementById("submit-vote");
  const signOutButton = document.getElementById("sign-out");

  if (voteButton) {
    let currentSessionId = "sess-2"; // Define session ID
    console.log("Current Session ID:", currentSessionId);

    voteButton.addEventListener("click", async () => {
      if (!currentUserId || !currentSessionId) {
        alert("Something went wrong. Please verify your session again.");
        return;
      }

      const selectedVote = document.querySelector('input[name="vote"]:checked');
      if (!selectedVote) {
        alert("Please select a candidate before submitting.");
        return;
      }

      const voterName = localStorage.getItem("voterName") || "Unknown";
      const aadhaarNumber = localStorage.getItem("aadhaarNumber") || "0000";

      try {
        const result = await castVote(currentUserId, currentSessionId, voterName, aadhaarNumber, selectedVote.value);
        if (result.success) {
          alert("Your vote has been recorded successfully!");
          window.location.href = "/thanking.html"; // Redirect after successful vote
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Vote submission error:", error);
      }
    });
  }

  // ✅ Attach Sign-Out Button Event Listener
  if (signOutButton) {
    signOutButton.addEventListener("click", SignOutHandler);
  }

  // ✅ Prevent Multiple Votes
  if (voteButton) {
    voteButton.addEventListener("click", async function () {
      try {
        if (typeof checkIfUserHasVoted === "function") {
          const voteSnap = await checkIfUserHasVoted();
          if (voteSnap.exists()) {
            console.error("User has already voted in this session.");
            let voteModal = new bootstrap.Modal(document.getElementById("voteWarningModal"));
            voteModal.show();
            return;
          }
        } else {
          console.warn("checkIfUserHasVoted function is not defined.");
        }
      } catch (error) {
        console.error("Error checking vote status:", error);
      }
    });
  }
};

// ✅ Sign-Out Function
export async function SignOutHandler() {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
    window.location.href = "signin.html";
  } catch (error) {
    console.error("Sign-Out Error:", error);
  }
}
