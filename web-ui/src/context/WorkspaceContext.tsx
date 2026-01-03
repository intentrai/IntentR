import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { INTEGRATION_URL, WORKSPACE_URL } from '../api/client';
import type { PageLayoutConfig } from '../components/PageLayout';

const SHARED_WORKSPACE_API = `${WORKSPACE_URL}/api`;

// INTENT State Model types for StoryCard
export type StoryCardLifecycleState = 'draft' | 'active' | 'implemented' | 'maintained' | 'retired';
export type StoryCardWorkflowStage = 'intent' | 'specification' | 'ui_design' | 'implementation' | 'control_loop';
export type StoryCardStageStatus = 'in_progress' | 'ready_for_approval' | 'approved' | 'blocked';
export type StoryCardApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface StoryCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  x: number;
  y: number;
  // INTENT State Model - 4 dimensions
  lifecycle_state: StoryCardLifecycleState;
  workflow_stage: StoryCardWorkflowStage;
  stage_status: StoryCardStageStatus;
  approval_status: StoryCardApprovalStatus;
  // Legacy field for backward compatibility (deprecated)
  status?: 'pending' | 'in-progress' | 'completed';
  ideationTags: string[];
  ideationCardId?: string; // Link to ideation card by ID
  sourceFileName?: string; // Original filename if loaded from specifications
}

export interface Connection {
  id?: string;
  from: string;
  to: string;
}

export interface StoryboardData {
  cards: StoryCard[];
  connections: Connection[];
  zoom?: number;
  scrollLeft?: number;
  scrollTop?: number;
}

export interface TextBlock {
  id: string;
  content: string;
  x: number;
  y: number;
  tags: string[];
  width: number;
  height: number;
}

export interface ImageBlock {
  id: string;
  imageUrl: string;
  x: number;
  y: number;
  tags: string[];
  width: number;
  height: number;
}

export interface ShapeBlock {
  id: string;
  type: 'box' | 'circle' | 'line' | 'square';
  x: number;
  y: number;
  width: number;
  height: number;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  tags: string[];
}

export interface IdeationData {
  textBlocks: TextBlock[];
  imageBlocks: ImageBlock[];
  shapeBlocks?: ShapeBlock[];
  connections?: Connection[];
  zoom?: number;
  scrollLeft?: number;
  scrollTop?: number;
}

export interface AIPrinciplesData {
  [categoryId: string]: string;
}

export interface AIPrinciplesPreset {
  name: string;
  principles: AIPrinciplesData;
}

export interface SystemCapability {
  id: string;
  name: string;
  status: string;
  enablers: string[];
  upstreamDependencies: string[];
  downstreamImpacts: string[];
  x: number;
  y: number;
}

export interface SystemEnabler {
  id: string;
  name: string;
  capabilityId: string;
  x: number;
  y: number;
}

export interface SystemCapabilityDependency {
  from: string;
  to: string;
}

export interface SystemEnablerConnection {
  capabilityId: string;
  enablerId: string;
}

export interface SystemData {
  capabilities: SystemCapability[];
  enablers: SystemEnabler[];
  capabilityDependencies?: SystemCapabilityDependency[];
  enablerConnections?: SystemEnablerConnection[];
  zoom?: number;
  scrollLeft?: number;
  scrollTop?: number;
}

export type WorkspaceType = 'new' | 'refactor' | 'enhance' | 'reverse-engineer';

export type WizardFlowType = 'new' | 'refactor' | 'enhance' | 'reverse-engineer';

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  workspaceType?: WorkspaceType;
  figmaTeamUrl?: string;
  projectFolder?: string;
  aiPrinciples?: AIPrinciplesData;
  aiPrinciplesPresets?: AIPrinciplesPreset[];
  activeAIPreset?: number; // 1-5 representing which preset is active
  selectedUIFramework?: string; // ID of the selected UI framework
  customUIFrameworks?: any[]; // Custom UI frameworks created by user
  selectedUILayout?: string; // ID of the selected UI layout
  customUILayouts?: any[]; // Custom UI layouts created by user
  pageLayoutConfig?: PageLayoutConfig; // Active page layout configuration
  customPageLayouts?: PageLayoutConfig[]; // Custom page layouts created by user
  storyboard?: StoryboardData;
  ideation?: IdeationData;
  systemDiagram?: SystemData;
  wizardFlows?: Record<WizardFlowType, string[]>; // Wizard section sequences per flow type
  wizardSubpages?: Record<string, string[]>; // Subpage sequences per section
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  ownerName?: string;
  isShared: boolean;
}

interface WorkspaceState {
  workspaces: Workspace[];
  sharedWithMeWorkspaces: Workspace[]; // Workspaces shared with current user (automatic access)
  currentWorkspace: Workspace | null;
  isLoading: boolean;
}

interface WorkspaceContextType extends WorkspaceState {
  createWorkspace: (name: string, description?: string, figmaTeamUrl?: string, workspaceType?: WorkspaceType) => Promise<void>;
  updateWorkspace: (id: string, updates: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  switchWorkspace: (id: string, isSharedWithMe?: boolean) => void;
  updateStoryboard: (storyboardData: StoryboardData) => void;
  toggleSharing: (id: string) => Promise<void>;
  refreshSharedWithMeWorkspaces: () => Promise<void>;
  setActiveAIPreset: (presetNumber: number) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, setState] = useState<WorkspaceState>({
    workspaces: [],
    sharedWithMeWorkspaces: [],
    currentWorkspace: null,
    isLoading: true,
  });

  useEffect(() => {
    if (user) {
      // Migrate old shared_workspaces to global_shared_workspaces (one-time migration)
      migrateSharedWorkspaces();
      loadWorkspaces();
      refreshSharedWithMeWorkspaces();
    }
  }, [user]);

  // Auto-refresh current workspace if it's a shared-with-me workspace (for collaboration)
  useEffect(() => {
    if (!state.currentWorkspace) return;

    // Check if current workspace is a shared-with-me workspace
    const isSharedWithMeWorkspace = state.sharedWithMeWorkspaces.some(w => w.id === state.currentWorkspace?.id);

    if (!isSharedWithMeWorkspace) return;

    // Poll every 5 seconds for updates
    const intervalId = setInterval(async () => {
      try {
        // Refresh shared-with-me workspaces to get latest data
        await refreshSharedWithMeWorkspaces();
      } catch (error) {
        console.error('Failed to sync workspace updates:', error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId);
  }, [state.currentWorkspace?.id, state.sharedWithMeWorkspaces]);

  const migrateSharedWorkspaces = () => {
    const userEmail = user?.email || 'anonymous';

    // MIGRATION 1: Migrate old global 'workspaces' to user-specific 'workspaces_${email}'
    const oldWorkspaces = localStorage.getItem('workspaces');
    const userSpecificWorkspaces = localStorage.getItem(`workspaces_${userEmail}`);

    // Only migrate if old workspaces exist AND user-specific doesn't exist yet
    if (oldWorkspaces && !userSpecificWorkspaces) {
      try {
        const oldData = JSON.parse(oldWorkspaces);

        // Filter to only migrate workspaces owned by this user
        const myWorkspaces = oldData.filter((w: Workspace) =>
          w.ownerId === userEmail || w.ownerId === 'unknown'
        );

        if (myWorkspaces.length > 0) {
          localStorage.setItem(`workspaces_${userEmail}`, JSON.stringify(myWorkspaces));
          console.log(`Migrated ${myWorkspaces.length} workspaces to user-specific storage for ${userEmail}`);
        }

        // Don't remove the old key yet - other users might need to migrate their workspaces
      } catch (err) {
        console.error('Failed to migrate workspaces:', err);
      }
    }

    // MIGRATION 2: Migrate old global 'joinedWorkspaces' to user-specific
    const oldJoinedWorkspaces = localStorage.getItem('joinedWorkspaces');
    const userSpecificJoined = localStorage.getItem(`joinedWorkspaces_${userEmail}`);

    if (oldJoinedWorkspaces && !userSpecificJoined) {
      try {
        localStorage.setItem(`joinedWorkspaces_${userEmail}`, oldJoinedWorkspaces);
        console.log(`Migrated joined workspaces to user-specific storage for ${userEmail}`);
      } catch (err) {
        console.error('Failed to migrate joined workspaces:', err);
      }
    }

    // MIGRATION 3: Migrate old 'shared_workspaces' to 'global_shared_workspaces'
    const oldSharedWorkspaces = localStorage.getItem('shared_workspaces');
    if (oldSharedWorkspaces) {
      try {
        const oldData = JSON.parse(oldSharedWorkspaces);
        const globalSharedWorkspaces = JSON.parse(localStorage.getItem('global_shared_workspaces') || '[]');

        // Merge old data into global shared workspaces (avoiding duplicates by ID)
        const existingIds = new Set(globalSharedWorkspaces.map((w: Workspace) => w.id));
        oldData.forEach((workspace: Workspace) => {
          if (!existingIds.has(workspace.id)) {
            globalSharedWorkspaces.push(workspace);
          }
        });

        localStorage.setItem('global_shared_workspaces', JSON.stringify(globalSharedWorkspaces));

        // Remove the old key to prevent re-migration
        localStorage.removeItem('shared_workspaces');
        console.log('Migrated shared workspaces to global storage');
      } catch (err) {
        console.error('Failed to migrate shared workspaces:', err);
      }
    }
  };

  const loadWorkspaces = () => {
    // Use user-specific keys to isolate workspaces per user
    const userEmail = user?.email || 'anonymous';
    const stored = localStorage.getItem(`workspaces_${userEmail}`);
    const currentId = localStorage.getItem(`currentWorkspaceId_${userEmail}`);

    let workspaces: Workspace[] = [];

    if (stored) {
      let needsSave = false;
      workspaces = JSON.parse(stored)
        .filter((w: Workspace) => {
          // SAFETY: Only load workspaces owned by this user
          const ownerEmail = w.ownerId || 'unknown';
          return ownerEmail === userEmail || ownerEmail === 'unknown';
        })
        .map((w: Workspace) => {
          // Migration: Auto-set projectFolder if not set
          let projectFolder = w.projectFolder;
          if (!projectFolder) {
            const safeFolderName = w.name.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-');
            projectFolder = `workspaces/${safeFolderName}`;
            needsSave = true;
            console.log(`Migrating workspace "${w.name}" to use projectFolder: ${projectFolder}`);
          }
          return {
            ...w,
            projectFolder,
            createdAt: new Date(w.createdAt),
            updatedAt: new Date(w.updatedAt),
            ownerId: w.ownerId || user?.email || 'unknown',
            ownerName: w.ownerName || user?.name || user?.email || 'Unknown',
            isShared: w.isShared || false,
          };
        });
      // Save migrated workspaces if any were updated
      if (needsSave) {
        localStorage.setItem(`workspaces_${userEmail}`, JSON.stringify(workspaces));
      }
    } else {
      // Default new users to HelloWorldWeather workspace
      const defaultWorkspace: Workspace = {
        id: 'workspace-' + Date.now(),
        name: 'HelloWorldWeather',
        description: 'A sample weather application workspace to help you get started with IntentR',
        workspaceType: 'new',
        projectFolder: 'workspaces/HelloWorldWeather',
        createdAt: new Date(),
        updatedAt: new Date(),
        ownerId: user?.email || 'unknown',
        ownerName: user?.name || user?.email || 'Unknown',
        isShared: false,
      };

      workspaces = [defaultWorkspace];
      localStorage.setItem(`workspaces_${userEmail}`, JSON.stringify(workspaces));
    }

    // Current workspace can be from own workspaces or shared-with-me (will be loaded separately)
    const currentWorkspace = currentId
      ? workspaces.find(w => w.id === currentId) || workspaces[0] || null
      : workspaces[0] || null;

    if (currentWorkspace) {
      localStorage.setItem(`currentWorkspaceId_${userEmail}`, currentWorkspace.id);
    }

    setState(prev => ({
      ...prev,
      workspaces,
      currentWorkspace,
      isLoading: false,
    }));
  };

  const saveWorkspaces = (workspaces: Workspace[]) => {
    const userEmail = user?.email || 'anonymous';
    localStorage.setItem(`workspaces_${userEmail}`, JSON.stringify(workspaces));
  };

  const createWorkspace = async (
    name: string,
    description?: string,
    figmaTeamUrl?: string,
    workspaceType?: WorkspaceType
  ): Promise<void> => {
    // Generate a safe folder name from the workspace name
    const safeFolderName = name.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-');
    const projectFolder = `workspaces/${safeFolderName}`;

    const newWorkspace: Workspace = {
      id: 'workspace-' + Date.now(),
      name,
      description,
      workspaceType: workspaceType || 'new',
      figmaTeamUrl,
      projectFolder, // Auto-set project folder based on workspace name
      createdAt: new Date(),
      updatedAt: new Date(),
      ownerId: user?.email || 'unknown',
      ownerName: user?.name || user?.email || 'Unknown',
      isShared: false,
    };

    // Ensure workspace folder structure exists and copy CODE_RULES
    try {
      await fetch(`${INTEGRATION_URL}/folders/ensure-workspace-structure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: projectFolder }),
      });
    } catch (error) {
      console.error('Error ensuring workspace structure:', error);
    }

    // Save .intentrworkspace configuration file
    try {
      await fetch(`${INTEGRATION_URL}/workspace-config/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            id: newWorkspace.id,
            name: newWorkspace.name,
            description: newWorkspace.description || '',
            workspaceType: newWorkspace.workspaceType || 'new',
            figmaTeamUrl: newWorkspace.figmaTeamUrl || '',
            projectFolder: newWorkspace.projectFolder,
            activeAIPreset: newWorkspace.activeAIPreset || 0,
            selectedUIFramework: newWorkspace.selectedUIFramework || '',
            selectedUILayout: newWorkspace.selectedUILayout || '',
            ownerId: newWorkspace.ownerId,
            ownerName: newWorkspace.ownerName || '',
            isShared: newWorkspace.isShared,
            createdAt: newWorkspace.createdAt.toISOString(),
            updatedAt: newWorkspace.updatedAt.toISOString(),
            version: '1.0',
            // Include canvas data for shared workspaces
            storyboard: null,
            ideation: null,
            systemDiagram: null,
          },
        }),
      });
    } catch (error) {
      console.error('Error saving workspace configuration file:', error);
    }

    const updatedWorkspaces = [...state.workspaces, newWorkspace];
    saveWorkspaces(updatedWorkspaces);

    setState(prev => ({
      ...prev,
      workspaces: updatedWorkspaces,
    }));
  };

  const updateWorkspace = async (id: string, updates: Partial<Workspace>): Promise<void> => {
    console.log('[WorkspaceContext] updateWorkspace called');
    console.log('[WorkspaceContext] id:', id);
    console.log('[WorkspaceContext] updates:', updates);
    console.log('[WorkspaceContext] current state.workspaces count:', state.workspaces.length);

    const updatedWorkspaces = state.workspaces.map(w =>
      w.id === id
        ? { ...w, ...updates, updatedAt: new Date() }
        : w
    );

    console.log('[WorkspaceContext] updatedWorkspaces - workspace found:', updatedWorkspaces.some(w => w.id === id));
    const updatedWs = updatedWorkspaces.find(w => w.id === id);
    console.log('[WorkspaceContext] updated workspace wizardFlows:', updatedWs?.wizardFlows);

    saveWorkspaces(updatedWorkspaces);
    console.log('[WorkspaceContext] saveWorkspaces called');

    // Update .intentrworkspace configuration file if workspace has a projectFolder
    const updatedWorkspace = updatedWorkspaces.find(w => w.id === id);
    if (updatedWorkspace?.projectFolder) {
      try {
        await fetch(`${INTEGRATION_URL}/workspace-config/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: {
              id: updatedWorkspace.id,
              name: updatedWorkspace.name,
              description: updatedWorkspace.description || '',
              workspaceType: updatedWorkspace.workspaceType || 'new',
              figmaTeamUrl: updatedWorkspace.figmaTeamUrl || '',
              projectFolder: updatedWorkspace.projectFolder,
              activeAIPreset: updatedWorkspace.activeAIPreset || 0,
              selectedUIFramework: updatedWorkspace.selectedUIFramework || '',
              selectedUILayout: updatedWorkspace.selectedUILayout || '',
              ownerId: updatedWorkspace.ownerId,
              ownerName: updatedWorkspace.ownerName || '',
              isShared: updatedWorkspace.isShared,
              createdAt: updatedWorkspace.createdAt instanceof Date
                ? updatedWorkspace.createdAt.toISOString()
                : updatedWorkspace.createdAt,
              updatedAt: updatedWorkspace.updatedAt instanceof Date
                ? updatedWorkspace.updatedAt.toISOString()
                : updatedWorkspace.updatedAt,
              version: '1.0',
              // Include canvas data for shared workspaces
              storyboard: updatedWorkspace.storyboard || null,
              ideation: updatedWorkspace.ideation || null,
              systemDiagram: updatedWorkspace.systemDiagram || null,
            },
          }),
        });
      } catch (error) {
        console.error('Error updating workspace configuration file:', error);
      }
    }

    console.log('[WorkspaceContext] Calling setState to update workspaces...');
    setState(prev => {
      const newCurrentWorkspace = prev.currentWorkspace?.id === id
        ? updatedWorkspaces.find(w => w.id === id) || prev.currentWorkspace
        : prev.currentWorkspace;
      console.log('[WorkspaceContext] setState - prev.currentWorkspace?.id:', prev.currentWorkspace?.id);
      console.log('[WorkspaceContext] setState - newCurrentWorkspace wizardFlows:', newCurrentWorkspace?.wizardFlows);
      return {
        ...prev,
        workspaces: updatedWorkspaces,
        currentWorkspace: newCurrentWorkspace,
      };
    });

    // Sync to global shared workspaces if this workspace is shared
    const workspace = updatedWorkspaces.find(w => w.id === id);
    if (workspace?.isShared) {
      try {
        // Update in global_shared_workspaces so other users see the changes
        const globalSharedWorkspaces = JSON.parse(localStorage.getItem('global_shared_workspaces') || '[]');
        const sharedIndex = globalSharedWorkspaces.findIndex((w: Workspace) => w.id === id);

        if (sharedIndex >= 0) {
          globalSharedWorkspaces[sharedIndex] = workspace;
        } else {
          globalSharedWorkspaces.push(workspace);
        }

        localStorage.setItem('global_shared_workspaces', JSON.stringify(globalSharedWorkspaces));

        // When backend workspace service is implemented, uncomment this:
        // await axios.put(`${SHARED_WORKSPACE_API}/shared-workspaces/${id}`, { workspace });
      } catch (error) {
        console.error('Failed to sync workspace to shared storage:', error);
      }
    }

    // For shared-with-me workspaces, update the current workspace in memory
    // The actual data is stored in the workspace folder's .intentrworkspace file
    const isSharedWithMeWorkspace = state.sharedWithMeWorkspaces.some(w => w.id === id);
    if (isSharedWithMeWorkspace) {
      setState(prev => ({
        ...prev,
        currentWorkspace: prev.currentWorkspace?.id === id
          ? { ...prev.currentWorkspace, ...updates, updatedAt: new Date() }
          : prev.currentWorkspace,
      }));
    }
  };

  const deleteWorkspace = async (id: string): Promise<void> => {
    const workspace = state.workspaces.find(w => w.id === id);

    if (workspace?.isShared) {
      try {
        await axios.delete(`${SHARED_WORKSPACE_API}/shared-workspaces/${id}?userEmail=${user?.email}`);
      } catch (error) {
        console.error('Failed to unshare workspace:', error);
      }
    }

    // Move workspace folder to archived_workspaces instead of permanently deleting
    if (workspace?.projectFolder) {
      try {
        await fetch(`${INTEGRATION_URL}/folders/move-to-deleted`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourcePath: workspace.projectFolder,
          }),
        });
      } catch (error) {
        console.error('Failed to move workspace folder to archived_workspaces:', error);
        // Continue with deletion from state even if folder move fails
      }
    }

    const updatedWorkspaces = state.workspaces.filter(w => w.id !== id);
    saveWorkspaces(updatedWorkspaces);

    setState(prev => {
      const allWorkspaces = [...updatedWorkspaces, ...prev.sharedWithMeWorkspaces];
      const newCurrent = prev.currentWorkspace?.id === id
        ? allWorkspaces[0] || null
        : prev.currentWorkspace;

      if (newCurrent) {
        const userEmail = user?.email || 'anonymous';
        localStorage.setItem(`currentWorkspaceId_${userEmail}`, newCurrent.id);
      }

      return {
        ...prev,
        workspaces: updatedWorkspaces,
        currentWorkspace: newCurrent,
      };
    });
  };

  const switchWorkspace = async (id: string, isSharedWithMe: boolean = false): Promise<void> => {
    // Find workspace in owned workspaces or shared-with-me workspaces
    let workspace = isSharedWithMe
      ? state.sharedWithMeWorkspaces.find(w => w.id === id)
      : state.workspaces.find(w => w.id === id);

    const userEmail = user?.email || 'anonymous';

    // Initialize workspace files (copy CLAUDE.md and MAIN_SWDEV_PLAN.md from CODE_RULES if needed)
    const workspaceToInit = workspace || [...state.workspaces, ...state.sharedWithMeWorkspaces].find(w => w.id === id);
    if (workspaceToInit?.projectFolder) {
      try {
        await fetch(`${INTEGRATION_URL}/workspace/init-files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            workspacePath: workspaceToInit.projectFolder,
          }),
        });
      } catch (error) {
        console.error('Failed to initialize workspace files:', error);
      }
    }

    if (!workspace) {
      const found = [...state.workspaces, ...state.sharedWithMeWorkspaces].find(w => w.id === id);
      if (found) {
        localStorage.setItem(`currentWorkspaceId_${userEmail}`, id);
        setState(prev => ({
          ...prev,
          currentWorkspace: found,
        }));
      }
    } else {
      localStorage.setItem(`currentWorkspaceId_${userEmail}`, id);
      setState(prev => ({
        ...prev,
        currentWorkspace: workspace,
      }));
    }
  };

  const updateStoryboard = (storyboardData: StoryboardData): void => {
    if (!state.currentWorkspace) return;

    const workspaceId = state.currentWorkspace.id;
    const isOwnWorkspace = state.workspaces.some(w => w.id === workspaceId);

    if (isOwnWorkspace) {
      // Update owned workspace
      const updatedWorkspaces = state.workspaces.map(w =>
        w.id === workspaceId
          ? { ...w, storyboard: storyboardData, updatedAt: new Date() }
          : w
      );

      saveWorkspaces(updatedWorkspaces);

      const updatedWorkspace = updatedWorkspaces.find(w => w.id === workspaceId);

      setState(prev => ({
        ...prev,
        workspaces: updatedWorkspaces,
        currentWorkspace: updatedWorkspace || prev.currentWorkspace,
      }));

      // Also save to .intentrworkspace config file for sharing (async, fire-and-forget)
      if (updatedWorkspace?.projectFolder) {
        fetch(`${INTEGRATION_URL}/workspace-config/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            config: {
              id: updatedWorkspace.id,
              name: updatedWorkspace.name,
              description: updatedWorkspace.description || '',
              workspaceType: updatedWorkspace.workspaceType || 'new',
              figmaTeamUrl: updatedWorkspace.figmaTeamUrl || '',
              projectFolder: updatedWorkspace.projectFolder,
              activeAIPreset: updatedWorkspace.activeAIPreset || 0,
              selectedUIFramework: updatedWorkspace.selectedUIFramework || '',
              selectedUILayout: updatedWorkspace.selectedUILayout || '',
              ownerId: updatedWorkspace.ownerId,
              ownerName: updatedWorkspace.ownerName || '',
              isShared: updatedWorkspace.isShared,
              createdAt: updatedWorkspace.createdAt instanceof Date
                ? updatedWorkspace.createdAt.toISOString()
                : updatedWorkspace.createdAt,
              updatedAt: new Date().toISOString(),
              version: '1.0',
              storyboard: storyboardData,
              ideation: updatedWorkspace.ideation || null,
              systemDiagram: updatedWorkspace.systemDiagram || null,
            },
          }),
        }).catch(err => console.error('Error saving storyboard to config file:', err));
      }
    } else {
      // This is a shared-with-me workspace - update in memory only
      // The actual data is stored in the workspace's .intentrworkspace file
      const updatedWorkspace = {
        ...state.currentWorkspace,
        storyboard: storyboardData,
        updatedAt: new Date(),
      };

      setState(prev => ({
        ...prev,
        currentWorkspace: updatedWorkspace,
      }));
    }
  };

  const toggleSharing = async (id: string): Promise<void> => {
    const workspace = state.workspaces.find(w => w.id === id);
    if (!workspace) {
      throw new Error('Workspace not found');
    }

    const newIsShared = !workspace.isShared;

    try {
      const updatedWorkspaces = state.workspaces.map(w =>
        w.id === id
          ? { ...w, isShared: newIsShared, updatedAt: new Date() }
          : w
      );

      saveWorkspaces(updatedWorkspaces);

      setState(prev => ({
        ...prev,
        workspaces: updatedWorkspaces,
        currentWorkspace: prev.currentWorkspace?.id === id
          ? updatedWorkspaces.find(w => w.id === id) || prev.currentWorkspace
          : prev.currentWorkspace,
      }));
    } catch (error) {
      console.error('Failed to toggle sharing:', error);
      throw error;
    }
  };

  // Fetch workspaces shared with the current user from backend API
  const refreshSharedWithMeWorkspaces = async (): Promise<void> => {
    if (!user?.email) return;

    try {
      // Get auth token from sessionStorage (where AuthContext stores it)
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
        console.log('No auth token, skipping shared workspaces fetch');
        return;
      }

      // Step 1: Get workspace IDs shared with current user from auth service
      const sharedIdsResponse = await fetch('/api/workspaces/shared-with-me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!sharedIdsResponse.ok) {
        console.error('Failed to fetch shared workspace IDs:', sharedIdsResponse.status);
        return;
      }

      const sharedWorkspaceIds: string[] = await sharedIdsResponse.json();

      if (!sharedWorkspaceIds || sharedWorkspaceIds.length === 0) {
        setState(prev => ({
          ...prev,
          sharedWithMeWorkspaces: [],
        }));
        return;
      }

      // Step 2: Scan workspace folders to get full workspace configs
      const scanResponse = await fetch(`${INTEGRATION_URL}/workspace-config/scan`);
      if (!scanResponse.ok) {
        console.error('Failed to scan workspace configs:', scanResponse.status);
        return;
      }

      const scanData = await scanResponse.json();
      const allWorkspaceConfigs = scanData.workspaces || [];

      // Step 3: Filter to only workspaces that are shared with current user
      const sharedWorkspaceIdSet = new Set(sharedWorkspaceIds);
      const myWorkspaceIds = new Set(state.workspaces.map(w => w.id));

      const sharedWithMeWorkspaces: Workspace[] = allWorkspaceConfigs
        .filter((sw: any) => sw.hasConfig && sw.config && sharedWorkspaceIdSet.has(sw.config.id))
        .filter((sw: any) => !myWorkspaceIds.has(sw.config.id)) // Don't include own workspaces
        .map((sw: any) => ({
          id: sw.config.id,
          name: sw.config.name,
          description: sw.config.description || '',
          workspaceType: sw.config.workspaceType || 'new',
          figmaTeamUrl: sw.config.figmaTeamUrl || '',
          projectFolder: sw.folderPath,
          activeAIPreset: sw.config.activeAIPreset || 0,
          selectedUIFramework: sw.config.selectedUIFramework || '',
          selectedUILayout: sw.config.selectedUILayout || '',
          ownerId: sw.config.ownerId || 'unknown',
          ownerName: sw.config.ownerName || sw.config.ownerId || 'Unknown',
          isShared: true,
          createdAt: new Date(sw.config.createdAt),
          updatedAt: new Date(sw.config.updatedAt),
          // Include canvas data from shared workspace config
          storyboard: sw.config.storyboard || undefined,
          ideation: sw.config.ideation || undefined,
          systemDiagram: sw.config.systemDiagram || undefined,
        }));

      setState(prev => {
        // Also update current workspace if it's a shared workspace
        let updatedCurrent = prev.currentWorkspace;
        if (prev.currentWorkspace && sharedWorkspaceIdSet.has(prev.currentWorkspace.id)) {
          const updated = sharedWithMeWorkspaces.find(w => w.id === prev.currentWorkspace?.id);
          if (updated && new Date(updated.updatedAt) > new Date(prev.currentWorkspace.updatedAt)) {
            updatedCurrent = updated;
          }
        }

        return {
          ...prev,
          sharedWithMeWorkspaces,
          currentWorkspace: updatedCurrent,
        };
      });
    } catch (error) {
      console.error('Failed to fetch shared-with-me workspaces:', error);
    }
  };

  const setActiveAIPreset = async (presetNumber: number): Promise<void> => {
    if (!state.currentWorkspace) return;
    if (presetNumber < 1 || presetNumber > 5) {
      console.error('Invalid preset number. Must be 1-5');
      return;
    }

    await updateWorkspace(state.currentWorkspace.id, { activeAIPreset: presetNumber });
  };

  return (
    <WorkspaceContext.Provider
      value={{
        ...state,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        switchWorkspace,
        updateStoryboard,
        toggleSharing,
        refreshSharedWithMeWorkspaces,
        setActiveAIPreset,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = (): WorkspaceContextType => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within WorkspaceProvider');
  }
  return context;
};
