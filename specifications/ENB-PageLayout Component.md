# PageLayout Component

## Metadata

- **Name**: PageLayout Component
- **Type**: Enabler
- **ID**: ENB-956232
- **Capability ID**: CAP-956231
- **Owner**: Development Team
- **Status**: Ready for Implementation
- **Approval**: Approved
- **Priority**: High
- **Analysis Review**: Not Required
- **Code Review**: Not Required

## Technical Overview

### Purpose

Create a core wrapper component that enforces consistent page structure across the IntentR application. PageLayout provides a unified header with wizard navigation, AI preset indicator, workspace bar, title, and description with expandable info.

### Architecture Fit

This enabler is part of the Configurable Page Layout System capability (CAP-956231) and integrates with:
- Page Migration (ENB-956233) for adopting existing pages
- Page Layout Configuration UI (ENB-956234) for user customization
- Layout Template System (ENB-956235) for preset configurations

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-956232-001 | Wrapper Component | Provide PageLayout component that wraps page content | High | Ready | Approved |
| FR-956232-002 | Required Props | Accept title, quickDescription, and children props | High | Ready | Approved |
| FR-956232-003 | Optional Props | Accept detailedDescription, actions, and override flags | Medium | Ready | Approved |
| FR-956232-004 | Wizard Integration | Render WizardPageNavigation component | High | Ready | Approved |
| FR-956232-005 | AI Preset Display | Render AIPresetIndicator component | High | Ready | Approved |
| FR-956232-006 | Workspace Bar | Render workspace information bar | High | Ready | Approved |
| FR-956232-007 | Page Header | Render title and description with info button | High | Ready | Approved |
| FR-956232-008 | Config Override | Allow pages to hide specific elements via props | Medium | Ready | Approved |

## Non-Functional Requirements

| ID | Name | Type | Requirement | Priority | Status | Approval |
|----|------|------|-------------|----------|--------|----------|
| NFR-956232-001 | Render Performance | Performance | Component renders within 50ms | High | Ready | Approved |
| NFR-956232-002 | Bundle Size | Performance | Component adds < 5KB to bundle | Medium | Ready | Approved |

## Technical Specifications

### Component Interface

```typescript
interface PageLayoutProps {
  title: string;
  quickDescription: string;
  children: React.ReactNode;
  detailedDescription?: string;
  actions?: React.ReactNode;
  hideWizard?: boolean;
  hidePreset?: boolean;
  hideWorkspace?: boolean;
  fullWidth?: boolean;
}
```

### Planned File Location

- **Component**: `web-ui/src/components/PageLayout.tsx`

## Approval History

| Date | Stage | Decision | By | Feedback |
|------|-------|----------|-----|----------|
| 2025-12-23 | Specification | Approved | System | Auto-created during gap analysis |
