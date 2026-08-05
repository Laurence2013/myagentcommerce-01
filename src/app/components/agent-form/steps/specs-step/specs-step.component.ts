import { Component, signal, inject } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgentFormComponent } from '../../agent-form.component';
import {
  TransportBinding,
  AuthenticationType,
  TechnicalSpecifications,
  TargetEnvironment
} from '../../../../interface/agent-submission.interface';

@Component({
  selector: 'app-specs-step',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './specs-step.component.html',
  styleUrl: './specs-step.component.sass',
  host: {
    'class': 'step-host'
  }
})
export class SpecsStepComponent {
  private readonly fb = inject(FormBuilder);
  private readonly parent = inject(AgentFormComponent);

  get formGroup(): FormGroup {
    return this.parent.form;
  }

  readonly newCapability = signal<string>('');

  readonly platformOptions: TargetEnvironment['platform'][] = [
    'Shopify',
    'WooCommerce',
    'Magento',
    'Wix',
    'BigCommerce',
    'Custom_Node',
    'Edge_Worker',
    'Cross_Platform'
  ];

  readonly transportBindingOptions: TransportBinding[] = [
    'REST',
    'gRPC',
    'JSON-RPC',
    'MCP',
    'GraphQL',
    'ePOS_Webhook'
  ];

  readonly languageOptions: NonNullable<TargetEnvironment['language']>[] = [
    'TypeScript',
    'Python',
    'Java',
    'PHP',
    'Go',
    'Rust',
    'Other'
  ];

  readonly authenticationOptions: AuthenticationType[] = [
    'OAuth2',
    'API_Key',
    'Web_Bot_Auth',
    'AP2_Mandate',
    'x402_Wallet',
    'None'
  ];

  readonly crossProtocolOptions: TechnicalSpecifications['crossProtocolCompat'][number][] = [
    'UCP',
    'ACP',
    'MCP',
    'AP2',
    'x402',
    'A2A'
  ];

  get capabilitiesArray(): FormArray {
    return this.formGroup.get('specifications.supportedCapabilities') as FormArray;
  }

  addCapability(): void {
    const val = this.newCapability().trim();
    if (val && this.capabilitiesArray) {
      this.capabilitiesArray.push(this.fb.control(val));
      this.newCapability.set('');
    }
  }

  removeCapability(index: number): void {
    if (this.capabilitiesArray) {
      this.capabilitiesArray.removeAt(index);
    }
  }

  toggleCrossProtocol(item: TechnicalSpecifications['crossProtocolCompat'][number]): void {
    const group = this.formGroup.get('specifications.crossProtocolCompat');
    if (!group) return;
    const current: TechnicalSpecifications['crossProtocolCompat'] = group.value || [];
    if (current.includes(item)) {
      group.setValue(current.filter(i => i !== item));
    } else {
      group.setValue([...current, item]);
    }
  }

  isCrossProtocolSelected(item: TechnicalSpecifications['crossProtocolCompat'][number]): boolean {
    const current: TechnicalSpecifications['crossProtocolCompat'] = this.formGroup.get('specifications.crossProtocolCompat')?.value || [];
    return current.includes(item);
  }
}
