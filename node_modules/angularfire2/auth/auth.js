import { Injectable, Inject, Optional, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseAppConfig, FirebaseAppName, _firebaseAppFactory, FirebaseZoneScheduler } from 'angularfire2';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
var AngularFireAuth = (function () {
    function AngularFireAuth(config, name, zone) {
        var _this = this;
        this.zone = zone;
        var scheduler = new FirebaseZoneScheduler(zone);
        this.auth = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(config, name);
            return app.auth();
        });
        this.authState = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new Observable(function (subscriber) {
            var unsubscribe = _this.auth.onAuthStateChanged(subscriber);
            return { unsubscribe: unsubscribe };
        })));
        this.idToken = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new Observable(function (subscriber) {
            var unsubscribe = _this.auth.onIdTokenChanged(subscriber);
            return { unsubscribe: unsubscribe };
        }))).switchMap(function (user) {
            return user ? Observable.fromPromise(user.getIdToken()) : Observable.of(null);
        });
    }
    AngularFireAuth.decorators = [
        { type: Injectable },
    ];
    AngularFireAuth.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: Inject, args: [FirebaseAppConfig,] },] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [FirebaseAppName,] },] },
        { type: NgZone, },
    ]; };
    return AngularFireAuth;
}());
export { AngularFireAuth };
//# sourceMappingURL=auth.js.map