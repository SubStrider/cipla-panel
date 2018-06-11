import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import { ActivatedRoute } from '@angular/router';
import printJS from 'print-js';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Criteria, JudgeEntry, User } from '../../core/user.model';
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
    judgeEntryForm: FormGroup;
    preScreenForm: FormGroup;
    showForm: boolean = false;
    judgeEntry: JudgeEntry;
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

    // Score variable for 2 way binding
    r1Score: number;

    readonly revenuePotentialConst: Criteria[] = [
        { criteriaName: 'Less than 1M$', criteriaScore: 25, criteriaCategory: 'revenuePotential' },
        { criteriaName: '1-5M$', criteriaScore: 50, criteriaCategory: 'revenuePotential' },
        { criteriaName: '5-10M$', criteriaScore: 75, criteriaCategory: 'revenuePotential' },
        { criteriaName: 'More than 10M$', criteriaScore: 100, criteriaCategory: 'revenuePotential' }
    ];

    readonly ciplaSynergyConst: Criteria[] = [
        { criteriaName: 'Yes', criteriaScore: 100, criteriaCategory: 'ciplaSynergy' },
        { criteriaName: 'Maybe', criteriaScore: 50, criteriaCategory: 'ciplaSynergy' },
        { criteriaName: 'No', criteriaScore: 0, criteriaCategory: 'ciplaSynergy' },
    ];

    readonly implementabilityConst: Criteria[] = [
        { criteriaName: 'Idea is realistic', criteriaScore: 100, criteriaCategory: 'implementability' },
        { criteriaName: 'Idea seems less likely', criteriaScore: 50, criteriaCategory: 'implementability' },
        { criteriaName: 'Challenging to execute', criteriaScore: 0, criteriaCategory: 'implementability' },
    ];

    readonly uniquenessConst: Criteria[] = [
        { criteriaName: 'Idea is unique', criteriaScore: 100, criteriaCategory: 'uniqueness' },
        { criteriaName: 'Idea is unique for India', criteriaScore: 100, criteriaCategory: 'uniqueness' },
        { criteriaName: 'Idea is not unique however business model is streamlined and scalable', criteriaScore: 50, criteriaCategory: 'uniqueness' },
        { criteriaName: 'Idea is not unique', criteriaScore: 0, criteriaCategory: 'uniqueness' },
    ];

    constructor(
        private afs: AngularFirestore,
        private route: ActivatedRoute,
        public authService: AuthService,
        private formBuilder: FormBuilder,
        private dataService: DataService
    ) {
        this.judgeEntryForm = this.formBuilder.group({
            revenuePotential: ['', [Validators.required]],
            ciplaSynergy: ['', Validators.required],
            implementability: ['', Validators.required],
            uniqueness: ['', Validators.required],
            judgeComments: '',
            judgeUID: ['', Validators.required]
        });

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
                this.preScreenForm.setValue({ health: this.health, revenue: this.revenue })
            }

            if (data['judgeEntry']) {
                this.revenuePotential = data['judgeEntry'].revenuePotential
                this.ciplaSynergy = data['judgeEntry'].ciplaSynergy
                this.implementability = data['judgeEntry'].implementability
                this.uniqueness = data['judgeEntry'].uniqueness
                this.judgeComments = data['judgeEntry'].judgeComments
                this.judgeId = data['judgeEntry'].judgeUID
                this.judgeEntryForm.setValue({
                    revenuePotential: this.revenuePotential,
                    ciplaSynergy: this.ciplaSynergy,
                    implementability: this.implementability,
                    uniqueness: this.uniqueness,
                    judgeComments: this.judgeComments,
                    judgeUID: this.judgeId
                })
                this.r1Score = data['r1Score']
            }
        })

        this.userSubscription = this.authService.user$.subscribe(data => {
            this.user = data
            if (!(this.judgeEntryForm.value && this.judgeEntryForm.value.judgeUID)) {
                this.judgeId = data.uid;
                this.judgeEntryForm.patchValue({ judgeUID: data.uid })
            }
        });
    }

    ngOnDestroy() {
        this.submissionSubscription.unsubscribe()
        this.userSubscription.unsubscribe()
    };

    calculateScore(scoreObject): number {
        let score = 0;
        _.map(scoreObject, (value, key) => {
            if (_.isNumber(value)) {
                score += 0.25 * value
            }
        })

        score = score / 20;

        return parseFloat(score.toFixed(2))
    }

    public findAndRetrieve(category, score): any{
        if(category === 'revenuePotential'){
            return _.find(this.revenuePotentialConst, {criteriaScore: score})
        }
        else if(category === 'implementability'){
            return _.find(this.implementabilityConst, {criteriaScore: score})
        }
        else if(category === 'uniqueness'){
            return _.find(this.uniquenessConst, {criteriaScore: score})
        }
        else if(category === 'ciplaSynergy'){
            return _.find(this.ciplaSynergyConst, {criteriaScore: score})
        }
    }

    saveJudgeEntry() {
        this.loading['judgeEntry'] = true
        console.log(this.judgeEntryForm.value)
        let value = { judgeEntry: this.judgeEntryForm.value, r1Score: this.calculateScore(this.judgeEntryForm.value), status:'scored' }
        this.r1Score = value['r1Score']
        console.log(value)
        this.dataService.updateSubmission(this.submissionId, value)
        .then(res => {
            this.loading['judgeEntry'] = false
            console.log("Transaction successfully committed!");
        })
        .catch(error => {
            this.loading['judgeEntry'] = false
            console.error("Transaction failed: ", error);
        });
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
            val = { preScreen: preScreen, status: status, r1Score: firebase.firestore.FieldValue.delete(), judgeEntry: firebase.firestore.FieldValue.delete()}
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

    selectOption(event) {
        let value: any = {}
        value[event.value.criteriaCategory] = event.value.criteriaScore
        this.judgeEntryForm.patchValue(value)
    }

}
