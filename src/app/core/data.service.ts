import { Injectable } from '@angular/core';
import {BasicSubmission, EntryTableData} from './user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import {Subject} from 'rxjs/Subject';
import { StatsCount } from './user.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class DataService {
    entriesChanged = new Subject<EntryTableData[]>();
    statsCount: StatsCount;


    constructor(private afs: AngularFirestore ) { }

    fetchEntries(){
        this.afs.collection('submissions')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        teamName: doc.payload.doc.data().teamName,
                        category: doc.payload.doc.data().category,
                        stage: doc.payload.doc.data().stage,
                        r1Score: doc.payload.doc.data().r1Score,
                        r2Score: doc.payload.doc.data().r2Score,
                        submissionId: doc.payload.doc.id
                    };
                });
            })
            .subscribe((fetchedEntries: EntryTableData[]) => {
                this.entriesChanged.next(fetchedEntries);
            });
    }


    // statsCount(){
    //     this.afs.collection('submissions')
    //         .snapshotChanges()
    //         .subscribe(result => {
    //             for (const res of result) {
    //                 console.log(res.payload.doc.data());
    //             }
    //         });
    // }

}

