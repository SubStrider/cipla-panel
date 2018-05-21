import { Injectable, Inject, Optional, NgZone } from '@angular/core';
import { getRef } from './utils';
import { createListReference } from './list/create-reference';
import { createObjectReference } from './object/create-reference';
import { FirebaseAppConfig, FirebaseAppName, RealtimeDatabaseURL, _firebaseAppFactory, FirebaseZoneScheduler } from 'angularfire2';
var AngularFireDatabase = (function () {
    function AngularFireDatabase(config, name, databaseURL, zone) {
        this.scheduler = new FirebaseZoneScheduler(zone);
        this.database = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(config, name);
            return app.database(databaseURL || undefined);
        });
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, queryFn) {
        var ref = getRef(this.database, pathOrRef);
        var query = ref;
        if (queryFn) {
            query = queryFn(ref);
        }
        return createListReference(query, this);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef) {
        var ref = getRef(this.database, pathOrRef);
        return createObjectReference(ref, this);
    };
    AngularFireDatabase.prototype.createPushId = function () {
        return this.database.ref().push().key;
    };
    AngularFireDatabase.decorators = [
        { type: Injectable },
    ];
    AngularFireDatabase.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [FirebaseAppConfig,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FirebaseAppName,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [RealtimeDatabaseURL,] },] },
        { type: NgZone, },
    ]; };
    return AngularFireDatabase;
}());
export { AngularFireDatabase };
export { RealtimeDatabaseURL };
//# sourceMappingURL=database.js.map