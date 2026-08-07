import { Component, inject, Signal } from '@angular/core';
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
}
