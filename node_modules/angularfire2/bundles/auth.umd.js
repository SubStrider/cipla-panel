(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Observable'), require('angularfire2'), require('rxjs/add/operator/switchMap'), require('rxjs/add/observable/of'), require('rxjs/add/observable/fromPromise'), require('@firebase/auth')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Observable', 'angularfire2', 'rxjs/add/operator/switchMap', 'rxjs/add/observable/of', 'rxjs/add/observable/fromPromise', '@firebase/auth'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.auth = global.angularfire2.auth || {}),global.ng.core,global.Rx,global.angularfire2,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.firebase));
}(this, (function (exports,_angular_core,rxjs_Observable,angularfire2,rxjs_add_operator_switchMap,rxjs_add_observable_of,rxjs_add_observable_fromPromise,_firebase_auth) { 'use strict';

var AngularFireAuth = (function () {
    function AngularFireAuth(config, name, zone) {
        var _this = this;
        this.zone = zone;
        var scheduler = new angularfire2.FirebaseZoneScheduler(zone);
        this.auth = zone.runOutsideAngular(function () {
            var app = angularfire2._firebaseAppFactory(config, name);
            return app.auth();
        });
        this.authState = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new rxjs_Observable.Observable(function (subscriber) {
            var unsubscribe = _this.auth.onAuthStateChanged(subscriber);
            return { unsubscribe: unsubscribe };
        })));
        this.idToken = scheduler.keepUnstableUntilFirst(scheduler.runOutsideAngular(new rxjs_Observable.Observable(function (subscriber) {
            var unsubscribe = _this.auth.onIdTokenChanged(subscriber);
            return { unsubscribe: unsubscribe };
        }))).switchMap(function (user) {
            return user ? rxjs_Observable.Observable.fromPromise(user.getIdToken()) : rxjs_Observable.Observable.of(null);
        });
    }
    AngularFireAuth.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFireAuth.ctorParameters = function () { return [
        { type: undefined, decorators: [{ type: _angular_core.Inject, args: [angularfire2.FirebaseAppConfig,] },] },
        { type: undefined, decorators: [{ type: _angular_core.Optional }, { type: _angular_core.Inject, args: [angularfire2.FirebaseAppName,] },] },
        { type: _angular_core.NgZone, },
    ]; };
    return AngularFireAuth;
}());

var AngularFireAuthModule = (function () {
    function AngularFireAuthModule() {
    }
    AngularFireAuthModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [AngularFireAuth]
                },] },
    ];
    AngularFireAuthModule.ctorParameters = function () { return []; };
    return AngularFireAuthModule;
}());

exports.AngularFireAuth = AngularFireAuth;
exports.AngularFireAuthModule = AngularFireAuthModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
