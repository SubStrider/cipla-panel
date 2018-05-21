import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
function _fromRef(ref) {
    return new Observable(subscriber => {
        const unsubscribe = ref.onSnapshot(subscriber);
        return { unsubscribe };
    });
}
export function fromRef(ref) {
    return _fromRef(ref).share();
}
export function fromDocRef(ref) {
    return fromRef(ref)
        .map(payload => ({ payload, type: 'value' }));
}
export function fromCollectionRef(ref) {
    return fromRef(ref).map(payload => ({ payload, type: 'query' }));
}
//# sourceMappingURL=fromRef.js.map