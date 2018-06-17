import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UserTableData } from '../../core/user.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'extended-table-cmp',
    templateUrl: 'judges.component.html'
})

export class JudgesComponent implements OnInit, OnDestroy, AfterViewInit {

    displayedColumns = ['name', 'email', 'phone', 'roles', 'actions'];
    dataSource = new MatTableDataSource<UserTableData>();
    dataDetail: UserTableData[];
    user: any;
    userSubscription: Subscription;
    // loading: boolean;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private dataService: DataService,
        public authService: AuthService
    ) { }

    ngOnInit() {
        this.userSubscription = this.dataService.usersChanged.subscribe((entries: UserTableData[]) => {
            this.dataSource.data = entries;
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
        this.dataService.getUsers()
    }

    doFilter(filterValue: string) {
        if (filterValue && filterValue.length >= 3) {
            this.dataSource.filter = filterValue.trim().toLowerCase();
        } else {
            this.dataSource.filter = null;
        }
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
        this.dataSource.disconnect();
    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    updateUser(user) {
        user.loading = true;
        this.authService.updateUserData(user).then(r => {
            console.log('profile updated')
            user.loading = false;
        }).catch(error => {
            console.error('Some error occurred', error)
            user.loading = false;
        })
    }

    scrollTop() {
        $('.main-panel').scrollTop(0)
    }
}
