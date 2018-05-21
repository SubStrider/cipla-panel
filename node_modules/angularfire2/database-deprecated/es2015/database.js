import { Inject, Injectable, Optional, NgZone } from '@angular/core';
import { FirebaseListFactory } from './firebase_list_factory';
import { FirebaseObjectFactory } from './firebase_object_factory';
import * as utils from './utils';
import { FirebaseAppConfig, FirebaseAppName, RealtimeDatabaseURL, _firebaseAppFactory } from 'angularfire2';
export class AngularFireDatabase {
    constructor(config, name, databaseURL, zone) {
        this.database = zone.runOutsideAngular(() => {
            const app = _firebaseAppFactory(config, name);
            return app.database(databaseURL || undefined);
        });
    }
    list(pathOrRef, opts) {
        const ref = utils.getRef(this.database, pathOrRef);
        return FirebaseListFactory(ref, opts);
    }
    object(pathOrRef, opts) {
        const ref = utils.getRef(this.database, pathOrRef);
        return FirebaseObjectFactory(ref, opts);
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