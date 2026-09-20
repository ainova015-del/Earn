import {auth,db,functions} from './firebase.js';
import {onAuthStateChanged} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js';
import {doc,getDoc,collection,query,where,orderBy,limit,onSnapshot} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js';
import {httpsCallable} from 'https://www.gstatic.com/firebasejs/12.1.0/firebase-functions.js';
export const call=(name,data={})=>httpsCallable(functions,name)(data);
export function toast(msg){const el=document.querySelector('#toast');if(!el)return;el.textContent=msg;el.style.display='block';clearTimeout(window.__toast);window.__toast=setTimeout(()=>el.style.display='none',3000)}
export function guard(){return new Promise(resolve=>onAuthStateChanged(auth,u=>{if(!u)location.replace('/login.html');else resolve(u)}))}
export async function userDoc(u){return (await getDoc(doc(db,'users',u.uid))).data()}
export function nav(active){document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active',a.dataset.page===active));}
export function money(coins,rate){return `₹${(coins/rate).toFixed(2)}`}
export function fmt(ts){if(!ts)return '—';const d=ts.toDate?ts.toDate():new Date(ts);return d.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short'})}
export function renderNav(active){document.body.insertAdjacentHTML('beforeend',`<nav class="nav"><div class="nav-inner"><a data-page="home" href="/home.html"><span>⌂</span>Home</a><a data-page="earn" href="/earn.html"><span>▶</span>Earn</a><a data-page="wallet" href="/wallet.html"><span>₹</span>Wallet</a><a data-page="refer" href="/refer.html"><span>↗</span>Refer</a><a data-page="profile" href="/profile.html"><span>●</span>Profile</a></div></nav>`);nav(active)}
export function profileHeader(u){return `<div class="row"><div class="row"><img class="avatar" src="${u.photoURL||'/icon.svg'}" onerror="this.style.display='none'"><div><b>${esc(u.displayName||'EarnX User')}</b><div class="muted small">${esc(u.email||'')}</div></div></div></div>`}
export function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
