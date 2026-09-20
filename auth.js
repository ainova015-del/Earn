import { auth } from './firebase.js';

import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';

const error = document.querySelector('#error');
const btn = document.querySelector('#googleBtn');

const params = new URLSearchParams(location.search);

const referralCode =
  params.get('ref') ||
  localStorage.getItem('earnx_ref') ||
  '';

if (referralCode) {
  localStorage.setItem('earnx_ref', referralCode);
}


// Check login state
onAuthStateChanged(auth, (user) => {

  if (user && location.pathname.endsWith('/login.html')) {
    location.replace('/home.html');
  }

});


// Google Login
btn?.addEventListener('click', async () => {

  error.textContent = '';

  btn.disabled = true;
  btn.textContent = 'Signing in…';

  try {

    const provider = new GoogleAuthProvider();

    provider.setCustomParameters({
      prompt: 'select_account'
    });

    await signInWithPopup(auth, provider);

    // Login successful
    localStorage.removeItem('earnx_ref');

    location.replace('/home.html');

  } catch (e) {

    console.error(e);

    error.textContent =
      e?.message || 'Sign-in failed.';

    btn.disabled = false;
    btn.textContent = 'Continue with Google';

  }

});


// Logout
export async function logout() {

  await signOut(auth);

  location.replace('/login.html');

}