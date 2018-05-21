import { NgModule } from '@angular/core';
import { AngularFireStorage } from './storage';
import '@firebase/storage';
export class AngularFireStorageModule {
}
AngularFireStorageModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireStorage]
            },] },
];
AngularFireStorageModule.ctorParameters = () => [];
//# sourceMappingURL=storage.module.js.map