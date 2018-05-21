import { NgModule } from '@angular/core';
import { AngularFireStorage } from './storage';
import '@firebase/storage';
var AngularFireStorageModule = (function () {
    function AngularFireStorageModule() {
    }
    AngularFireStorageModule.decorators = [
        { type: NgModule, args: [{
                    providers: [AngularFireStorage]
                },] },
    ];
    AngularFireStorageModule.ctorParameters = function () { return []; };
    return AngularFireStorageModule;
}());
export { AngularFireStorageModule };
//# sourceMappingURL=storage.module.js.map