import { Injectable } from '@angular/core';
import { FirebaseAuthService } from './firebase-auth.service';
import { Unsubscribe, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';

export enum DbRes {
  users = 'users',
  asianpoker_sessions = 'asianpoker_sessions',
  asianpoker_games = 'asianpoker_games',
}

export type DbDTO = {
  [key: string]: any;
} & { id: string };

export type ListenerCallback<T> = (data: T | undefined, unsubFn: Unsubscribe | undefined) => void;

@Injectable({
  providedIn: 'root',
})
export class FirebaseDbService {
  readonly firebaseDB = this.firebase.firebaseDB;

  constructor(private firebase: FirebaseAuthService) {}

  async getBy<DbDTO>(resource: DbRes, key: string, value: (string | number | boolean)[]): Promise<DbDTO[]> {
    const queryRef = query(this.collectionRef(resource), where(key, 'in', value));
    const querySnapshot = await getDocs(queryRef);
    const docs: DbDTO[] = [];

    querySnapshot.forEach((doc) => docs.push(doc.data() as DbDTO));
    return docs;
  }

  async insertNew<DbDTO>(resource: DbRes, data: DbDTO) {
    const dataCopy = { ...data } as any;
    const [result, error] = await tryCatch(setDoc(this.documentRef(resource, dataCopy.id), dataCopy));

    if (result) {
      return result;
    }
    if (error) {
      consoleError(error, 'insertNew ' + resource);
    }
  }

  async updateFullOverwrite<DbDTO>(resource: DbRes, data: DbDTO) {
    const dataCopy = { ...data } as any;
    const [result, error] = await tryCatch(updateDoc(this.documentRef(resource, dataCopy.id), dataCopy));

    if (result) {
      return result;
    }
    if (error) {
      consoleError(error, 'updateFullOverwrite ' + resource);
    }
  }

  async listenToChangesSnapshots<DbDTO>(
    resource: DbRes,
    key: string,
    value: (string | number | boolean)[],
    callback: ListenerCallback<DbDTO[]>,
  ) {
    const queryRef = query(this.collectionRef(resource), where(key, 'in', value));

    const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const docs: DbDTO[] = [];
      querySnapshot.forEach((doc) => {
        const item = doc.data() as DbDTO;
        docs.push(item);
      });
      callback(docs, unsub);
    });
  }

  documentRef(resource: DbRes, ...pathSegments: string[]) {
    return doc(this.firebaseDB, resource, ...pathSegments);
  }

  collectionRef(resource: DbRes) {
    return collection(this.firebaseDB, resource);
  }
}
