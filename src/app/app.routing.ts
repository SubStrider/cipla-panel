import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

import { AuthGuard} from './core/auth.guard';

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
            canActivate: [AuthGuard]
        },{
            path: 'components',
            loadChildren: './components/components.module#ComponentsModule',
            canActivate: [AuthGuard]
        },{
            path: 'forms',
            loadChildren: './forms/forms.module#Forms',
            canActivate: [AuthGuard]
        },{
            path: 'entry',
            loadChildren: './entry/entry.module#EntryModule',
            canActivate: [AuthGuard]
        },{
            path: 'charts',
            loadChildren: './charts/charts.module#ChartsModule',
            canActivate: [AuthGuard]
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
