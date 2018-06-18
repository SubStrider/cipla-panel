import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  reportsRef: AngularFirestoreCollection<any>;
  userReportsRef: AngularFirestoreCollection<any>;
  reports: Observable<any>;
  userReports: Observable<any>;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.reportsRef = this.afs.collection('reports')
    this.userReportsRef = this.afs.collection('userReports')

    // Map the snapshot to include the document ID
    this.reports = this.reportsRef
      .snapshotChanges().map(arr => {
        return arr.map(snap => {
          const data = snap.payload.doc.data()
          const id = snap.payload.doc.id
          return { ...data, id }
        })
      })

    this.userReports = this.userReportsRef
      .snapshotChanges().map(arr => {
        return arr.map(snap => {
          const data = snap.payload.doc.data()
          const id = snap.payload.doc.id
          return { ...data, id }
        })
      })
  }

  // Creates new report, triggering FCF
  requestReport() {
    const data = {
      name: `Submissions on ${moment().format('Do MMM YYYY hh:mm a')}`,
      status: 'processing',
      createdAt: new Date()
    }
    this.reportsRef.add(data)
  }

  requestUserReport() {
    const data = {
      name: `Users on ${moment().format('Do MMM YYYY hh:mm a')}`,
      status: 'processing',
      createdAt: new Date()
    }

    this.userReportsRef.add(data)
  }

}
