import {AfterViewInit, Component, OnInit} from '@angular/core';
import * as Chartist from 'chartist';
import {EntryTableData} from '../../core/user.model';
import {DataService} from '../../core/data.service';
import {Observable} from 'rxjs/Observable';
import { StatsData} from '../../core/user.model';
import{ AngularFirestore } from 'angularfire2/firestore';

declare var $:any;

@Component({
  selector: 'overview-cmp',
  templateUrl: './overview.component.html'
})

export class OverviewComponent implements OnInit, AfterViewInit {
    totCount = 0;
    totCiplaR1 = 0;
    totCountR2 = 0;
    totCiplaR2 = 0;
    catCountPharmaceutical = 0;
    catCountMedical = 0;
    catCountDevices = 0;
    catCountHospital = 0;
    catCountServices = 0;
    catCountDigital = 0;
    catCountDiagnostics = 0;
    catCountOthers = 0;
    catCountUndef = 0;
    stgCountIdeation = 0;
    stgCountPOC = 0;
    stgCountRevenues = 0;
    stgCountUndef = 0;

    chartStage;
    chartCategory;
    chartWeek;

    constructor(
        private dataService: DataService, private afs: AngularFirestore,
    ) {}

    initCirclePercentage(){
        $('#chartDashboard, #chartOrders, #chartNewVisitors, #chartSubscriptions, #chartDashboardDoc, #chartOrdersDoc').easyPieChart({
            lineWidth: 6,
            size: 160,
            scaleColor: false,
            trackColor: 'rgba(255,255,255,.25)',
            barColor: '#FFFFFF',
            animate: ({duration: 5000, enabled: true})
        });
    }

    ngOnInit(){
        this.fetchStatsCount();

        /*   **************** Submissions by Stage ********************    */

        var data = {
            labels: ['Ideation', 'POC', 'Revenues',],
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
            labels: ['\'07','\'08','\'09', '\'10', '\'11', '\'12', '\'13', '\'14', 'Current'],
            series: [
                [22.20, 34.90, 42.28, 51.93, 62.21, 80.23, 62.21, 82.12, 102.50, 107.23]
            ]
        };

        var optionsStock = {
            lineSmooth: false,
            //   height: "200px",
            axisY: {
                offset: 40,
                labelInterpolationFnc: function(value) {
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

    ngAfterViewInit(){
        this.initCirclePercentage();
    }

    fetchStatsCount(){
        this.afs.collection('submissions')
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
                    };
                });
            })
            .subscribe(result => {
                result.forEach((value) => {
                    this.totCount++;
                    if (value.category === 'pharmaceutical') {
                        this.catCountPharmaceutical++;
                    }
                    if (value.category === 'medical') {
                        this.catCountMedical++;
                    }
                    if (value.category === 'devices') {
                        this.catCountDevices++;
                    }
                    if (value.category === 'hospital') {
                        this.catCountHospital++;
                    }
                    if (value.category === 'services') {
                        this.catCountServices++;
                    }
                    if (value.category === 'digital') {
                        this.catCountDigital++;
                    }
                    if (value.category === 'diagnostic') {
                        this.catCountDiagnostics++;
                    }
                    if (value.category === 'others') {
                        this.catCountOthers++;
                    }
                    if (value.category === undefined ) {
                        this.catCountUndef++;
                    }
                    if (value.stage === 'ideation') {
                        this.stgCountIdeation++;
                    }
                    if (value.stage === 'poc') {
                        this.stgCountPOC++;
                    }
                    if (value.stage === 'revenues') {
                        this.stgCountRevenues++;
                    }
                    if (value.stage === undefined ) {
                        this.stgCountUndef++;
                    }
                    this.afs.collection('users')
                        .doc(value.userID).valueChanges()
                        .subscribe(res => {
                            // if (res.email.indexOf('cipla.com') > 0) {
                            //     this.totCiplaR1++;
                            // }
                        });
                });

                this.chartStage.update({
                    labels: ['Ideation', 'POC', 'Revenues',],
                    series: [
                        [this.stgCountIdeation, this.stgCountPOC, this.stgCountRevenues]
                    ]
                });
                this.chartCategory.update({
                    labels: ['Pharma', 'Medical', 'Devices', 'Hospital', 'Services', 'Digital', 'Diagnostic', 'Others'],
                    series: [
                        [
                            this.catCountPharmaceutical,
                            this.catCountMedical,
                            this.catCountDevices,
                            this.catCountHospital,
                            this.catCountServices,
                            this.catCountDigital,
                            this.catCountDiagnostics,
                            this.catCountOthers
                        ]
                    ]
                });
            });
    }

}
