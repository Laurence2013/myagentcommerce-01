import { Component, inject, input, output, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
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
  selector: 'app-agent-form',
  imports: [
    ReactiveFormsModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './agent-form.component.html',
  styleUrl: './agent-form.component.sass',
  host: {
    'class': 'agent-form-host'
  }
})
export class AgentFormComponent {
  private readonly fb = inject(FormBuilder);

  // Inputs & Outputs
  readonly initialData = input<Partial<AgentSubmission> | null>(null);
  readonly formSubmit = output<AgentSubmission>();
  readonly formCancel = output<void>();

  readonly isSubmitting = signal<boolean>(false);
  readonly submissionSuccess = signal<boolean>(false);

  // Central Root Reactive FormGroup
  readonly form: FormGroup = this.fb.group({
    // Step 1: Core Identity
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    tagline: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    logoUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
    websiteUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/i)]],
    docsUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
    manifestUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],
    repositoryUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],

    // Step 2: Multi-Layer Taxonomy
    marketSide: ['plumbing_stack' as MarketSide, [Validators.required]],
    category: ['', [Validators.required]],
    parentEcosystem: ['Google_UCP' as ParentEcosystem, [Validators.required]],
    functionalClass: ['Discovery_Manifest' as FunctionalClass, [Validators.required]],

    // Step 3: Environment & Specs
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

    // Step 4: Merchant Profile
    targetMerchantProfile: this.fb.group({
      targetScale: [['SMB', 'Mid_Market'] as TargetMerchantScale[], [Validators.required]],
      aovRange: ['Medium' as TargetMerchantProfile['aovRange']],
      riskProfile: ['Standard' as TargetMerchantProfile['riskProfile']]
    }),

    // Step 5: Commercials & Claiming
    developerType: ['Startup' as DeveloperType, [Validators.required]],
    pricingModel: ['Freemium' as AgentSubmission['pricingModel'], [Validators.required]],
    pricingDetails: [''],
    verificationStatus: ['Pending_Audit' as AgentSubmission['verificationStatus'], [Validators.required]],
    claimedByOwner: [false],
    claimedByEmail: ['', [Validators.email]],
    githubBadgeUrl: ['', [Validators.pattern(/^https?:\/\/.+/i)]],

    // Step 6: Admin Audit
    status: ['pending' as AgentSubmission['status'], [Validators.required]],
    contactEmail: ['', [Validators.required, Validators.email]],
    submitterRole: ['Developer' as NonNullable<AgentSubmission['submitterRole']>]
  });

  readonly isFormValid = computed(() => this.form.valid);

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const submissionPayload: AgentSubmission = {
      ...this.form.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.formSubmit.emit(submissionPayload);
    this.isSubmitting.set(false);
    this.submissionSuccess.set(true);
    setTimeout(() => this.submissionSuccess.set(false), 5000);
  }

  onReset(): void {
    this.form.reset();
    this.formCancel.emit();
  }
}
