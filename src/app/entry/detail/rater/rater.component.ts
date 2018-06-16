import { Component, OnInit, Input } from '@angular/core';
import { JudgeEntry, Criteria, User } from '../../../core/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../core/data.service';
import * as _ from 'lodash';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-rater',
  templateUrl: './rater.component.html',
  styleUrls: ['./rater.component.css']
})
export class RaterComponent implements OnInit {

  @Input('rating') rating: JudgeEntry;
  @Input('submissionId') submissionId: string;
  @Input('index') index: number;
  @Input('ratings') ratings: JudgeEntry[];
  @Input('user') user: User;

  judgeEntryForm: FormGroup;
  loading: boolean;
  score: number = 0;
  scored: string[] = [];

  // Post Screen Variables for 2 way binding
  revenuePotential: number;
  synergy: number;
  implementability: number;
  uniqueness: number;

  readonly revenuePotentialConst: Criteria[] = [
    { criteriaName: 'Less than 1M$', criteriaScore: 25, criteriaCategory: 'revenuePotential' },
    { criteriaName: '1-5M$', criteriaScore: 50, criteriaCategory: 'revenuePotential' },
    { criteriaName: '5-10M$', criteriaScore: 75, criteriaCategory: 'revenuePotential' },
    { criteriaName: 'More than 10M$', criteriaScore: 100, criteriaCategory: 'revenuePotential' }
  ];

  readonly ciplaSynergyConst: Criteria[] = [
    { criteriaName: 'Yes', criteriaScore: 100, criteriaCategory: 'synergy' },
    { criteriaName: 'Maybe', criteriaScore: 50, criteriaCategory: 'synergy' },
    { criteriaName: 'No', criteriaScore: 0, criteriaCategory: 'synergy' },
  ];

  readonly implementabilityConst: Criteria[] = [
    { criteriaName: 'Idea is realistic', criteriaScore: 100, criteriaCategory: 'implementability' },
    { criteriaName: 'Idea seems less likely', criteriaScore: 50, criteriaCategory: 'implementability' },
    { criteriaName: 'Challenging to execute', criteriaScore: 0, criteriaCategory: 'implementability' },
  ];

  readonly uniquenessConst: Criteria[] = [
    { criteriaName: 'Idea is unique', criteriaScore: 100, criteriaCategory: 'uniqueness' },
    { criteriaName: 'Idea is unique for India', criteriaScore: 75, criteriaCategory: 'uniqueness' },
    { criteriaName: 'Idea is not unique, business model is unique', criteriaScore: 50, criteriaCategory: 'uniqueness' },
    { criteriaName: 'Idea is not unique', criteriaScore: 0, criteriaCategory: 'uniqueness' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    public authService: AuthService
  ) {
    this.judgeEntryForm = this.formBuilder.group({
      revenuePotential: ['', [Validators.required]],
      synergy: ['', Validators.required],
      implementability: ['', Validators.required],
      uniqueness: ['', Validators.required],
      comments: '',
      judgeUID: ['', Validators.required],
      judgeName: ['', Validators.required],
      score: [0, Validators.required]
    });
  }

  ngOnInit() {
    if (this.rating) {
      if (!this.rating.score) {
        this.judgeEntryForm.patchValue({ judgeUID: this.rating.judgeUID, judgeName: this.rating.judgeName })
      } else {
        this.judgeEntryForm.setValue({
          revenuePotential: this.rating.revenuePotential,
          synergy: this.rating.synergy,
          implementability: this.rating.implementability,
          uniqueness: this.rating.uniqueness,
          comments: this.rating.comments,
          judgeUID: this.rating.judgeUID,
          score: this.rating.score,
          judgeName: this.rating.judgeName
        })

        this.revenuePotential = this.rating.revenuePotential
        this.synergy = this.rating.synergy
        this.implementability = this.rating.implementability
        this.uniqueness = this.rating.uniqueness

        this.score = this.rating.score

        if(this.user.roles.superjudge || this.user.roles.admin){
          this.judgeEntryForm.enable()
        } else {
          this.judgeEntryForm.controls['comments'].disable()
        }
      }
    }
  }

  calculateScore(scoreObject): number {
    console.log(scoreObject)
    let score = 0;
    _.map(scoreObject, (value, key) => {
      if (_.isNumber(value)) {
        switch(key){
          case 'revenuePotential': score += 0.25 * value; break;
          case 'synergy': score += 0.25 * value; break;
          case 'uniqueness': score += 0.25 * value; break;
          case 'implementability': score += 0.25 * value; break;
        }
      }
    })

    score = score / 20;
    return score;
  }

  public findAndRetrieve(category, score): any {
    if (category === 'revenuePotential') {
      return _.find(this.revenuePotentialConst, { criteriaScore: score })
    }
    else if (category === 'implementability') {
      return _.find(this.implementabilityConst, { criteriaScore: score })
    }
    else if (category === 'uniqueness') {
      return _.find(this.uniquenessConst, { criteriaScore: score })
    }
    else if (category === 'synergy') {
      return _.find(this.ciplaSynergyConst, { criteriaScore: score })
    }
  }

  selectOption(event) {
    let value: any = {}
    value[event.value.criteriaCategory] = event.value.criteriaScore
    this.judgeEntryForm.patchValue(value)
    this.score = this.calculateScore({...this.judgeEntryForm.value})
    this.judgeEntryForm.patchValue({score: this.score})
  }

  getStatus(ratings: JudgeEntry[]): string {
    let scores = _.compact(_.map(ratings, 'score'))
    if (scores.length === 2) {
      return 'scored'
    } else {
      return 'partial'
    }
  }

  saveJudgeEntry() {
    this.loading = true
    console.log(this.judgeEntryForm.value)
    let val: JudgeEntry = this.judgeEntryForm.value
    val.score = this.score
    this.ratings[this.index] = val
    let value = { judgeEntries: this.ratings, status: this.getStatus(this.ratings) }
    console.log(value)
    this.dataService.updateSubmission(this.submissionId, value)
      .then(res => {
        this.loading = false
        console.log('Transaction successfully committed!');
      })
      .catch(error => {
        this.loading = false
        console.error('Transaction failed: ', error);
      });
  };

}
