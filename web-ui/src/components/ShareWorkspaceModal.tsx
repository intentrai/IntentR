import React, { useState, useEffect, useCallback } from 'react';
import { Button, Alert } from './index';
import { authClient } from '../api/client';

// Types for workspace sharing
interface ShareableUser {
  id: number;
  email: string;
  name: string;
}

interface WorkspaceShare {
  id: number;
  workspaceId: string;
  sharedWithUserId: number;
  sharedWithUserEmail: string;
  sharedWithUserName: string;
  sharedByUserId: number;
  createdAt: string;
  updatedAt: string;
}

interface ShareWorkspaceModalProps {
  isOpen: boolean;
  workspaceId: string;
  workspaceName: string;
  onClose: () => void;
  onSharesUpdated?: (shares: WorkspaceShare[]) => void;
}

export const ShareWorkspaceModal: React.FC<ShareWorkspaceModalProps> = ({
  isOpen,
  workspaceId,
  workspaceName,
  onClose,
  onSharesUpdated,
}) => {
  const [users, setUsers] = useState<ShareableUser[]>([]);
  const [currentShares, setCurrentShares] = useState<WorkspaceShare[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users and current shares when modal opens
  const fetchData = useCallback(async () => {
    if (!isOpen || !workspaceId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch shareable users and current shares in parallel
      const [usersResponse, sharesResponse] = await Promise.all([
        authClient.get<ShareableUser[]>('/api/users/shareable'),
        authClient.get<WorkspaceShare[]>(`/api/workspaces/${workspaceId}/shares`),
      ]);

      setUsers(usersResponse.data || []);
      setCurrentShares(sharesResponse.data || []);

      // Set initially selected users based on current shares
      const sharedUserIds = new Set(
        (sharesResponse.data || []).map((share: WorkspaceShare) => share.sharedWithUserId)
      );
      setSelectedUserIds(sharedUserIds);
    } catch (err: any) {
      console.error('Failed to fetch sharing data:', err);
      setError(err.response?.data?.error || 'Failed to load sharing data');
    } finally {
      setLoading(false);
    }
  }, [isOpen, workspaceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setError(null);
    }
  }, [isOpen]);

  const handleToggleUser = (userId: number) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const filteredUserIds = filteredUsers.map(u => u.id);
    setSelectedUserIds(new Set(filteredUserIds));
  };

  const handleDeselectAll = () => {
    setSelectedUserIds(new Set());
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const response = await authClient.post<WorkspaceShare[]>(
        `/api/workspaces/${workspaceId}/shares`,
        { userIds: Array.from(selectedUserIds) }
      );

      setCurrentShares(response.data || []);
      onSharesUpdated?.(response.data || []);
      onClose();
    } catch (err: any) {
      console.error('Failed to update shares:', err);
      setError(err.response?.data?.error || 'Failed to save sharing settings');
    } finally {
      setSaving(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  });

  // Check if a user is currently shared with (from database)
  const isCurrentlyShared = (userId: number) => {
    return currentShares.some(share => share.sharedWithUserId === userId);
  };

  // Check if there are unsaved changes
  const hasChanges = () => {
    const currentIds = new Set(currentShares.map(s => s.sharedWithUserId));
    if (selectedUserIds.size !== currentIds.size) return true;
    for (const id of selectedUserIds) {
      if (!currentIds.has(id)) return true;
    }
    return false;
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--color-systemBackground)',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-systemGray4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h2 className="text-title2" style={{ margin: 0 }}>
              Share Workspace
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: 'var(--color-secondaryLabel)',
                padding: '4px',
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            className="text-subheadline"
            style={{
              margin: '8px 0 0 0',
              color: 'var(--color-secondaryLabel)',
            }}
          >
            {workspaceName}
          </p>
        </div>

        {/* Search */}
        <div style={{ padding: '16px 24px 0' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid var(--color-systemGray4)',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'var(--color-secondarySystemBackground)',
              color: 'var(--color-label)',
            }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }}>
          {error && (
            <Alert type="error" style={{ marginBottom: '16px' }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  border: '3px solid var(--color-systemGray4)',
                  borderTop: '3px solid var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }}
              />
            </div>
          ) : users.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--color-secondaryLabel)',
              }}
            >
              <p className="text-body">No other users available to share with.</p>
              <p className="text-footnote" style={{ marginTop: '8px' }}>
                Ask an administrator to create user accounts.
              </p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: 'var(--color-secondaryLabel)',
              }}
            >
              <p className="text-body">No users match your search.</p>
            </div>
          ) : (
            <>
              {/* Select all / Deselect all */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                }}
              >
                <span
                  className="text-footnote"
                  style={{ color: 'var(--color-secondaryLabel)' }}
                >
                  {selectedUserIds.size} of {users.length} selected
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleSelectAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '4px 8px',
                    }}
                  >
                    Select all
                  </button>
                  <button
                    onClick={handleDeselectAll}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      padding: '4px 8px',
                    }}
                  >
                    Deselect all
                  </button>
                </div>
              </div>

              {/* User list */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                {filteredUsers.map((user) => {
                  const isSelected = selectedUserIds.has(user.id);
                  const wasShared = isCurrentlyShared(user.id);

                  return (
                    <label
                      key={user.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        backgroundColor: isSelected
                          ? 'var(--color-systemBlue-light, rgba(0, 122, 255, 0.1))'
                          : 'var(--color-secondarySystemBackground)',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        border: `1px solid ${
                          isSelected
                            ? 'var(--color-primary)'
                            : 'var(--color-systemGray4)'
                        }`,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleUser(user.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          cursor: 'pointer',
                          accentColor: 'var(--color-primary)',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          className="text-body"
                          style={{
                            fontWeight: 500,
                            color: 'var(--color-label)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {user.name}
                        </div>
                        <div
                          className="text-footnote"
                          style={{
                            color: 'var(--color-secondaryLabel)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {user.email}
                        </div>
                      </div>
                      {wasShared && (
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--color-systemGreen-light, rgba(52, 199, 89, 0.15))',
                            color: 'var(--color-systemGreen)',
                            fontWeight: 500,
                            flexShrink: 0,
                          }}
                        >
                          Shared
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-systemGray4)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving || loading || !hasChanges()}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ShareWorkspaceModal;
