# Intentr Codebase Structure Analysis

**Project:** Intentr
**Framework:** INTENT (Scaled Agile With AI)
**Analysis Date:** December 23, 2025
**Last Updated:** December 23, 2025
**Repository:** /Users/jamesreynolds/Documents/Development/UbeCode

---

## EXECUTIVE SUMMARY

The Intentr repository is a **moderately complex microservices application** using Go backend services and React frontend. The core Go project follows standard conventions (cmd/, internal/, pkg/).

### Recent Cleanup (December 21-23, 2025)

Significant organizational improvements have been made:

| Issue | Status | Notes |
|-------|--------|-------|
| Binary executables in git | **RESOLVED** | Removed from tracking, added to .gitignore |
| Log files in git | **RESOLVED** | Removed from tracking |
| PID files in git | **RESOLVED** | Removed from tracking |
| Database files in git | **RESOLVED** | Removed from tracking |
| .gitignore incomplete | **RESOLVED** | Comprehensive update with security patterns |
| Naming inconsistency (Ube/UbeCode) | **RESOLVED** | Renamed to Intentr/intentrcli |
| Orphaned directories (Users/, path/, code/, enh-code/) | **RESOLVED** | No longer present |
| Sidebar naming | **RESOLVED** | Updated to Intent/Specification/System/Control Loop |
| PageLayout inconsistencies | **RESOLVED** | Consistent layout across all pages |

### Remaining Issues (Action Items for Future):
1. **Duplicate specification directories** (specifications/ vs ori-specifications/)
2. **AI Principles location** (could move to CODE_RULES/)
3. **Design assets scattered** (uploaded-assets/, root HTML files)
4. **Philosophy/ at root** (could move to docs/)
5. **tests/ organization** (contains old SDP file)
6. **Frontend Welcome vs Wizard duplication** (needs audit)

---

## PART 1: CURRENT DIRECTORY STRUCTURE

### A. Top-Level Directory Organization

```
/Intentr/ (repository root)
├── Core Go Modules
│   ├── cmd/                    # Service entry points (CORRECT)
│   │   ├── integration-service/
│   │   ├── design-service/
│   │   ├── capability-service/
│   │   ├── auth-service/
│   │   ├── claude-proxy/
│   │   ├── balut/
│   │   └── intentrcli/         # CLI tool (renamed from ubecli)
│   ├── internal/               # Private service logic (CORRECT)
│   ├── pkg/                    # Shared public libraries (CORRECT)
│   └── migrations/             # Database migrations (CORRECT)
│
├── Frontend Application
│   └── web-ui/                 # React + Vite (CORRECT)
│
├── Specifications & Documentation
│   ├── specifications/         # Current specs (111 files) - CANONICAL
│   ├── ori-specifications/     # Original specs (93 files) - CONSIDER ARCHIVING
│   ├── docs/                   # Feature & API docs (CORRECT)
│   └── CODE_RULES/             # Development guidelines (CORRECT)
│
├── Configuration & Deployment
│   ├── scripts/                # Build & setup scripts (CORRECT)
│   ├── docker-compose.yml      # Container orchestration (CORRECT)
│   ├── Dockerfile              # Image definition (CORRECT)
│   ├── Makefile                # Build automation (CORRECT)
│   ├── nginx/                  # Web server config (CORRECT)
│   ├── .env.example            # Config template (CORRECT)
│   └── .intentrcli.yaml        # CLI config (CORRECT - renamed from .ubecli.yaml)
│
├── Workspaces
│   └── workspaces/             # Multi-project workspace support (CORRECT)
│       └── */.intentrworkspace # Workspace markers (renamed from .ubeworkspace)
│
├── Items to Consider Reorganizing
│   ├── AI_Principles/          # Policy presets - could move to CODE_RULES/
│   ├── Philosophy/             # Presentation files - could move to docs/
│   ├── uploaded-assets/        # Design artifacts - could consolidate
│   ├── tests/                  # Old artifacts - needs review
│   └── darkblue-UI-design-guide.html # Could move to docs/design-systems/
│
├── Archived (Gitignored)
│   ├── archived-specifications/
│   └── archived-legacy/
│
├── Documentation & Metadata
│   ├── CLAUDE.md               # AI instructions (CORRECT)
│   ├── README.md               # Project readme (CORRECT)
│   ├── CONTRIBUTIONS.md        # Contribution guide (CORRECT)
│   ├── CODEBASE_STRUCTURE_ANALYSIS.md  # This file
│   ├── CODEBASE_EXPLORATION_SUMMARY.md # Generated analysis
│   ├── QUICK_REFERENCE.md      # Quick reference
│   ├── LICENSE*                # License files (CORRECT)
│   ├── go.mod / go.sum         # Go dependencies (CORRECT)
│   └── .gitignore              # Git exclusions (UPDATED & COMPREHENSIVE)
│
├── Startup & Control Scripts
│   ├── start.sh                # Start all services (CORRECT)
│   ├── stop.sh                 # Stop all services (CORRECT)
│   ├── status.sh               # Show service status (CORRECT)
│   └── git-push.sh             # Git automation (CORRECT)
│
└── Runtime Artifacts (GITIGNORED - Not in Repository)
    ├── .env                    # Local configuration
    ├── .pids/                  # PID files
    ├── logs/                   # Application logs
    ├── bin/                    # Build output
    ├── .claude/                # Claude Code local settings
    ├── workspaces.db           # SQLite database
    └── cmd/*/[binary]          # Compiled binaries
```

### B. Go Project Structure (Standard Layout)

```
cmd/                                    # CORRECT - Service entry points
├── integration-service/main.go         # Port 9080
├── design-service/main.go              # Port 9081
├── capability-service/main.go          # Port 9082
├── auth-service/main.go                # Port 9083
├── balut/main.go                       # Design system service
├── claude-proxy/main.go                # Proxy service
└── intentrcli/                         # CLI tool (8 subdirectories)

internal/                               # CORRECT - Private service logic
├── auth/                               # Auth handlers & services
└── integration/                        # Integration handlers

pkg/                                    # CORRECT - Shared libraries
├── client/                             # Figma API client
├── container/                          # Container orchestration
├── database/                           # PostgreSQL wrapper
├── middleware/                         # HTTP middleware (auth)
├── models/                             # Data structures
└── repository/                         # Data access layer

migrations/                             # CORRECT - Database migration scripts
```

### C. Frontend (React + Vite)

```
web-ui/
├── src/
│   ├── api/                    # Axios HTTP clients
│   ├── assets/                 # Images/static assets
│   │   └── intentr-logo.svg    # Logo (renamed from ube-logo.svg)
│   ├── components/             # React components
│   │   ├── wizard/             # Wizard flow components
│   │   └── PageLayout.tsx      # Consistent page layout wrapper
│   ├── context/                # React Context providers
│   │   ├── AppContext.tsx
│   │   ├── AuthContext.tsx
│   │   ├── WorkspaceContext.tsx
│   │   ├── WizardContext.tsx
│   │   └── [other contexts]
│   ├── pages/                  # Route components
│   │   ├── wizard/             # Wizard pages (14 files)
│   │   └── [other pages]
│   ├── styles/                 # CSS & design systems
│   └── types/                  # TypeScript definitions
├── public/
│   └── intentr-logo.svg        # Public logo (renamed)
├── index.html
├── package.json
└── vite.config.ts
```

---

## PART 2: COMPLETED CLEANUP ITEMS

### December 21-23, 2025 Changes

#### 1. Git Tracking Cleanup (COMPLETED)

**Files Removed from Git Tracking:**
- `cmd/claude-proxy/claude-proxy` - compiled binary
- `cmd/integration-service/integration-service` - compiled binary
- `cmd/integration-service/.!*` - corrupted temp binaries
- `cmd/intentrcli/intentrcli` - compiled binary
- `workspaces.db` - SQLite database
- `.pids/*.pid` - all PID files (4 files)
- `logs/*.log` - all log files (6 files)
- `workspaces/HelloWorld/code/.pid`
- `workspaces/HelloWorld/code/logs/app.log`

#### 2. .gitignore Comprehensive Update (COMPLETED)

**New Sections Added:**
- Security patterns (*.pem, *.key, *.crt, etc.)
- Claude Code local settings (.claude/)
- Compiled binaries in cmd/ directories
- Broader log/pid patterns (**/*.log, **/*.pid)
- Database files (*.sqlite, *.sqlite3, *.db)
- Python artifacts (venv/, __pycache__/, *.pyc)
- Local config files (.intentrcli.yaml, *.local.json)
- Global node_modules pattern

#### 3. Naming Standardization (COMPLETED)

**Content Replacements:**
| Original | New |
|----------|-----|
| UbeCode | Intentr |
| ubecode | intentr |
| UBECODE | INTENTR |
| ubecli | intentrcli |
| .ubeworkspace | .intentrworkspace |
| .ubecli.yaml | .intentrcli.yaml |
| ube-logo | intentr-logo |

**File/Directory Renames:**
- `cmd/ubecli/` → `cmd/intentrcli/`
- `.ubecli.yaml` → `.intentrcli.yaml`
- `web-ui/public/ube-logo.svg` → `web-ui/public/intentr-logo.svg`
- All `workspaces/*/.ubeworkspace` → `workspaces/*/.intentrworkspace`
- `Philosophy/INTENT_UbeCode_*.pptx` → `Philosophy/INTENT_Intentr_*.pptx`

#### 4. UI Navigation Updates (COMPLETED)

**Sidebar Section Renames:**
| Original | New |
|----------|-----|
| Intent Declaration | Intent |
| Formal Specification | Specification |
| System Derivation | System |
| Continuous Validation | Control Loop |

**Page Rename:**
- "Phase Approval" → "Intent Integrity" (in Control Loop section)

#### 5. PageLayout Consistency (COMPLETED)

Fixed pages that bypassed PageLayout wrapper when "minimal" mode selected:
- TestingApproval.tsx
- StoryMap.tsx
- Analyze.tsx

---

## PART 3: REMAINING ACTION ITEMS

### Priority 1: Specification Directory Consolidation

**Issue:** Two specification directories with overlapping content
```
specifications/         # 111 files - Current/canonical
ori-specifications/     # 93 files - Original/historical
```

**Recommendation:**
- [ ] Determine which is authoritative (likely specifications/)
- [ ] Archive ori-specifications/ or delete if redundant
- [ ] Document decision in specifications/INDEX.md

### Priority 2: AI Principles Organization

**Current Location:** `/AI_Principles/` at root

**Contents:**
```
AI_Principles/
├── AI_GOVERNANCE_FRAMEWORK.md
├── AI-Policy-Preset1.md through AI-Policy-Preset5.md
```

**Recommendation:**
- [ ] Move to `CODE_RULES/AI_GOVERNANCE/`
- [ ] Update references in MAIN_SWDEV_PLAN.md
- [ ] Update AI Principles page in web-ui

### Priority 3: Design Assets Consolidation

**Current State:** Scattered across multiple locations
```
uploaded-assets/                          # Design artifacts
├── BalutDesignSystem/
├── balut ds.html
├── balut-default-reverse-engineered.html
├── ford-design-system.html
├── purple-design-system.html
└── SOFTWARE_DEVELOPMENT_PLAN.md

darkblue-UI-design-guide.html             # At root level

web-ui/src/styles/                        # CSS implementations
├── apple-hig-theme.css
├── ford-design-system.css
```

**Recommendation:**
- [ ] Create `docs/design-systems/` directory
- [ ] Move HTML exports to `docs/design-systems/exports/`
- [ ] Create index documenting each design system
- [ ] Move `darkblue-UI-design-guide.html` from root

### Priority 4: Philosophy Directory Location

**Current Location:** `/Philosophy/` at root

**Contents:**
```
Philosophy/
├── INTENT_Intentr_Executive_Deck.pptx
├── INTENT_Intentr_Executive_Deck_Polished.pptx
├── INTENT_Intentr_Executive_Deck_With_Diagrams.pptx
└── [other files]
```

**Recommendation:**
- [ ] Move to `docs/philosophy/` or `docs/presentations/`
- [ ] Consider if these should be in version control

### Priority 5: Tests Directory Cleanup

**Current State:**
```
tests/
├── SOFTWARE_DEVELOPMENT_PLAN.md  # Old document
└── test_figma_team.go            # Valid Go test
```

**Recommendation:**
- [ ] Move `test_figma_team.go` to appropriate package tests
- [ ] Archive or remove old SDP document
- [ ] Consider if `tests/` directory is needed

### Priority 6: Frontend Welcome vs Wizard Audit

**Issue:** Potential duplication between flows

```
web-ui/src/pages/
├── Welcome.tsx                   # Entry point
└── wizard/                       # Wizard pages (14 files)

web-ui/src/components/
├── GettingStartedWizard.tsx     # Wizard component
└── wizard/                       # Wizard subcomponents
```

**Recommendation:**
- [ ] Audit actual usage of Welcome.tsx vs wizard/ pages
- [ ] Clarify user journey: Welcome → Wizard or alternatives?
- [ ] Consolidate if redundant

---

## PART 4: UPDATED GITIGNORE STATUS

The `.gitignore` file has been comprehensively updated and now includes:

```
# Comprehensive categories covered:
- macOS system files (.DS_Store)
- Binary executables (*.exe, *.dll, *.so, *.dylib)
- Go binaries at root and in cmd/ directories
- Test binaries and coverage files
- Workspaces (except example projects)
- Go workspace files
- Environment files (.env)
- Build artifacts (bin/)
- Editor/IDE files (.idea/, .vscode/)
- Web UI runtime files
- Node modules (global pattern)
- Runtime artifacts (.pids/, logs/, **/*.log, **/*.pid)
- Database files (*.db, *.sqlite, *.sqlite3)
- Temporary files (*.tmp, *.bak)
- Archived directories
- Security files (*.pem, *.key, *.crt, etc.)
- Claude Code settings (.claude/)
- Local config files (.intentrcli.yaml, *.local.json)
- Python artifacts (venv/, __pycache__/)
```

---

## PART 5: RECOMMENDED FINAL DIRECTORY STRUCTURE

```
intentr/
├── .gitignore                          # Comprehensive (DONE)
├── .git/
├── .github/                            # GitHub workflows (if needed)
├── .env.example                        # Config template only
│
├── README.md
├── CLAUDE.md
├── CONTRIBUTIONS.md
├── LICENSE & LICENSE.* files
├── CODEBASE_STRUCTURE_ANALYSIS.md      # This file
│
├── go.mod / go.sum
├── Makefile
├── docker-compose.yml
├── Dockerfile
│
├── cmd/                                # Service entry points (DONE)
│   ├── integration-service/
│   ├── design-service/
│   ├── capability-service/
│   ├── auth-service/
│   ├── claude-proxy/
│   ├── balut/
│   └── intentrcli/
│
├── internal/                           # Private logic (DONE)
├── pkg/                                # Shared libraries (DONE)
├── migrations/                         # Database migrations (DONE)
│
├── web-ui/                             # React + Vite frontend (DONE)
│
├── specifications/                     # CANONICAL specs only
│
├── docs/                               # Documentation
│   ├── api/
│   ├── architecture/
│   ├── features/
│   ├── getting-started/
│   ├── operations/
│   ├── reports/
│   ├── design-systems/                 # FUTURE: Consolidate here
│   └── philosophy/                     # FUTURE: Move Philosophy/ here
│
├── CODE_RULES/                         # Development guidelines
│   ├── MAIN_SWDEV_PLAN.md
│   ├── INTENT.md
│   ├── CODE_COMPLETE.md
│   ├── ACTIVE_AI_PRINCIPLES.md
│   └── AI_GOVERNANCE/                  # FUTURE: Move AI_Principles/ here
│
├── scripts/                            # Utility & deployment scripts
├── nginx/                              # Web server config
├── workspaces/                         # Multi-project workspaces
│
├── start.sh                            # Startup script (keep at root for convenience)
├── stop.sh
├── status.sh
│
└── (NOT COMMITTED - Gitignored)
    ├── .env
    ├── .pids/
    ├── logs/
    ├── bin/
    ├── .claude/
    ├── workspaces.db
    └── cmd/*/[binaries]
```

---

## PART 6: ACTION ITEM CHECKLIST

### Completed (December 2025)
- [x] Remove binary executables from git tracking
- [x] Update .gitignore comprehensively
- [x] Remove log/pid/db files from git tracking
- [x] Rename Ube* to Intentr* (files and content)
- [x] Update sidebar navigation names
- [x] Fix PageLayout consistency
- [x] Remove orphaned directories (Users/, path/, code/, enh-code/)
- [x] Rename workspace markers (.ubeworkspace → .intentrworkspace)

### Pending (Future Work)
- [ ] Archive or remove ori-specifications/ directory
- [ ] Move AI_Principles/ to CODE_RULES/AI_GOVERNANCE/
- [ ] Consolidate design assets into docs/design-systems/
- [ ] Move Philosophy/ to docs/philosophy/ or docs/presentations/
- [ ] Clean up tests/ directory
- [ ] Audit Welcome.tsx vs wizard/ page duplication
- [ ] Move darkblue-UI-design-guide.html to appropriate location
- [ ] Consider moving QUICK_REFERENCE.md and CODEBASE_EXPLORATION_SUMMARY.md

---

## CONCLUSION

The Intentr project has undergone significant cleanup and now has:

1. **Clean git history** - No build artifacts, logs, or runtime files tracked
2. **Comprehensive .gitignore** - Prevents future accidental commits
3. **Consistent naming** - All references updated from Ube/UbeCode to Intentr
4. **Improved UI navigation** - Clear phase names (Intent, Specification, System, Control Loop)
5. **Consistent page layouts** - PageLayout wrapper used consistently

**Remaining effort:** ~2-3 hours for organizational improvements (moving directories, consolidating assets)

**Risk level:** Low - mainly file reorganization

**Recommended approach:** Address remaining items incrementally as part of regular development work

---

**Document Version:** 2.0
**Last Updated:** December 23, 2025
**Updated By:** Claude Code
