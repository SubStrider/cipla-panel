import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import {DataService} from '../../core/data.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import {EntryTableData} from '../../core/user.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription} from 'rxjs/Subscription';
import { AngularFirestoreDocument} from 'angularfire2/firestore';

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

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(
        private afs: AngularFirestore, private dataService: DataService
    ) {}

    public dataTable: DataTable;

    ngOnInit(){
        this.entriesSubscription = this.dataService.entriesChanged.subscribe((entries: EntryTableData[]) => {
            
            entries.forEach((entry, index) => {
                this.afs.collection('users')
                        .doc(entry['userId']).valueChanges()
                        .subscribe(res => {
                            entry['email'] = res['email']
                        });
            });
            
            this.dataSource.data = entries;
            // console.log(entries);
        });
        this.dataService.fetchEntries();
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

    }
}
