export type PillarCategory = 'LIFESTYLE' | 'FITNESS' | 'MEDICAL' | 'AI_TOOLS';

export interface ArticleSection {
  id: string;
  heading: string;
  content: string;
  calloutBox?: {
    type: 'clinical_note' | 'protocol_step' | 'evidence_summary' | 'warning';
    title: string;
    text: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  pillar: PillarCategory;
  categoryTag: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  reviewer?: {
    name: string;
    title: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  featured?: boolean;
  trending?: boolean;
  executiveSummary: string;
  keyTakeaways: string[];
  embeddedAiTool: {
    toolId: string;
    toolName: string;
    toolDescription: string;
    demoType: 'jargon_simplifier' | 'symptom_contextualizer' | 'lifestyle_habit_planner' | 'workout_mobility_coach';
    inputPlaceholder: string;
    contextHint: string;
    presetQueries: string[];
  };
  sections: ArticleSection[];
  tags: string[];
  relatedArticleIds: string[];
}

export interface CategoryNode {
  id: string;
  title: string;
  pillar: PillarCategory;
  description: string;
  iconName: string;
  subTopics: string[];
  aiToolsAssociated: string[];
  recommendedContentType: string[];
  targetAudience: string;
  monetizationHook?: string;
}

export interface SiteNode {
  id: string;
  title: string;
  path: string;
  description: string;
  type: 'page' | 'hub' | 'tool' | 'portal' | 'article';
  children?: SiteNode[];
  pillar?: PillarCategory;
  status: 'core_v1' | 'v2_expansion' | 'premium_feature';
}

export interface UserPersona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  goals: string[];
  painPoints: string[];
  primaryPillars: PillarCategory[];
  userJourney: {
    stage: string;
    action: string;
    raphaAtlasTouchpoint: string;
    outcome: string;
  }[];
}

export interface TechStackLayer {
  layer: string;
  technology: string;
  purpose: string;
  integrationStrategy: string;
}

export interface AiToolSpec {
  id: string;
  name: string;
  description: string;
  pillar: PillarCategory;
  inputParams: string[];
  outputFormat: string;
  medicalSafetyLevel: 'Informational' | 'Triage' | 'Routine' | 'Educational';
  demoType: 'jargon_simplifier' | 'symptom_contextualizer' | 'lifestyle_habit_planner' | 'workout_mobility_coach';
}

export interface CategorizedContentResult {
  suggestedTitle: string;
  primaryCategory: string;
  subCategory: string;
  targetPersona: string;
  seoKeywords: string[];
  executiveSummary: string;
  recommendedFormat: string;
  internalLinkingOpportunities: string[];
  contentQualityScore: number;
  actionableTakeaways: string[];
}
