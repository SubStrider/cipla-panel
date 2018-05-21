import { NgModule } from '@angular/core';
import { AngularFireDatabase } from './database';
import '@firebase/database';
export class AngularFireDatabaseModule {
}
AngularFireDatabaseModule.decorators = [
    { type: NgModule, args: [{
                providers: [AngularFireDatabase]
            },] },
];
AngularFireDatabaseModule.ctorParameters = () => [];
//# sourceMappingURL=database.module.js.map