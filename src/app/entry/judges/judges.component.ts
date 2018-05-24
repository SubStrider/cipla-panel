import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UserTableData } from '../../core/user.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';

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
        private dataService: DataService,
        private authService: AuthService
    ){ }

    ngOnInit(){
        this.usersSubscription = this.dataService.usersChanged.subscribe((entries: UserTableData[]) => {
            this.dataSource.data = entries;
        });
        this.dataService.getUsers()
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

    updateUser(user){
        console.log(user)
        this.authService.updateUserData(user).then(r => {
            console.log('profile updated')
        }).catch(error => {
            console.error('Some error occurred', error)
        })
    }
}
