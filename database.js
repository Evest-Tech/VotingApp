import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
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
const db = getFirestore(app);



// ✅ Function to Store Vote in Firestore


// ✅ Function to Get User's Votes
export async function getUserVotes(userId) {
  const userVotesRef = collection(db, `users/${userId}/votes`);
  const querySnapshot = await getDocs(userVotesRef);

  let votes = [];
  querySnapshot.forEach((doc) => {
    votes.push({ sessionId: doc.id, ...doc.data() });
  });

  return votes;
}

// ✅ Function to Check if User Already Voted
export async function hasUserVoted(userId, sessionId) {
  const userRef = doc(db, `users/${userId}`);
  const userSnap = await getDoc(userRef);

  // ✅ If user doesn't exist, allow voting
  if (!userSnap.exists()) {
    console.log("New user detected. Allowing vote.");
    return false;
  }

  // ✅ Check if vote exists in user's document
  const voteRef = doc(db, `users/${userId}/votes`, sessionId);
  const voteSnap = await getDoc(voteRef);

  return voteSnap.exists(); // ✅ Returns true if user already voted
}


// ✅ Function to Verify Session ID
export async function verifySession(sessionId) {
  const sessionRef = doc(db, `sessions/${sessionId}`);
  const sessionSnap = await getDoc(sessionRef);

  if (!sessionSnap.exists()) {
    return { success: false, message: "Invalid session ID." };
  }
  return { success: true, message: "Session verified." };
}



