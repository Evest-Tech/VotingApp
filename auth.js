// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {
  getAuth,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const provider = new GoogleAuthProvider();

// ✅ Prevent Redirection Loop
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user);
    if (window.location.pathname !== "/index.html") {  
      window.location.href = "index.html"; // Redirect only if not already there
    }
  } else {
    console.log("No user is signed in.");
    if (window.location.pathname === "/index.html") {
      window.location.href = "signin.html"; // Redirect back to login page if logged out
    }
  }
});

// ✅ Google Sign-In Function
export async function handleGoogleSignIn() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("User signed in with Google:", result.user);
    window.location.href = "index.html"; // Redirect after successful login
  } catch (error) {
    console.error("Google Sign-In Error:", error);
  }
}

// ✅ Email/Password Sign-Up Function
export async function SignUpHandler(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    window.location.href = "index.html"; // Redirect after signup
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      console.warn("Email already in use, trying to login...");
      LoginHandler(event); // Try logging in if email is already used
    } else {
      console.error("Sign-Up Error:", error);
      alert(`Error: ${error.message}`);
    }
  }
}

// ✅ Email/Password Login Function
export async function LoginHandler(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    window.location.href = "index.html"; // Redirect after login
  } catch (error) {
    console.error("Login Error:", error);
    alert(`Error: ${error.message}`);
  }
}



// ✅ Attach Event Listeners
document.getElementById("google-sign-in")?.addEventListener("click", handleGoogleSignIn);
document.getElementById("sign-up")?.addEventListener("click", SignUpHandler);
document.getElementById("sign-in")?.addEventListener("click", LoginHandler);
