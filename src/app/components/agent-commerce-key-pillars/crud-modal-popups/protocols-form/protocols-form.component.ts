import { Component, effect, input, output, signal } from '@angular/core';
import { ProtocolFormValue, CrudModalMode } from '../../../../interfaces/crud-modals';

@Component({
  selector: 'app-protocols-form',
  templateUrl: './protocols-form.component.html',
  styleUrl: './protocols-form.component.sass',
  host: {
    'class': 'protocols-form-host'
  }
})
export class ProtocolsFormComponent {
  public readonly item = input<Record<string, unknown> | null>(null);
  public readonly mode = input<CrudModalMode | null>(null);
  public readonly formChange = output<ProtocolFormValue>();
  public readonly formName = signal<string>('');
  public readonly formLayers = signal<string>('');
  public readonly formPrimaryFunctions = signal<string>('');
  public readonly formKeyBackers = signal<string>('');
  public readonly formTransports = signal<string>('');
  public readonly formGovernance = signal<string>('');
  public readonly formEvaluationContext = signal<string>('');
	public readonly pillarName = input<string>(''); // Receiver signal input

  public resetForm(): void {
    this.formName.set('');
    this.formLayers.set('');
    this.formPrimaryFunctions.set('');
    this.formKeyBackers.set('');
    this.formTransports.set('');
    this.formGovernance.set('');
    this.formEvaluationContext.set('');
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
    this.formEvaluationContext.set((event.target as HTMLInputElement).value);
    this.emitChange();
  }
  public getFormValue(): ProtocolFormValue {
    return {
      name: this.formName().trim(),
      layers: this.formLayers().split(',').map((s) => s.trim()).filter(Boolean),
      primaryFunctions: this.formPrimaryFunctions().split(',').map((s) => s.trim()).filter(Boolean),
      keyBackers: this.formKeyBackers().split(',').map((s) => s.trim()).filter(Boolean),
      transports: this.formTransports().split(',').map((s) => s.trim()).filter(Boolean),
      governance: this.formGovernance().split(',').map((s) => s.trim()).filter(Boolean),
      evaluationContext: this.formEvaluationContext().trim(),
      //collectionName: this.pillarName().trim().toLowerCase()
    };
  }
  private emitChange(): void {
    this.formChange.emit(this.getFormValue());
  }
}
