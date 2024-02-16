import { Component } from '@angular/core';
import { DbResDetails, FirebaseDbService } from '@core/firebase/firebase-db.service';
import { UserAppAccount } from '@store/auth/auth.state';
import { Unsubscribe } from 'firebase/firestore';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent {
  constructor(private fdb: FirebaseDbService) {}
}
