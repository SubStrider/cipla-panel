import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
function _fromRef(ref) {
    return new Observable(function (subscriber) {
        var unsubscribe = ref.onSnapshot(subscriber);
        return { unsubscribe: unsubscribe };
    });
}
export function fromRef(ref) {
    return _fromRef(ref).share();
}
export function fromDocRef(ref) {
    return fromRef(ref)
        .map(function (payload) { return ({ payload: payload, type: 'value' }); });
}
export function fromCollectionRef(ref) {
    return fromRef(ref).map(function (payload) { return ({ payload: payload, type: 'query' }); });
}
//# sourceMappingURL=fromRef.js.map