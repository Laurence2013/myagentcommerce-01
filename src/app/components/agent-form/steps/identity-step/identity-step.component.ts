import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgentFormComponent } from '../../agent-form.component';

@Component({
  selector: 'app-identity-step',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './identity-step.component.html',
  styleUrl: './identity-step.component.sass',
  host: {
    'class': 'step-host'
  }
})
export class IdentityStepComponent {
  private readonly parent = inject(AgentFormComponent);

  get formGroup(): FormGroup {
    return this.parent.form;
  }

  getControl(name: string): FormControl {
    return this.parent.form.get(name) as FormControl;
  }
}
