import { Injectable, OnDestroy } from '@angular/core';
import { FirebaseDbService, DbDTO, DbRes } from './firebase-db.service';
import { query, where, getDocs, Unsubscribe, onSnapshot } from 'firebase/firestore';
import { UserAppAccount } from '@store/auth/auth.state';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BaseComponent } from '@shared/components/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class FirebaseUsersService extends BaseComponent implements OnDestroy {
  private firebaseUnsubs = new Map<string, Unsubscribe>();
  private loggedUsersEmitter = new BehaviorSubject<UserAppAccount[]>([]);
  loggedUsers$ = this.loggedUsersEmitter.asObservable().pipe(takeUntil(this.__destroy));

  constructor(private fdb: FirebaseDbService) {
    super('FirebaseUsersService');
    this.listenToLoggedUsers();
  }

  override ngOnDestroy(): void {
    this.deleteFirebaseListeners();
  }

  private listenToLoggedUsers() {
    const queryRef = query(this.fdb.collectionRef(DbRes.users), where('logged', '==', true));
    const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const users: UserAppAccount[] = [];
      querySnapshot.forEach((doc) => users.push(doc.data() as UserAppAccount));
      this.loggedUsersEmitter.next(users);
    });
    this.firebaseUnsubs.set('listenToLoggedUsers', unsub);
  }

  private deleteFirebaseListeners() {
    this.firebaseUnsubs.forEach((unsub, key) => {
      if (unsub) {
        unsub();
      }
      this.firebaseUnsubs.delete(key);
    });
  }
}
