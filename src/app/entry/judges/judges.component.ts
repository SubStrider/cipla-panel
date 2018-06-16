import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { UserTableData } from '../../core/user.model';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { DataService } from '../../core/data.service';
import { AuthService } from '../../core/auth.service';
import { PapaParseService } from 'ngx-papaparse';
import * as moment from 'moment';

declare var $:any;

@Component({
    moduleId: module.id,
    selector: 'extended-table-cmp',
    templateUrl: 'judges.component.html'
})

export class JudgesComponent implements OnInit, OnDestroy, AfterViewInit{

    displayedColumns = ['name', 'email', 'phone','roles','actions'];
    dataSource = new MatTableDataSource<UserTableData>();
    dataDetail: UserTableData[];
    user: any;
    // loading: boolean;
    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private dataService: DataService,
        public authService: AuthService,
        private papa: PapaParseService
    ){ }

    ngOnInit(){
        let usersSubscription = this.dataService.usersChanged.subscribe((entries: UserTableData[]) => {
            usersSubscription.unsubscribe()
            this.dataSource.data = entries;
        });
        this.dataService.getUsers()
    }

    doFilter(filterValue: string) {
        if(filterValue && filterValue.length >= 3){
            this.dataSource.filter = filterValue.trim().toLowerCase();
        } else {
            this.dataSource.filter = null;
        }
    }

    ngOnDestroy(){
        this.dataSource.disconnect();
    }

    ngAfterViewInit(){
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log(this.dataSource);
    }

    updateUser(user){
        user.loading = true;
        this.authService.updateUserData(user).then(r => {
            console.log('profile updated')
            user.loading = false;
        }).catch(error => {
            console.error('Some error occurred', error)
            user.loading = false;
        })
    }

    downloadUserCsv(){
       let csvData = this.papa.unparse(this.dataSource.data,{header: true})
       this.download(`Users - ${moment().format('MMM dd hhmmss')}`, csvData)
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
}
