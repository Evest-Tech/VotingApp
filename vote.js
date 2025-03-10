
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {  getAuth,  signOut,
  onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import {  hasUserVoted } from "./database.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";




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
const db = getFirestore(app);

let currentUserId = null;


// ✅ Prevent Redirection p
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user);
    currentUserId = user.uid;  // ✅ Get Google UUID
    if (window.location.pathname === "VotingApp/vote.html") {
      
    }
    else if (window.location.pathname !== "VotingApp/index.html") {
      // window.location.href = "index.html"; // Redirect only if not already there
    }
  } else {
    console.log("No user is signed in.");
    if (window.location.pathname === "VotingApp/index.html") {
      window.location.href = "signin.html"; // Redirect to login page if logged out
    }
  }
});
  // ✅ Handle Voting in vote.html
  const voteButton = document.getElementById("submit-vote");
  if (voteButton) {
    var currentSessionId = localStorage.getItem("sessionId"); // Retrieve stored session ID
    console.log("Current Session ID:", currentSessionId);
    voteButton.addEventListener("click", async () => {
      if (!currentUserId || !currentSessionId) {
        // alert("Something went wrong. Please verify your session again.");
        return;
      }

      const selectedVote = document.querySelector('input[name="vote"]:checked');
      if (!selectedVote) {
        // alert("Please select a candidate before submitting.");
        return;
      }
     

      const voterName = localStorage.getItem("voterName") || "Unknown";
      const aadhaarNumber = localStorage.getItem("aadhaarNumber") || "0000";

      const result = await castVote(currentUserId, currentSessionId, voterName, aadhaarNumber, selectedVote.value);
      if (result.success) {
        alert("Your vote has been recorded successfully!");
        window.location.href = "/thanking.html"; // Redirect after successful vote      } else {
        alert(result.message);
      }
    });
  }

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
  document.getElementById("submit-vote").addEventListener("click", async function () {
    try {
         // Assume this checks voting status

        if (hasUserVoted()) {
            console.error("User has already voted in this session.");
            let voteModal = new bootstrap.Modal(document.getElementById("voteWarningModal"));
            voteModal.show();
            return;
        }

        // Continue with vote submission logic...
    } catch (error) {
        console.error("Error checking vote status:", error);
    }
});
// document.addEventListener("DOMContentLoaded", () => {
//   // Get the modal trigger button
//   const submitVoteButton = document.getElementById("submit-vote");
//   const okButton = document.getElementById("ok-button");

//   if (submitVoteButton) {
//       submitVoteButton.addEventListener("click", function () {
//           showModal();
//       });
//   }

 function showModal() {
   let modal = new bootstrap.Modal(document.getElementById("voteModal"));
   modal.show();
   let okButton = document.getElementById("ok-button");
 
 if (okButton) {
   okButton.addEventListener("click", function () {
     SignOutHandler();          // Redirect to signin.html
   });
 }
 }
 

 export async function castVote(userId, sessionId, voterName, aadhaarNumber, voteChoice) {
   const voteRef = doc(db, `users/${userId}/votes`, sessionId);
   const voteSnap = await getDoc(voteRef);
 
   if (voteSnap.exists()) {
     showModal();
     // console.error("User has already voted in this session.");
     return { success: false, message: "User has already voted in this session." };
   }
 
   try {
     await setDoc(voteRef, {
       vote: voteChoice,
       time: serverTimestamp(),
       voterName: voterName,
       aadhaarNumber: aadhaarNumber
     });
     console.log("Vote recorded successfully.");
 
     return { success: true, message: "Vote recorded successfully." };
 
   } catch (error) {
     console.error("Error storing vote: ", error);
     return { success: false, message: "Error storing vote." };
   }
 }
// });


  