import { Injectable, OnDestroy } from '@angular/core';
import { FirebaseDbService, DbDTO, DbRes, DbResDetails, DbSubFeaturePart } from './firebase-db.service';
import { query, where, getDocs, Unsubscribe, onSnapshot } from 'firebase/firestore';
import { UserAppAccount } from '@store/auth/auth.state';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BaseComponent } from '@shared/abstracts/base/base.component';
import { consoleError } from '@shared/helpers/common.utils';

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

  async insertData(docId: string, data: any) {
    const dbResDetails: DbResDetails = ['users'];
    this.fdb.insertDataGlobal(dbResDetails, docId, data); //.catch((e) => consoleError(e, 'Error while creating new' + dbRes));
  }

  async updateData(docId: string, data: any) {
    const dbResDetails: DbResDetails = ['users'];
    this.fdb.updateDataGlobal(dbResDetails, docId, data); //.catch((e) => consoleError(e, 'Error while updating' + dbRes));
  }

  async readOneBy<T>(readDetails: { key: string; value: string | number | boolean }) {
    const dbResDetails: DbResDetails = ['users'];
    return this.fdb.readOneByGlobal<T>(dbResDetails, readDetails); //.catch((e) => consoleError(e, 'Error while reading' + dbRes));
  }

  async readManyBy<T>(readDetails: { key: string; values: (string | number | boolean)[] }) {
    const dbResDetails: DbResDetails = ['users'];
    return this.fdb.readManyByGlobal<T>(dbResDetails, readDetails); //.catch((e) => consoleError(e, 'Error while reading' + dbRes));
  }

  async getUserById(id: string): Promise<UserAppAccount | undefined> {
    return this.readOneBy<UserAppAccount>({ key: 'id', value: id });
  }

  async getUsersByIds(ids: string[]): Promise<UserAppAccount[]> {
    return this.readManyBy<UserAppAccount>({ key: 'id', values: ids });
  }

  private listenToLoggedUsers() {
    const readDetails = { key: 'logged', values: [true] };
    const dbResDetails: DbResDetails = ['users'];

    this.fdb.listenToChangesSnapshots<UserAppAccount>(
      readDetails,
      dbResDetails,
      (data: UserAppAccount[] | undefined, unsub: Unsubscribe | undefined) => {
        console.log('new user changes', data);
        if (data && unsub) {
          this.__addFirebaseListener('listenToSessionChanges', unsub);
          if (data) {
            this.loggedUsersEmitter.next(data);
          }
        }
      },
    );

    // const queryRef = query(this.fdb.collectionRef(DbRes.users), where('logged', 'in', [true]));
    // const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
    //   const users: UserAppAccount[] = [];
    //   querySnapshot.forEach((doc) => users.push(doc.data() as UserAppAccount));
    //   this.loggedUsersEmitter.next(users);
    // });
    // this.__addFirebaseListener('listenToLoggedUsers', unsub);
  }
}
