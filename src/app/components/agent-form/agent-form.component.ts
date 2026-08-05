import { Component, inject, input, output, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { AgentFormService } from '../../services/agent-form.service';
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
  private readonly agentFormService = inject(AgentFormService);

  // Inputs & Outputs
  readonly initialData = input<Partial<AgentSubmission> | null>(null);
  readonly formSubmit = output<AgentSubmission>();
  readonly formCancel = output<void>();

  // Convert RxJS service streams to signals in component UI
  readonly isSubmitting = toSignal(this.agentFormService.isSubmitting$, { initialValue: false });
  readonly submissionSuccess = toSignal(this.agentFormService.submissionSuccess$, { initialValue: false });

  // Central Root Reactive FormGroup
  readonly form: FormGroup = this.fb.group({
    // Step 1: Core Identity
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    tagline: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    logoUrl: [''],
    websiteUrl: ['', [Validators.required]],
    docsUrl: [''],
    manifestUrl: [''],
    repositoryUrl: [''],

    // Step 2: Multi-Layer Taxonomy
    marketSide: ['plumbing_stack' as MarketSide, [Validators.required]],
    category: ['Promotional Clearing', [Validators.required]],
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
    claimedByEmail: [''],
    githubBadgeUrl: [''],

    // Step 6: Admin Audit
    status: ['pending' as AgentSubmission['status'], [Validators.required]],
    contactEmail: ['admin@agenticcommerce.ai', [Validators.required, Validators.email]],
    submitterRole: ['Developer' as NonNullable<AgentSubmission['submitterRole']>]
  });

  // Convert Reactive Form status & value streams to Signals for real-time template tracking
  readonly formStatus = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  readonly formValue = toSignal(this.form.valueChanges, { initialValue: this.form.value });

  // Real-time computed signal tracking form validity
  readonly isFormValid = computed(() => {
    this.formStatus();
    return this.form.valid;
  });

  // Step 1 Validity
  readonly isIdentityValid = computed(() => {
    this.formValue();
    return (
      this.form.get('name')?.valid &&
      this.form.get('tagline')?.valid &&
      this.form.get('description')?.valid &&
      this.form.get('websiteUrl')?.valid
    );
  });

  // Step 2 Validity
  readonly isTaxonomyValid = computed(() => {
    this.formValue();
    return (
      this.form.get('marketSide')?.valid &&
      this.form.get('category')?.valid &&
      this.form.get('parentEcosystem')?.valid &&
      this.form.get('functionalClass')?.valid
    );
  });

  // Step 3 Validity
  readonly isSpecsValid = computed(() => {
    this.formValue();
    return (
      this.form.get('targetEnvironment')?.valid &&
      this.form.get('specifications')?.valid
    );
  });

  // Step 4 Validity
  readonly isMerchantValid = computed(() => {
    this.formValue();
    return this.form.get('targetMerchantProfile')?.valid;
  });

  // Step 5 Validity
  readonly isCommercialsValid = computed(() => {
    this.formValue();
    return (
      this.form.get('developerType')?.valid &&
      this.form.get('pricingModel')?.valid &&
      this.form.get('verificationStatus')?.valid
    );
  });

  // Step 6 Validity
  readonly isAuditValid = computed(() => {
    this.formValue();
    return (
      this.form.get('status')?.valid &&
      this.form.get('contactEmail')?.valid
    );
  });

  // Count of completed steps (out of 6)
  readonly completedStepsCount = computed(() => {
    let count = 0;
    if (this.isIdentityValid()) count++;
    if (this.isTaxonomyValid()) count++;
    if (this.isSpecsValid()) count++;
    if (this.isMerchantValid()) count++;
    if (this.isCommercialsValid()) count++;
    if (this.isAuditValid()) count++;
    return count;
  });

  readonly progressPercentage = computed(() => {
    return Math.round((this.completedStepsCount() / 6) * 100);
  });

  // Human-friendly missing field labels per step
  readonly missingFieldsSummary = computed(() => {
    this.formValue();
    this.formStatus();

    const stepIssues: { step: string; fields: string[] }[] = [];

    // Step 1
    const s1: string[] = [];
    if (this.form.get('name')?.invalid) s1.push('Agent Name');
    if (this.form.get('tagline')?.invalid) s1.push('Tagline');
    if (this.form.get('description')?.invalid) s1.push('Description');
    if (this.form.get('websiteUrl')?.invalid) s1.push('Website URL');
    if (s1.length) stepIssues.push({ step: 'Step 1 (Identity)', fields: s1 });

    // Step 2
    const s2: string[] = [];
    if (this.form.get('marketSide')?.invalid) s2.push('Market Side');
    if (this.form.get('category')?.invalid) s2.push('Category');
    if (s2.length) stepIssues.push({ step: 'Step 2 (Taxonomy)', fields: s2 });

    // Step 6
    const s6: string[] = [];
    if (this.form.get('contactEmail')?.invalid) s6.push('Contact Email');
    if (s6.length) stepIssues.push({ step: 'Step 6 (Audit)', fields: s6 });

    return stepIssues;
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const submissionPayload: AgentSubmission = {
      ...this.form.value,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.agentFormService.submitAgent(submissionPayload).subscribe({
      next: (result) => {
        this.formSubmit.emit(result);
      }
    });
  }

  onReset(): void {
    this.form.reset();
    this.agentFormService.resetState();
    this.formCancel.emit();
  }
}
