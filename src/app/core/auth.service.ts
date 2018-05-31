import { Injectable } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from './user.model';
import { AuthData } from './user.model';
import {AngularFirestore, AngularFirestoreDocument} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
// import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
    //subscription to show or hide elements on other components
    authChange = new Subject<boolean>();
    private isAuthenticated = false;
    returnUrl;

    user$: Observable<User>;
    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
    ) {
        //// Get auth data, then get firestore user document || null
        this.user$ = this.afAuth.authState
            .switchMap(user => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges()
                } else {
                    return Observable.of(null)
                }
            });
    }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/']);
            } else {
                // this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/pages/login']);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData) {
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
            })
            .catch(error => {
                console.log(error);
            });
    }

    login(authData: AuthData) {
        

        return this.afAuth.auth
            .signInWithEmailAndPassword(authData.email, authData.password)
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }

    updateUserData(user) {
        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);
        return userRef.set(user, { merge: true });
      }

      // role based activities

      canLogin(user: User): boolean {
        const allowed = ['admin', 'judge']
        return this.checkAuthorization(user, allowed)
      }

      canUpdate(user: User): boolean{
          const allowed = ['judge']
          return this.checkAuthorization(user, allowed)
      }

      canChangePermissions(user: User): boolean{
        const allowed = ['admin']
        return this.checkAuthorization(user, allowed)
      }

      // determines if user has matching role
      private checkAuthorization(user: User, allowedRoles: string[]): boolean {
        if (!user) return false
        for (const role of allowedRoles) {
          if ( user.roles[role] ) {
            return true
          }
        }
        return false
      }

}
