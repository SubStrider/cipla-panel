import { InjectionToken, NgZone } from '@angular/core';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable, Inject, Optional } from '@angular/core';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
import { FirebaseAppConfig, FirebaseAppName, _firebaseAppFactory, FirebaseZoneScheduler } from 'angularfire2';
export const EnablePersistenceToken = new InjectionToken('angularfire2.enableFirestorePersistence');
export function associateQuery(collectionRef, queryFn = ref => ref) {
    const query = queryFn(collectionRef);
    const ref = collectionRef;
    return { query, ref };
}
export class AngularFirestore {
    constructor(config, name, shouldEnablePersistence, zone) {
        this.scheduler = new FirebaseZoneScheduler(zone);
        this.firestore = zone.runOutsideAngular(() => {
            const app = _firebaseAppFactory(config, name);
            return app.firestore();
        });
        this.persistenceEnabled$ = zone.runOutsideAngular(() => shouldEnablePersistence ? from(this.firestore.enablePersistence().then(() => true, () => false))
            : of(false))
            .catch(() => of(false));
    }
    collection(pathOrRef, queryFn) {
        let collectionRef;
        if (typeof pathOrRef === 'string') {
            collectionRef = this.firestore.collection(pathOrRef);
        }
        else {
            collectionRef = pathOrRef;
        }
        const { ref, query } = associateQuery(collectionRef, queryFn);
        return new AngularFirestoreCollection(ref, query, this);
    }
    doc(pathOrRef) {
        let ref;
        if (typeof pathOrRef === 'string') {
            ref = this.firestore.doc(pathOrRef);
        }
        else {
            ref = pathOrRef;
        }
        return new AngularFirestoreDocument(ref, this);
    }
    createId() {
        return this.firestore.collection('_').doc().id;
    }
}
AngularFirestore.decorators = [
    { type: Injectable },
];
AngularFirestore.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FirebaseAppConfig,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FirebaseAppName,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [EnablePersistenceToken,] },] },
    { type: NgZone, },
];
//# sourceMappingURL=firestore.js.map