import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TablesRoutes } from './entry.routing';

import { JudgesComponent } from './judges/judges.component';
import { ViewentriesComponent } from './viewentries/viewentries.component';
import {MaterialModule} from '../material.module';
import { DetailComponent } from './detail/detail.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TablesRoutes),
        FormsModule,
        MaterialModule
    ],
    exports: [
    ],
    declarations: [
        JudgesComponent,
        ViewentriesComponent,
        DetailComponent,
    ]
})

export class EntryModule {}
