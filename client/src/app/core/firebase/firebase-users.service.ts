import { Injectable, OnDestroy } from '@angular/core';
import { FirebaseDbService, DbDTO, DbRes } from './firebase-db.service';
import { query, where, getDocs, Unsubscribe, onSnapshot } from 'firebase/firestore';
import { UserAppAccount } from '@store/auth/auth.state';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BaseComponent } from '@shared/abstracts/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class FirebaseUsersService extends BaseComponent {
  private loggedUsersEmitter = new BehaviorSubject<UserAppAccount[]>([]);
  loggedUsers$ = this.loggedUsersEmitter.asObservable().pipe(takeUntil(this.__destroy));

  constructor(private fdb: FirebaseDbService) {
    super('FirebaseUsersService');
    this.listenToLoggedUsers();
  }

  private listenToLoggedUsers() {
    const queryRef = query(this.fdb.collectionRef(DbRes.users), where('logged', '==', true));
    const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const users: UserAppAccount[] = [];
      querySnapshot.forEach((doc) => users.push(doc.data() as UserAppAccount));
      this.loggedUsersEmitter.next(users);
    });
    this.__addFirebaseListener('listenToLoggedUsers', unsub);
  }
}
