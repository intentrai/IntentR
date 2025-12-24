import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWizard } from '../../context/WizardContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Button } from '../Button';

export const WorkspaceTypeStep: React.FC = () => {
  const navigate = useNavigate();
  const { flowType, setFlowType, setWizardMode, nextStep, steps } = useWizard();
  const { currentWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(currentWorkspace?.id || '');

  const handleWorkspaceSelect = (workspaceId: string) => {
    setSelectedWorkspaceId(workspaceId);
  };

  const handleContinue = async () => {
    // Switch to the selected workspace
    if (selectedWorkspaceId) {
      await switchWorkspace(selectedWorkspaceId);
    }

    // Ensure wizard mode is enabled
    setWizardMode(true);

    // Ensure we have a flow type set (default to 'new' if not)
    if (!flowType) {
      setFlowType('new');
    }

    // Use nextStep to properly navigate to the next step in the wizard
    // This handles state updates and navigation correctly
    if (steps.length > 1) {
      nextStep();
    } else {
      // Fallback: navigate to the first non-workspace step
      navigate('/wizard/intent/start');
    }
  };

  const handleCreateNew = () => {
    // Navigate to workspaces page to create a new workspace
    navigate('/workspaces');
  };

  return (
    <div className="workspace-select-step">
      <div className="workspace-select-header">
        <h1>Select a Workspace</h1>
        <p>Choose the workspace you want to work with in this wizard session.</p>
      </div>

      {/* Workspace List */}
      <div className="workspace-list">
        {workspaces.length === 0 ? (
          <div className="no-workspaces">
            <div className="no-workspaces-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <h3>No Workspaces Found</h3>
            <p>Create a new workspace to get started with the wizard.</p>
            <Button variant="primary" onClick={handleCreateNew}>
              Create Workspace
            </Button>
          </div>
        ) : (
          <>
            {workspaces.map((workspace) => {
              const isSelected = selectedWorkspaceId === workspace.id;
              const isCurrent = currentWorkspace?.id === workspace.id;

              return (
                <button
                  key={workspace.id}
                  onClick={() => handleWorkspaceSelect(workspace.id)}
                  className={`workspace-card ${isSelected ? 'workspace-card--selected' : ''}`}
                >
                  <div className="workspace-card-content">
                    <div className="workspace-card-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                      </svg>
                    </div>
                    <div className="workspace-card-info">
                      <h3 className="workspace-card-name">
                        {workspace.name}
                        {isCurrent && <span className="current-badge">Current</span>}
                      </h3>
                      {workspace.description && (
                        <p className="workspace-card-description">{workspace.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="workspace-card-radio">
                    {isSelected ? (
                      <div className="radio-selected" />
                    ) : (
                      <div className="radio-unselected" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Create New Workspace Option */}
            <button
              onClick={handleCreateNew}
              className="workspace-card workspace-card--create"
            >
              <div className="workspace-card-content">
                <div className="workspace-card-icon workspace-card-icon--create">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="workspace-card-info">
                  <h3 className="workspace-card-name">Create New Workspace</h3>
                  <p className="workspace-card-description">Start a new project from scratch</p>
                </div>
              </div>
            </button>
          </>
        )}
      </div>

      {/* Continue Button */}
      {workspaces.length > 0 && (
        <div className="workspace-select-actions">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!selectedWorkspaceId}
          >
            Continue with {selectedWorkspaceId ? workspaces.find(w => w.id === selectedWorkspaceId)?.name : 'selected workspace'}
            <svg className="continue-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}

      <style>{`
        .workspace-select-step {
          max-width: 700px;
          margin: 0 auto;
          padding: 2rem;
        }

        .workspace-select-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .workspace-select-header h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--color-grey-900);
          margin-bottom: 0.5rem;
        }

        .workspace-select-header p {
          font-size: 1rem;
          color: var(--color-grey-600);
        }

        .workspace-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .no-workspaces {
          text-align: center;
          padding: 3rem 2rem;
          background: var(--color-grey-50);
          border-radius: 0.75rem;
          border: 2px dashed var(--color-grey-300);
        }

        .no-workspaces-icon {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          color: var(--color-grey-400);
        }

        .no-workspaces-icon svg {
          width: 100%;
          height: 100%;
        }

        .no-workspaces h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--color-grey-900);
          margin-bottom: 0.5rem;
        }

        .no-workspaces p {
          font-size: 0.875rem;
          color: var(--color-grey-600);
          margin-bottom: 1.5rem;
        }

        .workspace-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          text-align: left;
          padding: 1rem 1.25rem;
          border: 2px solid var(--color-grey-200);
          border-radius: 0.75rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .workspace-card:hover {
          border-color: var(--color-grey-300);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .workspace-card--selected {
          border-color: var(--color-blue-500);
          background: var(--color-blue-50);
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .workspace-card--create {
          border-style: dashed;
          background: var(--color-grey-50);
        }

        .workspace-card--create:hover {
          background: var(--color-grey-100);
          border-color: var(--color-grey-400);
        }

        .workspace-card-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .workspace-card-icon {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-blue-600);
          background: var(--color-blue-100);
          border-radius: 0.5rem;
          flex-shrink: 0;
        }

        .workspace-card-icon svg {
          width: 1.5rem;
          height: 1.5rem;
        }

        .workspace-card-icon--create {
          color: var(--color-grey-500);
          background: var(--color-grey-200);
        }

        .workspace-card-info {
          min-width: 0;
        }

        .workspace-card-name {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-grey-900);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .current-badge {
          display: inline-flex;
          padding: 0.125rem 0.5rem;
          background: var(--color-green-100);
          color: var(--color-green-700);
          font-size: 0.625rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-radius: 9999px;
        }

        .workspace-card-description {
          font-size: 0.875rem;
          color: var(--color-grey-600);
          margin-top: 0.25rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .workspace-card-radio {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
        }

        .radio-selected {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: var(--color-blue-500);
          position: relative;
        }

        .radio-selected::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 0.5rem;
          height: 0.5rem;
          background: white;
          border-radius: 50%;
        }

        .radio-unselected {
          width: 100%;
          height: 100%;
          border: 2px solid var(--color-grey-300);
          border-radius: 50%;
        }

        .workspace-select-actions {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }

        .continue-icon {
          width: 1.25rem;
          height: 1.25rem;
          margin-left: 0.5rem;
        }

        @media (max-width: 640px) {
          .workspace-select-step {
            padding: 1rem;
          }

          .workspace-select-header h1 {
            font-size: 1.5rem;
          }

          .workspace-card {
            padding: 0.875rem 1rem;
          }

          .workspace-card-icon {
            width: 2rem;
            height: 2rem;
          }

          .workspace-card-icon svg {
            width: 1.25rem;
            height: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WorkspaceTypeStep;
