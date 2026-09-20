# EarnX — Firebase Rewards App

EarnX is a mobile-first PWA frontend with Firebase Authentication, Firestore and Cloud Functions. Sensitive earning and withdrawal accounting is server-side only.

## Important architecture

The browser can sign in and read its own account data, but Firestore rules deny all client writes to balances, transactions and withdrawals. Cloud Functions use Admin SDK transactions for reward/withdrawal accounting.

### Rewarded ads
AdMob rewarded ads are not a browser/web API. For a production Android build, wrap the PWA in a native Android WebView and expose a bridge such as `window.EarnXNativeAd.showRewardedAd()`. The native Google Mobile Ads SDK loads/shows the rewarded ad. Configure AdMob Server-Side Verification (SSV) on the rewarded ad unit to call:

`https://<YOUR_REGION>-<YOUR_PROJECT_ID>.cloudfunctions.net/admobSsv`

The SSV endpoint verifies Google's signature, checks the configured ad unit/reward item, enforces a daily limit, uses the AdMob transaction ID for idempotency, and then credits Firestore. Do not add coins from the WebView callback.

## 1. Firebase project

1. Create a Firebase project.
2. Add a Web App and copy its config into `js/firebase.js`.
3. Enable Authentication → Google provider.
4. Create Firestore in production/locked mode.
5. Enable Cloud Functions and billing as required by your Firebase/Google Cloud plan.
6. Install Firebase CLI and authenticate:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
```

## 2. Install Functions dependencies

```bash
cd functions
npm install
cd ..
```

Deploy:

```bash
firebase deploy --only firestore:rules,firestore:indexes,functions,hosting
```

## 3. Google Sign-In

In Firebase Console → Authentication → Sign-in method → Google → Enable. Add your production Hosting domain under authorized domains if Firebase has not added it automatically.

The frontend uses Firebase's Google provider and creates the Firestore profile through `ensureUserProfile`.

## 4. Initial admin

After the first user signs in, copy that user's Firebase Auth UID. In Firestore create:

`admins/<UID>`

with:

```json
{"role":"admin","disabled":false}
```

There is intentionally no public/admin bootstrap endpoint. Keep admin creation restricted to trusted operators.

## 5. Firestore collections

- `users`
- `transactions`
- `withdrawals`
- `tasks`
- `referrals`
- `appConfig/public`
- `admins`
- `rewardRequests`
- `rateLimits`

The public configuration is created automatically when the first user profile is created. You can edit it from the Admin page after making an admin account.

## 6. Tasks

The backend exposes `adminCreateTask`. It is callable only by an admin/operator. Example payload:

```json
{"title":"Sponsored task","description":"Placeholder for a legitimately integrated sponsor task","rewardCoins":100,"dailyLimit":1,"status":"active"}
```

A task does not itself award coins until a real completion verifier is added. Do not wire arbitrary client-side task completion to a reward function.

## 7. AdMob Android wrapper

Use the Google Mobile Ads SDK in the native Android shell. During development use Google's test rewarded ad unit; replace it only for a correctly configured production app. The native SDK receives the user identity/custom data and the rewarded callback. Configure SSV on the ad unit and set `custom_data`/user identification so the callback identifies the EarnX user. The server is the final authority.

Google's documented SSV callback includes `transaction_id`, `reward_amount`, `reward_item`, `ad_unit`, `user_id`, `signature`, and `key_id`. The function verifies the signed query string against Google's rotating public keys.

## 8. Withdrawals

The app intentionally does not fake UPI payments. A withdrawal request becomes `pending`; an authorized operator/admin can move it through `approved → processing → paid` after completing a real payment workflow, or reject it. A rejected request returns the frozen coins through a transaction.

To automate payouts, integrate a legitimate provider/API in a separate trusted function and require provider-side payment verification/webhooks before marking a withdrawal `paid`.

## 9. Production hardening

Before launch:

- Enable Firebase App Check for the web/native clients.
- Use least-privilege Google Cloud IAM.
- Add monitoring/alerts for reward and withdrawal anomalies.
- Add a proper native Android shell with Play policy-compliant ad UX.
- Complete AdMob account/app approval and policy configuration.
- Complete real payment-provider KYC and webhook integration if automatic payouts are desired.
- Add a privacy policy, terms, refund/withdrawal rules and age/eligibility requirements appropriate to your jurisdiction.
- Load test Cloud Functions and Firestore indexes.
- Review abuse signals such as excessive referrals, repeated account creation, device/IP patterns and withdrawal velocity.

## 10. Local development

```bash
firebase emulators:start
```

The included frontend uses the deployed Firebase Functions region `asia-south1`. If you use the emulator, change the functions initialization in `js/firebase.js` to `connectFunctionsEmulator(functions,'127.0.0.1',5001)` during local testing.

## 11. Firebase config placeholders

Edit `js/firebase.js`:

- `YOUR_FIREBASE_API_KEY`
- `YOUR_PROJECT.firebaseapp.com`
- `YOUR_PROJECT_ID`
- `YOUR_PROJECT.firebasestorage.app`
- `YOUR_SENDER_ID`
- `YOUR_FIREBASE_APP_ID`

The public web API key is not a secret; Firestore/Auth rules and server-side authorization are what protect the data.

## 12. What is real vs configurable

Real in this project: Google authentication, Firestore user profiles, server-side daily check-in, server-side withdrawal freezing/reversal, transaction history, referral linking/qualification, admin authorization, configuration, AdMob SSV verification endpoint and idempotent reward accounting.

Requires external production configuration: Firebase project credentials, Google OAuth provider, AdMob app/ad-unit IDs and approval, native Android rewarded-ad SDK, and a legitimate payout provider if automatic UPI payouts are wanted.


## AdMob IDs configured for this build
- AdMob App ID: `ca-app-pub-4750812054378687~6363156923`
- Rewarded Ad Unit ID: `ca-app-pub-4750812054378687/4607222129`

The Android wrapper passes the authenticated Firebase UID as AdMob SSV custom data. The rewarded callback only updates the UI; the Cloud Function remains the authority for awarding coins.
