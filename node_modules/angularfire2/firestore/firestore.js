import { InjectionToken, NgZone } from '@angular/core';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Injectable, Inject, Optional } from '@angular/core';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
import { FirebaseAppConfig, FirebaseAppName, _firebaseAppFactory, FirebaseZoneScheduler } from 'angularfire2';
export var EnablePersistenceToken = new InjectionToken('angularfire2.enableFirestorePersistence');
export function associateQuery(collectionRef, queryFn) {
    if (queryFn === void 0) { queryFn = function (ref) { return ref; }; }
    var query = queryFn(collectionRef);
    var ref = collectionRef;
    return { query: query, ref: ref };
}
var AngularFirestore = (function () {
    function AngularFirestore(config, name, shouldEnablePersistence, zone) {
        var _this = this;
        this.scheduler = new FirebaseZoneScheduler(zone);
        this.firestore = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(config, name);
            return app.firestore();
        });
        this.persistenceEnabled$ = zone.runOutsideAngular(function () {
            return shouldEnablePersistence ? from(_this.firestore.enablePersistence().then(function () { return true; }, function () { return false; }))
                : of(false);
        })
            .catch(function () { return of(false); });
    }
    AngularFirestore.prototype.collection = function (pathOrRef, queryFn) {
        var collectionRef;
        if (typeof pathOrRef === 'string') {
            collectionRef = this.firestore.collection(pathOrRef);
        }
        else {
            collectionRef = pathOrRef;
        }
        var _a = associateQuery(collectionRef, queryFn), ref = _a.ref, query = _a.query;
        return new AngularFirestoreCollection(ref, query, this);
    };
    AngularFirestore.prototype.doc = function (pathOrRef) {
        var ref;
        if (typeof pathOrRef === 'string') {
            ref = this.firestore.doc(pathOrRef);
        }
        else {
            ref = pathOrRef;
        }
        return new AngularFirestoreDocument(ref, this);
    };
    AngularFirestore.prototype.createId = function () {
        return this.firestore.collection('_').doc().id;
    };
    AngularFirestore.decorators = [
        { type: Injectable },
    ];
    AngularFirestore.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [FirebaseAppConfig,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FirebaseAppName,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [EnablePersistenceToken,] },] },
        { type: NgZone, },
    ]; };
    return AngularFirestore;
}());
export { AngularFirestore };
//# sourceMappingURL=firestore.js.map