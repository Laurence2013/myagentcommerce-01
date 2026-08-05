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

  // Convert RxJS service streams to signals in component UI (AGENTS.md Best Practice)
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
    this.formStatus(); // Establishes signal dependency on status changes
    return this.form.valid;
  });

  // Real-time computed signal returning list of missing/invalid field names on every keystroke
  readonly invalidFieldNames = computed(() => {
    this.formValue(); // Establishes signal dependency on every single keystroke
    this.formStatus();

    const invalid: string[] = [];
    Object.keys(this.form.controls).forEach(key => {
      const ctrl = this.form.get(key);
      if (ctrl && ctrl.invalid) {
        invalid.push(key);
      }
    });
    return invalid;
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

    // Trigger RxJS service stream targeting 'commerce-agents' collection
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
