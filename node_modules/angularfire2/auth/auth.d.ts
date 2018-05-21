import { FirebaseAuth, User } from '@firebase/auth-types';
import { FirebaseOptions } from '@firebase/app-types';
import { NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/fromPromise';
export declare class AngularFireAuth {
    private zone;
    readonly auth: FirebaseAuth;
    readonly authState: Observable<User | null>;
    readonly idToken: Observable<string | null>;
    constructor(config: FirebaseOptions, name: string, zone: NgZone);
}
