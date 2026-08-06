import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AgentFormComponent } from '../../agent-form.component';
import {
  MarketSide,
  ParentEcosystem,
  FunctionalClass
} from '../../../../interfaces/forms/agent-submission.interface';

@Component({
  selector: 'app-taxonomy-step',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './taxonomy-step.component.html',
  styleUrl: './taxonomy-step.component.sass',
  host: {
    'class': 'step-host'
  }
})
export class TaxonomyStepComponent {
  private readonly parent = inject(AgentFormComponent);

  get formGroup(): FormGroup {
    return this.parent.form;
  }

  getControl(name: string): FormControl {
    return this.parent.form.get(name) as FormControl;
  }

  readonly marketSideOptions: { value: MarketSide; label: string; desc: string }[] = [
    { value: 'plumbing_stack', label: 'Plumbing Stack', desc: 'Protocol primitives, rails & middleware' },
    { value: 'seller_merchant', label: 'Seller / Merchant', desc: 'Storefront apps, catalog engines, AEO' },
    { value: 'buyer_consumer', label: 'Buyer / Consumer', desc: 'Wallet agents, discount stackers, deal hunters' },
    { value: 'backend_infrastructure', label: 'Backend Infrastructure', desc: 'Clearinghouses, OMS, tax, returns, escrow' }
  ];

  readonly parentEcosystemOptions: ParentEcosystem[] = [
    'Google_UCP',
    'OpenAI_ACP',
    'Anthropic_MCP',
    'Stripe_AP2',
    'Cloudflare_x402',
    'Cross_Protocol',
    'Custom_API'
  ];

  readonly functionalClassOptions: FunctionalClass[] = [
    'Discovery_Manifest',
    'Catalog_Sync',
    'Checkout_Session',
    'Discount_Optimization',
    'Escrow_Governance',
    'Payment_Mandate',
    'Micropayment_Wallet',
    'Tax_Compliance',
    'Logistics_Returns',
    'Identity_Mandate'
  ];
}
