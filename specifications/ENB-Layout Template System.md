# Layout Template System

## Metadata

- **Name**: Layout Template System
- **Type**: Enabler
- **ID**: ENB-956235
- **Capability ID**: CAP-956231
- **Owner**: Development Team
- **Status**: Ready for Implementation
- **Approval**: Approved
- **Priority**: Medium
- **Analysis Review**: Not Required
- **Code Review**: Not Required

## Technical Overview

### Purpose

Provide default layout templates and support for custom layout configurations. Templates define which page header elements are visible and enable quick switching between layout modes.

### Architecture Fit

This enabler is part of the Configurable Page Layout System capability (CAP-956231) and integrates with:
- PageLayout Component (ENB-956232) for rendering configuration
- Page Layout Configuration UI (ENB-956234) for template selection

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-956235-001 | Standard Template | Provide template with all elements visible | High | Ready | Approved |
| FR-956235-002 | Minimal Template | Provide template with only title/description | High | Ready | Approved |
| FR-956235-003 | Development Template | Provide template with debug/dev info | Medium | Ready | Approved |
| FR-956235-004 | Presentation Template | Provide clean template for demos | Medium | Ready | Approved |
| FR-956235-005 | Custom Templates | Support user-defined layout configurations | Medium | Ready | Approved |
| FR-956235-006 | Template Storage | Store selected template in workspace | High | Ready | Approved |

## Technical Specifications

### Default Templates

| Template | Wizard | AI Preset | UI Framework | Workspace | Title | Description | Info |
|----------|:------:|:---------:|:------------:|:---------:|:-----:|:-----------:|:----:|
| Standard | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Minimal | No | No | No | No | Yes | Yes | No |
| Development | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Presentation | No | No | No | Yes | Yes | No | No |

### Data Model

```typescript
interface PageLayoutConfig {
  id: string;
  name: string;
  showWizard: boolean;
  showAIPreset: boolean;
  showUIFramework: boolean;
  showWorkspace: boolean;
  showTitle: boolean;
  showDescription: boolean;
  showInfoButton: boolean;
}

interface Workspace {
  // ... existing fields
  pageLayoutConfig?: PageLayoutConfig;
  customPageLayouts?: PageLayoutConfig[];
}
```

### Storage

- Selected template stored in `workspace.pageLayoutConfig`
- Custom templates stored in `workspace.customPageLayouts`
- Persisted via WorkspaceContext to localStorage and .intentrworkspace file

## Approval History

| Date | Stage | Decision | By | Feedback |
|------|-------|----------|-----|----------|
| 2025-12-23 | Specification | Approved | System | Auto-created during gap analysis |
