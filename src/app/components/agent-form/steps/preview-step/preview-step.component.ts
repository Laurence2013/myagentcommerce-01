import { Component, inject, computed } from '@angular/core';
import { AgentFormComponent } from '../../agent-form.component';

@Component({
  selector: 'app-preview-step',
  imports: [],
  templateUrl: './preview-step.component.html',
  styleUrl: './preview-step.component.sass',
  host: {
    'class': 'step-host'
  }
})
export class PreviewStepComponent {
  private readonly parent = inject(AgentFormComponent);

  get isValid(): boolean {
    return this.parent.isFormValid();
  }

  readonly jsonCode = computed(() => JSON.stringify(this.parent.form.value, null, 2));
}
