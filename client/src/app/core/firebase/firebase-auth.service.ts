import { Injectable } from '@angular/core';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { collection, doc, getDocs, getFirestore, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { GoogleAuthProvider, User, UserCredential, getAuth, getRedirectResult, signInWithRedirect, signOut } from 'firebase/auth';
import { StorageItem } from '@shared/models/storage-items.enum';
import { LocalStorage, generateDocumentId } from 'frotsi';
import { Store } from '@ngrx/store';
import { AppState } from '@store/app-state';
import { setFirebaseCurrentUser, setUserAppAccount } from '@store/auth/auth.actions';
import { selectAuth, selectUserAppAccount, selectUserLoggedIn } from '@store/auth/auth.selectors';
import { first, map, takeUntil, tap } from 'rxjs';
import { BaseComponent } from '@shared/components/base/base.component';
import { Router } from '@angular/router';
import { LayoutService } from '@core/modules/layout/services/layout.service';
import { UserAppAccount } from '@store/auth/auth.state';
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
export class FirebaseAuthService extends BaseComponent {
  readonly firebaseAuth = FirebaseAuth;
  readonly googleProvider = GoogleProvider;
  readonly firebaseDB = FirebaseDB;

  isLogged$ = this.store.select(selectUserLoggedIn).pipe(
    tap((logged) => (this.isLogged = logged)),
    takeUntil(this.__destroy),
  );
  isLogged = false;

  constructor(
    private store: Store<AppState>,
    private router: Router,
  ) {
    super('FirebaseAuthService');
    this.isLogged$.subscribe();
  }

  async refreshLogin(tryReAuth: boolean, redirectToAfter?: string) {
    this.__layoutService.setLoader('auth', 'active');
    let currentUser: User | null | undefined = undefined;
    this.firebaseAuth.onAuthStateChanged(async (user: User | null) => {
      currentUser = user;
      this.store.dispatch(setFirebaseCurrentUser({ user: JSON.parse(JSON.stringify(user)) }));

      if (user) {
        this.supplyAppAccount(user);
        this.listenToUserAppAccountData(user);
      }

      this.__layoutService.setLoader('auth', 'inactive');
    });

    const redirectResult: UserCredential | undefined = (await getRedirectResult(this.firebaseAuth)) || undefined;
    this.__layoutService.setLoader('auth', 'inactive');
    if (tryReAuth) {
      if (!redirectResult && !currentUser) {
        this.__layoutService.setLoader('auth', 'active');
        try {
          signInWithRedirect(this.firebaseAuth, this.googleProvider);
        } catch (e) {
          console.error('Error signInWithRedirect', e);
        }
      }
    }

    if (redirectResult) {
      const user = { ...redirectResult.user };
      const credential = GoogleAuthProvider.credentialFromResult(redirectResult);
      const token = credential?.accessToken;
      LocalStorage.setItem(StorageItem.TOKEN, token);
      LocalStorage.setItem(StorageItem.USER, user);
    }
  }

  async firebaseLogout(redirectToAfter?: string) {
    await signOut(this.firebaseAuth)
      .catch((err) => console.error('LOGOUT ERROR', err))
      .then(async () => {
        try {
          this.store
            .select(selectUserAppAccount)
            .pipe(first())
            .subscribe(async (user) => {
              if (user) {
                this.store.dispatch(setFirebaseCurrentUser({ user: null }));
                this.store.dispatch(setUserAppAccount({ appAccount: undefined }));
                await this.setUserLoginStatus(user, false);
              }
            });
        } catch (e) {
          console.error('Error firebaseLogout', e);
        }
      });
  }

  async setUserLoginStatus(user: UserAppAccount, logged: boolean) {
    try {
      return updateDoc(doc(this.firebaseDB, 'users', user.id), { ...user, logged });
    } catch (e) {
      console.error('Error', e);
    }
  }

  /**
   * Check if app account exists for an email. If not, create it. Then pass it to app store.
   */
  async supplyAppAccount(user: User) {
    if (user.email) {
      const appAccountExists = await this.checkIfAppAccountExists(user?.email);

      if (!appAccountExists) {
        try {
          await this.createAppAccount(user);
        } catch (e) {
          console.error('Błąd', e);
        }
      }

      const appAccount = await this.checkIfAppAccountExists(user?.email);
      if (appAccount) {
        this.store.dispatch(setUserAppAccount({ appAccount }));
        await this.setUserLoginStatus(appAccount, true);
      }
    }
  }

  async checkIfAppAccountExists(email: string) {
    if (!email) {
      return undefined;
    }

    const queryRef = query(collection(this.firebaseDB, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(queryRef);
    const docs: UserAppAccount[] = [];
    querySnapshot.forEach((doc) => docs.push(doc.data() as UserAppAccount));

    return docs[0];
  }

  async createAppAccount(authUser: User) {
    if (authUser.email) {
      const id = generateDocumentId('user');
      const appUser: UserAppAccount = {
        id,
        googleUid: authUser.uid,
        email: authUser.email,
        displayName: authUser.displayName || '',
        logged: false,
        appFeaturesData: {
          asianPoker: {
            currentSessionId: '',
          },
        },
      };
      return setDoc(doc(this.firebaseDB, 'users', id), appUser);
    } else {
      console.error('Brak adresu email. Nie udało się utworzyć konta.');
    }
  }

  async listenToUserAppAccountData(authUser: User) {
    if (authUser.email) {
      const queryRef = query(collection(this.firebaseDB, 'users'), where('email', '==', authUser.email));
      const querySnapshot = await getDocs(queryRef);

      querySnapshot.docChanges().forEach(function (change) {
        if (change.type === 'added') {
          console.log('Add heard: ', change.doc.data());
        }
        if (change.type === 'modified') {
          console.log('Modified heard: ', change.doc.data());
        }
        if (change.type === 'removed') {
          console.log('Removed heard: ', change.doc.data());
        }
      });
    } else {
      console.error('Brak adresu email.');
    }
  }
}
