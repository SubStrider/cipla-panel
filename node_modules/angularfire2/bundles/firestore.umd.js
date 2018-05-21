(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/observable/from'), require('rxjs/observable/of'), require('rxjs/add/operator/map'), require('rxjs/add/operator/catch'), require('rxjs/Observable'), require('rxjs/add/operator/share'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/scan'), require('rxjs/add/observable/of'), require('angularfire2'), require('@firebase/firestore')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/observable/from', 'rxjs/observable/of', 'rxjs/add/operator/map', 'rxjs/add/operator/catch', 'rxjs/Observable', 'rxjs/add/operator/share', 'rxjs/add/operator/filter', 'rxjs/add/operator/scan', 'rxjs/add/observable/of', 'angularfire2', '@firebase/firestore'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.firestore = global.angularfire2.firestore || {}),global.ng.core,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.angularfire2,global.firebase));
}(this, (function (exports,_angular_core,rxjs_observable_from,rxjs_observable_of,rxjs_add_operator_map,rxjs_add_operator_catch,rxjs_Observable,rxjs_add_operator_share,rxjs_add_operator_filter,rxjs_add_operator_scan,rxjs_add_observable_of,angularfire2,_firebase_firestore) { 'use strict';

function _fromRef(ref) {
    return new rxjs_Observable.Observable(function (subscriber) {
        var unsubscribe = ref.onSnapshot(subscriber);
        return { unsubscribe: unsubscribe };
    });
}
function fromRef(ref) {
    return _fromRef(ref).share();
}
function fromDocRef(ref) {
    return fromRef(ref)
        .map(function (payload) { return ({ payload: payload, type: 'value' }); });
}
function fromCollectionRef(ref) {
    return fromRef(ref).map(function (payload) { return ({ payload: payload, type: 'query' }); });
}

function docChanges(query) {
    return fromCollectionRef(query)
        .map(function (action) {
        return action.payload.docChanges
            .map(function (change) { return ({ type: change.type, payload: change }); });
    });
}
function sortedChanges(query, events) {
    return fromCollectionRef(query)
        .map(function (changes) { return changes.payload.docChanges; })
        .scan(function (current, changes) { return combineChanges(current, changes, events); }, [])
        .map(function (changes) { return changes.map(function (c) { return ({ type: c.type, payload: c }); }); });
}
function combineChanges(current, changes, events) {
    changes.forEach(function (change) {
        if (events.indexOf(change.type) > -1) {
            current = combineChange(current, change);
        }
    });
    return current;
}
function combineChange(combined, change) {
    switch (change.type) {
        case 'added':
            if (combined[change.newIndex] && combined[change.newIndex].doc.id == change.doc.id) {
            }
            else {
                combined.splice(change.newIndex, 0, change);
            }
            break;
        case 'modified':
            if (change.oldIndex !== change.newIndex) {
                combined.splice(change.oldIndex, 1);
                combined.splice(change.newIndex, 0, change);
            }
            else {
                combined.splice(change.newIndex, 1, change);
            }
            break;
        case 'removed':
            combined.splice(change.oldIndex, 1);
            break;
    }
    return combined;
}

function validateEventsArray(events) {
    if (!events || events.length === 0) {
        events = ['added', 'removed', 'modified'];
    }
    return events;
}
var AngularFirestoreCollection = (function () {
    function AngularFirestoreCollection(ref, query, afs) {
        this.ref = ref;
        this.query = query;
        this.afs = afs;
    }
    AngularFirestoreCollection.prototype.stateChanges = function (events) {
        if (!events || events.length === 0) {
            return docChanges(this.query);
        }
        return this.afs.scheduler.keepUnstableUntilFirst(docChanges(this.query)
            .map(function (actions) { return actions.filter(function (change) { return events.indexOf(change.type) > -1; }); })
            .filter(function (changes) { return changes.length > 0; }));
    };
    AngularFirestoreCollection.prototype.auditTrail = function (events) {
        return this.stateChanges(events).scan(function (current, action) { return current.concat(action); }, []);
    };
    AngularFirestoreCollection.prototype.snapshotChanges = function (events) {
        var validatedEvents = validateEventsArray(events);
        var sortedChanges$ = sortedChanges(this.query, validatedEvents);
        var scheduledSortedChanges$ = this.afs.scheduler.runOutsideAngular(sortedChanges$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduledSortedChanges$);
    };
    AngularFirestoreCollection.prototype.valueChanges = function () {
        var fromCollectionRef$ = fromCollectionRef(this.query);
        var scheduled$ = this.afs.scheduler.runOutsideAngular(fromCollectionRef$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduled$)
            .map(function (actions) { return actions.payload.docs.map(function (a) { return a.data(); }); });
    };
    AngularFirestoreCollection.prototype.add = function (data) {
        return this.ref.add(data);
    };
    AngularFirestoreCollection.prototype.doc = function (path) {
        return new AngularFirestoreDocument(this.ref.doc(path), this.afs);
    };
    return AngularFirestoreCollection;
}());

var AngularFirestoreDocument = (function () {
    function AngularFirestoreDocument(ref, afs) {
        this.ref = ref;
        this.afs = afs;
    }
    AngularFirestoreDocument.prototype.set = function (data, options) {
        return this.ref.set(data, options);
    };
    AngularFirestoreDocument.prototype.update = function (data) {
        return this.ref.update(data);
    };
    AngularFirestoreDocument.prototype.delete = function () {
        return this.ref.delete();
    };
    AngularFirestoreDocument.prototype.collection = function (path, queryFn) {
        var collectionRef = this.ref.collection(path);
        var _a = associateQuery(collectionRef, queryFn), ref = _a.ref, query = _a.query;
        return new AngularFirestoreCollection(ref, query, this.afs);
    };
    AngularFirestoreDocument.prototype.snapshotChanges = function () {
        var fromDocRef$ = fromDocRef(this.ref);
        var scheduledFromDocRef$ = this.afs.scheduler.runOutsideAngular(fromDocRef$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduledFromDocRef$);
    };
    AngularFirestoreDocument.prototype.valueChanges = function () {
        return this.snapshotChanges().map(function (action) {
            return action.payload.exists ? action.payload.data() : null;
        });
    };
    return AngularFirestoreDocument;
}());

var EnablePersistenceToken = new _angular_core.InjectionToken('angularfire2.enableFirestorePersistence');
function associateQuery(collectionRef, queryFn) {
    if (queryFn === void 0) { queryFn = function (ref) { return ref; }; }
    var query = queryFn(collectionRef);
    var ref = collectionRef;
    return { query: query, ref: ref };
}
var AngularFirestore = (function () {
    function AngularFirestore(config, name, shouldEnablePersistence, zone) {
        var _this = this;
        this.scheduler = new angularfire2.FirebaseZoneScheduler(zone);
        this.firestore = zone.runOutsideAngular(function () {
            var app = angularfire2._firebaseAppFactory(config, name);
            return app.firestore();
        });
        this.persistenceEnabled$ = zone.runOutsideAngular(function () {
            return shouldEnablePersistence ? rxjs_observable_from.from(_this.firestore.enablePersistence().then(function () { return true; }, function () { return false; }))
                : rxjs_observable_of.of(false);
        })
            .catch(function () { return rxjs_observable_of.of(false); });
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
        { type: _angular_core.Injectable },
    ];
    AngularFirestore.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [angularfire2.FirebaseAppConfig,] },] },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [angularfire2.FirebaseAppName,] },] },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [EnablePersistenceToken,] },] },
        { type: _angular_core.NgZone, },
    ]; };
    return AngularFirestore;
}());

var AngularFirestoreModule = (function () {
    function AngularFirestoreModule() {
    }
    AngularFirestoreModule.enablePersistence = function () {
        return {
            ngModule: AngularFirestoreModule,
            providers: [
                { provide: EnablePersistenceToken, useValue: true },
            ]
        };
    };
    AngularFirestoreModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [AngularFirestore]
                },] },
    ];
    AngularFirestoreModule.ctorParameters = function () { return []; };
    return AngularFirestoreModule;
}());

exports.EnablePersistenceToken = EnablePersistenceToken;
exports.associateQuery = associateQuery;
exports.AngularFirestore = AngularFirestore;
exports.AngularFirestoreModule = AngularFirestoreModule;
exports.validateEventsArray = validateEventsArray;
exports.AngularFirestoreCollection = AngularFirestoreCollection;
exports.AngularFirestoreDocument = AngularFirestoreDocument;
exports.docChanges = docChanges;
exports.sortedChanges = sortedChanges;
exports.combineChanges = combineChanges;
exports.combineChange = combineChange;
exports.fromRef = fromRef;
exports.fromDocRef = fromDocRef;
exports.fromCollectionRef = fromCollectionRef;

Object.defineProperty(exports, '__esModule', { value: true });

})));
