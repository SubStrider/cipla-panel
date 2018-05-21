import { InjectionToken, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { FirebaseOptions } from '@firebase/app-types';
import 'zone.js';
import 'rxjs/add/operator/first';
export declare const FirebaseAppName: InjectionToken<string>;
export declare const FirebaseAppConfig: InjectionToken<FirebaseOptions>;
export declare const RealtimeDatabaseURL: InjectionToken<string>;
export declare class FirebaseZoneScheduler {
    zone: NgZone;
    constructor(zone: NgZone);
    schedule(...args: any[]): Subscription;
    keepUnstableUntilFirst<T>(obs$: Observable<T>): Observable<T>;
    runOutsideAngular<T>(obs$: Observable<T>): Observable<T>;
}
