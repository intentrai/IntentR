# Ideation Canvas Feature

## Overview
The Ideation Canvas is a freeform digital workspace that allows users to capture, organize, and develop ideas visually before moving them into structured storyboards.

**Generated**: 2025-11-14
**Version**: 1.0
**Status**: Implemented

## Feature Summary

The Ideation Canvas provides a flexible, infinite canvas where users can:
- Add text blocks anywhere on the canvas
- Upload and position images
- Tag items for organization and cross-referencing
- Use quick templates to structure thinking
- Zoom and pan for large idea maps
- Persist all work within workspace context

## User Stories

### Primary User Stories

**US-1: As a product designer, I want to capture raw ideas in a freeform space so that I can brainstorm without constraints**
- Given I'm on the Ideation page
- When I click "Add Text" or use a quick template
- Then a text card appears on the canvas that I can edit and position

**US-2: As a UX researcher, I want to add images to my ideation board so that I can include visual references**
- Given I'm on the Ideation page
- When I click "Add Image" and upload a file
- Then the image appears on the canvas and I can drag it to position it

**US-3: As a project manager, I want to tag ideation items so that I can reference them in storyboards**
- Given I have text or image blocks on the canvas
- When I select a block and add tags
- Then those tags appear on the block and are available in storyboard card creation

**US-4: As a team lead, I want quick templates for common ideation prompts so that I can structure brainstorming efficiently**
- Given I'm on the Ideation page
- When I click a quick template button
- Then a pre-filled text card appears with the prompt

## Technical Architecture

### Component Structure

```
Ideation.tsx
├── PageLayout (with fullWidth)
│   ├── Title & Quick Description
│   └── Actions (right-justified in title row):
│       ├── Add Card button
│       ├── Add Text button
│       ├── Add Image button
│       └── Add UI Assets button
├── Helper Toolbar
│   └── Quick Template Buttons
├── Canvas Section
│   ├── Infinite Canvas (10000x10000px)
│   ├── Text Blocks (draggable, editable)
│   ├── Image Blocks (draggable, taggable)
│   └── Zoom Controls
└── Sidebar (conditional)
    ├── Item Details
    ├── Tag Management
    └── Delete Button
```

**Note**: Action buttons are passed to PageLayout via the `actions` prop, placing them on the same line as the title (right-justified) for UI consistency across the application.

### Data Model

#### TextBlock Interface
```typescript
interface TextBlock {
  id: string;              // Unique identifier
  content: string;         // Text content
  x: number;              // X position on canvas
  y: number;              // Y position on canvas
  tags: string[];         // Associated tags
  width: number;          // Block width (300px default)
  height: number;         // Block height (150px default)
}
```

#### ImageBlock Interface
```typescript
interface ImageBlock {
  id: string;              // Unique identifier
  imageUrl: string;        // Base64 or URL
  x: number;              // X position on canvas
  y: number;              // Y position on canvas
  tags: string[];         // Associated tags
  width: number;          // Block width (300px default)
  height: number;         // Block height (300px default)
}
```

#### IdeationData Interface
```typescript
interface IdeationData {
  textBlocks: TextBlock[];
  imageBlocks: ImageBlock[];
}
```

### State Management

**Workspace Context Integration**:
- Ideation data stored in `workspace.ideation`
- Auto-saves on any change to blocks
- Loads from workspace on mount
- Persists to localStorage via WorkspaceContext

**Local Component State**:
- `textBlocks`: Array of text blocks
- `imageBlocks`: Array of image blocks
- `zoom`: Current zoom level (0.1 to 3.0)
- `pan`: Canvas pan position {x, y}
- `selectedItemId`: Currently selected block ID
- `draggingItem`: Currently dragging block reference

## Features

### 1. Freeform Canvas

**Infinite Grid**: 10,000 x 10,000 pixel canvas
- Grid background (20px cells)
- Smooth scrolling and panning
- Transform-based rendering for performance

**Zoom Control**:
- Range: 10% to 300%
- Mouse wheel zoom
- Zoom buttons (+, -, reset)
- Live zoom percentage display

**Pan Control**:
- Shift + drag to pan
- Middle mouse button to pan
- Touch-friendly on mobile

### 2. Text Blocks

**Creation**:
- Click "Add Text" button
- Click quick template buttons
- Default position: 200,200 with smart offset

**Editing**:
- Double-click to edit
- Textarea-based editor
- Click outside or blur to save
- Pre-wrap text with word wrap

**Styling**:
- Yellow background (systemYellow with 15% opacity)
- Yellow border (2px solid)
- 12px border-radius
- Shadow on hover
- Blue highlight when selected

**Size**: 300px width × 150px height (default)

### 3. Image Blocks

**Upload**:
- Click "Add Image" button
- File input (accept: image/*)
- FileReader API for base64 encoding
- Default position: 250,250

**Display**:
- White background
- Gray border (systemGray4)
- 12px border-radius
- Object-fit: cover
- Shadow on hover

**Size**: 300px × 300px (default)

### 4. Tagging System

**Tag Management**:
- Select block to open sidebar
- Add tag via input + Enter or button
- Remove tag with × button
- Tags display as blue badges on blocks

**Tag Display**:
- Blue background (systemBlue)
- White text
- 6px border-radius
- 13px font size
- 500 weight

**Cross-Reference**:
- Tags available in Storyboard card dialog
- Multi-select interface for association
- Enables traceability from ideation to implementation

### 5. Quick Templates

**Template Buttons**:
1. 💡 What is the idea?
2. ⚠️ What is the problem/challenge?
3. ✨ What is the solution?
4. ⭐ What is the value to user?

**Behavior**:
- Click creates pre-filled text card
- Smart positioning (offset by existing blocks)
- Immediate editing available
- Same tagging capabilities as manual text blocks

**Styling**:
- Gray toolbar background (systemGray6)
- White button background
- Blue on hover with lift effect
- Emoji icons for visual identification

## User Interface

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ Ideation Canvas                    [Add Card][Add Text][Add Image] │
│ Freeform whiteboard for your ideas              [Add UI Assets]    │
├─────────────────────────────────────────────────────────────────────┤
│ Quick Templates:                                                     │
│ [💡 Idea] [⚠️ Problem] [✨ Solution] [⭐ Value]                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Infinite Canvas (10000x10000)                                      │
│  ┌────────┐  ┌────────┐                                             │
│  │ Text   │  │ Image  │                                             │
│  │ Block  │  │ Block  │                                             │
│  │ [tag]  │  │ [tag]  │                                             │
│  └────────┘  └────────┘                                             │
│                                                                      │
│                                              [Zoom: 100%]           │
│                                              [- + ⟲]                │
└─────────────────────────────────────────────────────────────────────┘
```

**UI Consistency Note**: Buttons are positioned in the page header row (same line as title) via PageLayout's `actions` prop, following the application-wide pattern for action button placement.

### Apple HIG Compliance

**Colors**:
- systemBackground: Canvas and blocks
- systemGray6: Grid and toolbar
- systemYellow: Text block highlight
- systemBlue: Tags and active states
- systemGray4/5: Borders

**Typography**:
- 28px, 700 weight: Page title
- 15px, 400 weight: Subtitle
- 15px, 500 weight: Block content
- 13px, 600 weight: Toolbar labels
- 11px, 500 weight: Tags

**Spacing** (8pt grid):
- 4px: Tight gaps
- 8px: Standard gaps
- 12px: Component spacing
- 16px: Section padding
- 24px: Page padding

**Interactions**:
- 0.15s ease transitions
- Hover lift effects
- Shadow depth on interaction
- Smooth drag and drop

## Workflows

### Basic Ideation Flow

1. Navigate to Ideation page
2. Click quick template or "Add Text"
3. Edit text content (double-click)
4. Add tags for organization
5. Position blocks by dragging
6. Add images for visual context
7. Zoom out to see full ideation map
8. Tags auto-save to workspace

### Ideation to Storyboard Flow

1. Create ideation blocks with tags
2. Tag key concepts (e.g., "user-flow", "mvp")
3. Navigate to Storyboard page
4. Create or edit story card
5. Select ideation tags from dialog
6. Tags create traceability link
7. Export storyboard to markdown (includes tag references)

## Integration Points

### Workspace Context
- **File**: `src/context/WorkspaceContext.tsx`
- **Interface**: Added `ideation?: IdeationData` to Workspace
- **Methods**: `updateWorkspace()` for persistence

### Storyboard Integration
- **File**: `src/pages/Storyboard.tsx`
- **Function**: `getAllIdeationTags()` extracts tags
- **UI**: Tag selection in card dialog
- **Display**: Tags shown as badges on cards

### Navigation
- **File**: `src/App.tsx`
- **Route**: `/ideation`
- **Icon**: ◐ (half circle)
- **Position**: Second item (after Dashboard)

## Technical Implementation

### Key Files

**Component**: `src/pages/Ideation.tsx` (587 lines)
- React functional component
- Canvas rendering with transform
- Drag and drop implementation
- Tag management UI

**Context**: `src/context/WorkspaceContext.tsx`
- TextBlock, ImageBlock, IdeationData interfaces
- Workspace ideation field
- Persistence layer

**Routes**: `src/App.tsx`
- Ideation navigation item
- Route configuration

**Exports**: `src/pages/index.ts`
- Component exports

### Dependencies

- React 19
- react-router-dom (navigation)
- WorkspaceContext (state management)
- FileReader API (image upload)

### Performance Considerations

**Canvas Optimization**:
- CSS transforms for zoom/pan (GPU accelerated)
- Absolute positioning for blocks
- Lazy rendering (no virtualization needed for typical use)

**State Updates**:
- Debounced workspace saves
- Controlled drag updates
- Efficient re-renders

## Testing Scenarios

### Functional Tests

1. **Text Block Creation**
   - Click "Add Text" → Block appears
   - Click template → Pre-filled block appears
   - Double-click → Edit mode activates
   - Edit and blur → Content saves

2. **Image Block Creation**
   - Click "Add Image" → File picker opens
   - Select image → Block appears with preview
   - Drag block → Position updates

3. **Tagging**
   - Select block → Sidebar opens
   - Add tag → Badge appears on block
   - Add tag → Tag available in storyboard
   - Remove tag → Badge disappears

4. **Canvas Controls**
   - Scroll wheel → Zoom in/out
   - Shift+drag → Pan canvas
   - Click zoom buttons → View changes
   - Click reset → Returns to 100%, 0,0

5. **Persistence**
   - Create blocks → Refresh → Blocks persist
   - Switch workspace → Different ideation
   - Edit block → Auto-saves

### Edge Cases

1. Empty canvas state
2. Maximum zoom (300%)
3. Minimum zoom (10%)
4. Large number of blocks (50+)
5. Very long text content
6. Large image files
7. Special characters in tags
8. Duplicate tag prevention

## Accessibility

- Keyboard navigation for buttons
- Focus indicators on interactive elements
- Alt text for images
- ARIA labels for controls
- High contrast mode support

## Future Enhancements

### Potential Features

1. **Collaboration**
   - Real-time multi-user editing
   - User cursors and selection
   - Change history/undo

2. **Advanced Organization**
   - Folders/groups for blocks
   - Color-coding system
   - Block linking/connections

3. **Export Options**
   - PDF export
   - Image snapshot
   - Markdown export

4. **Templates**
   - Save custom templates
   - Template library
   - Import templates

5. **AI Integration**
   - Auto-tagging suggestions
   - Content summarization
   - Idea generation

## Success Metrics

1. **Usage**: Number of ideation sessions per user
2. **Engagement**: Average blocks created per session
3. **Tag Adoption**: Percentage of blocks with tags
4. **Storyboard Link**: Tags referenced in storyboards
5. **Template Usage**: Quick template click rate

## Conclusion

The Ideation Canvas provides a flexible, intuitive space for capturing and organizing ideas before structured development. Its integration with the storyboarding system creates a seamless workflow from initial concept to implementation planning, while maintaining full traceability through the tagging system.
