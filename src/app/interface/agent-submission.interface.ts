export type MarketSide = 
  | 'plumbing_stack'           // Protocol primitives, rails & middleware
  | 'seller_merchant'          // Storefront apps, catalog engines, AEO
  | 'buyer_consumer'           // Wallet agents, discount stackers, deal hunters
  | 'backend_infrastructure';  // Clearinghouses, OMS, tax, returns, escrow

export type ParentEcosystem = 
  | 'Google_UCP' 
  | 'OpenAI_ACP' 
  | 'Anthropic_MCP' 
  | 'Stripe_AP2' 
  | 'Cloudflare_x402' 
  | 'Cross_Protocol' 
  | 'Custom_API';

export type FunctionalClass = 
  | 'Discovery_Manifest' 
  | 'Catalog_Sync' 
  | 'Checkout_Session' 
  | 'Discount_Optimization' 
  | 'Escrow_Governance' 
  | 'Payment_Mandate' 
  | 'Micropayment_Wallet' 
  | 'Tax_Compliance' 
  | 'Logistics_Returns' 
  | 'Identity_Mandate';

export type DeveloperType = 'Solo_Developer' | 'Indie_Hacker' | 'Startup' | 'Enterprise';

export type AuthenticationType = 'OAuth2' | 'API_Key' | 'Web_Bot_Auth' | 'AP2_Mandate' | 'x402_Wallet' | 'None';

export type TransportBinding = 'REST' | 'gRPC' | 'JSON-RPC' | 'MCP' | 'GraphQL' | 'ePOS_Webhook';

export type TargetMerchantScale = 'SMB' | 'Mid_Market' | 'Enterprise' | 'Marketplace_P2P';

export interface TargetEnvironment {
  platform: 'Shopify' | 'WooCommerce' | 'Magento' | 'Wix' | 'BigCommerce' | 'Custom_Node' | 'Edge_Worker' | 'Cross_Platform';
  transportBinding: TransportBinding;
  language?: 'TypeScript' | 'Python' | 'Java' | 'PHP' | 'Go' | 'Rust' | 'Other';
}

export interface TechnicalSpecifications {
  protocolVersion?: string;             // e.g., "2026-08-01"
  supportedCapabilities: string[];      // e.g., ["dev.uip.shopping.promotions", "cart_checkout"]
  authenticationType: AuthenticationType;
  crossProtocolCompat: Array<'UCP' | 'ACP' | 'MCP' | 'AP2' | 'x402' | 'A2A'>;
}

export interface TargetMerchantProfile {
  targetScale: TargetMerchantScale[];   // Target audience scale
  aovRange?: 'Micro' | 'Low' | 'Medium' | 'High_Ticket'; // e.g., Sub-cent, $20-$200, $200+
  riskProfile?: 'Standard' | 'High_Risk' | 'Escrow_Required';
}

export interface AgentSubmission {
  // 1. Core Identity & Basic Info
  name: string;                         // e.g., "UCPhub.ai", "Talon.One"
  tagline: string;                      // Short description (max 120 chars)
  description: string;                  // Detailed explanation of functionality
  logoUrl?: string;                     // Direct URL to app logo or icon
  websiteUrl: string;                   // Primary website/product URL
  docsUrl?: string;                     // Developer documentation or GitHub repo
  manifestUrl?: string;                 // Direct link to /.well-known/ucp.json or /.well-known/acp.json
  repositoryUrl?: string;               // Public GitHub/GitLab repo for open-source tools

  // 2. Multi-Layer Taxonomy & Classification
  marketSide: MarketSide; 
  category: string;                     // Sub-category (e.g., "Promotional Clearing", "Escrow & Governance")
  parentEcosystem: ParentEcosystem;     // Core protocol family (UCP, ACP, MCP, AP2, etc.)
  functionalClass: FunctionalClass;     // Functional role (Discovery, Discount, Escrow, etc.)

  // 3. Environment & Technical Specifications
  targetEnvironment: TargetEnvironment;
  specifications: TechnicalSpecifications;

  // 4. Merchant & Audience Targeting
  targetMerchantProfile: TargetMerchantProfile;

  // 5. Commercials & Developer Profile
  developerType: DeveloperType;
  pricingModel: 'Open Source' | 'Free' | 'Freemium' | 'Paid' | 'Commission' | 'Enterprise Subscription';
  pricingDetails?: string;              // e.g., "$39.99/mo after 10 free orders"

  // 6. Verification & Profile Claiming
  verificationStatus: 'Unverified' | 'Pending_Audit' | 'Verified_Compliant';
  claimedByOwner: boolean;              // True if claimed via "Claim Profile" flow
  claimedByEmail?: string;              // Owner account email after claim verification
  githubBadgeUrl?: string;              // URL of embedded README badge

  // 7. Submission Metadata & Admin Audit Trail
  status: 'pending' | 'approved' | 'rejected'; // For manual approval in admin panel
  contactEmail: string;                 // Email of the submitter
  submitterRole?: 'Developer' | 'Merchant' | 'Agency' | 'Community_Member';
  createdAt: unknown;                   // Firestore serverTimestamp()
  updatedAt?: unknown;                  // Timestamp of last modification
}
