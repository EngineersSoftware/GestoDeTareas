import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./presentation/pages/task-dashboard/task-dashboard').then(
        (m) => m.TaskDashboardComponent,
      ),
  },
  {
    path: 'stats',
    loadComponent: () =>
      import('./presentation/pages/stats/stats').then((m) => m.StatsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
