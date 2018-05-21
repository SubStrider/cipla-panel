import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { queue } from 'rxjs/scheduler/queue';
import 'zone.js';
import 'rxjs/add/operator/first';
import { observeOn } from 'rxjs/operator/observeOn';
export const FirebaseAppName = new InjectionToken('angularfire2.appName');
export const FirebaseAppConfig = new InjectionToken('angularfire2.config');
export const RealtimeDatabaseURL = new InjectionToken('angularfire2.realtimeDatabaseURL');
export class FirebaseZoneScheduler {
    constructor(zone) {
        this.zone = zone;
    }
    schedule(...args) {
        return this.zone.runGuarded(function () { return queue.schedule.apply(queue, args); });
    }
    keepUnstableUntilFirst(obs$) {
        return new Observable(subscriber => {
            const noop = () => { };
            const task = Zone.current.scheduleMacroTask('firebaseZoneBlock', noop, {}, noop, noop);
            obs$.first().subscribe(() => this.zone.runOutsideAngular(() => task.invoke()));
            return obs$.subscribe(subscriber);
        });
    }
    runOutsideAngular(obs$) {
        const outsideAngular = new Observable(subscriber => {
            return this.zone.runOutsideAngular(() => {
                return obs$.subscribe(subscriber);
            });
        });
        return observeOn.call(outsideAngular, this);
    }
}
//# sourceMappingURL=angularfire2.js.map