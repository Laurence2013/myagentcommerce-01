export type EvaluationImportance = 'Critical' | 'High' | 'Medium';

export interface EvaluationCheckOption {
  value: number;                  // Score weight (e.g., 0 = Non-Compliant, 5 = Partial, 10 = Fully Compliant)
  label: string;                  // Option label for UI radio/checkbox
  technicalIndicator: string;     // Technical state associated with this score
}

export interface MerchantEvaluationCriterion {
  id: string;                     // Unique doc ID (e.g., "eval_protocol_01")
  pillarId: string;               // Pillar classification
  pillarName: string;             // Category display name
  title: string;                  // Checklist item title
  question: string;               // Evaluation question presented to merchant/auditor
  importance: EvaluationImportance;
  weight: number;                 // Percentage contribution to overall 100-point audit score
  
  // Technical Auditing Details
  technicalRequirements: string[];// Specific technical capabilities required to pass
  riskIfMissing: string;          // Business / financial risk if absent
  remediationAction: string;      // Recommended solution / developer action
  
  // Scoring Options
  scoring: EvaluationCheckOption[];

  // Directory Tags & Mapping
  relevantProtocols: Array<'UCP' | 'ACP' | 'MCP' | 'AP2' | 'x402' | 'TAP'>;
  targetCategories: string[];     // Matching tool categories on myagentcommerce.com
  
  // Admin & Ordering
  displayOrder: number;
  active: boolean;
  updatedAt: string;
}
