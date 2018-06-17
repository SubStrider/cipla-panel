import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { JudgesComponent } from './entry/judges/judges.component';
import { ViewentriesComponent } from './entry/viewentries/viewentries.component';
import { DetailComponent } from './entry/detail/detail.component';
import { ReportsComponent } from './entry/reports/reports.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'a/dashboard/overview',
        pathMatch: 'full'
    },
    {
        path: 'entry',
        redirectTo: 'entry/viewentries',
        pathMatch: 'prefix'
    },
    {
        path: 'a',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'dashboard',
                canActivate: [AuthGuard, AdminGuard],
                children: [
                    {
                        path: 'overview',
                        component: OverviewComponent
                    }
                ]
            },
            {
                path: 'entry',
                canActivate: [AuthGuard, AdminGuard],
                children: [
                    {
                        path: 'viewentries',
                        component: ViewentriesComponent
                    },
                    {
                        path: 'detail/:id',
                        component: DetailComponent
                    },
                    {
                        path: 'judges',
                        component: JudgesComponent
                    },
                    {
                        path: 'reports',
                        component: ReportsComponent
                    }
                ]
            }
        ]
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    }
];
