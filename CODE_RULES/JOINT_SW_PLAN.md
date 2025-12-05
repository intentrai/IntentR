# JOINT SOFTWARE DEVELOPMENT PLAN
**Version**: 1.0.0
**Last Updated**: December 1, 2025
**Framework**: Unified SAWai-Anvil Methodology

## Overview

This document consolidates the SAWai (Scaled Agile With AI) and Anvil capability-driven frameworks into a single, coherent methodology for AI-assisted software development. It provides clear guidance for Claude Code and human developers to collaborate effectively.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Hierarchy Model](#hierarchy-model)
3. [Simplified State Machine](#simplified-state-machine)
4. [Development Stages](#development-stages)
5. [Manual Approval Process](#manual-approval-process)
6. [Discovery Mode](#discovery-mode)
7. [Error Recovery Paths](#error-recovery-paths)
8. [Conditional Skip Rules](#conditional-skip-rules)
9. [Simplified Documentation](#simplified-documentation)
10. [Templates](#templates)

---

## Core Principles

### 1. Specification Quality First
High-quality specifications drive better AI-generated outcomes. Invest time in clear, detailed specs.

### 2. Human-in-the-Loop Approval
All stage transitions require explicit human approval. AI assists but humans decide.

### 3. Capability-Driven Development
Work is organized around business capabilities that deliver value to users.

### 4. Pragmatic Documentation
Document what matters. Skip what doesn't add value.

### 5. Fail Fast, Recover Gracefully
When errors occur, stop immediately, report clearly, and provide recovery options.

---

## Hierarchy Model

```
Component (System/Application)
    └── Capability (Business Function)
            └── Enabler (Technical Implementation)
                    └── Requirement (Specific Need)
```

### Definitions

| Element | Description | Example |
|---------|-------------|---------|
| **Component** | A logical system or application | "UbeCode Web Application" |
| **Capability** | A high-level business function | "User Authentication" |
| **Enabler** | Technical implementation of a capability | "JWT Token Handler" |
| **Requirement** | Specific functional or non-functional need | "Tokens expire after 24 hours" |

---

## Simplified State Machine

### Four-Stage Workflow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ SPECIFICATION│────▶│  DEFINITION │────▶│   DESIGN    │────▶│  EXECUTION  │
│             │     │             │     │             │     │             │
│ What & Why  │     │ How (High)  │     │ How (Detail)│     │ Build & Test│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
   [APPROVE]           [APPROVE]           [APPROVE]           [COMPLETE]
```

### Stage Descriptions

| Stage | Purpose | Key Activities | Output |
|-------|---------|----------------|--------|
| **Specification** | Define WHAT and WHY | Identify capabilities, business value, success criteria | Capability specs |
| **Definition** | Define HOW (high-level) | Identify enablers, dependencies, technical approach | Enabler specs |
| **Design** | Define HOW (detailed) | Create technical specs, APIs, data models, diagrams | Technical designs |
| **Execution** | BUILD and TEST | Implement code, write tests, integrate | Working software |

### State Values

Each element (Capability, Enabler, Requirement) has a simple state:

| State | Meaning |
|-------|---------|
| `draft` | Work in progress, not ready for review |
| `pending_approval` | Ready for human review and approval |
| `approved` | Human approved, ready to proceed |
| `in_progress` | Currently being worked on |
| `completed` | Finished successfully |
| `rejected` | Human rejected, needs revision |
| `blocked` | Cannot proceed due to dependency or issue |
| `skipped` | Conditionally skipped (with justification) |

### State Transitions

```
                    ┌──────────────┐
                    │    draft     │
                    └──────┬───────┘
                           │ submit for review
                           ▼
                    ┌──────────────┐
          ┌─────────│pending_approval│─────────┐
          │         └──────────────┘           │
          │ reject                      approve│
          ▼                                    ▼
   ┌──────────────┐                    ┌──────────────┐
   │   rejected   │                    │   approved   │
   └──────┬───────┘                    └──────┬───────┘
          │ revise                            │ start work
          │                                   ▼
          │                            ┌──────────────┐
          └───────────────────────────▶│ in_progress  │
                                       └──────┬───────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
             ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
             │   blocked    │          │  completed   │          │   skipped    │
             └──────────────┘          └──────────────┘          └──────────────┘
```

---

## Development Stages

### Stage 1: Specification

**Purpose:** Define what needs to be built and why it matters.

**Activities:**
1. Identify business capabilities needed
2. Document business value and success criteria
3. Identify stakeholders and users
4. Define high-level acceptance criteria

**AI Role:** Assist in identifying capabilities, drafting specifications, suggesting success criteria.

**Human Role:** Validate business value, approve capability definitions.

**Exit Criteria:**
- [ ] All capabilities identified and documented
- [ ] Business value clearly articulated
- [ ] Success criteria defined
- [ ] **HUMAN APPROVAL OBTAINED**

---

### Stage 2: Definition

**Purpose:** Define the technical approach at a high level.

**Activities:**
1. Break capabilities into enablers
2. Identify technical dependencies
3. Define integration points
4. Estimate complexity and effort

**AI Role:** Suggest enabler breakdown, identify dependencies, create initial enabler specs.

**Human Role:** Validate technical approach, approve enabler definitions.

**Exit Criteria:**
- [ ] All enablers identified for each capability
- [ ] Dependencies mapped
- [ ] Technical approach validated
- [ ] **HUMAN APPROVAL OBTAINED**

---

### Stage 3: Design

**Purpose:** Create detailed technical specifications with AI review.

**Activities:**
1. Design APIs and interfaces with request/response examples
2. Create data models with constraints
3. Design component interactions
4. Document edge cases and error handling
5. **AI Specification Review** (before approval)

**AI Role:** Generate technical specs, create diagrams, define APIs, **review specifications for ambiguities**.

**Human Role:** Review technical design, resolve ambiguities identified by AI, approve implementation approach.

**AI Specification Review Checklist:**
Before requesting human approval, AI must verify:
- [ ] All requirements have input/output examples
- [ ] Edge cases are documented
- [ ] Error handling is specified
- [ ] No conflicting requirements
- [ ] Patterns match existing codebase conventions
- [ ] Performance requirements are testable

**Exit Criteria:**
- [ ] Technical specifications complete with examples
- [ ] APIs defined with request/response schemas
- [ ] Data models documented with constraints
- [ ] Edge cases documented
- [ ] AI review completed - no ambiguities
- [ ] **HUMAN APPROVAL OBTAINED**

---

### Stage 4: Execution

**Purpose:** Build, test, and deliver working software.

**Activities:**
1. Implement code following design specs
2. Write and run tests
3. Integrate with existing systems
4. Document as needed

**AI Role:** Generate code, write tests, assist with debugging.

**Human Role:** Review code, validate functionality, approve completion.

**Exit Criteria:**
- [ ] Code implemented and working
- [ ] Tests passing
- [ ] Integration verified
- [ ] **HUMAN APPROVAL TO MARK COMPLETE**

---

## Manual Approval Process

### Approval Gates

Each stage transition requires explicit human approval:

```
Specification ──[APPROVE]──▶ Definition ──[APPROVE]──▶ Design ──[APPROVE]──▶ Execution ──[COMPLETE]──▶ Done
```

### How Approval Works

1. **AI completes stage work** and sets state to `pending_approval`
2. **System notifies human** that approval is needed
3. **Human reviews** the work product
4. **Human decides:**
   - **Approve** → State changes to `approved`, proceed to next stage
   - **Reject** → State changes to `rejected`, AI revises based on feedback
   - **Request Changes** → State stays `pending_approval`, specific changes noted

### Approval UI Flow

```
┌────────────────────────────────────────────────────────────┐
│                    APPROVAL REQUIRED                        │
├────────────────────────────────────────────────────────────┤
│ Stage: Definition                                          │
│ Element: CAP-123456 - User Authentication                  │
│                                                            │
│ Summary of Changes:                                        │
│ • Added 3 enablers: JWT Handler, OAuth Integration, MFA    │
│ • Identified 2 external dependencies                       │
│ • Estimated complexity: Medium                             │
│                                                            │
│ [View Full Details]                                        │
│                                                            │
│ ┌──────────┐  ┌──────────┐  ┌────────────────┐            │
│ │ APPROVE  │  │  REJECT  │  │ REQUEST CHANGES│            │
│ └──────────┘  └──────────┘  └────────────────┘            │
│                                                            │
│ Feedback (optional for approve, required for reject):      │
│ ┌────────────────────────────────────────────────────────┐│
│ │                                                        ││
│ └────────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────────┘
```

### Approval Rules for AI

1. **NEVER auto-approve** - Only humans can approve
2. **NEVER bypass approval** - All stage transitions require approval
3. **ALWAYS notify** - Make approval needs visible
4. **ALWAYS wait** - Do not proceed until approval received
5. **ALWAYS record** - Log all approvals with timestamp and approver

### Approval Data Structure

```json
{
  "approval_id": "APR-789012",
  "element_type": "capability",
  "element_id": "CAP-123456",
  "stage": "definition",
  "status": "pending_approval",
  "submitted_at": "2025-12-01T10:30:00Z",
  "submitted_by": "claude-code",
  "reviewed_at": null,
  "reviewed_by": null,
  "decision": null,
  "feedback": null
}
```

---

## Discovery Mode

### What is Discovery Mode?

Discovery Mode is a special operational mode used when:
- You have **existing source code** but **no documentation**
- The goal is to **read and analyze** code to **generate accurate documentation**
- **No code modifications** are made

### When to Use Discovery

| Scenario | Use Discovery? |
|----------|----------------|
| Analyzing existing codebase for documentation | YES |
| Reverse-engineering legacy application | YES |
| Understanding third-party code | YES |
| Building new features | NO |
| Modifying existing code | NO |
| Fixing bugs | NO |

### Discovery Process

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   ANALYZE   │────▶│   IDENTIFY  │────▶│  DOCUMENT   │────▶│   REVIEW    │
│    Code     │     │ Capabilities│     │   Specs     │     │   Output    │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

**Phase 1: Analyze Code**
- Read directory structure
- Identify entry points
- Map dependencies
- Understand data flow

**Phase 2: Identify Capabilities**
- Extract business functions from code
- Map code components to capabilities
- Identify enablers within capabilities

**Phase 3: Document Specs**
- Create capability documents
- Create enabler documents
- Document existing state (not planned state)

**Phase 4: Review Output**
- Human reviews generated documentation
- Validates accuracy against actual code
- Approves or requests corrections

### Discovery Rules

1. **READ-ONLY** - Never modify source code during discovery
2. **ACCURATE** - Document what IS, not what SHOULD BE
3. **COMPLETE** - Capture all significant capabilities
4. **BOUNDED** - Stay within specified directory scope
5. **STATUS = IMPLEMENTED** - Discovered items are marked as already implemented

### Discovery Document Settings

When creating documents during Discovery:

| Field | Value | Reason |
|-------|-------|--------|
| State | `completed` | Code already exists |
| Approval | `approved` | Documenting existing reality |
| Stage | `execution` | Already built |

---

## Error Recovery Paths

### Error Categories

| Category | Description | Recovery Path |
|----------|-------------|---------------|
| **Validation Error** | Pre-conditions not met | Fix conditions, retry |
| **Approval Rejection** | Human rejected work | Revise based on feedback |
| **Dependency Block** | Waiting on external item | Unblock or skip with justification |
| **Implementation Failure** | Code doesn't work | Debug, fix, or rollback |
| **Timeout** | Approval not received in time | Escalate or pause |

### Recovery Workflows

#### Rejection Recovery

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  REJECTED   │────▶│   REVISE    │────▶│  RESUBMIT   │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    Read feedback
                    Make changes
                    Update state to
                    pending_approval
```

#### Blocked Recovery

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   BLOCKED   │────▶│  EVALUATE   │────▶│   DECIDE    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
             ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
             │Wait for      │          │ Skip with    │          │ Escalate to  │
             │dependency    │          │ justification│          │ human        │
             └──────────────┘          └──────────────┘          └──────────────┘
```

#### Implementation Failure Recovery

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   FAILED    │────▶│  DIAGNOSE   │────▶│   ACTION    │
│             │     │             │     │             │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                    ┌──────────────────────────┼──────────────────────────┐
                    │                          │                          │
                    ▼                          ▼                          ▼
             ┌──────────────┐          ┌──────────────┐          ┌──────────────┐
             │ Fix and      │          │ Rollback     │          │ Request help │
             │ retry        │          │ changes      │          │ from human   │
             └──────────────┘          └──────────────┘          └──────────────┘
```

### Error Response Format

When an error occurs, AI must respond with:

```markdown
## ERROR: [Error Type]

**Element:** [ID and Name]
**Stage:** [Current Stage]
**State:** [Current State]

### What Happened
[Clear description of the error]

### Why It Happened
[Root cause if known]

### Recovery Options
1. [Option 1 with instructions]
2. [Option 2 with instructions]
3. [Option 3 with instructions]

### Recommended Action
[AI's recommendation]

### To Proceed
[What the human needs to do]
```

---

## Conditional Skip Rules

### When Skipping is Allowed

Skipping is permitted when:

| Condition | Skip Allowed | Requires |
|-----------|--------------|----------|
| Element not applicable to this project | YES | Justification |
| Dependency will never be available | YES | Human approval |
| Lower priority than available resources | YES | Human approval |
| Already implemented elsewhere | YES | Reference to existing |
| Explicitly marked as optional | YES | Justification |

### When Skipping is NOT Allowed

| Condition | Skip Allowed | Reason |
|-----------|--------------|--------|
| Approval not yet received | NO | Must wait for approval |
| Pre-conditions not evaluated | NO | Must evaluate first |
| Core functionality | NO | Essential to system |
| Security requirements | NO | Non-negotiable |
| Human explicitly said "don't skip" | NO | Human override |

### Skip Process

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  EVALUATE   │────▶│  JUSTIFY    │────▶│   RECORD    │
│  Skip Need  │     │  Skip       │     │   Skip      │
└─────────────┘     └─────────────┘     └─────────────┘
```

1. **Evaluate:** Determine if skip conditions are met
2. **Justify:** Document why skip is appropriate
3. **Record:** Update state to `skipped` with justification

### Skip Documentation

When skipping an element:

```json
{
  "element_id": "ENB-654321",
  "state": "skipped",
  "skip_reason": "functionality_exists_elsewhere",
  "skip_justification": "This enabler duplicates functionality already provided by the existing AuthService at /internal/auth/service.go",
  "skip_approved_by": "human_user",
  "skip_approved_at": "2025-12-01T14:30:00Z",
  "reference": "/internal/auth/service.go"
}
```

### Conditional Skip Syntax in Workflow

```
IF [condition] THEN
  SKIP [element] WITH justification "[reason]"
  REQUIRE approval IF [condition requires human approval]
ELSE
  PROCEED normally
END IF
```

**Example:**

```
IF enabler.type == "ui_component" AND project.has_no_frontend THEN
  SKIP enabler WITH justification "Project has no frontend; UI component not applicable"
  REQUIRE approval IF enabler.priority == "high"
ELSE
  PROCEED normally
END IF
```

---

## Simplified Documentation

### Documentation Philosophy

**Document what matters. Skip what doesn't add value.**

### Required vs Optional Documentation

| Document Type | When Required | When Optional |
|---------------|---------------|---------------|
| Capability spec | Always | Never |
| Enabler spec | Always | Never |
| API spec | When APIs exist | No APIs |
| Data model | When data is persisted | Stateless |
| Sequence diagram | Complex multi-step flows | Simple CRUD |
| Class diagram | Complex OOP design | Simple functions |
| State diagram | Stateful behavior | Stateless |
| Dependency diagram | Multiple dependencies | Single dependency |

### Minimal Viable Documentation

For each capability, at minimum document:

```markdown
# [Capability Name]

## Metadata
- **ID**: CAP-XXXXXX
- **State**: [state]
- **Stage**: [stage]

## Purpose
[One paragraph: what it does and why it matters]

## Enablers
| ID | Name | State |
|----|------|-------|
| ENB-XXXXXX | [Name] | [state] |

## Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

For each enabler, at minimum document:

```markdown
# [Enabler Name]

## Metadata
- **ID**: ENB-XXXXXX
- **Capability**: CAP-XXXXXX
- **State**: [state]
- **Stage**: [stage]

## Purpose
[One paragraph: what it does technically]

## Requirements
| ID | Requirement | Priority | State |
|----|-------------|----------|-------|
| REQ-XXXXXX | [Description] | [H/M/L] | [state] |
```

### When to Add More Documentation

Add additional documentation when:

| Add This | When |
|----------|------|
| API spec | Building or consuming APIs |
| Data model | Persisting or transforming data |
| Sequence diagram | 3+ components interact |
| Class diagram | 5+ classes with relationships |
| State diagram | Element has 3+ states |
| Dependency diagram | 3+ external dependencies |

### Documentation Anti-Patterns

AVOID:
- Documenting obvious code
- Creating diagrams nobody will read
- Duplicating information across documents
- Documenting implementation details that change frequently
- Creating templates with empty sections

---

## Templates

### Capability Template (Enhanced for AI)

```markdown
# [Capability Name]

## Metadata
- **ID**: CAP-XXXXXX
- **Component**: [Component Name]
- **Owner**: [Team/Person]
- **State**: draft | pending_approval | approved | in_progress | completed | rejected | blocked | skipped
- **Stage**: specification | definition | design | execution
- **Priority**: high | medium | low
- **Created**: [Date]
- **Updated**: [Date]

## Business Context

### Problem Statement
[What specific problem does this capability solve? Be concrete.]

### Value Proposition
[Why does this matter to users/business? Quantify if possible.]

### Success Metrics
- [Metric 1: e.g., "Reduce login time by 50%"]
- [Metric 2: e.g., "Support 10,000 concurrent users"]

## User Perspective

### Primary Persona
[Who benefits most from this capability?]

### User Journey (Before/After)
**Before**: [Current painful experience]
**After**: [Improved experience with this capability]

### User Scenarios
1. **Scenario 1**: [Concrete example with specific inputs/outputs]
2. **Scenario 2**: [Another concrete example]
3. **Scenario 3**: [Edge case scenario]

## Boundaries

### In Scope
- [Explicitly what IS included]

### Out of Scope
- [Explicitly what is NOT included]

### Assumptions
- [What we're assuming to be true]

### Constraints
- [Technical, business, or regulatory limits]

## Enablers
| ID | Name | Purpose | State |
|----|------|---------|-------|
| ENB-XXXXXX | [Name] | [One-line purpose] | [state] |

## Dependencies
| Type | ID | Name | Status |
|------|-----|------|--------|
| upstream | CAP-XXXXXX | [Name] | [status] |
| downstream | CAP-XXXXXX | [Name] | [status] |

## Acceptance Criteria
- [ ] [Specific, testable criterion with verification method]
- [ ] [Another criterion]

## Approval History
| Date | Stage | Decision | By | Feedback |
|------|-------|----------|-----|----------|
| [Date] | [stage] | approved/rejected | [name] | [feedback] |
```

### Enabler Template (Enhanced for AI)

```markdown
# [Enabler Name]

## Metadata
- **ID**: ENB-XXXXXX
- **Capability**: CAP-XXXXXX - [Capability Name]
- **Owner**: [Team/Person]
- **State**: draft | pending_approval | approved | in_progress | completed | rejected | blocked | skipped
- **Stage**: specification | definition | design | execution
- **Priority**: high | medium | low
- **Created**: [Date]
- **Updated**: [Date]

## Technical Context

### Purpose
[One paragraph: what this enabler does technically]

### Architecture Fit
[How does this fit into the existing system architecture?]

### Existing Patterns to Follow
- [Pattern 1: e.g., "Use repository pattern from /internal/auth/repository.go"]
- [Pattern 2: e.g., "Follow error handling style in /pkg/errors"]

## Requirements

### Functional Requirements
| ID | Requirement | Input Example | Output Example | Edge Cases |
|----|-------------|---------------|----------------|------------|
| REQ-XXXXXX | [Description] | `{"user": "john"}` | `{"success": true}` | null input, empty string |

### Non-Functional Requirements
| ID | Requirement | Target | How to Verify |
|----|-------------|--------|---------------|
| REQ-XXXXXX | Response time | <200ms p95 | Load test |

## API Contract (if applicable)

### Endpoint
`POST /api/v1/resource`

### Request Schema
```json
{
  "field1": "string (required)",
  "field2": "number (optional, default: 0)"
}
```

### Response Schema (Success)
```json
{
  "id": "string",
  "created_at": "ISO8601 datetime"
}
```

### Error Responses
| Status | Condition | Response |
|--------|-----------|----------|
| 400 | Invalid input | `{"error": "field1 is required"}` |
| 401 | Not authenticated | `{"error": "unauthorized"}` |

## Data Model (if applicable)
```
Entity: [Name]
├── id: UUID (PK)
├── field1: string (required, max 255)
├── created_at: timestamp
└── updated_at: timestamp
```

## Edge Cases and Error Handling
| Scenario | Expected Behavior | Test Case |
|----------|-------------------|-----------|
| Null input | Return 400 error | `test_null_input()` |
| Duplicate entry | Return 409 conflict | `test_duplicate()` |

## Testing Strategy
- [ ] Unit: Test with valid input
- [ ] Unit: Test with invalid input
- [ ] Integration: Test API endpoint
- [ ] Edge case: [Specific edge case]

## Implementation Hints

### Suggested Approach
[High-level approach recommendation]

### Reference Implementations
- [Link to similar code in codebase]

## Dependencies
| Type | Description |
|------|-------------|
| Internal | [Internal dependencies] |
| External | [External services/APIs] |

## Approval History
| Date | Stage | Decision | By | Feedback |
|------|-------|----------|-----|----------|
| [Date] | [stage] | approved/rejected | [name] | [feedback] |
```

### ID Generation

Use 6-digit numeric IDs with prefixes:

| Type | Format | Example |
|------|--------|---------|
| Capability | CAP-XXXXXX | CAP-123456 |
| Enabler | ENB-XXXXXX | ENB-654321 |
| Requirement | REQ-XXXXXX | REQ-789012 |
| Approval | APR-XXXXXX | APR-345678 |

Generate IDs using timestamp + random:
```
ID = (last 4 digits of timestamp) * 100 + (random 0-99)
```

---

## Quick Reference

### Workflow Summary

```
SPECIFICATION ──[approve]──▶ DEFINITION ──[approve]──▶ DESIGN ──[approve]──▶ EXECUTION ──[complete]──▶ DONE
```

### State Reference

| State | Can Transition To |
|-------|-------------------|
| draft | pending_approval |
| pending_approval | approved, rejected |
| approved | in_progress |
| in_progress | completed, blocked, skipped |
| rejected | draft (for revision) |
| blocked | in_progress (when unblocked), skipped |
| completed | (terminal) |
| skipped | (terminal) |

### AI Behavior Rules

1. **NEVER** auto-approve anything
2. **ALWAYS** wait for human approval at stage gates
3. **ALWAYS** provide clear error messages with recovery options
4. **MAY** skip elements with justification and approval
5. **MUST** document all decisions and state changes
6. **MUST** review specifications for ambiguities before requesting approval in Design stage
7. **MUST** include input/output examples in all requirements
8. **MUST** document edge cases before implementation

### Key Principles

1. **No Epics** - Capabilities and Enablers are sufficient with AI assistance
2. **Invest in Specifications** - AI quality depends on specification quality
3. **Examples Over Descriptions** - Concrete inputs/outputs beat abstract requirements
4. **AI Reviews First** - Catch ambiguities before implementation
5. **Human Approvals at Gates** - AI assists, humans decide

---

**Document Version**: 2.0.0
**Framework**: Unified SAWai-Anvil (Epic-free)
**Last Updated**: 2025-12-01
**Maintained By**: Development Team
