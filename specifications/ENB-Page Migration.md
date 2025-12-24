# Page Migration

## Metadata

- **Name**: Page Migration
- **Type**: Enabler
- **ID**: ENB-956233
- **Capability ID**: CAP-956231
- **Owner**: Development Team
- **Status**: Ready for Implementation
- **Approval**: Approved
- **Priority**: High
- **Analysis Review**: Not Required
- **Code Review**: Not Required

## Technical Overview

### Purpose

Migrate all 27 non-exempt pages in the IntentR application to use the PageLayout component. This ensures consistent header structure across all application pages.

### Architecture Fit

This enabler is part of the Configurable Page Layout System capability (CAP-956231) and depends on:
- PageLayout Component (ENB-956232) for the wrapper component

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-956233-001 | PageHeader Pages | Migrate 7 pages using PageHeader | High | Ready | Approved |
| FR-956233-002 | AIPreset Pages | Migrate 4 pages needing AIPreset | High | Ready | Approved |
| FR-956233-003 | Wizard Pages | Migrate 9 pages needing Wizard navigation | High | Ready | Approved |
| FR-956233-004 | Workspace Pages | Migrate 4 pages needing workspace bar | High | Ready | Approved |
| FR-956233-005 | Full Migration Pages | Migrate 3 pages needing all components | High | Ready | Approved |
| FR-956233-006 | Backward Compatibility | Ensure no functional regressions | High | Ready | Approved |

## Pages to Migrate

### Needs PageHeader Conversion (7)
- Ideation.tsx, Storyboard.tsx, System.tsx, UIDesigner.tsx, UIFramework.tsx, UIStyles.tsx, Run.tsx

### Needs AIPreset + Full Migration (4)
- Enablers.tsx, Testing.tsx, StoryMap.tsx, TestingApproval.tsx

### Needs Wizard + Full Migration (9)
- ConceptionApproval.tsx, DefinitionApproval.tsx, DesignApproval.tsx, ImplementationApproval.tsx, Features.tsx, Integrations.tsx, Settings.tsx, AIChat.tsx, Analyze.tsx

### Needs Workspace via PageHeader (4)
- AIPrinciples.tsx, Capabilities.tsx, Designs.tsx, Vision.tsx

### Needs ALL Components (3)
- Workspaces.tsx, DataCollection.tsx, Admin.tsx

### Exempt Pages (7)
- Login.tsx, GoogleCallback.tsx, Welcome.tsx, Dashboard.tsx, WorkspaceOverview.tsx, LearnINTENT.tsx, DesignsOld.tsx

## Technical Specifications

### Migration Pattern

```typescript
// Before
export function SomePage() {
  return (
    <div>
      <WizardPageNavigation />
      <AIPresetIndicator />
      <PageHeader title="Page" />
      {/* content */}
    </div>
  );
}

// After
export function SomePage() {
  return (
    <PageLayout title="Page" quickDescription="Description">
      {/* content */}
    </PageLayout>
  );
}
```

## Approval History

| Date | Stage | Decision | By | Feedback |
|------|-------|----------|-----|----------|
| 2025-12-23 | Specification | Approved | System | Auto-created during gap analysis |
