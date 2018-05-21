import { NgModule } from '@angular/core';
import { FirebaseAppConfig, FirebaseAppName } from './angularfire2';
import firebase from '@firebase/app';
export class FirebaseApp {
}
export function _firebaseAppFactory(config, name) {
    const appName = name || '[DEFAULT]';
    const existingApp = firebase.apps.filter(app => app.name == appName)[0];
    return existingApp || firebase.initializeApp(config, appName);
}
const FirebaseAppProvider = {
    provide: FirebaseApp,
    useFactory: _firebaseAppFactory,
    deps: [FirebaseAppConfig, FirebaseAppName]
};
export class AngularFireModule {
    static initializeApp(config, appName) {
        return {
            ngModule: AngularFireModule,
            providers: [
                { provide: FirebaseAppConfig, useValue: config },
                { provide: FirebaseAppName, useValue: appName }
            ]
        };
    }
}
AngularFireModule.decorators = [
    { type: NgModule, args: [{
                providers: [FirebaseAppProvider],
            },] },
];
AngularFireModule.ctorParameters = () => [];
//# sourceMappingURL=firebase.app.module.js.map