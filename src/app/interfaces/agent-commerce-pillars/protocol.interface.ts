export interface ProtocolItem {
  id: string;
  name: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DEPRECATED' | string;
  layers: string[];
  primaryFunctions: string[];
  keyBackers: string[];
  transports: string[];
  governance: string[];
  evaluationContext: string;
}
