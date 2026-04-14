// ===== Modern Firebase V9 Modular SDK Helper =====
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase config — Using Environment Variables securely via Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

let app = null;
let auth = null;
let recaptchaVerifier = null;
let confirmationResult = null;

// Initialize Firebase (lazy, only when needed)
export function initFirebase() {
  if (app) return { app, auth };

  // Handle Vite HMR nicely: reuse existing app if present
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
  
  auth = getAuth(app);
  auth.useDeviceLanguage();
  
  // Initialize analytics safely if supported by browser
  isSupported().then(supported => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch(() => {});

  return { app, auth };
}

// Setup the invisible reCAPTCHA verifier
export function setupRecaptcha(buttonId) {
  const { auth } = initFirebase();

  // Clear any previous verifier
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch(e) { }
  }

  // Modern V9 Syntax: auth instance goes first
  recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved — will proceed with sendOTP
    },
    'expired-callback': () => {
      console.warn('reCAPTCHA expired, please try again');
    }
  });

  return recaptchaVerifier;
}

// Send OTP to a phone number
export async function sendOTP(phoneNumber) {
  const { auth } = initFirebase();

  if (!recaptchaVerifier) {
    throw new Error('reCAPTCHA not initialized. Call setupRecaptcha first.');
  }

  // Format phone number with country code
  const formattedPhone = phoneNumber.startsWith('+91') 
    ? phoneNumber 
    : `+91${phoneNumber}`;

  try {
    confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Send OTP error:', error);
    // Reset recaptcha on error
    try {
      recaptchaVerifier.clear();
    } catch(e) {}
    recaptchaVerifier = null;
    throw error;
  }
}

// Verify the OTP code
export async function verifyOTP(code) {
  if (!confirmationResult) {
    throw new Error('No OTP was sent. Call sendOTP first.');
  }

  try {
    const result = await confirmationResult.confirm(code);
    const phone = result.user.phoneNumber;
    return { success: true, phone };
  } catch (error) {
    console.error('Verify OTP error:', error);
    throw error;
  }
}

// Get current auth user phone
export function getVerifiedPhone() {
  if (!auth) return null;
  const user = auth.currentUser;
  return user ? user.phoneNumber : null;
}
