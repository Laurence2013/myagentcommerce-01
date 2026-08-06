import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommerceAgentsService } from '../../services/commerce-agents.service';

export interface ProtocolComplianceFeature {
  id: string;
  title: string;
  icon: string;
  protocols: string[];
  transports: string[];
  manifestStatus: string;
}

export interface SecurityGovernanceFeature {
  id: string;
  title: string;
  icon: string;
  verificationStatus: string;
  authMethods: string[];
  riskProfile: string;
}

export interface TaxonomyClassificationFeature {
  id: string;
  title: string;
  icon: string;
  marketSides: string[];
  functionalClasses: string[];
  categories: string[];
}

export interface MerchantCommercialsFeature {
  id: string;
  title: string;
  icon: string;
  platforms: string[];
  pricingModels: string[];
  aovRange: string;
}

@Component({
  selector: 'app-commerce-agents',
  templateUrl: './commerce-agents.component.html',
  styleUrl: './commerce-agents.component.sass',
  host: {
    'class': 'commerce-agents-host'
  }
})
export class CommerceAgentsComponent {
  private readonly commerceAgentsService = inject(CommerceAgentsService);

  readonly selectedCriteria = toSignal(this.commerceAgentsService.selectedCriteria$, { initialValue: 'ProtocolCapability' });

  // Converts RxJS stream directly into a Signal (Initial empty array fallback)
  readonly rawAgents = toSignal(this.commerceAgentsService.getCommerceAgents(), { initialValue: [] });

  onCardSelect(criteria: string): void {
    this.commerceAgentsService.selectCriteria(criteria);
  }

  // 1. Protocol & Capability Feature Card Object
  readonly protocolCard = computed<ProtocolComplianceFeature>(() => {
    const agents = this.rawAgents();
    const protocolsSet = new Set<string>();
    const transportsSet = new Set<string>();

    for (const agent of agents) {
      if (agent['parentEcosystem']) protocolsSet.add(String(agent['parentEcosystem']));
      const specs = agent['specifications'] as Record<string, unknown> | undefined;
      if (specs?.['crossProtocolCompat'] && Array.isArray(specs['crossProtocolCompat'])) {
        specs['crossProtocolCompat'].forEach((p) => protocolsSet.add(String(p)));
      }
      const env = agent['targetEnvironment'] as Record<string, unknown> | undefined;
      if (env?.['transportBinding']) transportsSet.add(String(env['transportBinding']));
    }

    return {
      id: 'ProtocolCapability',
      title: 'Protocol & Capability Readiness',
      icon: '⚡',
      protocols: Array.from(protocolsSet).length > 0 ? Array.from(protocolsSet) : ['Google UCP', 'OpenAI ACP', 'Anthropic MCP'],
      transports: Array.from(transportsSet).length > 0 ? Array.from(transportsSet) : ['REST', 'gRPC', 'MCP Stream'],
      manifestStatus: agents.length > 0 ? `${agents.length} Active Manifests Loaded` : 'Protocol Audit Ready'
    };
  });

  // 2. Security & Governance Feature Card Object
  readonly securityCard = computed<SecurityGovernanceFeature>(() => {
    const agents = this.rawAgents();
    const authSet = new Set<string>();
    let verifiedCount = 0;

    for (const agent of agents) {
      if (agent['verificationStatus'] === 'Verified_Compliant') verifiedCount++;
      const specs = agent['specifications'] as Record<string, unknown> | undefined;
      if (specs?.['authenticationType']) authSet.add(String(specs['authenticationType']));
    }

    return {
      id: 'SecurityGovernance',
      title: 'Security & Audit Governance',
      icon: '🛡',
      verificationStatus: agents.length > 0 ? `${verifiedCount}/${agents.length} Verified Compliant` : 'WCAG AA & AXE Audited',
      authMethods: Array.from(authSet).length > 0 ? Array.from(authSet) : ['OAuth2', 'AP2 Mandate', 'x402 Wallet'],
      riskProfile: 'Escrow & AP2 Protected'
    };
  });

  // 3. Multi-Layer Taxonomy Feature Card Object
  readonly taxonomyCard = computed<TaxonomyClassificationFeature>(() => {
    const agents = this.rawAgents();
    const marketSidesSet = new Set<string>();
    const functionalClassesSet = new Set<string>();
    const categoriesSet = new Set<string>();

    for (const agent of agents) {
      if (agent['marketSide']) marketSidesSet.add(String(agent['marketSide']).replace(/_/g, ' '));
      if (agent['functionalClass']) functionalClassesSet.add(String(agent['functionalClass']).replace(/_/g, ' '));
      if (agent['category']) categoriesSet.add(String(agent['category']));
    }

    return {
      id: 'TaxonomyClassification',
      title: 'Taxonomy & Classification',
      icon: '🏷',
      marketSides: Array.from(marketSidesSet).length > 0 ? Array.from(marketSidesSet) : ['Plumbing Stack', 'Seller Merchant', 'Buyer Consumer'],
      functionalClasses: Array.from(functionalClassesSet).length > 0 ? Array.from(functionalClassesSet) : ['Discovery Manifest', 'Discount Optimization'],
      categories: Array.from(categoriesSet).length > 0 ? Array.from(categoriesSet) : ['Promotional Clearing', 'Escrow Governance']
    };
  });

  // 4. Merchant & Commercial Specs Feature Card Object
  readonly merchantCard = computed<MerchantCommercialsFeature>(() => {
    const agents = this.rawAgents();
    const platformsSet = new Set<string>();
    const pricingSet = new Set<string>();

    for (const agent of agents) {
      const env = agent['targetEnvironment'] as Record<string, unknown> | undefined;
      if (env?.['platform']) platformsSet.add(String(env['platform']));
      if (agent['pricingModel']) pricingSet.add(String(agent['pricingModel']));
    }

    return {
      id: 'MerchantSpecs',
      title: 'Merchant & Commercial Specs',
      icon: '🛒',
      platforms: Array.from(platformsSet).length > 0 ? Array.from(platformsSet) : ['Shopify', 'WooCommerce', 'Magento', 'Edge Worker'],
      pricingModels: Array.from(pricingSet).length > 0 ? Array.from(pricingSet) : ['Freemium', 'Paid Subscription', 'Open Source'],
      aovRange: 'Micro-payments to Enterprise Scale'
    };
  });
}
