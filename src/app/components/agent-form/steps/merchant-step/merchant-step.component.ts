import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgentFormComponent } from '../../agent-form.component';
import {
  TargetMerchantScale,
  TargetMerchantProfile
} from '../../../../interfaces/forms/agent-submission.interface';

@Component({
  selector: 'app-merchant-step',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './merchant-step.component.html',
  styleUrl: './merchant-step.component.sass',
  host: {
    'class': 'step-host'
  }
})
export class MerchantStepComponent {
  private readonly parent = inject(AgentFormComponent);

  get formGroup(): FormGroup {
    return this.parent.form;
  }

  getControl(path: string): FormControl {
    return this.parent.form.get(path) as FormControl;
  }

  readonly scaleOptions: TargetMerchantScale[] = [
    'SMB',
    'Mid_Market',
    'Enterprise',
    'Marketplace_P2P'
  ];

  readonly aovOptions: NonNullable<TargetMerchantProfile['aovRange']>[] = [
    'Micro',
    'Low',
    'Medium',
    'High_Ticket'
  ];

  readonly riskProfileOptions: NonNullable<TargetMerchantProfile['riskProfile']>[] = [
    'Standard',
    'High_Risk',
    'Escrow_Required'
  ];

  toggleScale(item: TargetMerchantScale): void {
    const group = this.parent.form.get('targetMerchantProfile.targetScale');
    if (!group) return;
    const current: TargetMerchantScale[] = group.value || [];
    if (current.includes(item)) {
      group.setValue(current.filter(i => i !== item));
    } else {
      group.setValue([...current, item]);
    }
  }

  isScaleSelected(item: TargetMerchantScale): boolean {
    const current: TargetMerchantScale[] = this.parent.form.get('targetMerchantProfile.targetScale')?.value || [];
    return current.includes(item);
  }
}
