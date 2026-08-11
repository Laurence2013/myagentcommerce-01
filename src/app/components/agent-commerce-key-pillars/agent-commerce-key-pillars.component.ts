import { Component, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgentPillarsService } from '../../services/agent-pillars/agent-pillars.service';
import { ProtocolItem, SecurityItem, InventoryAndShippingItem, 
	PromotionItem, FraudDetectionItem, ReturnItem } from '../../interfaces/agent-commerce-pillars';
import { CrudModalPopupsComponent } from './crud-modal-popups/crud-modal-popups.component';
import { CrudModalMode, CrudModalSubmitEvent } from '../../interfaces/crud-modals';

export const PILLAR_TABS = {
  PROTOCOLS: 'protocols',
  SECURITIES: 'securities',
  INVENTORY_SHIPPING: 'inventory-n-shipping',
  PROMOTIONS: 'promotions',
  FRAUD_IDENTITY: 'fraud-n-identity',
  RETURNS: 'returns',
  ADD_NEW_PROTOCOL: 'add-new-protocol',
	ADD_NEW_SECURITIES: 'add-new-securities',
	ADD_NEW_INVENTORY_SHIPPING: 'add-new-inventory-shipping'
} as const;

export type PillarTab = typeof PILLAR_TABS[keyof typeof PILLAR_TABS];

export interface TabDefinition {
  id: PillarTab;
  name: string;
}

@Component({
  selector: 'app-agent-commerce-key-pillars',
  templateUrl: './agent-commerce-key-pillars.component.html',
  styleUrl: './agent-commerce-key-pillars.component.sass',
  imports: [CrudModalPopupsComponent],
  host: {
    'class': 'agent-commerce-key-pillars-host',
    '(window:scroll)': 'onWindowScroll()'
  }
})
export class AgentCommerceKeyPillars {
  public readonly PILLAR_TABS = PILLAR_TABS;
  protected readonly agentPillarsService = inject(AgentPillarsService);

  public readonly activeTab = signal<PillarTab>('protocols');
  public readonly isModalOpen = signal<boolean>(false);
  public readonly modalMode = signal<CrudModalMode | null>(null);
  public readonly selectedPillar = signal<PillarTab | null>(null);
  public readonly selectedItem = signal<Record<string, unknown> | null>(null);
  public readonly showBackToTop = signal<boolean>(false);
  public readonly tabs: TabDefinition[] = [
    { id: 'protocols', name: 'Protocols' },
    { id: 'securities', name: 'Securities' },
    { id: 'inventory-n-shipping', name: 'Inventory & Shipping' },
    { id: 'promotions', name: 'Promotions' },
    { id: 'fraud-n-identity', name: 'Fraud & Identity' },
    { id: 'returns', name: 'Returns' }
  ];
  public readonly protocols: Signal<ProtocolItem[]> = toSignal(
    this.agentPillarsService.getProtocols(),
    { initialValue: [] }
  );
  public readonly securities: Signal<SecurityItem[]> = toSignal(
    this.agentPillarsService.getSecurities(),
    { initialValue: [] }
  );
  public readonly inventoryShipping: Signal<InventoryAndShippingItem[]> = toSignal(
    this.agentPillarsService.getInventoryAndShipping(),
    { initialValue: [] }
  );
  public readonly promotions: Signal<PromotionItem[]> = toSignal(
    this.agentPillarsService.getPromotions(),
    { initialValue: [] }
  );
  public readonly fraudIdentity: Signal<FraudDetectionItem[]> = toSignal(
    this.agentPillarsService.getFraudAndIdentity(),
    { initialValue: [] }
  );
  public readonly returns: Signal<ReturnItem[]> = toSignal(
    this.agentPillarsService.getReturns(),
    { initialValue: [] }
  );
  public selectTab(tabId: PillarTab): void {
    this.activeTab.set(tabId);
  }
  public onCreate(pillarId: PillarTab): void {
    this.selectedPillar.set(pillarId);
    this.selectedItem.set(null);
    this.modalMode.set('create');
    this.isModalOpen.set(true);
  }
	public onAdd(pillarId: PillarTab, item?: unknown): void {
    this.selectedPillar.set(pillarId);
		this.selectedItem.set((item as Record<string, unknown>) || null);
    this.modalMode.set('add');
    this.isModalOpen.set(true);
	}
  public onEdit(pillarIdOrItem: PillarTab | Record<string, unknown> | unknown, item?: unknown): void {
    if (typeof pillarIdOrItem === 'string') {
      this.selectedPillar.set(pillarIdOrItem as PillarTab);
      this.selectedItem.set((item as Record<string, unknown>) || null);
    } else {
      this.selectedPillar.set(this.activeTab());
      this.selectedItem.set((pillarIdOrItem as Record<string, unknown>) || null);
    }
    this.modalMode.set('edit');
    this.isModalOpen.set(true);
  }
  public onDelete(pillarId: PillarTab, item: unknown): void {
    this.selectedPillar.set(pillarId);
    this.selectedItem.set((item as Record<string, unknown>) || null);
    this.modalMode.set('delete');
    this.isModalOpen.set(true);
  }
  public onModalClose(): void {
    this.isModalOpen.set(false);
    this.modalMode.set(null);
    this.selectedItem.set(null);
  }
  public onModalSubmit(event: CrudModalSubmitEvent): void {
		console.log(event.item);
    console.log('[AgentCommerceKeyPillars] Form Submitted from Modal:', {
      formType: event.pillarId,
      currentTabId: this.activeTab(),
      currentTabName: this.getPillarName(this.activeTab()),
      documentId: event.item?.['id'] || event.item?.['docId'] || 'N/A',
      payload: [event.item?.['name'], event.item?.['values']]
    });
    if (
      event.pillarId === PILLAR_TABS.ADD_NEW_PROTOCOL ||
      event.pillarId === PILLAR_TABS.ADD_NEW_SECURITIES ||
      event.pillarId === PILLAR_TABS.ADD_NEW_INVENTORY_SHIPPING ||
      String(event.pillarId).startsWith('add-new-')
    ) {
      this.addNewForm(event);
    } else if (event.mode === 'create' || event.mode === 'edit') {
      this.savePillarItem(event);
    }
    if (event.mode === 'delete') {
			console.log(event.mode);
      this.agentPillarsService.deletePillarItem(event.pillarId, event.item).subscribe({
        next: res => {
          console.log(`[AgentCommerceKeyPillars] Successfully deleted ${event.pillarId} item:`, res);
        },
        error: err => {
          console.error(`[AgentCommerceKeyPillars] Failed to delete ${event.pillarId} item:`, err);
        }});
    }
    this.onModalClose();
  }
  private addNewForm(event: CrudModalSubmitEvent): void {
    const collectionName = this.activeTab();
    const currentItem = this.selectedItem() || {};
    const updatePayload: Record<string, unknown> = { ...currentItem, ...(event.item || {}) };

    this.agentPillarsService.updatePillarItem(collectionName, updatePayload).subscribe({
      next: (updated) => {
        console.log(
          `[AgentCommerceKeyPillars] Successfully updated document '${updatePayload['id'] || ''}' in Firestore collection '${collectionName}':`,
          updated
        );
      },
      error: (err) => {
        console.error(
          `[AgentCommerceKeyPillars] Failed to update document '${updatePayload['id'] || ''}' in Firestore collection '${collectionName}':`,
          err
        );
      }
    });
  }
  private savePillarItem(event: CrudModalSubmitEvent): void {
    if (!event.pillarId || !event.item) return;

    const action$ = event.mode === 'create'
        ? this.agentPillarsService.addPillarItem(event.pillarId, event.item)
        : this.agentPillarsService.updatePillarItem(event.pillarId, event.item);
    const actionText = event.mode === 'create' ? 'saved' : 'updated';

    action$.subscribe({
      next: (res) => {
        console.log(
          `[AgentCommerceKeyPillars] Successfully ${actionText} ${event.pillarId} item in Firestore emulator:`,
          res
        );
      },
      error: (err) => {
        console.error(
          `[AgentCommerceKeyPillars] Failed to ${event.mode} ${event.pillarId} item in Firestore emulator:`,
          err
        );
      }
    });
  }
  public getPillarName(pillarId: PillarTab | null): string {
    if (!pillarId) return '';
    const match = this.tabs.find((t) => t.id === pillarId);
    return match ? match.name : '';
  }
  public getDocumentFields(item: unknown): { key: string; value: unknown }[] {
    if (!item || typeof item !== 'object') return [];
    const record = item as Record<string, unknown>;
    const headerKeys = new Set(['id', 'docId', 'name', 'status']);

    return Object.entries(record)
      .filter(([key, value]) => !headerKeys.has(key) && value !== null && value !== undefined && value !== '')
      .map(([key, value]) => ({ key, value }));
  }
  public getObjectEntries(item: Record<string, unknown>): { key: string; value: unknown }[] {
    if (!item || typeof item !== 'object') return [];
    return Object.entries(item).map(([key, value]) => ({ key, value }));
  }
  public isArray(val: unknown): boolean {
    return Array.isArray(val);
  }
  public formatKeyName(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
  public formatTitle(name: string): string {
    if (!name) return '';
    return name
      .replace(/[-_]/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((word) => (word.toUpperCase() === 'N' ? '&' : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(' ');
  }
  public onWindowScroll(): void {
    const scrollPosition =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.showBackToTop.set(scrollPosition > 150);
  }
  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (document.documentElement) {
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (document.body) {
      document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
