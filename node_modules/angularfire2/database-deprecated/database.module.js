import { NgModule } from '@angular/core';
import { AngularFireDatabase } from './database';
import '@firebase/database';
var AngularFireDatabaseModule = (function () {
    function AngularFireDatabaseModule() {
    }
    AngularFireDatabaseModule.decorators = [
        { type: NgModule, args: [{
                    providers: [AngularFireDatabase]
                },] },
    ];
    AngularFireDatabaseModule.ctorParameters = function () { return []; };
    return AngularFireDatabaseModule;
}());
export { AngularFireDatabaseModule };
//# sourceMappingURL=database.module.js.map