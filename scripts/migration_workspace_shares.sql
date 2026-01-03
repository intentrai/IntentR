-- IntentR Workspace Sharing Database Migration
-- This script adds workspace sharing tables for granular user-based sharing

-- Create workspace_shares table
CREATE TABLE IF NOT EXISTS workspace_shares (
    id SERIAL PRIMARY KEY,
    workspace_id VARCHAR(255) NOT NULL,
    shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(workspace_id, shared_with_user_id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_workspace_shares_workspace_id
    ON workspace_shares(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_shares_shared_with_user_id
    ON workspace_shares(shared_with_user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_shares_shared_by_user_id
    ON workspace_shares(shared_by_user_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_workspace_shares_updated_at ON workspace_shares;
CREATE TRIGGER update_workspace_shares_updated_at
    BEFORE UPDATE ON workspace_shares
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
