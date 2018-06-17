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

    fetchEntries(category?: string, stage?: string, status?: string, role: string = 'judge', id?: string, style?: string) {

        let subscription = this.afs.collection('submissions', ref => {
            let query: firebase.firestore.CollectionReference | firebase.firestore.Query = ref;
            if (category) { query = query.where('category', '==', category) }
            if (stage) { query = query.where('stage', '==', stage) }
            if (status && status !== 'submitted') {
                query = query.where('status', '==', status)
            }
            
            if(role === 'judge'){
                if (id) { query = query.where(`judges.${id}`, '==', true) }
            }
            return query;
        })
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {


                    let payload = doc.payload.doc;
                    let judgeEntries = payload.data().judgeEntries;

                    // let score1 = judgeEntries && judgeEntries.length ? judgeEntries[0].score : 0;
                    // let score2 = judgeEntries && judgeEntries.length && judgeEntries[1] ? judgeEntries[1].score : 0;

                    let scores = _.map(judgeEntries, entry => {
                        return {
                            judgeId: entry.judgeUID,
                            score: entry.score
                        }
                    })

                    let score1 = scores[0] ? scores[0].score : 0
                    let score2 = scores[1] ? scores[1].score : 0

                    let data = {
                        teamName: payload.data().teamName,
                        category: payload.data().category,
                        stage: payload.data().stage,
                        avgScore: score1 || score2 ? this.getAverageScore(score1, score2) : 0,
                        submissionId: payload.id,
                        userId: payload.data().userId,
                        numericId: this.getNumberId(payload.id),
                        status: payload.data().status ? payload.data().status : 'submitted',
                        judges: payload.data().judges,
                        entries: scores
                    };

                    if (style === 'full') {
                        data['pitch'] = payload.data().pitch
                        data['overview'] = payload.data().overview
                        data['potential'] = payload.data().potentil
                        data['market'] = payload.data().market
                        data['competition'] = payload.data().competition
                        data['teamSize'] = payload.data().teamSize
                        data['revenue'] = payload.data().revenue
                        data['year'] = payload.data().year
                        data['website'] = payload.data().website
                        data['partner'] = payload.data().partner
                        data['attachment'] = payload.data().attachment
                    }

                    return data;
                });
            })
            .subscribe((fetchedEntries: EntryTableData[]) => {
                subscription.unsubscribe()
                this.entriesChanged.next(fetchedEntries);
            });
    }


    getUsers(isJudge?: boolean, isSuperJudge?: boolean) {
        let subscription = this.afs.collection('users', ref => {
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
                subscription.unsubscribe()
                this.usersChanged.next(fetchedEntries)
            })
    }

    updateSubmission(submissionId: string, value: any) {
        if (value.loading) {
            delete value.loading
        }
        return this.afs.collection('submissions').doc(submissionId).update(value)
    }

    getEmail(userId) {
        return this.afs.collection('users').doc(userId).ref.get().then(doc => {
            return doc.data()
        })
    }

}

