import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router, CanLoad, Route,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/pages/login'], { queryParams: { returnUrl: state.url }});
        }
    }

    canLoad(route: Route){
        if (this.authService.isAuth()) {
            return true;
        } else {
            this.router.navigate(['/pages/login']);
        }
    }
}

// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { AuthService } from './auth.service';
//
// @Injectable()
// export class AuthGuard implements CanActivate {
//     constructor(private auth: AuthService, private router: Router) {}
//
//     canActivate(
//         next: ActivatedRouteSnapshot,
//         state: RouterStateSnapshot): Observable<boolean> | boolean {
//
//         return this.auth.user
//             .take(1)
//             .map(user => !!user)
//             .do(loggedIn => {
//                 if (!loggedIn) {
//                     console.log('access denied')
//                     this.router.navigate(['/pages/login']);
//                 }
//             })
//
//     }
}