-- Migration: Add rejection_comment and phase_approvals table
-- Date: 2025-12-25
-- Purpose: Centralize state management for INTENT phases

-- ============================================================================
-- Add rejection_comment column to entity tables
-- ============================================================================

ALTER TABLE capabilities ADD COLUMN IF NOT EXISTS rejection_comment TEXT;
ALTER TABLE enablers ADD COLUMN IF NOT EXISTS rejection_comment TEXT;
ALTER TABLE story_cards ADD COLUMN IF NOT EXISTS rejection_comment TEXT;

-- ============================================================================
-- Create phase_approvals table for phase-level approval tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS phase_approvals (
    id SERIAL PRIMARY KEY,
    workspace_id VARCHAR(255) NOT NULL,
    phase VARCHAR(50) NOT NULL,  -- 'intent', 'specification', 'ui_design', 'implementation', 'control_loop'
    is_approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP,
    approved_by INTEGER REFERENCES users(id),
    revoked_at TIMESTAMP,
    revoked_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, phase)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_phase_approvals_workspace ON phase_approvals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_phase_approvals_phase ON phase_approvals(phase);

-- ============================================================================
-- Comments for documentation
-- ============================================================================

COMMENT ON TABLE phase_approvals IS 'Tracks phase-level approval status for INTENT workflow stages';
COMMENT ON COLUMN phase_approvals.phase IS 'INTENT workflow stage: intent, specification, ui_design, implementation, control_loop';
COMMENT ON COLUMN phase_approvals.is_approved IS 'Whether the phase has been approved';
COMMENT ON COLUMN phase_approvals.approved_at IS 'Timestamp when phase was approved';
COMMENT ON COLUMN phase_approvals.approved_by IS 'User who approved the phase';
COMMENT ON COLUMN phase_approvals.revoked_at IS 'Timestamp when approval was revoked (if applicable)';
COMMENT ON COLUMN phase_approvals.revoked_by IS 'User who revoked the approval (if applicable)';

COMMENT ON COLUMN capabilities.rejection_comment IS 'Comment provided when capability was rejected';
COMMENT ON COLUMN enablers.rejection_comment IS 'Comment provided when enabler was rejected';
COMMENT ON COLUMN story_cards.rejection_comment IS 'Comment provided when story card was rejected';
