// Workflow configuration exports
import newApplicationWorkflow from './new-application.json';
import refactorApplicationWorkflow from './refactor-application.json';
import reverseEngineerApplicationWorkflow from './reverse-engineer-application.json';

export type FlowType = 'new' | 'refactor' | 'reverse-engineer';

export interface SubpageConfig {
  id: string;
  name: string;
  index: number;
  route: string;
  isStartPage?: boolean;
  tab?: string;
}

export interface NavigationTarget {
  stepId: string;
  subpageId: string;
  route: string;
}

export interface StepNavigation {
  previous: NavigationTarget | null;
  next: NavigationTarget | null;
}

export interface StepConfig {
  id: string;
  name: string;
  description: string;
  index: number;
  route: string;
  startRoute?: string;
  component: string;
  startComponent?: string;
  subpages: SubpageConfig[];
  navigation: StepNavigation;
}

export interface WorkflowMetadata {
  version: string;
  totalSteps: number;
  estimatedDuration: string;
  notes?: string;
}

export interface WorkflowConfig {
  id: FlowType;
  name: string;
  description: string;
  steps: StepConfig[];
  metadata: WorkflowMetadata;
}

// Type-cast the imported JSON
export const workflows: Record<FlowType, WorkflowConfig> = {
  'new': newApplicationWorkflow as WorkflowConfig,
  'refactor': refactorApplicationWorkflow as WorkflowConfig,
  'reverse-engineer': reverseEngineerApplicationWorkflow as WorkflowConfig,
};

// Helper functions
export function getWorkflow(flowType: FlowType): WorkflowConfig {
  return workflows[flowType];
}

export function getStepByIndex(flowType: FlowType, index: number): StepConfig | undefined {
  return workflows[flowType].steps[index];
}

export function getStepById(flowType: FlowType, stepId: string): StepConfig | undefined {
  return workflows[flowType].steps.find(step => step.id === stepId);
}

export function getSubpage(flowType: FlowType, stepId: string, subpageId: string): SubpageConfig | undefined {
  const step = getStepById(flowType, stepId);
  return step?.subpages.find(sp => sp.id === subpageId);
}

export function getNextNavigation(flowType: FlowType, stepIndex: number, subpageIndex: number): { route: string; isNextStep: boolean } | null {
  const step = getStepByIndex(flowType, stepIndex);
  if (!step) return null;

  // If not on last subpage, go to next subpage
  if (subpageIndex < step.subpages.length - 1) {
    const nextSubpage = step.subpages[subpageIndex + 1];
    return { route: nextSubpage.route, isNextStep: false };
  }

  // If on last subpage, go to next step
  if (step.navigation.next) {
    return { route: step.navigation.next.route, isNextStep: true };
  }

  return null;
}

export function getPreviousNavigation(flowType: FlowType, stepIndex: number, subpageIndex: number): { route: string; isPreviousStep: boolean } | null {
  const step = getStepByIndex(flowType, stepIndex);
  if (!step) return null;

  // If not on first subpage, go to previous subpage
  if (subpageIndex > 0) {
    const prevSubpage = step.subpages[subpageIndex - 1];
    return { route: prevSubpage.route, isPreviousStep: false };
  }

  // If on first subpage, go to previous step
  if (step.navigation.previous) {
    return { route: step.navigation.previous.route, isPreviousStep: true };
  }

  return null;
}

export default workflows;
