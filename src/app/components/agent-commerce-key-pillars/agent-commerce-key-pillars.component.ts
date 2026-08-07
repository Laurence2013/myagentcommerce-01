import { Component, inject, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgentPillarsService } from '../../services/agent-pillars/agent-pillars.service';
import {
  ProtocolItem,
  SecurityItem,
  InventoryAndShippingItem,
  PromotionItem,
  FraudDetectionItem,
  ReturnItem
} from '../../interfaces/agent-commerce-pillars';

export type PillarTab =
  | 'protocols'
  | 'securities'
  | 'inventoryShipping'
  | 'promotions'
  | 'fraudIdentity'
  | 'returns';

export interface TabDefinition {
  id: PillarTab;
  name: string;
}

@Component({
  selector: 'app-agent-commerce-key-pillars',
  templateUrl: './agent-commerce-key-pillars.component.html',
  styleUrl: './agent-commerce-key-pillars.component.sass',
  host: {
    'class': 'agent-commerce-key-pillars-host'
  }
})
export class AgentCommerceKeyPillars {
  protected readonly agentPillarsService = inject(AgentPillarsService);

  public readonly activeTab = signal<PillarTab>('protocols');

  public readonly tabs: TabDefinition[] = [
    { id: 'protocols', name: 'Protocols' },
    { id: 'securities', name: 'Securities' },
    { id: 'inventoryShipping', name: 'Inventory & Shipping' },
    { id: 'promotions', name: 'Promotions' },
    { id: 'fraudIdentity', name: 'Fraud & Identity' },
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
}
