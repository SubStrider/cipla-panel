import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { TablesRoutes } from './entry.routing';

import { JudgesComponent } from './judges/judges.component';
import { ViewentriesComponent } from './viewentries/viewentries.component';
import {MaterialModule} from '../material.module';
import { DetailComponent } from './detail/detail.component';
import { MatRadioModule, MatRadioButton } from '@angular/material/radio';
import {MatSliderModule} from '@angular/material/slider';
import { RaterComponent } from './detail/rater/rater.component';
import { ReportsComponent } from './reports/reports.component';
import { ReportLinkComponent } from './reports/report-link/report-link.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(TablesRoutes),
        FormsModule,
        MaterialModule,
        ReactiveFormsModule,
        MatRadioModule,
        MatSliderModule
    ],
    exports: [
    ],
    declarations: [
        JudgesComponent,
        ViewentriesComponent,
        DetailComponent,
        RaterComponent,
        ReportsComponent,
        ReportLinkComponent,
    ]
})

export class EntryModule {}
