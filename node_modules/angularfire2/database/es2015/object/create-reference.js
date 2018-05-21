import { createObjectSnapshotChanges } from './snapshot-changes';
export function createObjectReference(query, afDatabase) {
    return {
        query,
        snapshotChanges() {
            const snapshotChanges$ = createObjectSnapshotChanges(query)();
            return afDatabase.scheduler.keepUnstableUntilFirst(snapshotChanges$);
        },
        update(data) { return query.ref.update(data); },
        set(data) { return query.ref.set(data); },
        remove() { return query.ref.remove(); },
        valueChanges() {
            const snapshotChanges$ = createObjectSnapshotChanges(query)();
            return afDatabase.scheduler.keepUnstableUntilFirst(snapshotChanges$)
                .map(action => action.payload.exists() ? action.payload.val() : null);
        },
    };
}
//# sourceMappingURL=create-reference.js.map