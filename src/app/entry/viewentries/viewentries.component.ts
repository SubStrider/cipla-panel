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
    displayedColumns = ['teamName', 'category', 'stage', 'r1Score', 'r2Score', 'actions'];
    dataSource = new MatTableDataSource<EntryTableData>();
    dataDetail: EntryTableData[];
    private entriesSubscription: Subscription;
    private emailSubscriptions: Subscription;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(
        private afs: AngularFirestore, private dataService: DataService, private papa : PapaParseService
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
            // console.log(entries);
        });
        this.dataService.fetchEntries();
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

    doFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy(){
        this.entriesSubscription.unsubscribe();
        this.emailSubscriptions.unsubscribe();
    }
}
