import { Injectable } from '@angular/core';
import { FirebaseAuthService } from './firebase-auth.service';
import {
  DocumentReference,
  Unsubscribe,
  collection,
  doc,
  endAt,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { consoleError, tryCatch } from '@shared/helpers/common.utils';

export enum DbRes {
  users = 'users',
  asianpoker_sessions = 'asianpoker_sessions',
  asianpoker_games = 'asianpoker_games',
  asianpoker_chats = 'asianpoker_chats',
}

export const DbAsianPoker = {
  root: 'features/entertainment/asianpoker',
  res: {
    sessions: 'features/entertainment/asianpoker/sessions',
    games: 'features/entertainment/asianpoker/games',
    chats: 'features/entertainment/asianpoker/chats',
  },
};

export const DbFeatures = ['users', 'features-entertainment', 'features-management', 'features-misc'] as const;
export type DbFeature = (typeof DbFeatures)[number];

export const DbFeatureEntertainments = ['asian-poker'] as const;
export type DbFeatureEntertainment = (typeof DbFeatureEntertainments)[number];

export type DbSubFeature = DbFeatureEntertainment;

export type DbSubFeaturePart = 'sessions' | 'games' | 'chats';

export type DbResDetails = [DbFeature, DbSubFeature, DbSubFeaturePart] | [DbFeature];
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

  // async getOneBy<DbDTO>(resource: DbRes, key: string, value: string | number | boolean): Promise<DbDTO | undefined> {
  //   const queryRef = query(this.collectionRef(resource), where(key, '==', value));
  //   const querySnapshot = await getDocs(queryRef);
  //   const docs: DbDTO[] = [];

  //   querySnapshot.forEach((doc) => docs.push(doc.data() as DbDTO));
  //   return docs[0];
  // }

  // async getBy<DbDTO>(resource: DbRes, key: string, value: (string | number | boolean)[]): Promise<DbDTO[]> {
  //   const queryRef = query(this.collectionRef(resource), where(key, 'in', value));
  //   const querySnapshot = await getDocs(queryRef);
  //   const docs: DbDTO[] = [];

  //   querySnapshot.forEach((doc) => docs.push(doc.data() as DbDTO));
  //   return docs;
  // }

  // async insertNew<DbDTO>(resource: DbRes, data: DbDTO) {
  //   const dataCopy = { ...data } as any;
  //   const [result, error] = await tryCatch(setDoc(this.documentRef(resource, dataCopy.id), dataCopy));

  //   if (result) {
  //     return result;
  //   }
  //   if (error) {
  //     consoleError(error, 'insertNew ' + resource);
  //   }
  // }

  // async updateFullOverwrite<DbDTO>(resource: DbRes, data: DbDTO) {
  //   const dataCopy = { ...data } as any;
  //   const [result, error] = await tryCatch(updateDoc(this.documentRef(resource, dataCopy.id), dataCopy));

  //   if (result) {
  //     return result;
  //   }
  //   if (error) {
  //     consoleError(error, 'updateFullOverwrite ' + resource);
  //   }
  // }

  async listenToChangesSnapshots<T>(
    readDetails: { key: string; values: (string | number | boolean)[] },
    dbResDetails: DbResDetails,
    callback: ListenerCallback<T[]>,
  ) {
    const { key, values } = readDetails;
    const col = this.getCollectionPart(dbResDetails);
    const queryRef = query(col, where(key, 'in', values));

    const unsub: Unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const docs: DbDTO[] = [];
      querySnapshot.forEach((doc) => {
        const item = doc.data() as DbDTO;
        docs.push(item);
      });
      callback(docs as T[], unsub);
    });
  }

  // documentRef(resource: DbRes, ...pathSegments: string[]) {
  //   return doc(this.firebaseDB, resource, ...pathSegments);
  // }

  // collectionRef(resource: DbRes) {
  //   return collection(this.firebaseDB, resource);
  // }

  getCollectionPart(dbResDetails: DbResDetails) {
    const [feature, subFeature, subFeaturePart] = dbResDetails;
    if (subFeature && subFeaturePart) {
      const doc0 = doc(collection(this.firebaseDB, feature), subFeature);
      return collection(doc0, subFeaturePart);
    } else {
      return collection(this.firebaseDB, feature);
    }
  }

  async insertDataGlobal(dbResDetails: DbResDetails, docId: string, data: any) {
    const col = this.getCollectionPart(dbResDetails);
    return setDoc(doc(col, docId), data);
  }

  async updateDataGlobal(dbResDetails: DbResDetails, docId: string, data: any) {
    const col = this.getCollectionPart(dbResDetails);
    return updateDoc(doc(col, docId), data);
  }

  async readManyByGlobal<T>(dbResDetails: DbResDetails, readDetails: { key: string; values: (string | number | boolean)[] }) {
    const { key, values } = readDetails;
    const col = this.getCollectionPart(dbResDetails);
    const queryRef = query(col, where(key, 'in', values));
    const [querySnapshot] = await tryCatch(getDocs(queryRef), true);
    if (!querySnapshot) {
      return [];
    }

    const docs: DbDTO[] = [];

    querySnapshot.forEach((doc) => docs.push(doc.data() as DbDTO));
    return docs as T[];
  }

  async readOneByGlobal<T>(dbResDetails: DbResDetails, readDetails: { key: string; value: string | number | boolean }) {
    const { key, value } = readDetails;
    const col = this.getCollectionPart(dbResDetails);
    const queryRef = query(col, where(key, '==', value));
    const [querySnapshot] = await tryCatch(getDocs(queryRef), true);
    if (!querySnapshot) {
      return undefined;
    }

    const docs: DbDTO[] = [];

    querySnapshot.forEach((doc) => docs.push(doc.data() as DbDTO));
    return docs[0] as T;
  }
}
