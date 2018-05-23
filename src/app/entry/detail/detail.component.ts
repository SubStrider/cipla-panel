import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {

    userSubmission: Observable<{}>;
    submissionId: string;

  constructor(private afs: AngularFirestore, private route: ActivatedRoute ) { }

  ngOnInit() {
      this.submissionId = this.route.snapshot.params['id'];

      this.userSubmission = this.afs.collection('submissions')
          .doc(this.submissionId)
          .valueChanges();
  }

  ngOnDestroy() {

  }

}
