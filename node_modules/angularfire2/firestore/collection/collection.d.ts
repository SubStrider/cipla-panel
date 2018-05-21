import { DocumentChangeType, CollectionReference, Query, DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { DocumentChangeAction } from '../interfaces';
import { AngularFirestoreDocument } from '../document/document';
import { AngularFirestore } from '../firestore';
import 'rxjs/add/observable/of';
export declare function validateEventsArray(events?: DocumentChangeType[]): DocumentChangeType[];
export declare class AngularFirestoreCollection<T> {
    readonly ref: CollectionReference;
    private readonly query;
    private readonly afs;
    constructor(ref: CollectionReference, query: Query, afs: AngularFirestore);
    stateChanges(events?: DocumentChangeType[]): Observable<DocumentChangeAction[]>;
    auditTrail(events?: DocumentChangeType[]): Observable<DocumentChangeAction[]>;
    snapshotChanges(events?: DocumentChangeType[]): Observable<DocumentChangeAction[]>;
    valueChanges(): Observable<T[]>;
    add(data: T): Promise<DocumentReference>;
    doc<T>(path: string): AngularFirestoreDocument<T>;
}
