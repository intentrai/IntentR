
# UbeCode - Design- and Capability-Driven Software Development

## What it is and why it matters
UbeCode is an open-source platform for DESIGN- and CAPABILITY-driven software development, treating capabilities as the structural backbone that connects specification, design, delivery, and AI governance.


## Why UbeCode Exists
Modern software teams operate across an increasingly fragmented toolchain—design systems, backlogs, repositories, AI assistants, and collaboration tools—none of which share a common understanding of what the system is actually intended to do.

This fragmentation was tolerable when delivery speed was constrained by human implementation. With AI-assisted development, that constraint has shifted.

As AI accelerates code generation, the primary bottleneck is no longer execution—it is specification.
Most existing agile and scaled agile frameworks were not designed for this reality. They optimize for managing work, not for expressing intent, governing AI behavior, or preserving architectural clarity at scale.

UbeCode is built around SAWai (Scaled Agile With AI)—an evolution of scaled agile practices specifically designed for AI-amplified software development.

### What is SAWai
SAWai (Scaled Agile With AI) is an evolution of traditional scaled agile frameworks designed specifically for AI-assisted development. Key principles:

**SAWai (Scaled Agile With AI)** is an evolution of traditional scaled agile frameworks designed specifically for AI-assisted development. Key principles:

- **Specification-First**: With AI accelerating code generation, the bottleneck shifts to specification quality. SAWai emphasizes thorough Vision, Ideation, and Storyboarding before implementation.
- **Four-Phase Workflow**:
  1. **SPECIFICATION** - Define what to build (Vision & Themes, Ideation, Storyboard)
  2. **DEFINITION** - Define the scope (Capabilities, Epics)
  3. **DESIGN** - Define how it looks (UI Assets, Framework, Styles)
  4. **EXECUTION** - Build and run (System, Code, Run)
- **AI-Amplified Delivery**: Traditional sprint velocities are superseded by AI-assisted generation, making well-defined requirements the primary success factor.
- **Simplified Hierarchy**: Capabilities → Epics (Features merged into Epics, Stories become implementation specs)


## Quick Start
UbeCode is designed to be explored quickly, without requiring deep setup or prior framework knowledge.
Prerequisites
Git
Node.js (LTS)
Docker (recommended for local and cloud environments)
1. Clone the Repository
git clone https://github.com/jareynolds/ubecode.git
cd ubecode
2. Set Up Your Development Environment
UbeCode provides environment-specific setup scripts to streamline local and cloud development.
Choose the script that matches your environment:
./setup-osx-environment.sh
./setup-aws-environment.sh
(more env coming in the future)
Each script installs required dependencies, configures services, and prepares the environment for running UbeCode. Refer to the script contents if you need to customize or extend the setup for your environment.
3. Start the Platform
./start.sh
This launches:
+ The UbeCode web UI
+ Core backend services
+ A local development workspace
4. Open the Web Interface
http://localhost:6175
You can now:
Create a workspace
Define capabilities and epics
Capture specification and design artifacts
Explore how capabilities structure delivery and AI governance
5. Explore the SAWai Workflow
Begin in the Specification phase:
Define vision, themes, ideation, and storyboards
Then progress through:
Definition → Capabilities and epics
Design → UI assets and design integration
Execution → System, code, and runtime alignment
Each phase remains explicitly connected to the originating capability.
6. Make Your First Contribution (Optional)
Interested in contributing?
Browse issues labeled good-first-issue
Review the architecture overview
Open a discussion or submit a pull request
UbeCode is built in the open and welcomes contributions across engineering, design systems, and AI governance.


## Env
A GoLang-based microservices application for massively streamlined comprehensive software development using the **SAWai (Scaled Agile With AI)** methodology.

## SAWai Principles?

SAWai is based on several core principles:
Specification-first development
When AI can generate implementation rapidly, the quality of vision, ideation, and specification becomes the dominant success factor.
A structured, four-phase workflow
SAWai formalizes the lifecycle of software intent and delivery into four explicit phases:
Specification — Define what to build (Vision, Themes, Ideation, Storyboarding)
Definition — Define the scope (Capabilities, Epics)
Design — Define how it looks and behaves (UI assets, frameworks, styles)
Execution — Build and run (System, Code, Runtime)
Capability-driven hierarchy
SAWai simplifies traditional agile hierarchies by treating capabilities as the primary unit of intent, with epics representing scoped delivery and implementation details serving as execution specifications.
AI-amplified delivery with governance
AI is not an add-on tool, but a governed participant in the development process, guided by explicit principles, constraints, and traceability back to the capabilities it affects.
Existing tools struggle to support this model because they are artifact-centric—tickets, boards, files, and pipelines—rather than capability-centric.
UbeCode exists to provide a unified, open-source platform that operationalizes SAWai by making capabilities the first-class abstraction that connects specification, design, delivery, collaboration, and AI governance in a single, coherent system.

## Overview

UbeCode is a web application that facilitates capability-driven software development by providing:

- **Web UI** - Modern React-based interface with design system
- **Design Service** - Manages design artifacts and versioning
- **Capability Service** - Tracks capabilities, features, and user stories
- **Integration Service** - Connects with external design tools (Figma)
- **Role-Based Access Control** - Granular permission management for all pages
- **Real-time Collaboration** - Workspace sharing and cursor tracking
- **AI Governance** - Configurable AI principles and presets

## Architecture

The application follows a microservices architecture pattern where each service:
- Runs independently in its own container
- Communicates via REST APIs
- Can be scaled independently
- Has its own data store (when needed)

```
┌──────────────────────────────────────────┐
│         Web UI (React + Vite)            │
│     Ford Design System - Port 6175       │
└──────────────────────────────────────────┘
              │
    ┌─────────┼─────────┬─────────┐
    │         │         │         │
┌───▼────┐ ┌──▼──────┐ ┌──▼──────┐ ┌──▼──────┐
│ Design │ │Capability│ │Integration│ │  Auth   │
│Service │ │ Service  │ │  Service  │ │ Service │
│ :9081  │ │  :9082   │ │   :9080   │ │  :9083  │
└────────┘ └────┬─────┘ └─────┬─────┘ └────┬────┘
                │              │             │
           ┌────▼──────────────▼─────────────▼───┐
           │      PostgreSQL Database :6432      │
           └─────────────────────────────────────┘
                              │
                         ┌────▼─────┐
                         │Figma API │
                         └──────────┘
```

## Prerequisites

- Go 1.21 or higher
- Node.js 18+ or 20+ (for Web UI)
- Docker and Docker Compose
- Make (optional, but recommended)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jareynolds/ubecode.git
cd ubecode
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Required
FIGMA_TOKEN=your_figma_personal_access_token
ANTHROPIC_API_KEY=your_anthropic_api_key
JWT_SECRET=your_jwt_signing_secret

# Optional - Google OAuth (for Google Sign-In)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database (defaults shown - override if needed)
DB_HOST=localhost
DB_PORT=6432
DB_USER=ubecode_user
DB_PASSWORD=ubecode_pass
DB_NAME=ubecode_db
```

**Getting API Keys:**

- **Figma Token**: Go to Figma Settings > Account > Personal access tokens > Generate new token
- **Anthropic API Key**: Get from [console.anthropic.com](https://console.anthropic.com/)
- **JWT Secret**: Generate a secure random string (e.g., `openssl rand -hex 32`)
- **Google OAuth**: Create credentials at [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

### 3. Quick Start (Recommended)

Use the provided scripts to start everything:

```bash
# Start all services (backend + web UI)
./start.sh

# Check status of all services
./status.sh

# Stop all services
./stop.sh
```

The start script will:
- ✅ Check prerequisites (Docker, Node.js)
- ✅ Install Web UI dependencies automatically
- ✅ Start PostgreSQL database
- ✅ Start backend services in Docker (Integration, Design, Capability, Auth)
- ✅ Start Node.js API servers (Specification, Collaboration, Shared Workspace)
- ✅ Start Web UI development server (Vite)
- ✅ Display all service URLs and management commands

**Troubleshooting Tips:**
- Run `./status.sh` to check service health
- Check logs in `logs/` directory for errors
- Ensure Docker is running before starting services
- Use `lsof -i :PORT` to check for port conflicts

### 4. Build and Run with Docker Compose (Backend Only)

```bash
# Build all services
make docker-build

# Start all services
make docker-up

# View logs
make docker-logs

# Stop all services
make docker-down
```

### 5. Run Web UI Separately

```bash
cd web-ui
npm install
npm run dev
```

### 6. Run Services Locally (Development)

```bash
# Terminal 1 - Integration Service
make run-integration

# Terminal 2 - Design Service
make run-design

# Terminal 3 - Capability Service
make run-capability

# Terminal 4 - Web UI
cd web-ui && npm run dev
```

## Application URLs

After running `./start.sh`, the application will be available at:

### Frontend (Port 6175)

- **Web UI**: `http://localhost:6175/`
- **Dashboard**: `http://localhost:6175/`
- **Workspaces**: `http://localhost:6175/workspaces`
  - Designs: `http://localhost:6175/designs`
  - Ideation: `http://localhost:6175/ideation`
  - Storyboard: `http://localhost:6175/storyboard`
  - System: `http://localhost:6175/system`
  - Capabilities: `http://localhost:6175/capabilities`
  - AI Principles: `http://localhost:6175/ai-principles`
  - UI Framework: `http://localhost:6175/ui-framework`
  - AI Assistant: `http://localhost:6175/ai-chat`
- **Integrations**: `http://localhost:6175/integrations`
- **Settings**: `http://localhost:6175/settings`
- **Admin Panel**: `http://localhost:6175/admin` (Admins only)

## API Endpoints

### Integration Service (Port 9080)

- `GET /health` - Health check
- `GET /figma/files/{fileKey}` - Get Figma file details
- `GET /figma/files/{fileKey}/comments` - Get Figma file comments
- `POST /analyze-application` - Analyze application structure
- `POST /export-ideation` - Export ideation cards

### Design Service (Port 9081)

- `GET /health` - Health check
- `GET /designs` - List designs

### Capability Service (Port 9082)

- `GET /health` - Health check
- `GET /capabilities` - List capabilities

### Auth Service (Port 9083)

- `GET /health` - Health check
- `POST /register` - User registration
- `POST /login` - User login (returns JWT)
- `POST /google/login` - Google OAuth login
- `GET /me` - Get current user info (requires auth)
- `GET /users` - List users (admin only)
- `PUT /users/{id}/role` - Update user role (admin only)

### Node.js APIs

- **Specification API** (Port 4001): `http://localhost:4001/api/health`
- **Collaboration Server** (Port 9084): WebSocket server for real-time collaboration
- **Shared Workspace API** (Port 4002): `http://localhost:4002/api/health`

### Database

- **PostgreSQL** (Port 6432): `localhost:6432` (user: ubecode_user, db: ubecode_db)

## Testing

```bash
# Run all Go tests
make test

# Run tests with coverage
make test-coverage

# Run specific test
go test -v ./internal/integration -run TestName

# Run frontend tests
cd web-ui && npm test
```

### Test Frameworks

- **Go**: Standard `testing` package + `testify` for assertions
- **BDD/Gherkin**: `godog` for behavior-driven tests
- **React**: Jest + React Testing Library

## Database Setup

The database is automatically initialized when using Docker. For manual setup:

```bash
# Connect to PostgreSQL
psql -h localhost -p 6432 -U ubecode_user -d ubecode_db

# Initialize schema manually (if needed)
psql -h localhost -p 6432 -U ubecode_user -d ubecode_db -f scripts/init-db.sql

# Run approval workflow migration
psql -h localhost -p 6432 -U ubecode_user -d ubecode_db -f scripts/migration_approval.sql
```

## Development

### Project Structure

```
ubecode/
├── web-ui/                # React Web UI (NEW)
│   ├── src/
│   │   ├── api/          # Backend API clients
│   │   ├── components/   # Ford Design System components
│   │   ├── context/      # React Context (state management)
│   │   ├── pages/        # Page components
│   │   └── styles/       # Ford Design System CSS
│   ├── package.json
│   └── README.md
├── cmd/                   # Main applications
│   ├── design-service/
│   ├── capability-service/
│   └── integration-service/
├── internal/              # Private application code
│   ├── design/
│   ├── capability/
│   └── integration/
├── pkg/                   # Public library code
│   ├── client/
│   ├── models/
│   └── utils/
├── specifications/        # Capability specifications
├── api/                   # API definitions
├── docs/                  # Documentation
├── scripts/               # Build and utility scripts
├── start.sh              # Start all services
├── stop.sh               # Stop all services
├── docker-compose.yml
├── Dockerfile
├── Makefile
└── go.mod
```

### Code Style

This project follows standard Go conventions:

- Use `gofmt` for formatting
- Use `go vet` for static analysis
- Follow [Effective Go](https://golang.org/doc/effective_go) guidelines
- Document all exported functions and types

### Building

```bash
# Build all services
make build

# Build specific service
go build -o bin/integration-service ./cmd/integration-service
```

### Linting

```bash
# Run linter and formatter
make lint
```

## Documentation

- [CLAUDE.md](CLAUDE.md) - AI assistant context and quick reference
- [Development Guide](DEVELOPMENT_GUIDE.md) - Comprehensive guide for SAWai capability-driven development
- [SAWai Development Plan](CODE_RULES/MAIN_SWDEV_PLAN.md) - Complete SAWai methodology and workflows
- [API Documentation](docs/api/API.md) - API specifications
- [Role-Based Access Control](docs/ROLE_BASED_ACCESS_CONTROL.md) - RBAC system documentation
- [Real-time Collaboration](docs/REALTIME_COLLABORATION.md) - Collaboration features

## SAWai Framework

This project follows the **SAWai (Scaled Agile With AI)** capability-driven approach:

1. **Vision & Themes** - Strategic direction and business objectives
2. **Capabilities** - Higher-level business outcomes spanning multiple epics
3. **Epics** - Large initiatives that define significant deliverables
4. **Implementation Specs** - Detailed specifications for AI-assisted code generation

**Key Difference from Traditional Agile**: In SAWai, the emphasis shifts from sprint velocity to specification quality. With AI handling much of the implementation, well-defined requirements become the primary driver of success.

See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for detailed information.

## Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

This project follows the **SAWai methodology**. Before implementing features:
1. Review [CODE_RULES/MAIN_SWDEV_PLAN.md](CODE_RULES/MAIN_SWDEV_PLAN.md) for the development workflow
2. Check if specifications exist in `specifications/` folder
3. Follow the Capability → Enabler → Requirement hierarchy

### Branching Strategy

- `main` - Production-ready code
- `develop` - Integration branch (if used)
- `feature/*` - New features (`feature/add-dark-mode`)
- `fix/*` - Bug fixes (`fix/login-error`)
- `docs/*` - Documentation updates

### Commit Message Convention

```
<type>: <short description>

<optional body>

<optional footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example: `feat: add workspace export functionality`

### Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for new functionality
4. Ensure all tests pass (`make test`)
5. Run linting (`make lint`)
6. Commit your changes with descriptive messages
7. Push to your fork (`git push origin feature/amazing-feature`)
8. Open a Pull Request with:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes

### Code Style

- **Go**: Follow `gofmt` and `go vet` standards
- **TypeScript/React**: ESLint with React hooks rules
- **API endpoints**: Use kebab-case (`/save-specification`)
- **Components**: Use PascalCase (`MyComponent.tsx`)

### Testing Requirements

- Write unit tests for new functions
- Write integration tests for API endpoints
- Use BDD/Gherkin scenarios for feature tests (see `CODE_RULES/MAIN_SWDEV_PLAN.md`)
- Maintain >80% coverage for new code

## Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please:

1. **Do NOT** open a public issue
2. Email security concerns to: ubecodesoftware@gmail.com
3. Include detailed steps to reproduce
4. Allow 48 hours for initial response

### Security Best Practices

- Never commit secrets or API keys
- Use environment variables for sensitive configuration
- Keep dependencies updated (`go mod tidy`, `npm audit fix`)
- Review the [OWASP Top 10](https://owasp.org/www-project-top-ten/) for common vulnerabilities

## License

# UbeCode — Dual Licensed (AGPLv3 or Commercial)

UbeCode is available under a **dual-licensing model**:

### 🔓 Open Source License: AGPLv3
You may use UbeCode under the GNU Affero General Public License v3.
If you modify UbeCode or build a system that uses it and make it available
to others (including over a network), you **must** release your complete
source code under the AGPLv3.

See: LICENSE.AGPL

### 💼 Commercial License
If your company wants to:
- keep its source code proprietary,
- embed UbeCode into closed-source products,
- run UbeCode as part of a SaaS platform without releasing your code,
- receive support, SLA, or custom terms,

you must purchase a **commercial license**.

See: LICENSE.COMMERCIAL
Contact: ubecodesoftware@gmail.com

### ⚠️ You must choose *one* license.
Using UbeCode without complying with AGPLv3 or without a commercial license
is a violation of copyright law.


## Contact


Project Link: [https://github.com/jareynolds/ubecode](https://github.com/jareynolds/ubecode)
Email: ubecodesoftware@gmail.com


## Acknowledgments

- SAWai methodology - Scaled Agile With AI (inspired by SAFe, evolved for AI-assisted development)
- [Figma API](https://www.figma.com/developers/api)
- [Go Programming Language](https://golang.org/)
- [Docker](https://www.docker.com/)
