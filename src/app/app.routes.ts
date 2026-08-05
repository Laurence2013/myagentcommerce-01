import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    title: 'Agentic Commerce - Home'
  },
  {
    path: 'admin/agents/new',
    loadComponent: () =>
      import('./components/admin-agent-form/admin-agent-form.component').then(
        (m) => m.AdminAgentFormComponent
      ),
    title: 'Admin - Register AI Agent'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
