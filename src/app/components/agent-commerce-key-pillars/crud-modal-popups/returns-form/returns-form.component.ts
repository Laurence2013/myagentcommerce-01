import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { CrudModalMode } from '../../../../interfaces/crud-modals';

export interface ReturnsFormValue {
  name: string;
  primaryRiskMitigated: string[];
  keyEnabler: string[];
  architecturalValidity: string[];
}

@Component({
  selector: 'app-returns-form',
  templateUrl: './returns-form.component.html',
  styleUrl: './returns-form.component.sass',
  host: {
    'class': 'returns-form-host'
  }
})
export class ReturnsFormComponent {
  public readonly item = input<Record<string, unknown> | null>(null);
  public readonly mode = input<CrudModalMode | null>(null);
  public readonly pillarName = input<string>('');
  public readonly formChange = output<ReturnsFormValue>();
  public readonly formName = signal<string>('');
  public readonly formPrimaryRiskMitigated = signal<string>('');
  public readonly formKeyEnabler = signal<string>('');
  public readonly formArchitecturalValidity = signal<string>('');

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

    const validity =
      currentItem['architecturalValidity'] ||
      currentItem['architectural_validity'] ||
      currentItem['Architectural Validity'];
    this.formArchitecturalValidity.set(Array.isArray(validity) ? validity.join(', ') : (validity ? String(validity) : ''));
  }

  public resetForm(): void {
    this.formName.set('');
    this.formPrimaryRiskMitigated.set('');
    this.formKeyEnabler.set('');
    this.formArchitecturalValidity.set('');
    this.emitChange();
  }

  public onNameInput(event: Event): void {
    this.formName.set((event.target as HTMLInputElement).value);
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

  public onArchitecturalValidityInput(event: Event): void {
    this.formArchitecturalValidity.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }

  public getFormValue(): ReturnsFormValue {
    const splitArr = (val: string): string[] =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    return {
      name: this.formName().trim(),
      primaryRiskMitigated: splitArr(this.formPrimaryRiskMitigated()),
      keyEnabler: splitArr(this.formKeyEnabler()),
      architecturalValidity: splitArr(this.formArchitecturalValidity())
    };
  }

  private emitChange(): void {
    this.formChange.emit(this.getFormValue());
  }
}
