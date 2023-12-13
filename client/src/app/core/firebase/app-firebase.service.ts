import { Injectable } from '@angular/core';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { GoogleAuthProvider, User, UserCredential, getAuth, getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import { StorageItem } from '@shared/models/storage-items.enum';
import { LocalStorage } from 'frotsi';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { setFirebaseCurrentUser } from '@store/auth/auth.actions';
import { selectAuth, selectUserLoggedIn } from '@store/auth/auth.selectors';
import { map, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '@shared/components/base/base.component';
import { Router } from '@angular/router';
import { LayoutService } from '@core/modules/layout/services/layout.service';
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
// const Analytics = getAnalytics(app);
const FirebaseAuth = getAuth(app);
const FirebaseDB = getFirestore(app);

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

  readonly firebaseDB = FirebaseDB;

  isLogged$ = this.store.select(selectUserLoggedIn).pipe(
    tap((logged) => (this.isLogged = logged)),
    tap((logged) => console.log(logged)),
    takeUntil(this.__destroy),
  );
  isLogged = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private layout: LayoutService,
  ) {
    super();
    this.isLogged$.subscribe();
  }

  async refreshLogin(tryReAuth: boolean, redirectToAfter?: string) {
    console.log(0);

    this.layout.setLoader('auth', true);
    let currentUser: User | null | undefined = undefined;
    this.firebaseAuth.onAuthStateChanged((user: User | null) => {
      console.log(1);
      currentUser = user;
      this.store.dispatch(setFirebaseCurrentUser({ user: JSON.parse(JSON.stringify(user)) }));

      this.router.navigate([user ? 'account' : 'home']);
      this.layout.setLoader('auth', false);
    });

    const redirectResult: UserCredential | undefined = (await getRedirectResult(this.firebaseAuth)) || undefined;

    console.log(2);
    this.layout.setLoader('auth', false);
    if (tryReAuth) {
      if (!redirectResult && !currentUser) {
        this.layout.setLoader('auth', true);
        signInWithRedirect(this.firebaseAuth, this.googleProvider); //.then(() => this.router.navigate(['account']));
      }
    }

    if (redirectResult) {
      console.log(3);
      const user = { ...redirectResult.user };
      const credential = GoogleAuthProvider.credentialFromResult(redirectResult);
      const token = credential?.accessToken;
      LocalStorage.setItem(StorageItem.TOKEN, token);
      LocalStorage.setItem(StorageItem.USER, user);
    }
    console.log(this.firebaseAuth);
  }

  async firebaseLogout(redirectToAfter?: string) {
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
