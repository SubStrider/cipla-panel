import { NgModule } from '@angular/core';
import { FirebaseAppConfig, FirebaseAppName } from './angularfire2';
import firebase from '@firebase/app';
var FirebaseApp = (function () {
    function FirebaseApp() {
    }
    return FirebaseApp;
}());
export { FirebaseApp };
export function _firebaseAppFactory(config, name) {
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
        { type: NgModule, args: [{
                    providers: [FirebaseAppProvider],
                },] },
    ];
    AngularFireModule.ctorParameters = function () { return []; };
    return AngularFireModule;
}());
export { AngularFireModule };
//# sourceMappingURL=firebase.app.module.js.map