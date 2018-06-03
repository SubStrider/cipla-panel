import { AfterViewInit, Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import * as Chartist from 'chartist';
import { EntryTableData } from '../../core/user.model';
import { DataService } from '../../core/data.service';
import { Observable } from 'rxjs/Observable';
import { StatsData } from '../../core/user.model';
import { AngularFirestore } from 'angularfire2/firestore';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ISubscription } from 'rxjs/Subscription';

declare var $: any;

@Component({
    selector: 'overview-cmp',
    templateUrl: './overview.component.html'
})

export class OverviewComponent implements OnInit, AfterViewInit, OnDestroy {
    totCount = 0;
    count: any = { total: 0, cipla: 0 };
    totCiplaR1 = 0;
    totCountR2 = 0;
    totCiplaR2 = 0;
    userSubscription: ISubscription;
    statsSubscription: ISubscription;

    catCount: any[] = [
        { name: 'pharmaceutical', count: 0 },
        { name: 'medical', count: 0 },
        { name: 'hospital', count: 0 },
        { name: 'devices', count: 0 },
        { name: 'services', count: 0 },
        { name: 'digital', count: 0 },
        { name: 'diagnostics', count: 0 },
        { name: 'other', count: 0 }
    ]

    stageCount: any[] = [
        { name: 'ideation', count: 0 },
        { name: 'poc', count: 0 },
        { name: 'revenues', count: 0 }
    ]

    weekCount: any[] = []

    chartStage;
    chartCategory;
    chartWeek;

    constructor(
        private dataService: DataService, private afs: AngularFirestore,
    ) { }

    initCirclePercentage() {
        $('#chartDashboard, #chartOrders, #chartNewVisitors, #chartSubscriptions, #chartDashboardDoc, #chartOrdersDoc').easyPieChart({
            lineWidth: 6,
            size: 160,
            scaleColor: false,
            trackColor: 'rgba(255,255,255,.25)',
            barColor: '#FFFFFF',
            animate: ({ duration: 5000, enabled: true })
        });
    }

    ngOnInit() {
        this.fetchStatsCount();
        this.fetchUserCount();

        /*   **************** Submissions by Stage ********************    */

        var data = {
            labels: ['Ideation', 'POC', 'Revenues'],
            series: [
                [10, 10, 10]
            ]
        };

        var options = {
            seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: "250px"
        };

        var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];

        this.chartStage = new Chartist.Bar('#chartActivity', data, options, responsiveOptions);


        /*  **************** Submissions by Week ******************** */

        var dataStock = {
            labels: ['\'07', '\'08', '\'09', '\'10', '\'11', '\'12', '\'13', '\'14', 'Current'],
            series: [
                [22.20, 34.90, 42.28, 51.93, 62.21, 80.23, 62.21, 82.12, 102.50, 107.23]
            ]
        };

        var optionsStock = {
            lineSmooth: false,
            //   height: "200px",
            axisY: {
                offset: 40,
                labelInterpolationFnc: function (value) {
                    // return '$' + value;
                    return value;
                }
            },
            low: 10,
            height: "250px",
            high: 110,
            classNames: {
                point: 'ct-point ct-green',
                line: 'ct-line ct-green'
            }
        };

        this.chartWeek = new Chartist.Line('#chartStock', dataStock, optionsStock);

        /*  **************** Submission by Category ******************** */

        var dataViews = {
            labels: ['Pharma', 'Medical', 'Devices', 'Hospital', 'Services', 'Digital', 'Diagnostic', 'Others'],
            series: [
                [5, 5, 5, 5, 5, 5, 5, 5]
            ]
        };

        var optionsViews = {
            seriesBarDistance: 10,
            classNames: {
                bar: 'ct-bar'
            },
            axisX: {
                showGrid: false,
            },
            height: "250px"
        };

        var responsiveOptionsViews: any[] = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];

        this.chartCategory = new Chartist.Bar('#chartViews', dataViews, optionsViews, responsiveOptionsViews);
    }

    ngAfterViewInit() {
        this.initCirclePercentage();
    }

    checkArrayAndUpdate(arr: any[], name: string) {
        if (name) {
            let found = _.find(arr, { name: name })
            if (found) {
                _.find(arr, { name: name })['count'] += 1;
            } else {
                _.find(arr, { name: 'other' })['count'] += 1;
            }
        } else {
            _.find(arr, { name: 'other' })['count'] += 1;
        }
    }

    fetchUserCount() {
        this.userSubscription = this.afs.collection('users')
            .snapshotChanges()
            .map(userArray => {
                return userArray.map(user => {
                    return user.payload.doc.data()
                })
            })
            .subscribe(result => {
                this.count['total'] = result.length
                this.count['cipla'] = _.filter(result, user => {
                    return user && user.email && user.email.includes('@cipla.com')
                }).length
            })
    }

    fetchStatsCount() {
        this.statsSubscription = this.afs.collection('submissions')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        submissionId: doc.payload.doc.id,
                        category: doc.payload.doc.data().category,
                        teamName: doc.payload.doc.data().teamName,
                        stage: doc.payload.doc.data().stage,
                        attachment: doc.payload.doc.data().attachment,
                        userID: doc.payload.doc.data().userId,
                        createdAt: doc.payload.doc.data().createdAt
                    };
                });
            })
            .subscribe(result => {
                let weekCount = []

                result.forEach(value => {
                    let catCount = 0;
                    let stageCount = 0;
                    this.totCount++;
                    this.checkArrayAndUpdate(this.catCount, value.category)
                    this.checkArrayAndUpdate(this.stageCount, value.stage || 'ideation')

                    weekCount.push({
                        week: value.createdAt ? moment(value.createdAt).format('W') : '21',
                        weekNumber: value.createdAt ? `Week ${3 + parseInt(moment(value.createdAt).format('W')) - 20}` : 'Week 1 - 3',
                        date: value.createdAt || moment('2018-05-24').toDate()
                    })

                    this.afs.collection('users')
                        .doc(value.userID).valueChanges()
                        .subscribe(res => {
                            if (res && res['email'] && res['email'].includes('@cipla.com')) {
                                this.totCiplaR1++;
                            }
                        });
                });

                let weekData = _.chain(weekCount).sortBy('weekNumber').groupBy('weekNumber').value()

                this.chartStage.update({
                    labels: _.map(this.stageCount, 'name'),
                    series: [_.map(this.stageCount, 'count')]
                });

                this.chartCategory.update({
                    labels: _.map(this.catCount, 'name'),
                    series: [_.map(this.catCount, 'count')]
                });

                this.chartWeek.update({
                    labels:_.keys(weekData),
                    series: [_.map(_.values(weekData), 'length')]
                });
            });
    }

    ngOnDestroy(){
        this.userSubscription.unsubscribe();
        this.statsSubscription.unsubscribe();
    }

}
