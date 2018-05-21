import { Injectable, Inject, Optional, NgZone } from '@angular/core';
import { getRef } from './utils';
import { createListReference } from './list/create-reference';
import { createObjectReference } from './object/create-reference';
import { FirebaseAppConfig, FirebaseAppName, RealtimeDatabaseURL, _firebaseAppFactory, FirebaseZoneScheduler } from 'angularfire2';
export class AngularFireDatabase {
    constructor(config, name, databaseURL, zone) {
        this.scheduler = new FirebaseZoneScheduler(zone);
        this.database = zone.runOutsideAngular(() => {
            const app = _firebaseAppFactory(config, name);
            return app.database(databaseURL || undefined);
        });
    }
    list(pathOrRef, queryFn) {
        const ref = getRef(this.database, pathOrRef);
        let query = ref;
        if (queryFn) {
            query = queryFn(ref);
        }
        return createListReference(query, this);
    }
    object(pathOrRef) {
        const ref = getRef(this.database, pathOrRef);
        return createObjectReference(ref, this);
    }
    createPushId() {
        return this.database.ref().push().key;
    }
}
AngularFireDatabase.decorators = [
    { type: Injectable },
];
AngularFireDatabase.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FirebaseAppConfig,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FirebaseAppName,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RealtimeDatabaseURL,] },] },
    { type: NgZone, },
];
export { RealtimeDatabaseURL };
//# sourceMappingURL=database.js.map