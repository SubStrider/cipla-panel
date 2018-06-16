import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { ActivatedRoute } from '@angular/router';
import printJS from 'print-js';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Criteria, JudgeEntry, User, preScreen, BasicSubmission } from '../../core/user.model';
import { AuthService } from '../../core/auth.service';
import { DataService } from '../../core/data.service';
import * as _ from 'lodash';
import { ISubscription } from 'rxjs/Subscription';
import * as firebase from 'firebase/app';

@Component({
    selector: 'app-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
    userSubmission: Observable<{}>;
    submissionSubscription: ISubscription;
    userSubscription: ISubscription;
    submissionId: string;
    preScreenForm: FormGroup;
    showForm: boolean = false;
    judgeEntry: JudgeEntry;
    preScreen: preScreen;
    user: User;
    numericId: string;

    // Error object
    error: any = {};

    // Loading object
    loading: any = { preScreen: false, judging: false };

    // Pre Screen Variables for 2 way binding
    health: string;
    revenue: string;

    // Post Screen Variables for 2 way binding
    revenuePotential: number;
    ciplaSynergy: number;
    implementability: number;
    uniqueness: number;
    judgeComments: string;
    judgeId: string;    

    constructor(
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        public authService: AuthService,
        private formBuilder: FormBuilder,
        private dataService: DataService
    ) {
        this.preScreenForm = this.formBuilder.group({
            health: ['', Validators.required],
            revenue: ['', Validators.required]
        })
    }

    changePreScreen(event) {
        let value: any = {}
        value[event.source.name] = event.value === '1' ? true : false
        this.preScreenForm.patchValue(value)
    }

    ngOnInit() {
        this.submissionId = this.route.snapshot.params['id'];
        this.userSubmission = this.afs.collection('submissions')
            .doc(this.submissionId)
            .valueChanges()

        this.numericId = this.dataService.getNumberId(this.submissionId)

        this.submissionSubscription = this.userSubmission.subscribe(data => {
            if (data['preScreen']) {
                this.health = data['preScreen'].health ? '1' : '0';
                this.revenue = data['preScreen'].revenue ? '1' : '0';
                this.preScreen = {
                    health: this.health,
                    revenue: this.revenue
                }
                this.preScreenForm.setValue(this.preScreen)
            }

            // if (data['judgeEntry']) {
            //     this.revenuePotential = data['judgeEntry'].revenuePotential
            //     this.ciplaSynergy = data['judgeEntry'].ciplaSynergy
            //     this.implementability = data['judgeEntry'].implementability
            //     this.uniqueness = data['judgeEntry'].uniqueness
            //     this.judgeComments = data['judgeEntry'].judgeComments
            //     this.judgeId = data['judgeEntry'].judgeUID
            //     this.judgeEntryForm.setValue({
            //         revenuePotential: this.revenuePotential,
            //         ciplaSynergy: this.ciplaSynergy,
            //         implementability: this.implementability,
            //         uniqueness: this.uniqueness,
            //         judgeComments: this.judgeComments,
            //         judgeUID: this.judgeId
            //     })
            //     this.r1Score = data['r1Score']
            // }
        })

        this.userSubscription = this.authService.user$.subscribe(data => {
            this.user = data
        });
    }

    ngOnDestroy() {
        this.submissionSubscription.unsubscribe()
        this.userSubscription.unsubscribe()
    };

    editJudgeEntry() {
        this.showForm = true;
    };

    cancelJudgeEntry() {
        this.showForm = false;
    };

    downloadPDF() {
        // $('#submission').focus()
        // window.print()
        printJS({
            printable: 'submission',
            type: 'html',
            css: '/assets/css/bootstrap.min.css',
            targetStyles: ['padding', 'color', 'margin'],
            ignoreElements: ['a', 'button'],
            documentTitle: `Submission ID ${this.submissionId}.pdf`
        })
    }

    submitPreScreen() {
        this.loading['preScreen'] = true
        let preScreen = this.preScreenForm.value
        let status: string = null;
        let val: any = {}
        if (preScreen.health && preScreen.revenue) {
            status = 'approved',
            val = { preScreen: preScreen, status: status }
        } else {
            status = 'rejected'
            val = { preScreen: preScreen, status: status, judgeEntries: firebase.firestore.FieldValue.delete() }
        }
        this.dataService.updateSubmission(this.submissionId, val)
            .then(res => {
                this.loading['preScreen'] = false
                console.log("Transaction successfully committed!");
            })
            .catch(error => {
                this.loading['preScreen'] = false
                console.error("Transaction failed: ", error);
            });

    }

    

}
