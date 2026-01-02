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
| FR-956232-009 | Full Width Mode | When fullWidth prop is true, remove maxWidth constraint (1400px) and centering margin to allow edge-to-edge content | High | Implemented | Approved |
| FR-956232-010 | Responsive Button Visibility | Action buttons in PageHeader must remain visible when browser window is resized; buttons wrap to next line rather than being clipped | High | Implemented | Approved |

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

### Props Usage Guide

#### `fullWidth` Prop

By default, PageLayout constrains content to `maxWidth: 1400px` with centered alignment. This works well for form-based pages and standard content.

**Use `fullWidth={true}` when:**
- The page contains visual diagrams, maps, or canvases that benefit from edge-to-edge display
- The page has interactive elements that need maximum horizontal space
- The content includes grids or cards that should fill available width

**Example - System Architecture page:**
```tsx
<PageLayout
  fullWidth
  title="System Architecture"
  quickDescription="Visualize and manage your system's capabilities..."
>
  {/* Diagram tabs and capability map use full viewport width */}
</PageLayout>
```

**Pages using `fullWidth`:**
- System Architecture (`System.tsx`) - diagram tabs and capability map require full width
- Ideation Canvas (`Ideation.tsx`) - freeform canvas requires full width
- Storyboard Canvas (`Storyboard.tsx`) - drag-and-drop canvas requires full width
- Story Map (`StoryMap.tsx`) - relationship visualization requires full width

#### `actions` Prop

The `actions` prop accepts React nodes that are rendered in the page header, right-justified on the same line as the title. This provides a consistent location for page-level action buttons across the application.

**UI Consistency Pattern:**
- Action buttons should be passed via `actions` prop, not rendered in page content
- Buttons appear on the same line as the title (right-justified)
- On narrow screens, buttons wrap to the next line (responsive behavior)
- This pattern saves vertical space and provides consistent button placement

**Example - Ideation Canvas page:**
```tsx
<PageLayout
  fullWidth
  title="Ideation Canvas"
  quickDescription="Freeform whiteboard for your ideas"
  actions={
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <Button variant="primary" onClick={handleAddCard}>Add Card</Button>
      <Button variant="primary" onClick={handleAddText}>Add Text</Button>
      <Button variant="primary" onClick={handleAddImage}>Add Image</Button>
    </div>
  }
>
  {/* Page content */}
</PageLayout>
```

**Pages using `actions` prop:**
- Ideation Canvas - Add Card, Add Text, Add Image, Add UI Assets
- Storyboard Canvas - Analyze & Generate, Add Card, UI Assets
- Story Map - Zoom controls, Analyze with AI, Refresh
- System Architecture - Import, AI Analysis, Export buttons

#### Responsive Behavior (FR-956232-010)

The PageHeader component ensures action buttons remain visible on all screen sizes:
- `.page-header__title-row` uses `flex-wrap: wrap` to allow buttons to wrap
- `overflow: hidden` was removed to prevent button clipping
- On medium screens (≤1024px), buttons stack below the title
- On small screens (≤480px), button gaps are reduced for compact display

## Approval History

| Date | Stage | Decision | By | Feedback |
|------|-------|----------|-----|----------|
| 2025-12-23 | Specification | Approved | System | Auto-created during gap analysis |
| 2026-01-01 | Implementation | Documented | Development | Added fullWidth prop usage guide; FR-956232-009 marked Implemented |
| 2026-01-02 | Implementation | Documented | Development | Added actions prop usage guide; FR-956232-010 (responsive button visibility) implemented and documented; updated pages list |
