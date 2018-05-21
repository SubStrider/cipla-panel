import { NgModule } from '@angular/core';
import { AngularFireAuth } from './auth';
import '@firebase/auth';
export class AngularFireAuthModule {
}
AngularFireAuthModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireAuth]
            },] },
];
AngularFireAuthModule.ctorParameters = () => [];
//# sourceMappingURL=auth.module.js.map