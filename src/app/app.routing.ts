import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AuthGuard} from './core/auth.guard';
import {AdminGuard} from './core/admin.guard';
import { JudgeGuard } from './core/judge.guard';

export const AppRoutes: Routes = [{
        path: '',
        redirectTo: 'dashboard/overview',
        pathMatch: 'full',
    },{
        path: '',
        component: AdminLayoutComponent,
        children: [{
            path: 'dashboard',
            loadChildren: './dashboard/dashboard.module#DashboardModule',
            canActivate: [AuthGuard, JudgeGuard, AdminGuard]
        },{
            path: 'components',
            loadChildren: './components/components.module#ComponentsModule',
            canActivate: [AuthGuard, AdminGuard]
        },{
            path: 'forms',
            loadChildren: './forms/forms.module#Forms',
            canActivate: [AuthGuard, AdminGuard]
        },{
            path: 'entry',
            loadChildren: './entry/entry.module#EntryModule',
            // canActivate: [AuthGuard, AdminGuard]
        },{
            path: 'charts',
            loadChildren: './charts/charts.module#ChartsModule',
            canActivate: [AuthGuard, AdminGuard]
        },{
            path: '',
            loadChildren: './userpage/user.module#UserModule',
        },{
            path: '',
            loadChildren: './timeline/timeline.module#TimelineModule'
        }]
        },{
            path: '',
            component: AuthLayoutComponent,
            children: [{
                path: 'pages',
                loadChildren: './pages/pages.module#PagesModule'
            }]
        }
];
