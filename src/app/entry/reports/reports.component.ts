import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  submissions: Observable<any>;

  reportsRef: AngularFirestoreCollection<any>;
  reports: Observable<any>;

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.submissions = this.afs.collection('submissions').valueChanges()
    this.reportsRef = this.afs.collection('reports')

    // Map the snapshot to include the document ID
    this.reports = this.reportsRef
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
      status: 'processing',
      createdAt: new Date()
    }
    this.reportsRef.add(data)
  }

}
