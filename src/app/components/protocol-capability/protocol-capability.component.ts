import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommerceAgentsService } from '../../services/commerce-agents.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-protocol-capability',
  templateUrl: './protocol-capability.component.html',
  styleUrl: './protocol-capability.component.sass',
  host: {
    'class': 'protocol-capability-host'
  }
})
export class ProtocolCapabilityComponent {
  private readonly commerceAgentsService = inject(CommerceAgentsService);

  readonly selectedCriteria = toSignal(this.commerceAgentsService.selectedCriteria$, { initialValue: 'ProtocolCapability' });

  // Listens reactively to selectedCriteria$ stream and calls get_a_document()
  readonly agentDocuments = toSignal(
    this.commerceAgentsService.selectedCriteria$.pipe(
      switchMap((criteria) => this.commerceAgentsService.get_a_document(criteria))
    ),
    { initialValue: [] }
  );

  readonly criteriaTitle = computed(() => {
    switch (this.selectedCriteria()) {
      case 'ProtocolCapability':
        return 'Protocol & Capability Agents (UCP / ACP / MCP / AP2)';
      case 'SecurityGovernance':
        return 'Security & Governance Compliant Tools';
      case 'TaxonomyClassification':
        return 'Taxonomy Classified Tools';
      case 'MerchantSpecs':
        return 'Merchant Platform & Commercial Specs Tools';
      default:
        return 'Agentic Commerce Payload Response';
    }
  });

  getSpecs(agent: Record<string, unknown>): Record<string, unknown> | undefined {
    return agent['specifications'] as Record<string, unknown> | undefined;
  }

  getEnv(agent: Record<string, unknown>): Record<string, unknown> | undefined {
    return agent['targetEnvironment'] as Record<string, unknown> | undefined;
  }
}
