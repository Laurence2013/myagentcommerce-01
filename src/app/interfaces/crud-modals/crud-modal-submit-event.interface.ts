import { PillarTab } from '../../components/agent-commerce-key-pillars/agent-commerce-key-pillars.component';

export type CrudModalMode = 'create' | 'edit' | 'delete' | 'add';

export interface CrudModalSubmitEvent {
  mode: CrudModalMode;
  pillarId: PillarTab;
  item: Record<string, unknown>;
}
