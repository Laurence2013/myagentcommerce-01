import { Component, effect, input, output, signal } from '@angular/core';
import { PillarTab } from '../agent-commerce-key-pillars.component';

export type CrudModalMode = 'create' | 'edit' | 'delete';

export interface CrudModalSubmitEvent {
  mode: CrudModalMode;
  pillarId: PillarTab;
  item: Record<string, unknown>;
}

@Component({
  selector: 'app-crud-modal-popups',
  templateUrl: './crud-modal-popups.component.html',
  styleUrl: './crud-modal-popups.component.sass',
  host: {
    'class': 'crud-modal-popups-host',
    '(keydown.escape)': 'onEscape()'
  }
})
export class CrudModalPopupsComponent {
  public readonly isOpen = input<boolean>(false);
  public readonly mode = input<CrudModalMode | null>(null);
  public readonly pillarId = input<PillarTab | null>(null);
  public readonly pillarName = input<string>('');
  public readonly item = input<Record<string, unknown> | null>(null);

  public readonly closeModal = output<void>();
  public readonly confirmAction = output<CrudModalSubmitEvent>();

  public readonly formName = signal<string>('');
  public readonly formCapabilities = signal<string>('');
  public readonly formPrimaryRisk = signal<string>('');
  public readonly formKeyEnablers = signal<string>('');

  constructor() {
    effect(() => {
      if (this.isOpen() && this.mode() === 'edit' && this.item()) {
        const currentItem = this.item() || {};
        this.formName.set(String(currentItem['name'] || ''));
        const caps = currentItem['capability'] || currentItem['Capability'];
        this.formCapabilities.set(Array.isArray(caps) ? caps.join(', ') : '');
        const risk = currentItem['primaryRiskMitigated'] || currentItem['primary_risk_mitigated'] || currentItem['Primary Risk Mitigated'];
        this.formPrimaryRisk.set(Array.isArray(risk) ? risk.join(', ') : '');
        const enablers = currentItem['keyEnabler'] || currentItem['key_enabler'] || currentItem['Key Enablers'];
        this.formKeyEnablers.set(Array.isArray(enablers) ? enablers.join(', ') : '');
      } else if (this.isOpen() && this.mode() === 'create') {
        this.formName.set('');
        this.formCapabilities.set('');
        this.formPrimaryRisk.set('');
        this.formKeyEnablers.set('');
      }
    });
  }

  public onEscape(): void {
    if (this.isOpen()) {
      this.closeModal.emit();
    }
  }

  public onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal.emit();
    }
  }

  public onNameInput(event: Event): void {
    this.formName.set((event.target as HTMLInputElement).value);
  }

  public onCapabilitiesInput(event: Event): void {
    this.formCapabilities.set((event.target as HTMLInputElement).value);
  }

  public onPrimaryRiskInput(event: Event): void {
    this.formPrimaryRisk.set((event.target as HTMLInputElement).value);
  }

  public onKeyEnablersInput(event: Event): void {
    this.formKeyEnablers.set((event.target as HTMLInputElement).value);
  }

  public onSubmit(): void {
    const currentMode = this.mode();
    const currentPillar = this.pillarId();
    if (!currentMode || !currentPillar) return;

    if (currentMode === 'delete') {
      this.confirmAction.emit({
        mode: 'delete',
        pillarId: currentPillar,
        item: this.item() || {}
      });
      this.closeModal.emit();
      return;
    }

    const payload: Record<string, unknown> = {
      ...(this.item() || {}),
      name: this.formName().trim(),
      capability: this.formCapabilities()
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      primaryRiskMitigated: this.formPrimaryRisk()
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      keyEnabler: this.formKeyEnablers()
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    };

    this.confirmAction.emit({
      mode: currentMode,
      pillarId: currentPillar,
      item: payload
    });
    this.closeModal.emit();
  }
}
