import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgentFormComponent } from '../../agent-form.component';
import {
  DeveloperType,
  AgentSubmission
} from '../../../../interfaces/forms/agent-submission.interface';

@Component({
  selector: 'app-commercials-step',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './commercials-step.component.html',
  styleUrl: './commercials-step.component.sass',
  host: {
    'class': 'step-host'
  }
})
export class CommercialsStepComponent {
  private readonly parent = inject(AgentFormComponent);

  get formGroup(): FormGroup {
    return this.parent.form;
  }

  getControl(name: string): FormControl {
    return this.parent.form.get(name) as FormControl;
  }

  readonly developerTypeOptions: DeveloperType[] = [
    'Solo_Developer',
    'Indie_Hacker',
    'Startup',
    'Enterprise'
  ];

  readonly pricingModelOptions: AgentSubmission['pricingModel'][] = [
    'Open Source',
    'Free',
    'Freemium',
    'Paid',
    'Commission',
    'Enterprise Subscription'
  ];

  readonly verificationStatusOptions: AgentSubmission['verificationStatus'][] = [
    'Unverified',
    'Pending_Audit',
    'Verified_Compliant'
  ];
}
