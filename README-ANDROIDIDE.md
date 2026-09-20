# EarnX — AndroidIDE build

This folder is prepared for AndroidIDE's **Web Source Project to App** flow.

## AndroidIDE
1. Extract this ZIP.
2. AndroidIDE → + → Web Source Project to App.
3. Choose the extracted `EarnX` folder.
4. The project should show `package.json: yes`, `Capacitor config: yes`, and `Android platform: yes`.
5. Use project name `EarnX`, package `com.earnx.rewards`, display name `EarnX`.
6. Create/import the project and build the debug APK.

## Important
The native Android wrapper currently loads the hosted EarnX URL from `MainActivity.kt`:
`https://YOUR_PROJECT.web.app/earn.html`

Replace `YOUR_PROJECT` with the Firebase Hosting project ID after Firebase Hosting is deployed.

AdMob App ID:
`ca-app-pub-4750812054378687~6363156923`

Rewarded Ad Unit ID:
`ca-app-pub-4750812054378687/4607222129`

Do not grant coins from the Android reward callback. The secure reward path is AdMob SSV → Cloud Function → Firestore.
