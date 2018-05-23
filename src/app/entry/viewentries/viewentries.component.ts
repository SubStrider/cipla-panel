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
        // this.dataTable = {
        //     headerRow: [ 'Team Name', 'Category', 'Stage', 'R1 Score', 'R2 Score', 'Actions' ],
        //     footerRow: [ 'Team Name', 'Category', 'Stage', 'R1 Score', 'R2 Score', 'Actions' ],
        //  };

        // this.dataRows = this.afs.collection('submissions')
        //     .snapshotChanges()
        //     .map(docArray => {
        //         return docArray.map(doc => {
        //             return {
        //                 teamName: doc.payload.doc.data().teamName,
        //                 category: doc.payload.doc.data().category,
        //                 stage: doc.payload.doc.data().stage,
        //                 r1Score: doc.payload.doc.data().r1Score,
        //                 r2Score: doc.payload.doc.data().r2Score,
        //                 submissionId: doc.payload.doc.id
        //             };
        //         });
        //     });

        this.entriesSubscription = this.dataService.entriesChanged.subscribe((entries: EntryTableData[]) => {
            this.dataSource.data = entries;
        });
        this.dataService.fetchEntries();
    }



    ngAfterViewInit(){
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        console.log(this.dataSource);

        $('#datatables').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            responsive: true,
            language: {
            search: "_INPUT_",
                searchPlaceholder: "Search records",
            },
        });

        var table = $('#datatables').DataTable();
         // Edit record
        table.on( 'click', '.edit', function () {
            var $tr = $(this).closest('tr');

            var data = table.row($tr).data();
            alert( 'You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.' );
        });

        // Delete a record
        table.on( 'click', '.remove', function (e) {
            var $tr = $(this).closest('tr');
            table.row($tr).remove().draw();
            e.preventDefault();
        });

        //Like record
        table.on( 'click', '.like', function () {
            alert('You clicked on Like button');
        });
    }

    doFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy(){
        this.entriesSubscription.unsubscribe();

    }
}
