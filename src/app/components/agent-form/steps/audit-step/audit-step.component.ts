import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AgentFormComponent } from '../../agent-form.component';
import { AgentSubmission } from '../../../../interface/agent-submission.interface';

@Component({
  selector: 'app-audit-step',
  imports: [ReactiveFormsModule, UpperCasePipe, RouterLink],
  templateUrl: './audit-step.component.html',
  styleUrl: './audit-step.component.sass',
  host: {
    'class': 'step-host'
  }
})
export class AuditStepComponent {
  private readonly parent = inject(AgentFormComponent);

  get formGroup(): FormGroup {
    return this.parent.form;
  }

  getControl(name: string): FormControl {
    return this.parent.form.get(name) as FormControl;
  }

  get isSubmitting(): boolean {
    return this.parent.isSubmitting();
  }

  get isFormValid(): boolean {
    return this.parent.isFormValid();
  }

  readonly statusOptions: AgentSubmission['status'][] = [
    'pending',
    'approved',
    'rejected'
  ];

  readonly submitterRoleOptions: NonNullable<AgentSubmission['submitterRole']>[] = [
    'Developer',
    'Merchant',
    'Agency',
    'Community_Member'
  ];

  onSubmit(): void {
    this.parent.onSubmit();
  }
}
