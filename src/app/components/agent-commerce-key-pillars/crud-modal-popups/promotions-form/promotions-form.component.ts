import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { CrudModalMode } from '../../../../interfaces/crud-modals';

export interface PromotionsFormValue {
  name: string;
  capability: string[];
  primaryRiskMitigated: string[];
  keyEnabler: string[];
  architecturalNuance: string[];
}

@Component({
  selector: 'app-promotions-form',
  templateUrl: './promotions-form.component.html',
  styleUrl: './promotions-form.component.sass',
  host: {
    'class': 'promotions-form-host'
  }
})
export class PromotionsFormComponent {
  public readonly item = input<Record<string, unknown> | null>(null);
  public readonly mode = input<CrudModalMode | null>(null);
  public readonly pillarName = input<string>('');
  public readonly formChange = output<PromotionsFormValue>();
  public readonly formName = signal<string>('');
  public readonly formCapability = signal<string>('');
  public readonly formPrimaryRiskMitigated = signal<string>('');
  public readonly formKeyEnabler = signal<string>('');
  public readonly formArchitecturalNuance = signal<string>('');

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

    const nuance =
      currentItem['architecturalNuance'] ||
      currentItem['architectural_nuance'] ||
      currentItem['Architectural Nuance'];
    this.formArchitecturalNuance.set(Array.isArray(nuance) ? nuance.join(', ') : (nuance ? String(nuance) : ''));
  }

  public resetForm(): void {
    this.formName.set('');
    this.formCapability.set('');
    this.formPrimaryRiskMitigated.set('');
    this.formKeyEnabler.set('');
    this.formArchitecturalNuance.set('');
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

  public onArchitecturalNuanceInput(event: Event): void {
    this.formArchitecturalNuance.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }

  public getFormValue(): PromotionsFormValue {
    const splitArr = (val: string): string[] =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    return {
      name: this.formName().trim(),
      capability: splitArr(this.formCapability()),
      primaryRiskMitigated: splitArr(this.formPrimaryRiskMitigated()),
      keyEnabler: splitArr(this.formKeyEnabler()),
      architecturalNuance: splitArr(this.formArchitecturalNuance())
    };
  }

  private emitChange(): void {
    this.formChange.emit(this.getFormValue());
  }
}
