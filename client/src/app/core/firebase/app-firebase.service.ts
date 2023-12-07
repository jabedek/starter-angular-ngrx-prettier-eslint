import { Injectable } from '@angular/core';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { GoogleAuthProvider, User, UserCredential, getAuth, getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import { StorageItem } from '@shared/models/storage-items.enum';
import { LocalStorage } from 'frotsi';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { setFirebaseCurrentUser } from '@store/auth/auth.actions';
import { selectAuth } from '@store/auth/auth.selectors';
import { map, takeUntil } from 'rxjs';
import { BaseComponent } from '@shared/components/base/base.component';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyDyOt-jO9eQpYSHThlriLUzmeQA8gMjwBg',
  authDomain: 'all-nice-things.firebaseapp.com',
  projectId: 'all-nice-things',
  storageBucket: 'all-nice-things.appspot.com',
  messagingSenderId: '819470114499',
  appId: '1:819470114499:web:6f87f270caae60fb5c4c76',
  measurementId: 'G-X1C0LK0P71',
};

const app = initializeApp(firebaseConfig);
const Analytics = getAnalytics(app);
const FirebaseAuth = getAuth(app);
const GoogleProvider = new GoogleAuthProvider();

GoogleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
GoogleProvider.addScope('https://www.googleapis.com/auth/userinfo.email');
GoogleProvider.addScope('https://www.googleapis.com/auth/firebase.database');
GoogleProvider.setCustomParameters({
  login_hint: 'user@example.com',
});

@Injectable({
  providedIn: 'root',
})
export class AppFirebaseService extends BaseComponent {
  readonly firebaseAuth = FirebaseAuth;
  readonly googleProvider = GoogleProvider;

  isLogged$ = this.store.select(selectAuth).pipe(map((auth) => !!auth.firebase.user));
  isLogged = false;

  constructor(private store: Store<AppState>) {
    super();
    this.isLogged$.pipe(takeUntil(this.__destroy)).subscribe((val) => (this.isLogged = val));
  }

  async refreshLogin() {
    let currentUser: User | null | undefined = undefined;
    this.firebaseAuth.onAuthStateChanged((user: User | null) => {
      currentUser = user;
      this.store.dispatch(setFirebaseCurrentUser({ user: JSON.parse(JSON.stringify(user)) }));
    });

    const redirectResult: UserCredential | undefined = (await getRedirectResult(this.firebaseAuth)) || undefined;

    if (!redirectResult && !currentUser) {
      signInWithRedirect(this.firebaseAuth, this.googleProvider);
    }

    if (redirectResult) {
      const user = { ...redirectResult.user };
      const credential = GoogleAuthProvider.credentialFromResult(redirectResult);
      const token = credential?.accessToken;
      LocalStorage.setItem(StorageItem.TOKEN, token);
      LocalStorage.setItem(StorageItem.USER, user);
    }
    console.log(this.firebaseAuth);
  }

  async firebaseLogout() {
    await signOut(this.firebaseAuth)
      .catch((err) => console.error('LOGOUT ERROR', err))
      .then(() => {
        try {
          this.store.dispatch(setFirebaseCurrentUser({ user: null }));
        } catch (e) {
          console.error('#', e);
        }
      });
  }
}
