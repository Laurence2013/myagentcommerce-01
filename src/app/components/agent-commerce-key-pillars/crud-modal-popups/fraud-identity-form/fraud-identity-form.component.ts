import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { CrudModalMode } from '../../../../interfaces/crud-modals';

export interface FraudIdentityFormValue {
  name: string;
  capability: string[];
  primaryRiskMitigated: string[];
  keyEnabler: string[];
}

@Component({
  selector: 'app-fraud-identity-form',
  templateUrl: './fraud-identity-form.component.html',
  styleUrl: './fraud-identity-form.component.sass',
  host: {
    'class': 'fraud-identity-form-host'
  }
})
export class FraudIdentityFormComponent {
  public readonly item = input<Record<string, unknown> | null>(null);
  public readonly mode = input<CrudModalMode | null>(null);
  public readonly pillarName = input<string>('');
  public readonly formChange = output<FraudIdentityFormValue>();
  public readonly formName = signal<string>('');
  public readonly formCapability = signal<string>('');
  public readonly formPrimaryRiskMitigated = signal<string>('');
  public readonly formKeyEnabler = signal<string>('');

  public constructor() {
    effect(() => {
      const currentItem = this.item();
      const currentMode = this.mode();

      untracked(() => {
        if (currentMode === 'edit' && currentItem) {
          this.populateForm(currentItem);
        } else if (currentMode === 'create') {
          this.resetForm();
        }
      });
    });
  }

  private populateForm(currentItem: Record<string, unknown>): void {
    this.formName.set(String(currentItem['name'] || ''));

    const cap = currentItem['capability'] || currentItem['Capability'];
    this.formCapability.set(Array.isArray(cap) ? cap.join(', ') : (cap ? String(cap) : ''));

    const risk =
      currentItem['primaryRiskMitigated'] ||
      currentItem['primary_risk_mitigated'] ||
      currentItem['Primary Risk Mitigated'];
    this.formPrimaryRiskMitigated.set(Array.isArray(risk) ? risk.join(', ') : (risk ? String(risk) : ''));

    const enabler =
      currentItem['keyEnabler'] ||
      currentItem['key_enabler'] ||
      currentItem['Key Enablers'];
    this.formKeyEnabler.set(Array.isArray(enabler) ? enabler.join(', ') : (enabler ? String(enabler) : ''));
  }

  public resetForm(): void {
    this.formName.set('');
    this.formCapability.set('');
    this.formPrimaryRiskMitigated.set('');
    this.formKeyEnabler.set('');
    this.emitChange();
  }

  public onNameInput(event: Event): void {
    this.formName.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }

  public onCapabilityInput(event: Event): void {
    this.formCapability.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }

  public onPrimaryRiskInput(event: Event): void {
    this.formPrimaryRiskMitigated.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }

  public onKeyEnablerInput(event: Event): void {
    this.formKeyEnabler.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }

  public getFormValue(): FraudIdentityFormValue {
    const splitArr = (val: string): string[] =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    return {
      name: this.formName().trim(),
      capability: splitArr(this.formCapability()),
      primaryRiskMitigated: splitArr(this.formPrimaryRiskMitigated()),
      keyEnabler: splitArr(this.formKeyEnabler())
    };
  }

  private emitChange(): void {
    this.formChange.emit(this.getFormValue());
  }
}
