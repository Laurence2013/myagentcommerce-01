import { Component, input, output, signal, viewChild } from '@angular/core';
import { PillarTab } from '../agent-commerce-key-pillars.component';
import { ProtocolsFormComponent } from './protocols-form/protocols-form.component';
import { EditFormComponent } from './edit-form/edit-form.component';
import { SecuritiesFormComponent, SecuritiesFormValue } from './securities-form/securities-form.component';
import {
  InventoryShippingFormComponent,
  InventoryShippingFormValue
} from './inventory-shipping-form/inventory-shipping-form.component';
import {
  PromotionsFormComponent,
  PromotionsFormValue
} from './promotions-form/promotions-form.component';
import {
  FraudIdentityFormComponent,
  FraudIdentityFormValue
} from './fraud-identity-form/fraud-identity-form.component';
import {
  CrudModalMode,
  CrudModalSubmitEvent,
  ProtocolFormValue
} from '../../../interfaces/crud-modals';

@Component({
  selector: 'app-crud-modal-popups',
  templateUrl: './crud-modal-popups.component.html',
  styleUrl: './crud-modal-popups.component.sass',
  imports: [
    ProtocolsFormComponent,
    EditFormComponent,
    SecuritiesFormComponent,
    InventoryShippingFormComponent,
    PromotionsFormComponent,
    FraudIdentityFormComponent
  ],
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
  public readonly securitiesFormComp = viewChild(SecuritiesFormComponent);
  public readonly inventoryShippingFormComp = viewChild(InventoryShippingFormComponent);
  public readonly promotionsFormComp = viewChild(PromotionsFormComponent);
  public readonly fraudIdentityFormComp = viewChild(FraudIdentityFormComponent);

  public readonly protocolFormValue = signal<ProtocolFormValue | null>(null);
  public readonly editFormValue = signal<Record<string, unknown> | null>(null);
  public readonly securitiesFormValue = signal<SecuritiesFormValue | null>(null);
  public readonly inventoryShippingFormValue = signal<InventoryShippingFormValue | null>(null);
  public readonly promotionsFormValue = signal<PromotionsFormValue | null>(null);
  public readonly fraudIdentityFormValue = signal<FraudIdentityFormValue | null>(null);

  public constructor() {}
  public onProtocolFormChange(val: ProtocolFormValue): void {
    this.protocolFormValue.set(val);
  }
  public onEditFormChange(val: Record<string, unknown>): void {
    this.editFormValue.set(val);
  }
  public onSecuritiesFormChange(val: SecuritiesFormValue): void {
    this.securitiesFormValue.set(val);
  }
  public onInventoryShippingFormChange(val: InventoryShippingFormValue): void {
    this.inventoryShippingFormValue.set(val);
  }
  public onPromotionsFormChange(val: PromotionsFormValue): void {
    this.promotionsFormValue.set(val);
  }
  public onFraudIdentityFormChange(val: FraudIdentityFormValue): void {
    this.fraudIdentityFormValue.set(val);
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
  public onSubmit(): void {
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
    } else if (currentPillar === 'securities' || this.pillarName().trim().toLowerCase() === 'securities') {
      const childVal = this.securitiesFormComp()?.getFormValue();
      const sVal = childVal || this.securitiesFormValue();
      payload = {...(this.item() || {}), ...(sVal || {})};
    } else if ( currentPillar === 'inventory-n-shipping' || this.pillarName().trim().toLowerCase().includes('inventory')) {
      const childVal = this.inventoryShippingFormComp()?.getFormValue();
      const iVal = childVal || this.inventoryShippingFormValue();
      payload = {...(this.item() || {}), ...(iVal || {})};
    } else if (currentPillar === 'promotions' || this.pillarName().trim().toLowerCase().includes('promotion')) {
      const childVal = this.promotionsFormComp()?.getFormValue();
      const prVal = childVal || this.promotionsFormValue();
      payload = {...(this.item() || {}), ...(prVal || {})};
    } else if (currentPillar === 'fraud-n-identity' || this.pillarName().trim().toLowerCase().includes('fraud')) {
      const childVal = this.fraudIdentityFormComp()?.getFormValue();
      const fiVal = childVal || this.fraudIdentityFormValue();
      payload = {...(this.item() || {}), ...(fiVal || {})};
    } else {
      const childVal = this.editFormComp()?.getFormValue();
      const eVal = childVal || this.editFormValue();
      payload = {
        ...(this.item() || {}),
        ...(eVal || {})
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
