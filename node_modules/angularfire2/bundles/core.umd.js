(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/Observable'), require('rxjs/scheduler/queue'), require('zone.js'), require('rxjs/add/operator/first'), require('rxjs/operator/observeOn'), require('@firebase/app')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/Observable', 'rxjs/scheduler/queue', 'zone.js', 'rxjs/add/operator/first', 'rxjs/operator/observeOn', '@firebase/app'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}),global.ng.core,global.Rx,global.Rx.Scheduler,global.Zone,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.firebase));
}(this, (function (exports,_angular_core,rxjs_Observable,rxjs_scheduler_queue,zone_js,rxjs_add_operator_first,rxjs_operator_observeOn,firebase) { 'use strict';

firebase = 'default' in firebase ? firebase['default'] : firebase;

var FirebaseAppName = new _angular_core.InjectionToken('angularfire2.appName');
var FirebaseAppConfig = new _angular_core.InjectionToken('angularfire2.config');
var RealtimeDatabaseURL = new _angular_core.InjectionToken('angularfire2.realtimeDatabaseURL');
var FirebaseZoneScheduler = (function () {
    function FirebaseZoneScheduler(zone) {
        this.zone = zone;
    }
    FirebaseZoneScheduler.prototype.schedule = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return this.zone.runGuarded(function () { return rxjs_scheduler_queue.queue.schedule.apply(rxjs_scheduler_queue.queue, args); });
    };
    FirebaseZoneScheduler.prototype.keepUnstableUntilFirst = function (obs$) {
        var _this = this;
        return new rxjs_Observable.Observable(function (subscriber) {
            var noop = function () { };
            var task = Zone.current.scheduleMacroTask('firebaseZoneBlock', noop, {}, noop, noop);
            obs$.first().subscribe(function () { return _this.zone.runOutsideAngular(function () { return task.invoke(); }); });
            return obs$.subscribe(subscriber);
        });
    };
    FirebaseZoneScheduler.prototype.runOutsideAngular = function (obs$) {
        var _this = this;
        var outsideAngular = new rxjs_Observable.Observable(function (subscriber) {
            return _this.zone.runOutsideAngular(function () {
                return obs$.subscribe(subscriber);
            });
        });
        return rxjs_operator_observeOn.observeOn.call(outsideAngular, this);
    };
    return FirebaseZoneScheduler;
}());

var FirebaseApp = (function () {
    function FirebaseApp() {
    }
    return FirebaseApp;
}());
function _firebaseAppFactory(config, name) {
    var appName = name || '[DEFAULT]';
    var existingApp = firebase.apps.filter(function (app) { return app.name == appName; })[0];
    return existingApp || firebase.initializeApp(config, appName);
}
var FirebaseAppProvider = {
    provide: FirebaseApp,
    useFactory: _firebaseAppFactory,
    deps: [FirebaseAppConfig, FirebaseAppName]
};
var AngularFireModule = (function () {
    function AngularFireModule() {
    }
    AngularFireModule.initializeApp = function (config, appName) {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: FirebaseAppConfig, useValue: config },
                { provide: FirebaseAppName, useValue: appName }
            ]
        };
    };
    AngularFireModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    providers: [FirebaseAppProvider],
                },] },
    ];
    AngularFireModule.ctorParameters = function () { return []; };
    return AngularFireModule;
}());

exports.FirebaseAppName = FirebaseAppName;
exports.FirebaseAppConfig = FirebaseAppConfig;
exports.RealtimeDatabaseURL = RealtimeDatabaseURL;
exports.FirebaseZoneScheduler = FirebaseZoneScheduler;
exports.FirebaseApp = FirebaseApp;
exports._firebaseAppFactory = _firebaseAppFactory;
exports.AngularFireModule = AngularFireModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
