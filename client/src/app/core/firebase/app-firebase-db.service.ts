import { Injectable } from '@angular/core';
import { AppFirebaseService } from './app-firebase.service';
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';

enum DbRes {
  users = 'users',
  asianpoker = 'asianpoker',
}

type DbDTO = {
  [key: string]: any;
} & { _id: string };

@Injectable({
  providedIn: 'root',
})
export class AppFirebaseDbService {
  readonly firebaseDB = this.firebase.firebaseDB;

  constructor(private firebase: AppFirebaseService) {}

  async getByIds<DbDTO>(resource: DbRes, ids: string[] = []): Promise<DbDTO[]> {
    const queryRef = query(this.collectionRef(resource), where('id', 'in', ids));
    const querySnapshot = await getDocs(queryRef);
    const docs: DbDTO[] = [];
    querySnapshot.forEach((doc) => docs.push(doc.data() as DbDTO));
    return docs;
  }

  async insertNew<DbDTO>(resource: DbRes, data: DbDTO) {
    const dataCopy = { ...data } as any;
    await setDoc(doc(this.firebaseDB, resource), dataCopy);
  }

  async updateFullOverwrite<DbDTO>(resource: DbRes, data: DbDTO) {
    const dataCopy = { ...data } as any;
    updateDoc(doc(this.firebaseDB, resource, dataCopy._id), dataCopy).catch((e) => console.error(e));
  }

  private collectionRef(resource: DbRes) {
    return collection(this.firebaseDB, resource);
  }
}
