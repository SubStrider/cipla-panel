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
export class AngularFirestoreCollection {
    constructor(ref, query, afs) {
        this.ref = ref;
        this.query = query;
        this.afs = afs;
    }
    stateChanges(events) {
        if (!events || events.length === 0) {
            return docChanges(this.query);
        }
        return this.afs.scheduler.keepUnstableUntilFirst(docChanges(this.query)
            .map(actions => actions.filter(change => events.indexOf(change.type) > -1))
            .filter(changes => changes.length > 0));
    }
    auditTrail(events) {
        return this.stateChanges(events).scan((current, action) => [...current, ...action], []);
    }
    snapshotChanges(events) {
        const validatedEvents = validateEventsArray(events);
        const sortedChanges$ = sortedChanges(this.query, validatedEvents);
        const scheduledSortedChanges$ = this.afs.scheduler.runOutsideAngular(sortedChanges$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduledSortedChanges$);
    }
    valueChanges() {
        const fromCollectionRef$ = fromCollectionRef(this.query);
        const scheduled$ = this.afs.scheduler.runOutsideAngular(fromCollectionRef$);
        return this.afs.scheduler.keepUnstableUntilFirst(scheduled$)
            .map(actions => actions.payload.docs.map(a => a.data()));
    }
    add(data) {
        return this.ref.add(data);
    }
    doc(path) {
        return new AngularFirestoreDocument(this.ref.doc(path), this.afs);
    }
}
//# sourceMappingURL=collection.js.map