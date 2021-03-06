import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';
import { tap, map, take } from 'rxjs/operators';


@Injectable()
export class JudgeGuard implements CanActivate {

    constructor(private auth: AuthService) { }


    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> {

        return this.auth.user$.pipe(
            take(1),
            map(user => {
                if (user) {
                    return user.roles.admin || user.roles.judge
                } else {
                    return false;
                }
                // user && user.roles.admin ? true : false
            }),
            tap(isAdmin => {
                if (!isAdmin) {
                    console.error('Access denied - Judges / Admins only')
                }
            })
        );

    }
}
