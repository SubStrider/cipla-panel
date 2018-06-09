import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {DataService} from '../../core/data.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import {EntryTableData} from '../../core/user.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription} from 'rxjs/Subscription';
import { AngularFirestoreDocument} from 'angularfire2/firestore';
import { PapaParseService } from 'ngx-papaparse';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';

declare var $:any;

declare interface DataTable {
    headerRow: string[];
    footerRow: string[];
}

@Component({
    moduleId: module.id,
    selector: 'data-table-cmp',
    templateUrl: 'viewentries.component.html'
})

export class ViewentriesComponent implements OnInit, OnDestroy, AfterViewInit {
    // dataRows: Observable<EntryTableData[]>;
    displayedColumns = ['numericId','teamName', 'category', 'stage', 'r1Score', 'r2Score', 'actions'];
    dataSource = new MatTableDataSource<EntryTableData>();
    dataDetail: EntryTableData[];
    private entriesSubscription: Subscription;
    private emailSubscriptions: Subscription;
    categories: string[] = ['pharmaceutical','medical','devices','hospital','services','digital','diagnostics'];
    stages: string[] = ['ideation','poc','revenues'];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    selectedCategory: string;
    selectedStage: string;
    selectedFilter: string;

    constructor(
        private afs: AngularFirestore, 
        private dataService: DataService, 
        private papa : PapaParseService, 
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {}

    public dataTable: DataTable;

    ngOnInit(){
        this.entriesSubscription = this.dataService.entriesChanged.subscribe((entries: EntryTableData[]) => {
            
            entries.forEach((entry, index) => {
                this.emailSubscriptions = this.afs.collection('users')
                        .doc(entry['userId']).valueChanges()
                        .subscribe(res => {
                            if(res && entry){
                                entry['email'] = res['email']
                            }
                        });
            });
            
            this.dataSource.data = entries;
        });

        this.activatedRoute.queryParams.subscribe(params => {
            this.selectedCategory = params['category']
            this.selectedStage = params['stage']
        this.dataService.fetchEntries(this.selectedCategory, this.selectedStage);
        }, error => {
            console.error(error)
        })

    }

    downloadSubmissionsCsv(){
        let csvData = this.papa.unparse(this.dataSource.data,{header: true})
        this.download(`Submissions - ${moment().format('MMM dd hhmmss')}`, csvData)
     }

     download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
      
        element.style.display = 'none';
        document.body.appendChild(element);
      
        element.click();
      
        document.body.removeChild(element);
      }


    ngAfterViewInit(){
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    doFilter(filterValue?: string) {
        if(filterValue && filterValue.length){
            this.dataSource.filter = filterValue.trim().toLowerCase();
        } else {
            this.dataSource.filter = null
        }
    }

    ngOnDestroy(){
        this.entriesSubscription.unsubscribe();
        this.emailSubscriptions.unsubscribe();
    }

    selectCategory(category){
        this.router.navigate(['/a/entry/viewentries'], {queryParams: {category: category.value}, queryParamsHandling: 'merge'})
    }

    selectStage(stage){
        this.router.navigate(['/a/entry/viewentries'], {queryParams: {stage: stage.value}, queryParamsHandling: 'merge'})
    }

    selectCipla(event){
        if(event.checked){
            this.doFilter('@cipla.com')
        } else {
            this.doFilter()
        }
    }

    reset(){
        this.selectedCategory = null
        this.selectedStage = null
        this.router.navigate(['/a/entry/viewentries'])
    }
}
