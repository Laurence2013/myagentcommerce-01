import { Component, input, output, signal, viewChild } from '@angular/core';
import { PillarTab } from '../agent-commerce-key-pillars.component';
import { ProtocolsFormComponent } from './protocols-form/protocols-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import {
  CrudModalMode,
  CrudModalSubmitEvent,
  ProtocolFormValue
} from '../../../interfaces/crud-modals';

@Component({
  selector: 'app-crud-modal-popups',
  templateUrl: './crud-modal-popups.component.html',
  styleUrl: './crud-modal-popups.component.sass',
  imports: [ProtocolsFormComponent, EditFormComponent],
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

  public readonly protocolFormComp = viewChild(ProtocolsFormComponent);
  public readonly editFormComp = viewChild(EditFormComponent);

  public readonly protocolFormValue = signal<ProtocolFormValue | null>(null);

  public constructor() {}
  public onProtocolFormChange(val: ProtocolFormValue): void {
    this.protocolFormValue.set(val);
  }
  public onEditFormChange(val: any): void {}
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
  public onSubmit(): void {
		console.log(this.pillarId());
    const currentMode = this.mode();
    const currentPillar = this.pillarId();
    if (!currentMode || !currentPillar) return;

    if (currentMode === 'delete') {
      this.confirmAction.emit({ mode: 'delete', pillarId: currentPillar, item: this.item() || {} });
      this.closeModal.emit();
      return;
    }

    let payload: Record<string, unknown>;

    if (currentPillar === 'protocols') {
      const childVal = this.protocolFormComp()?.getFormValue();
      const pVal = childVal || this.protocolFormValue();
      payload = {...(this.item() || {}), ...(pVal || {})};
    } else {
      const childVal = this.editFormComp()?.getFormValue();
      payload = {
        ...(this.item() || {}),
        ...(childVal || {})
      };
    }
    this.confirmAction.emit({
      mode: currentMode,
      pillarId: currentPillar,
      item: payload
    });
    this.closeModal.emit();
  }
}
