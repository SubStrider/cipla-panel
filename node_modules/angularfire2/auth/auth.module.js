import { NgModule } from '@angular/core';
import { AngularFireAuth } from './auth';
import '@firebase/auth';
var AngularFireAuthModule = (function () {
    function AngularFireAuthModule() {
    }
    AngularFireAuthModule.decorators = [
        { type: NgModule, args: [{
                    providers: [AngularFireAuth]
                },] },
    ];
    AngularFireAuthModule.ctorParameters = function () { return []; };
    return AngularFireAuthModule;
}());
export { AngularFireAuthModule };
//# sourceMappingURL=auth.module.js.map