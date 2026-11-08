export type Role = 'OWNER' | 'MEMBER' | 'VIEWER';

export type BuilderMode = 'build' | 'plan' | 'debug';

export type AppPlan = 'DRAFT' | 'MINIMAL' | 'STANDAR' | 'OPTIMAL';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'FREE' | 'STARTER' | 'PRO' | 'AGENCY';
  ownerId: string;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  color?: string; // blue, yellow, red, green, etc.
}

export interface ColumnDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'badge' | 'date' | 'email' | 'phone' | 'currency' | 'status';
  options?: string[]; // for badge/status options e.g. ["Baru", "Dihubungi", "Closing", "Gagal"]
  badgeColors?: Record<string, string>; // e.g. { "Baru": "blue", "Closing": "green" }
  required?: boolean;
}

export interface TableDefinition {
  id: string;
  name: string;
  description?: string;
  columns: ColumnDefinition[];
  records: Record<string, any>[];
  primaryKey?: string;
}

export interface KanbanStage {
  id: string;
  name: string;
  color: string;
}

export interface KanbanConfig {
  enabled: boolean;
  tableId: string;
  statusColumnKey: string;
  titleColumnKey: string;
  subtitleColumnKey?: string;
  valueColumnKey?: string;
  stages: KanbanStage[];
}

export interface AppPage {
  id: string;
  name: string;
  icon?: string;
  type: 'dashboard' | 'table' | 'kanban' | 'form' | 'custom';
  tableId?: string;
  description?: string;
}

export interface AppVersion {
  versionNumber: number;
  changelog: string;
  promptUsed: string;
  createdAt: string;
  mode: BuilderMode;
  metrics: MetricCard[];
  pages: AppPage[];
  tables: TableDefinition[];
  kanban?: KanbanConfig;
  quickActionLabel?: string;
  quickActionTargetTable?: string;
  primaryColor?: string; // hex or tailwind class
  accentColor?: string;
  appName: string;
  tagline: string;
}

export interface LegoApp {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'crm' | 'portal' | 'booking' | 'custom';
  currentVersion: number;
  versions: AppVersion[];
  isPublished: boolean;
  publishedSlug: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  organizationId: string;
  createdById: string;
  plan?: AppPlan;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  mode?: BuilderMode;
  versionCreated?: number;
  creditsCost?: {
    ai: number;
    cloud: number;
  };
  stepsCompleted?: string[];
  suggestedPrompts?: string[];
}

export interface CreditWallet {
  aiCredits: number;
  aiMaxCredits: number;
  cloudCredits: number;
  cloudMaxCredits: number;
  aiUsedThisMonth: number;
  cloudUsedThisMonth: number;
  plan: 'FREE' | 'STARTER' | 'PRO' | 'AGENCY';
  renewalDate: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  type: 'build' | 'publish' | 'credit' | 'team' | 'rollback' | 'data';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'invited';
  joinedAt: string;
}
