import { Component, OnInit, Input } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'report-link',
  templateUrl: './report-link.component.html',
  styleUrls: ['./report-link.component.css'],
})
export class ReportLinkComponent implements OnInit {

  @Input() report: any;
  @Input('type') type: string;
  downloadUrl: Observable<string>;

  constructor() { }

  ngOnInit() {
    let extension = this.type === 'reports' ? 'submission' : 'users'
    const reportRef = firebase.storage().ref(`${this.type}/${extension}_${this.report.id}.csv`);
    const promise = reportRef.getDownloadURL()

    this.downloadUrl = Observable.fromPromise(promise)
  }

}