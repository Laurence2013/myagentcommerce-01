import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-agent-commerce-key-pillars',
  imports: [ReactiveFormsModule],
  templateUrl: './agent-commerce-key-pillars.component.html',
  styleUrl: './agent-commerce-key-pillars.component.sass',
  host: {
    'class': 'agent-commerce-key-pillars-host'
  }
})
export class AgentCommerceKeyPillars {
  private readonly fb = inject(FormBuilder);

  public readonly evaluationForm: FormGroup = this.fb.group({
    protocolCompatibility: ['', Validators.required],
    paymentSecurity: ['', Validators.required],
    inventoryShipping: ['', Validators.required],
    promotions: ['', Validators.required],
    fraudIdentity: ['', Validators.required],
    returns: ['', Validators.required]
  });

  public onSubmit(): void {
    if (this.evaluationForm.valid) {
      console.log('Merchant Evaluation Form Submitted:', this.evaluationForm.value);
    } else {
      this.evaluationForm.markAllAsTouched();
    }
  }
}
