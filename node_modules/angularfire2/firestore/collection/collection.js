import { fromCollectionRef } from '../observable/fromRef';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import { docChanges, sortedChanges } from './changes';
import { AngularFirestoreDocument } from '../document/document';
import 'rxjs/add/observable/of';
export function validateEventsArray(events) {
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
export { AngularFirestoreCollection };
//# sourceMappingURL=collection.js.map