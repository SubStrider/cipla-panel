import { Routes } from '@angular/router';

import { JudgesComponent } from './judges/judges.component';
import { ViewentriesComponent } from './viewentries/viewentries.component';
import {DetailComponent} from './detail/detail.component';

export const TablesRoutes: Routes = [{
        path: '',
        children: [{
            path: 'judges',
            component: JudgesComponent
        }]
    },{
        path: '',
        children: [ {
            path: 'viewentries',
            component: ViewentriesComponent,
        }]
    },{
        path: '',
        children: [ {
            path: 'detail',
            component: DetailComponent,
        }]
    }
];
