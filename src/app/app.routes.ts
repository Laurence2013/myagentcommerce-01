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
      import('./components/agent-form/agent-form.component').then(
        (m) => m.AgentFormComponent
      ),
    children: [
      {
        path: '',
        redirectTo: 'identity',
        pathMatch: 'full'
      },
      {
        path: 'identity',
        loadComponent: () =>
          import('./components/agent-form/steps/identity-step/identity-step.component').then(
            (m) => m.IdentityStepComponent
          ),
        title: 'Register Agent - Identity'
      },
      {
        path: 'taxonomy',
        loadComponent: () =>
          import('./components/agent-form/steps/taxonomy-step/taxonomy-step.component').then(
            (m) => m.TaxonomyStepComponent
          ),
        title: 'Register Agent - Taxonomy'
      },
      {
        path: 'specs',
        loadComponent: () =>
          import('./components/agent-form/steps/specs-step/specs-step.component').then(
            (m) => m.SpecsStepComponent
          ),
        title: 'Register Agent - Tech Specs'
      },
      {
        path: 'merchant',
        loadComponent: () =>
          import('./components/agent-form/steps/merchant-step/merchant-step.component').then(
            (m) => m.MerchantStepComponent
          ),
        title: 'Register Agent - Merchant Profile'
      },
      {
        path: 'commercials',
        loadComponent: () =>
          import('./components/agent-form/steps/commercials-step/commercials-step.component').then(
            (m) => m.CommercialsStepComponent
          ),
        title: 'Register Agent - Commercials'
      },
      {
        path: 'audit',
        loadComponent: () =>
          import('./components/agent-form/steps/audit-step/audit-step.component').then(
            (m) => m.AuditStepComponent
          ),
        title: 'Register Agent - Audit Trail'
      },
      {
        path: 'preview',
        loadComponent: () =>
          import('./components/agent-form/steps/preview-step/preview-step.component').then(
            (m) => m.PreviewStepComponent
          ),
        title: 'Register Agent - JSON Payload'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
