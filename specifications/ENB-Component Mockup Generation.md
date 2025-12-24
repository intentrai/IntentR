# Component Mockup Generation

## Metadata

- **Name**: Component Mockup Generation
- **Type**: Enabler
- **ID**: ENB-958473
- **Capability ID**: CAP-847293
- **Owner**: Development Team
- **Status**: Implemented
- **Approval**: Approved
- **Priority**: High
- **Analysis Review**: Not Required
- **Code Review**: Not Required

## Technical Overview

### Purpose

Enable generation of UI component mockups through the DELM service. Users can select component types (button, card, input, etc.) and configure properties to generate visual mockups.

### Architecture Fit

This enabler is part of the UI Designer capability (CAP-847293) and is implemented within:
- DELM Service Integration (ENB-958471) - Main implementation

**Note**: This functionality is consolidated within ENB-958471 (DELM Service Integration). This document exists for traceability to capability requirements.

## Functional Requirements

| ID | Name | Requirement | Priority | Status | Approval |
|----|------|-------------|----------|--------|----------|
| FR-958473-001 | Component Selection | Allow selection from available component types | High | Implemented | Approved |
| FR-958473-002 | Property Configuration | Configure component-specific properties | High | Implemented | Approved |
| FR-958473-003 | Dimension Settings | Set width and height for generated image | Medium | Implemented | Approved |
| FR-958473-004 | Mockup Generation | Send generation request to DELM | High | Implemented | Approved |
| FR-958473-005 | Result Display | Display generated mockup in preview | High | Implemented | Approved |

## Technical Specifications

### Supported Components

- button, card, input, alert, navbar, avatar, progress, toggle

### API Integration

| Operation | Endpoint | Payload | Response |
|-----------|----------|---------|----------|
| Generate Mockup | POST /generate/mockup | { component_type, props, width, height, format } | { image, data_url, width, height } |

### Implementation Reference

See [ENB-958471 DELM Service Integration](ENB-DELM%20Service%20Integration.md) for full implementation details.

## Approval History

| Date | Stage | Decision | By | Feedback |
|------|-------|----------|-----|----------|
| 2025-12-23 | Discovery | Approved | System | Auto-created during gap analysis |
