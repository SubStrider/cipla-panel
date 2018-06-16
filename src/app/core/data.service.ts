import { Injectable } from '@angular/core';
import { EntryTableData, UserTableData } from './user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { Subject } from 'rxjs/Subject';
import { StatsCount } from './user.model';
import * as _ from 'lodash';

@Injectable()
export class DataService {
    entriesChanged = new Subject<EntryTableData[]>();
    statsCount: StatsCount;
    usersChanged = new Subject<UserTableData[]>();

    constructor(private afs: AngularFirestore) { }

    public getNumberId(id) {
        let last: string = id.substr(id.length - 3);
        let number: string = 'Sub-';
        for (let i = 0; i < last.length; i++) {
            let n = Math.abs(last[i].charCodeAt(0) - 97)
            number += n
        }

        return number;
    }

    getAverageScore(score1: number, score2: number) {
        return (score1 + score2) / (_.compact([score1, score2]).length)
    }

    fetchEntries(category?: string, stage?: string, minR1Score?: string, maxR1Score?: number, status?: string, judge1?: string, judge2?: string) {

        this.afs.collection('submissions', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (category) { query = query.where('category', '==', category) }
            if (stage) { query = query.where('stage', '==', stage) }
            // if (minR1Score && minR1Score !== '0') { query = query.where('r1Score', '>', parseInt(minR1Score)) };
            if (judge1) { query = query.where('judge1', '==', judge1) }
            if (judge2) { query = query.where('judge2', '==', judge2) }
            if (status && status !== 'submitted') {
                query = query.where('status', '==', status)
            }
            return query;
        })
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {

                    let judgeEntries = doc.payload.doc.data().judgeEntries;

                    let score1 = judgeEntries && judgeEntries.length ? judgeEntries[0].score : 0;
                    let score2 = judgeEntries && judgeEntries.length && judgeEntries[1] ? judgeEntries[1].score : 0;

                    return {
                        teamName: doc.payload.doc.data().teamName,
                        category: doc.payload.doc.data().category,
                        stage: doc.payload.doc.data().stage,
                        score1: score1,
                        score2: score2,
                        avgScore: score1 || score2 ? this.getAverageScore(score1, score2) : 0,
                        submissionId: doc.payload.doc.id,
                        userId: doc.payload.doc.data().userId,
                        numericId: this.getNumberId(doc.payload.doc.id),
                        // pitch: doc.payload.doc.data().pitch,
                        // overview: doc.payload.doc.data().overview,
                        // potential: doc.payload.doc.data().potential,
                        // market: doc.payload.doc.data().market,
                        // competition: doc.payload.doc.data().competition,
                        // teamSize: doc.payload.doc.data().teamSize,
                        // revenue: doc.payload.doc.data().revenue,
                        // year: doc.payload.doc.data().year,
                        // website: doc.payload.doc.data().website,
                        // partner: doc.payload.doc.data().partner,
                        // attachment: doc.payload.doc.data().attachment,
                        status: doc.payload.doc.data().status ? doc.payload.doc.data().status : 'submitted',
                        judge1: doc.payload.doc.data().judge1,
                        judge2: doc.payload.doc.data().judge2
                    };
                });
            })
            .subscribe((fetchedEntries: EntryTableData[]) => {
                this.entriesChanged.next(fetchedEntries);
            });
    }


    getUsers(isJudge?: boolean, isSuperJudge?: boolean) {
        this.afs.collection('users', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (isJudge) { query = query.where('roles.judge', '==', true) }
            if (isSuperJudge) { query = query.where('roles.superjudge', '==', true) }
            return query;
        })
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

    updateSubmission(submissionId: string, value: any) {
        if (value.loading) {
            delete value.loading
        }
        return this.afs.collection('submissions').doc(submissionId).update(value)
    }

}

