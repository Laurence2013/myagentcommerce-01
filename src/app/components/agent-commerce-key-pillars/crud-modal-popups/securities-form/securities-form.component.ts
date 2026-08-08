import { Component, effect, input, output, signal, untracked } from '@angular/core';
import { CrudModalMode } from '../../../../interfaces/crud-modals';

export interface SecuritiesFormValue {
  name: string;
  Capability: string[];
  'Primary Risk Mitigated': string[];
  Protocols: string[];
  Mechanisms: string[];
}

@Component({
  selector: 'app-securities-form',
  templateUrl: './securities-form.component.html',
  styleUrl: './securities-form.component.sass',
  host: {
    'class': 'securities-form-host'
  }
})
export class SecuritiesFormComponent {
  public readonly item = input<Record<string, unknown> | null>(null);
  public readonly mode = input<CrudModalMode | null>(null);
  public readonly pillarName = input<string>('');
  public readonly formChange = output<SecuritiesFormValue>();
  public readonly formName = signal<string>('');
  public readonly formCapability = signal<string>('');
  public readonly formPrimaryRiskMitigated = signal<string>('');
  public readonly formProtocols = signal<string>('');
  public readonly formMechanisms = signal<string>('');

  public constructor(){
    effect(() => {
      const currentItem = this.item();
      const currentMode = this.mode();

      untracked(() => {
        if (currentMode === 'edit' && currentItem) {
					this.editComponent(currentItem)
        } else if (currentMode === 'create') {
          this.resetForm();
        }
      });
    });
  }
  public resetForm(): void {
    this.formName.set('');
    this.formCapability.set('');
    this.formPrimaryRiskMitigated.set('');
    this.formProtocols.set('');
    this.formMechanisms.set('');
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
  public onProtocolsInput(event: Event): void {
    this.formProtocols.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onMechanismsInput(event: Event): void {
    this.formMechanisms.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public getFormValue(): SecuritiesFormValue {
    const splitArr = (val: string): string[] => val
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

    return {
      name: this.formName().trim(),
      Capability: splitArr(this.formCapability()),
      'Primary Risk Mitigated': splitArr(this.formPrimaryRiskMitigated()),
      Protocols: splitArr(this.formProtocols()),
      Mechanisms: splitArr(this.formMechanisms())
    };
  }
	private editComponent(currentItem: Record<string, unknown>){
		this.formName.set(String(currentItem['name'] || ''));

		const cap = currentItem['Capability'] || currentItem['capability'];
		this.formCapability.set(Array.isArray(cap) ? cap.join(', ') : (cap ? String(cap) : ''));

		const risk = currentItem['Primary Risk Mitigated'] || currentItem['primaryRiskMitigated'];
		this.formPrimaryRiskMitigated.set(Array.isArray(risk) ? risk.join(', ') : (risk ? String(risk) : ''));

		const prots = currentItem['Protocols'] || currentItem['protocols'];
		this.formProtocols.set(Array.isArray(prots) ? prots.join(', ') : (prots ? String(prots) : ''));

		const mechs = currentItem['Mechanisms'] || currentItem['mechanisms'];
		this.formMechanisms.set(Array.isArray(mechs) ? mechs.join(', ') : (mechs ? String(mechs) : ''));
	}
  private emitChange(): void {
    this.formChange.emit(this.getFormValue());
  }
}
