import { Injectable } from '@angular/core';
import { BasicSubmission, EntryTableData, UserTableData } from './user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { StatsCount } from './user.model';
import { Observable } from 'rxjs/Observable';
import { User } from '@firebase/auth-types';

@Injectable()
export class DataService {
    entriesChanged = new Subject<EntryTableData[]>();
    statsCount: StatsCount;
    usersChanged = new Subject<UserTableData[]>();

    constructor(private afs: AngularFirestore) { }

    getNumberId(id) {
        let last: string = id.substr(id.length - 3);
        let number:string = 'Sub-';
        for(let i = 0; i < last.length; i++){
            let n = Math.abs(last[i].charCodeAt(0) - 97)
            number += n
        }
        
        return number;
    }

    fetchEntries(category?: string, stage?: string, minR1Score?: number, maxR1Score?: number) {

        this.afs.collection('submissions', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (category) { query = query.where('category', '==', category) };
            if (stage) { query = query.where('stage', '==', stage) };
            return query;
        })
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        teamName: doc.payload.doc.data().teamName,
                        category: doc.payload.doc.data().category,
                        stage: doc.payload.doc.data().stage,
                        r1Score: doc.payload.doc.data().r1Score,
                        r2Score: doc.payload.doc.data().r2Score,
                        submissionId: doc.payload.doc.id,
                        userId: doc.payload.doc.data().userId,
                        numericId: this.getNumberId(doc.payload.doc.id)
                    };
                });
            })
            .subscribe((fetchedEntries: EntryTableData[]) => {
                this.entriesChanged.next(fetchedEntries);
            });
    }


    getUsers() {
        this.afs.collection('users')
            .snapshotChanges()
            .map(userArray => {
                return userArray.map(user => {
                    let u = user.payload.doc.data()
                    return {
                        name: u.name,
                        roles: u.roles,
                        email: u.email,
                        uid: user.payload.doc.id,
                        phone: u.phone
                    }
                })
            })
            .subscribe((fetchedEntries: UserTableData[]) => {
                this.usersChanged.next(fetchedEntries)
            })
    }

    updateSubmission(submissionId: string, value: any){
        return this.afs.collection('submissions').doc(submissionId).update(value)
    }

}

