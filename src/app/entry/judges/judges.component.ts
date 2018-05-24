import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UserTableData } from '../../core/user.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../core/data.service';

declare var $:any;

@Component({
    moduleId: module.id,
    selector: 'extended-table-cmp',
    templateUrl: 'judges.component.html'
})

export class JudgesComponent implements OnInit, OnDestroy, AfterViewInit{

    displayedColumns = ['name', 'roles', 'email', 'actions'];
    dataSource = new MatTableDataSource<UserTableData>();
    dataDetail: UserTableData[];
    usersSubscription: Subscription;
    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private dataService: DataService
    ){ }

    ngOnInit(){
        this.usersSubscription = this.dataService.usersChanged.subscribe((entries: UserTableData[]) => {
            console.log(entries);
            this.dataSource.data = entries;
        });
    }

    doFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    ngOnDestroy(){
        this.usersSubscription.unsubscribe();
    }

    ngAfterViewInit(){
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
    }
}
