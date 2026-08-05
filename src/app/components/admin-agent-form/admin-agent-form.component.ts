import { Component, inject, input, output, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormArray, FormGroup } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import {
  AgentSubmission,
  MarketSide,
  ParentEcosystem,
  FunctionalClass,
  DeveloperType,
  AuthenticationType,
  TransportBinding,
  TargetMerchantScale,
  TargetEnvironment,
  TechnicalSpecifications,
  TargetMerchantProfile
} from '../../interface/agent-submission.interface';

@Component({
  selector: 'app-admin-agent-form',
  imports: [ReactiveFormsModule, UpperCasePipe],
  templateUrl: './admin-agent-form.component.html',
  styleUrl: './admin-agent-form.component.sass',
  host: {
    'class': 'admin-agent-form-host'
  }
})
export class AdminAgentFormComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs and Outputs using signal APIs
  readonly initialData = input<Partial<AgentSubmission> | null>(null);
  readonly formSubmit = output<AgentSubmission>();
  readonly formCancel = output<void>();

  // Active section tab signal
  readonly activeTab = signal<'identity' | 'taxonomy' | 'environment' | 'merchant' | 'commercials' | 'admin' | 'preview'>('identity');
  readonly newCapability = signal<string>('');
  readonly isSubmitting = signal<boolean>(false);
  readonly submissionSuccess = signal<boolean>(false);

  // Enum Options for Selects & Badges
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

  readonly platformOptions: TargetEnvironment['platform'][] = [
    'Shopify',
    'WooCommerce',
    'Magento',
    'Wix',
    'BigCommerce',
    'Custom_Node',
    'Edge_Worker',
    'Cross_Platform'
  ];

  readonly transportBindingOptions: TransportBinding[] = [
    'REST',
    'gRPC',
    'JSON-RPC',
    'MCP',
    'GraphQL',
    'ePOS_Webhook'
  ];

  readonly languageOptions: NonNullable<TargetEnvironment['language']>[] = [
    'TypeScript',
    'Python',
    'Java',
    'PHP',
    'Go',
    'Rust',
    'Other'
  ];

  readonly authenticationOptions: AuthenticationType[] = [
    'OAuth2',
    'API_Key',
    'Web_Bot_Auth',
    'AP2_Mandate',
    'x402_Wallet',
    'None'
  ];

  readonly crossProtocolOptions: TechnicalSpecifications['crossProtocolCompat'][number][] = [
    'UCP',
    'ACP',
    'MCP',
    'AP2',
    'x402',
    'A2A'
  ];

  readonly scaleOptions: TargetMerchantScale[] = [
    'SMB',
    'Mid_Market',
    'Enterprise',
    'Marketplace_P2P'
  ];

  readonly aovOptions: NonNullable<TargetMerchantProfile['aovRange']>[] = [
    'Micro',
    'Low',
    'Medium',
    'High_Ticket'
  ];

  readonly riskProfileOptions: NonNullable<TargetMerchantProfile['riskProfile']>[] = [
    'Standard',
    'High_Risk',
    'Escrow_Required'
  ];

  readonly developerTypeOptions: DeveloperType[] = [
    'Solo_Developer',
    'Indie_Hacker',
    'Startup',
    'Enterprise'
  ];

  readonly pricingModelOptions: AgentSubmission['pricingModel'][] = [
    'Open Source',
    'Free',
    'Freemium',
    'Paid',
    'Commission',
    'Enterprise Subscription'
  ];

  readonly verificationStatusOptions: AgentSubmission['verificationStatus'][] = [
    'Unverified',
    'Pending_Audit',
    'Verified_Compliant'
  ];

  readonly statusOptions: AgentSubmission['status'][] = [
    'pending',
    'approved',
    'rejected'
  ];

  readonly submitterRoleOptions: NonNullable<AgentSubmission['submitterRole']>[] = [
    'Developer',
    'Merchant',
    'Agency',
    'Community_Member'
  ];

  // Capabilities FormArray getter
  get capabilitiesArray(): FormArray {
    return this.form.get('specifications.supportedCapabilities') as FormArray;
  }

  // Reactive Form Initialization
  readonly form: FormGroup = this.fb.group({
    // 1. Core Identity & Basic Info
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    tagline: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    logoUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
    websiteUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    docsUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
    manifestUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
    repositoryUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],

    // 2. Multi-Layer Taxonomy
    marketSide: ['plumbing_stack' as MarketSide, [Validators.required]],
    category: ['', [Validators.required]],
    parentEcosystem: ['Google_UCP' as ParentEcosystem, [Validators.required]],
    functionalClass: ['Discovery_Manifest' as FunctionalClass, [Validators.required]],

    // 3. Environment & Specs
    targetEnvironment: this.fb.group({
      platform: ['Cross_Platform' as TargetEnvironment['platform'], [Validators.required]],
      transportBinding: ['REST' as TransportBinding, [Validators.required]],
      language: ['TypeScript' as TargetEnvironment['language']]
    }),
    specifications: this.fb.group({
      protocolVersion: ['2026-08-01'],
      supportedCapabilities: this.fb.array([
        this.fb.control('dev.uip.shopping.promotions'),
        this.fb.control('cart_checkout')
      ]),
      authenticationType: ['OAuth2' as AuthenticationType, [Validators.required]],
      crossProtocolCompat: [['UCP', 'ACP'] as TechnicalSpecifications['crossProtocolCompat']]
    }),

    // 4. Merchant Profile
    targetMerchantProfile: this.fb.group({
      targetScale: [['SMB', 'Mid_Market'] as TargetMerchantScale[], [Validators.required]],
      aovRange: ['Medium' as TargetMerchantProfile['aovRange']],
      riskProfile: ['Standard' as TargetMerchantProfile['riskProfile']]
    }),

    // 5. Commercials & Developer
    developerType: ['Startup' as DeveloperType, [Validators.required]],
    pricingModel: ['Freemium' as AgentSubmission['pricingModel'], [Validators.required]],
    pricingDetails: [''],

    // 6. Verification & Claiming
    verificationStatus: ['Pending_Audit' as AgentSubmission['verificationStatus'], [Validators.required]],
    claimedByOwner: [false],
    claimedByEmail: ['', [Validators.email]],
    githubBadgeUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],

    // 7. Admin & Audit
    status: ['pending' as AgentSubmission['status'], [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]],
    submitterRole: ['Developer' as NonNullable<AgentSubmission['submitterRole']>]
  });

  // Computed live JSON preview of current form value
  readonly formPreview = computed(() => {
    const rawValue = this.form.value;
    return JSON.stringify(rawValue, null, 2);
  });

  readonly isFormValid = computed(() => this.form.valid);

  setTab(tab: 'identity' | 'taxonomy' | 'environment' | 'merchant' | 'commercials' | 'admin' | 'preview'): void {
    this.activeTab.set(tab);
  }

  addCapability(): void {
    const val = this.newCapability().trim();
    if (val) {
      this.capabilitiesArray.push(this.fb.control(val));
      this.newCapability.set('');
    }
  }

  removeCapability(index: number): void {
    this.capabilitiesArray.removeAt(index);
  }

  toggleCrossProtocol(item: TechnicalSpecifications['crossProtocolCompat'][number]): void {
    const group = this.form.get('specifications.crossProtocolCompat');
    if (!group) return;
    const current: TechnicalSpecifications['crossProtocolCompat'] = group.value || [];
    if (current.includes(item)) {
      group.setValue(current.filter(i => i !== item));
    } else {
      group.setValue([...current, item]);
    }
  }

  isCrossProtocolSelected(item: TechnicalSpecifications['crossProtocolCompat'][number]): boolean {
    const current: TechnicalSpecifications['crossProtocolCompat'] = this.form.get('specifications.crossProtocolCompat')?.value || [];
    return current.includes(item);
  }

  toggleScale(item: TargetMerchantScale): void {
    const group = this.form.get('targetMerchantProfile.targetScale');
    if (!group) return;
    const current: TargetMerchantScale[] = group.value || [];
    if (current.includes(item)) {
      group.setValue(current.filter(i => i !== item));
    } else {
      group.setValue([...current, item]);
    }
  }

  isScaleSelected(item: TargetMerchantScale): boolean {
    const current: TargetMerchantScale[] = this.form.get('targetMerchantProfile.targetScale')?.value || [];
    return current.includes(item);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formVal = this.form.value;

    const submission: AgentSubmission = {
      ...formVal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Emit result
    this.formSubmit.emit(submission);
    this.isSubmitting.set(false);
    this.submissionSuccess.set(true);
    setTimeout(() => this.submissionSuccess.set(false), 5000);
  }

  onReset(): void {
    this.form.reset();
    this.formCancel.emit();
  }
}
