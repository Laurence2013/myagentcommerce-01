import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-merchant-evaluation',
  imports: [ReactiveFormsModule],
  templateUrl: './merchant-evaluation.component.html',
  styleUrl: './merchant-evaluation.component.sass',
  host: {
    'class': 'merchant-evaluation-host'
  }
})
export class MerchantEvaluationComponent {
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
