import { InjectionToken, NgZone } from '@angular/core';
import { FirebaseFirestore, CollectionReference, DocumentReference } from '@firebase/firestore-types';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { FirebaseOptions } from '@firebase/app-types';
import { QueryFn, AssociatedReference } from './interfaces';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
import { FirebaseZoneScheduler } from 'angularfire2';
export declare const EnablePersistenceToken: InjectionToken<boolean>;
export declare function associateQuery(collectionRef: CollectionReference, queryFn?: (ref: any) => any): AssociatedReference;
export declare class AngularFirestore {
    readonly firestore: FirebaseFirestore;
    readonly persistenceEnabled$: Observable<boolean>;
    readonly scheduler: FirebaseZoneScheduler;
    constructor(config: FirebaseOptions, name: string, shouldEnablePersistence: boolean, zone: NgZone);
    collection<T>(path: string, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    collection<T>(ref: CollectionReference, queryFn?: QueryFn): AngularFirestoreCollection<T>;
    doc<T>(path: string): AngularFirestoreDocument<T>;
    doc<T>(ref: DocumentReference): AngularFirestoreDocument<T>;
    createId(): string;
}
