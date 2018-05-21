import { Injectable, Inject, Optional, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseAppConfig, FirebaseAppName, _firebaseAppFactory, FirebaseZoneScheduler } from 'angularfire2';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
export class AngularFireAuth {
    constructor(config, name, zone) {
        this.zone = zone;
        const scheduler = new FirebaseZoneScheduler(zone);
        this.auth = zone.runOutsideAngular(() => {
            const app = _firebaseAppFactory(config, name);
            return app.auth();
        });
        this.authState = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new Observable(subscriber => {
            const unsubscribe = this.auth.onAuthStateChanged(subscriber);
            return { unsubscribe };
        })));
        this.idToken = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new Observable(subscriber => {
            const unsubscribe = this.auth.onIdTokenChanged(subscriber);
            return { unsubscribe };
        }))).switchMap((user) => {
            return user ? Observable.fromPromise(user.getIdToken()) : Observable.of(null);
        });
    }
}
AngularFireAuth.decorators = [
    { type: Injectable },
];
AngularFireAuth.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [FirebaseAppConfig,] },] },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FirebaseAppName,] },] },
    { type: NgZone, },
];
//# sourceMappingURL=auth.js.map