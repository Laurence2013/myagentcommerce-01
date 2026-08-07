import { Component, computed, effect, input, output, signal, untracked } from '@angular/core';

export interface ParsedItemResult {
  name: string;
  layers: string;
  primaryFunctions: string;
  keyBackers: string;
  transports: string;
  governance: string;
  evaluationContext: string;
  capability: string;
  primaryRiskMitigated: string;
  keyEnabler: string;
}

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrl: './edit-form.component.sass',
  host: {
    'class': 'edit-form-host'
  }
})
export class EditFormComponent {
  public readonly item = input<Record<string, unknown> | null>(null);
  public readonly pillarName = input<string>('');

  public readonly formChange = output<Record<string, unknown>>();

  public readonly formName = signal<string>('');
  public readonly formLayers = signal<string>('');
  public readonly formPrimaryFunctions = signal<string>('');
  public readonly formKeyBackers = signal<string>('');
  public readonly formTransports = signal<string>('');
  public readonly formGovernance = signal<string>('');
  public readonly formEvaluationContext = signal<string>('');
  public readonly formCapability = signal<string>('');
  public readonly formPrimaryRiskMitigated = signal<string>('');
  public readonly formKeyEnabler = signal<string>('');

  public readonly parsed = computed<ParsedItemResult | null>(() => this.parseItem());

  public constructor() {
    effect(() => {
      const p = this.parsed();
      untracked(() => {
        if (p) {
          this.formName.set(p.name);
          this.formLayers.set(p.layers);
          this.formPrimaryFunctions.set(p.primaryFunctions);
          this.formKeyBackers.set(p.keyBackers);
          this.formTransports.set(p.transports);
          this.formGovernance.set(p.governance);
          this.formEvaluationContext.set(p.evaluationContext);
          this.formCapability.set(p.capability);
          this.formPrimaryRiskMitigated.set(p.primaryRiskMitigated);
          this.formKeyEnabler.set(p.keyEnabler);
        } else {
          this.resetForm();
        }
      });
    });
  }
  public parseItem(): ParsedItemResult | null {
    const raw = this.item();
    if (!raw) {
      console.log('[EditFormComponent] Parsed item: null');
      return null;
    }
    const formatArrayOrString = (val: unknown): string => {
      if (Array.isArray(val)) {
        return val.join(', ');
      }
      return val ? String(val) : '';
    };
    const parsed: ParsedItemResult = {
      name: String(raw['name'] || ''),
      layers: formatArrayOrString(raw['layers']),
      primaryFunctions: formatArrayOrString(raw['primaryFunctions'] || raw['primary_functions']),
      keyBackers: formatArrayOrString(raw['keyBackers'] || raw['key_backers']),
      transports: formatArrayOrString(raw['transports']),
      governance: formatArrayOrString(raw['governance']),
      evaluationContext: String(raw['evaluationContext'] || raw['evaluation_context'] || ''),
      capability: formatArrayOrString(raw['capability'] || raw['Capability']),
      primaryRiskMitigated: formatArrayOrString(
        raw['primaryRiskMitigated'] || raw['primary_risk_mitigated'] || raw['Primary Risk Mitigated']
      ),
      keyEnabler: formatArrayOrString(raw['keyEnabler'] || raw['key_enabler'] || raw['Key Enablers'])
    };
    console.log('[EditFormComponent] Parsed item to HTML format:', parsed);
    return parsed;
  }
  public resetForm(): void {
    this.formName.set('');
    this.formLayers.set('');
    this.formPrimaryFunctions.set('');
    this.formKeyBackers.set('');
    this.formTransports.set('');
    this.formGovernance.set('');
    this.formEvaluationContext.set('');
    this.formCapability.set('');
    this.formPrimaryRiskMitigated.set('');
    this.formKeyEnabler.set('');
    this.emitChange();
  }
  public onNameInput(event: Event): void {
    this.formName.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onLayersInput(event: Event): void {
    this.formLayers.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onPrimaryFunctionsInput(event: Event): void {
    this.formPrimaryFunctions.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onKeyBackersInput(event: Event): void {
    this.formKeyBackers.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onTransportsInput(event: Event): void {
    this.formTransports.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onGovernanceInput(event: Event): void {
    this.formGovernance.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public onEvaluationContextInput(event: Event): void {
    this.formEvaluationContext.set((event.target as HTMLTextAreaElement).value);
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
  public getFormValue(): Record<string, unknown> {
    const splitArr = (val: string): string[] =>
      val
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const val: Record<string, unknown> = {};

    if (this.formName()) val['name'] = this.formName().trim();
    if (this.formLayers()) val['layers'] = splitArr(this.formLayers());
    if (this.formPrimaryFunctions()) val['primaryFunctions'] = splitArr(this.formPrimaryFunctions());
    if (this.formKeyBackers()) val['keyBackers'] = splitArr(this.formKeyBackers());
    if (this.formTransports()) val['transports'] = splitArr(this.formTransports());
    if (this.formGovernance()) val['governance'] = splitArr(this.formGovernance());
    if (this.formEvaluationContext()) val['evaluationContext'] = this.formEvaluationContext().trim();
    if (this.formCapability()) val['capability'] = splitArr(this.formCapability());
    if (this.formPrimaryRiskMitigated()) val['primaryRiskMitigated'] = splitArr(this.formPrimaryRiskMitigated());
    if (this.formKeyEnabler()) val['keyEnabler'] = splitArr(this.formKeyEnabler());

    return val;
  }
  private emitChange(): void {
    this.formChange.emit(this.getFormValue());
  }
}
