import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AuthGuard } from './core/auth.guard';
import { AdminGuard } from './core/admin.guard';
import { OverviewComponent } from './dashboard/overview/overview.component';
import { JudgesComponent } from './entry/judges/judges.component';
import { ViewentriesComponent } from './entry/viewentries/viewentries.component';
import { DetailComponent } from './entry/detail/detail.component';

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
                    }
                ]
            }
        ]
    },
    // {
    //     path: '',
    //     component: AdminLayoutComponent,
    //     children: [{
    //         path: 'dashboard',
    //         loadChildren: './dashboard/dashboard.module#DashboardModule',
    //         canActivate: [AuthGuard, AdminGuard]
    //     }, {
    //         path: 'components',
    //         loadChildren: './components/components.module#ComponentsModule',
    //         canActivate: [AuthGuard, AdminGuard]
    //     }, {
    //         path: 'forms',
    //         loadChildren: './forms/forms.module#Forms',
    //         canActivate: [AuthGuard, AdminGuard]
    //     }, {
    //         path: 'entry',
    //         loadChildren: './entry/entry.module#EntryModule'
    //     }, {
    //         path: 'charts',
    //         loadChildren: './charts/charts.module#ChartsModule',
    //         canActivate: [AuthGuard, AdminGuard]
    //     },
    // {
    //     path: '',
    //     loadChildren: './userpage/user.module#UserModule',
    // }, {
    //     path: '',
    //     loadChildren: './timeline/timeline.module#TimelineModule'
    // }
    // ]
    //     },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: 'pages',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    }
];
