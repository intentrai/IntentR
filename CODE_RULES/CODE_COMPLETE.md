# SAWai Development Guide for Claude Code

## Overview

This document provides comprehensive guidance for Claude Code to design, analyze, implement, test, refactor, reverse-to-design, and retire software applications using SAWai (Scaled Agile With AI) methodology. SAWai is optimized for AI-assisted development, emphasizing high-quality specifications over heavy process ceremony. This serves as the single source of truth for all software development activities in the UbeCode project.

**For SAWai framework reference, see: [SAWai.md](./SAWai.md)**

## Table of Contents

1. [SAWai Framework Principles](#sawai-framework-principles)
2. [Architecture Overview](#architecture-overview)
3. [Development Lifecycle](#development-lifecycle)
4. [Design Phase](#design-phase)
5. [Analysis Phase](#analysis-phase)
6. [Implementation Phase](#implementation-phase)
7. [Testing Phase](#testing-phase)
8. [Refactoring Phase](#refactoring-phase)
9. [Reverse-to-Design Phase](#reverse-to-design-phase)
10. [Retirement Phase](#retirement-phase)
11. [Technology Stack](#technology-stack)
12. [Best Practices](#best-practices)

---

## SAWai Framework Principles

### Core Values

1. **Specification Quality** - High-quality specs drive better AI-generated outcomes
2. **Built-in Quality** - Ensure quality at every development stage
3. **Transparency** - Make work visible to enable collaboration
4. **Accelerated Delivery** - AI amplifies delivery speed; focus on maximizing business value

### Strategic Themes

Strategic themes are differentiating business objectives that connect your portfolio to the enterprise strategy. With AI-assisted development, well-defined themes guide AI tools to generate better outcomes.

### Capability-Driven Approach

In SAWai, capabilities represent high-level business outcomes that span multiple epics. They integrate with design artifacts and AI-assisted development tools to accelerate delivery. Each capability:

- Delivers value to end-users
- Is documented with clear acceptance criteria
- Integrates with design artifacts for AI tooling
- Can be broken down into epics, features, and stories
- Has measurable business outcomes

### Epic Workflow

SAWai uses a streamlined epic workflow:

```
Funnel → Analyzing → Review → Implementing → Done
```

Use **WSJF (Weighted Shortest Job First)** scoring to prioritize epics. Since AI amplifies delivery speed, focus on specifications that maximize business value.

### AI-Optimized Principles

1. **Invest in specifications** - Clear, detailed specs yield better AI outputs
2. **Apply systems thinking** - Understand how components interact
3. **Build incrementally** - Fast, integrated learning cycles with AI assistance
4. **Reduce ceremony** - Minimize process overhead; maximize value delivery
5. **Design-first approach** - Connect capabilities to design artifacts
6. **Continuous integration** - AI accelerates the feedback loop
7. **Decentralize decision-making** - Empower teams with AI tools
8. **Organize around value** - Structure work by business outcomes

---

## Architecture Overview

### Microservices Architecture

The UbeCode application follows a microservices architecture pattern with the following characteristics:

- **Service Independence** - Each microservice operates independently
- **Technology Flexibility** - Services can use different technologies as needed
- **Decentralized Data Management** - Each service manages its own database
- **Failure Isolation** - Failures are contained within service boundaries
- **Scalability** - Services can be scaled independently based on demand

### Technology Stack

- **Backend**: GoLang (Go 1.21+)
- **Frontend**: React 18+ with TypeScript, Vite
- **Containerization**: Docker
- **Orchestration**: Docker Compose (development), Kubernetes (production)
- **API Gateway**: To be determined based on requirements
- **Service Communication**: REST APIs, gRPC for inter-service communication
- **External Integrations**: Figma API, DELM API (image generation)
- **AI/ML Services**: DELM with mflux (Stable Diffusion on Apple Silicon)

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway                           │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐   ┌────────▼───────┐   ┌────────▼────────┐
│   Design       │   │   Capability   │   │   Integration   │
│   Service      │   │   Service      │   │   Service       │
└────────────────┘   └────────────────┘   └─────────────────┘
        │                     │                     │
        │                     │                     │
┌───────▼────────┐   ┌────────▼───────┐   ┌────────▼────────┐
│   Design DB    │   │ Capability DB  │   │   Figma API     │
└────────────────┘   └────────────────┘   └─────────────────┘
```

---

## Development Lifecycle

### Phase Overview

The development lifecycle follows these phases:

1. **Design** - Define the solution architecture and interfaces
2. **Analysis** - Evaluate requirements and constraints
3. **Implementation** - Build the solution
4. **Testing** - Verify functionality and quality
5. **Refactoring** - Improve code quality and design
6. **Reverse-to-Design** - Update design documentation from code
7. **Retirement** - Decommission obsolete components

### SAWai Development Workflow

```
Strategic Theme → Capability → Epic (Funnel → Analyzing → Review → Implementing → Done) → Feature → Story
```

**Epic Workflow Stages:**
- **Funnel**: New ideas and opportunities are captured
- **Analyzing**: Technical feasibility, WSJF scoring, specification development
- **Review**: Stakeholder review of specifications and priorities
- **Implementing**: AI-assisted development and delivery
- **Done**: Capability delivered and validated

---

## Design Phase

### Objectives

- Define clear boundaries between services
- Establish API contracts
- Design data models
- Plan integration points
- Document architectural decisions

### Design Activities

#### 1. Capability Definition

Create a capability specification document that includes:

```markdown
## Capability: [Name]

### Description
[Clear description of what the capability provides]

### Business Value
[Measurable business outcomes]

### Stakeholders
[List of stakeholders and their roles]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

### Features
1. Feature 1
2. Feature 2
3. Feature 3
```

#### 2. Service Design

For each microservice:

1. **Define Service Boundaries**
   - Identify bounded contexts
   - Define service responsibilities
   - Document data ownership

2. **API Design**
   - RESTful endpoints specification
   - Request/response schemas
   - Error handling patterns
   - Authentication/authorization requirements

3. **Data Model Design**
   - Entity definitions
   - Relationships
   - Constraints
   - Migration strategy

#### 3. Integration Design

- External API integration (Figma)
- Inter-service communication patterns
- Event-driven architecture (if applicable)
- Message formats and protocols

### Design Documentation

All design artifacts should be stored in:
- `docs/architecture/` - Architecture decision records (ADRs)
- `docs/capabilities/` - Capability specifications
- `docs/api/` - API documentation (OpenAPI/Swagger)
- `docs/design/` - Design diagrams and models

### Figma Integration Design

When integrating with Figma:

1. **Authentication**
   - Use Figma Personal Access Tokens
   - Store credentials securely (environment variables)

2. **API Endpoints**
   - Files API - Access design files
   - Comments API - Retrieve and post comments
   - Webhooks - Real-time updates (if needed)

3. **Data Synchronization**
   - Define sync strategy (polling vs. webhooks)
   - Handle rate limiting
   - Implement caching strategy

---

## Analysis Phase

### Objectives

- Validate requirements against business goals
- Assess technical feasibility
- Identify risks and dependencies
- Estimate effort and resources

### Analysis Activities

#### 1. Requirement Analysis

- Review capability specifications
- Identify functional and non-functional requirements
- Validate with stakeholders
- Document assumptions and constraints

#### 2. Technical Analysis

- Evaluate technology choices
- Assess scalability requirements
- Review security requirements
- Identify performance benchmarks

#### 3. Risk Analysis

Create a risk register:

```markdown
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| [Risk description] | High/Medium/Low | High/Medium/Low | [Strategy] |
```

#### 4. Dependency Analysis

- Identify external dependencies (Figma API, libraries)
- Map inter-service dependencies
- Document version requirements
- Plan for dependency updates

---

## Implementation Phase

### Objectives

- Write clean, maintainable code
- Follow Go best practices
- Implement with testability in mind
- Document code appropriately

### Implementation Standards

#### Go Code Standards

1. **Project Structure**

```
ubecode/
├── cmd/                    # Main applications
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
├── api/                   # API definitions (OpenAPI, protobuf)
├── configs/               # Configuration files
├── deployments/           # Docker, Kubernetes configs
├── docs/                  # Documentation
├── test/                  # Additional test applications
└── scripts/               # Build and utility scripts
```

2. **Coding Conventions**

- Follow [Effective Go](https://golang.org/doc/effective_go)
- Use `gofmt` for formatting
- Use `golint` and `go vet` for linting
- Document exported functions and types
- Use meaningful variable names
- Keep functions small and focused

3. **Error Handling**

```go
// Always check errors
result, err := someOperation()
if err != nil {
    return fmt.Errorf("operation failed: %w", err)
}

// Use custom error types for domain errors
type ValidationError struct {
    Field   string
    Message string
}

func (e *ValidationError) Error() string {
    return fmt.Sprintf("validation error on %s: %s", e.Field, e.Message)
}
```

4. **Context Usage**

```go
// Always pass context as first parameter
func ProcessRequest(ctx context.Context, data Data) error {
    // Use context for cancellation and timeouts
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()
    
    return doWork(ctx, data)
}
```

#### Microservice Implementation Pattern

Each microservice should follow this structure:

1. **Main Entry Point** (`cmd/service-name/main.go`)

```go
package main

import (
    "context"
    "log"
    "os"
    "os/signal"
    "syscall"
)

func main() {
    // Initialize service
    srv := initializeService()
    
    // Start server
    go srv.Start()
    
    // Graceful shutdown
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit
    
    log.Println("Shutting down server...")
    srv.Shutdown(context.Background())
}
```

2. **Service Layer** (business logic)
3. **Repository Layer** (data access)
4. **Handler Layer** (HTTP handlers)
5. **Models** (data structures)

#### Figma Integration Implementation

```go
package figma

import (
    "context"
    "net/http"
)

type Client struct {
    baseURL    string
    httpClient *http.Client
    token      string
}

func NewClient(token string) *Client {
    return &Client{
        baseURL:    "https://api.figma.com/v1",
        httpClient: &http.Client{},
        token:      token,
    }
}

func (c *Client) GetFile(ctx context.Context, fileKey string) (*File, error) {
    // Implementation
    return nil, nil
}
```

### Configuration Management

Use environment variables for configuration:

```go
type Config struct {
    Port        string `env:"PORT" envDefault:"8080"`
    DatabaseURL string `env:"DATABASE_URL,required"`
    FigmaToken  string `env:"FIGMA_TOKEN,required"`
}
```

---

## Testing Phase

### Objectives

- Ensure code correctness
- Validate business requirements through BDD/Gherkin scenarios
- Verify non-functional requirements
- Maintain high code coverage
- Bridge business language and technical implementation

### Behavior-Driven Development (BDD) with Gherkin

SAWai embraces BDD as a core testing methodology. Gherkin scenarios serve as **executable specifications** that:
- Document expected behavior in business language
- Create traceability from requirements to tests
- Enable AI to generate test implementations from scenarios
- Support the "Specification Quality" principle

#### Gherkin Scenario Structure

```gherkin
@TS-123456 @FR-789012 @critical
Feature: User Authentication
  As a registered user
  I want to log into the application
  So that I can access my personalized content

  Background:
    Given the application is running
    And the database is available

  Scenario: Successful login with valid credentials
    Given a registered user with email "user@example.com"
    And the user has password "SecurePass123"
    When the user navigates to the login page
    And the user enters their credentials
    And the user clicks the login button
    Then the user should be redirected to the dashboard
    And a session token should be created

  Scenario: Failed login with invalid password
    Given a registered user with email "user@example.com"
    When the user attempts to login with password "WrongPassword"
    Then an error message should display "Invalid credentials"
    And no session token should be created
```

### Testing Strategy

#### 1. Acceptance Testing (Gherkin/BDD)

Write Gherkin scenarios that map to requirements:

```gherkin
@TS-456789 @FR-123456
Scenario: Calculate order total with discount
  Given a shopping cart with the following items:
    | product    | price  | quantity |
    | Widget A   | 10.00  | 2        |
    | Widget B   | 15.00  | 1        |
  And a discount code "SAVE10" for 10% off
  When the user applies the discount code
  Then the order total should be "31.50"
  And the discount amount should be "3.50"
```

#### 2. Unit Testing

Test individual functions and methods:

```go
func TestCalculateTotal(t *testing.T) {
    tests := []struct {
        name     string
        input    []int
        expected int
    }{
        {"empty slice", []int{}, 0},
        {"single item", []int{5}, 5},
        {"multiple items", []int{1, 2, 3}, 6},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := CalculateTotal(tt.input)
            if result != tt.expected {
                t.Errorf("expected %d, got %d", tt.expected, result)
            }
        })
    }
}
```

#### 3. Integration Testing with Gherkin (Go - godog)

```go
// features/figma_integration.feature
// internal/testing/figma_steps_test.go

package testing

import (
    "context"
    "github.com/cucumber/godog"
)

type figmaContext struct {
    client   *figma.Client
    file     *figma.File
    err      error
}

func (ctx *figmaContext) aValidFigmaToken() error {
    ctx.client = figma.NewClient(os.Getenv("FIGMA_TOKEN"))
    return nil
}

func (ctx *figmaContext) iRequestFileWithKey(fileKey string) error {
    ctx.file, ctx.err = ctx.client.GetFile(context.Background(), fileKey)
    return nil
}

func (ctx *figmaContext) theFileShouldBeRetrievedSuccessfully() error {
    if ctx.err != nil {
        return fmt.Errorf("expected no error, got: %v", ctx.err)
    }
    if ctx.file == nil {
        return fmt.Errorf("expected file, got nil")
    }
    return nil
}

func InitializeScenario(ctx *godog.ScenarioContext) {
    fc := &figmaContext{}
    ctx.Step(`^a valid Figma token$`, fc.aValidFigmaToken)
    ctx.Step(`^I request file with key "([^"]*)"$`, fc.iRequestFileWithKey)
    ctx.Step(`^the file should be retrieved successfully$`, fc.theFileShouldBeRetrievedSuccessfully)
}
```

#### 4. React Component Testing with Gherkin (jest-cucumber)

```typescript
// features/login.feature → src/__tests__/login.steps.ts

import { defineFeature, loadFeature } from 'jest-cucumber';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginPage from '../pages/LoginPage';

const feature = loadFeature('./features/login.feature');

defineFeature(feature, (test) => {
  test('Successful login with valid credentials', ({ given, when, then, and }) => {
    given('a registered user with email "user@example.com"', () => {
      // Mock user exists in database
      mockUserService.createUser({ email: 'user@example.com' });
    });

    when('the user navigates to the login page', () => {
      render(<LoginPage />);
    });

    and('the user enters their credentials', () => {
      fireEvent.change(screen.getByLabelText('Email'), {
        target: { value: 'user@example.com' }
      });
      fireEvent.change(screen.getByLabelText('Password'), {
        target: { value: 'SecurePass123' }
      });
    });

    and('the user clicks the login button', () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    then('the user should be redirected to the dashboard', async () => {
      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
      });
    });
  });
});
```

#### 5. Contract Testing

Verify API contracts between services using tools like Pact.

#### 6. End-to-End Testing

Test complete user workflows across services using Gherkin scenarios.

### Test Tagging Convention

| Tag | Purpose | Example |
|-----|---------|---------|
| `@TS-XXXXXX` | Test Scenario ID | `@TS-123456` |
| `@TST-XXXXXX` | Test Suite ID | `@TST-789012` |
| `@FR-XXXXXX` | Functional Requirement link | `@FR-456789` |
| `@NFR-XXXXXX` | Non-Functional Requirement link | `@NFR-234567` |
| `@critical` | Critical priority | Must pass for release |
| `@smoke` | Smoke test | Quick validation |
| `@regression` | Regression test | Full test suite |
| `@automated` | Automation status | Currently automated |

### Testing Best Practices

- **Write Gherkin scenarios first** - Scenarios define expected behavior before code
- Write tests before or alongside implementation (TDD/BDD)
- Use table-driven tests for multiple scenarios
- Mock external dependencies
- Test error conditions
- Maintain test data fixtures
- Use meaningful test names
- Keep tests independent and isolated
- **Tag scenarios with requirement IDs** for traceability
- **Aim for 100% requirement coverage** - Every FR/NFR should have at least one test

### Test Coverage Requirements

| Metric | Target | Description |
|--------|--------|-------------|
| Requirement Coverage | 100% | Every requirement has tests |
| Scenario Pass Rate | ≥80% | Passing vs total executed |
| Critical Pass Rate | 100% | All @critical must pass |
| Unit Test Coverage | ≥80% | Code line coverage |

### Running Tests

```bash
# Run all Go tests
go test ./...

# Run Gherkin/BDD tests with godog
go test -v ./internal/testing/... -godog.format=pretty

# Run with coverage
go test -cover ./...

# Run specific tags
go test ./... -godog.tags=@smoke
go test ./... -godog.tags=@critical

# Run React/TypeScript tests with jest-cucumber
npm test -- --testPathPattern=steps

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

---

## Refactoring Phase

### Objectives

- Improve code quality without changing behavior
- Reduce technical debt
- Enhance maintainability
- Optimize performance

### Refactoring Activities

#### 1. Code Smells Identification

Common Go code smells:

- Long functions (>50 lines)
- Deeply nested logic (>3 levels)
- Repeated code
- Large interfaces
- Tight coupling
- Poor naming

#### 2. Refactoring Techniques

1. **Extract Function**
   - Break down long functions
   - Create reusable components

2. **Rename for Clarity**
   - Use descriptive names
   - Follow Go naming conventions

3. **Simplify Conditionals**
   - Use guard clauses
   - Extract complex conditions

4. **Remove Duplication**
   - Create shared utilities
   - Use generics where appropriate (Go 1.18+)

5. **Improve Error Handling**
   - Wrap errors with context
   - Use custom error types

#### 3. Refactoring Workflow

1. Ensure tests are passing
2. Make small, incremental changes
3. Run tests after each change
4. Commit frequently
5. Document significant refactorings

### Performance Optimization

- Profile before optimizing (`pprof`)
- Focus on bottlenecks
- Use benchmarks

```go
func BenchmarkProcessData(b *testing.B) {
    data := generateTestData()
    b.ResetTimer()
    
    for i := 0; i < b.N; i++ {
        ProcessData(data)
    }
}
```

---

## Reverse-to-Design Phase

### Objectives

- Ensure documentation reflects actual implementation
- Update architecture diagrams
- Maintain design-code consistency
- Capture architectural decisions

### Activities

#### 1. Code-to-Documentation Sync

- Update API documentation from code
- Generate OpenAPI specs from code annotations
- Update architecture diagrams
- Document design decisions (ADRs)

#### 2. Architecture Decision Records (ADRs)

Create ADRs for significant decisions:

```markdown
# ADR-001: Use Docker for Service Containerization

## Status
Accepted

## Context
We need a way to package and deploy microservices consistently across environments.

## Decision
We will use Docker for containerizing all microservices.

## Consequences
- Positive: Consistent deployment, isolation, portability
- Negative: Learning curve, resource overhead
- Mitigation: Provide Docker training, optimize images
```

#### 3. Living Documentation

- Keep documentation close to code
- Use code comments for godoc
- Maintain README files
- Update diagrams regularly

#### 4. Tools for Reverse Engineering

- `go doc` - Generate documentation
- PlantUML - Create diagrams from text
- Swagger/OpenAPI - API documentation
- Dependency graphs - Visualize service dependencies

---

## Retirement Phase

### Objectives

- Safely decommission obsolete services
- Migrate data if needed
- Update dependencies
- Remove technical debt

### Retirement Activities

#### 1. Decommissioning Strategy

1. **Identify Retirement Candidates**
   - Deprecated services
   - Unused features
   - Superseded capabilities

2. **Impact Analysis**
   - Identify dependencies
   - Assess data migration needs
   - Plan communication strategy

3. **Phased Retirement**
   - Deprecation notice
   - Feature flag for gradual removal
   - Migration period
   - Final decommission

#### 2. Data Migration

- Export critical data
- Migrate to new services
- Archive historical data
- Verify migration success

#### 3. Service Shutdown

```go
func (s *Service) Shutdown(ctx context.Context) error {
    log.Println("Starting graceful shutdown...")
    
    // Stop accepting new requests
    s.server.SetKeepAlivesEnabled(false)
    
    // Complete in-flight requests
    if err := s.server.Shutdown(ctx); err != nil {
        return fmt.Errorf("server shutdown failed: %w", err)
    }
    
    // Close database connections
    if err := s.db.Close(); err != nil {
        return fmt.Errorf("database close failed: %w", err)
    }
    
    log.Println("Shutdown complete")
    return nil
}
```

#### 4. Cleanup

- Remove code from repository
- Archive documentation
- Update deployment configurations
- Remove infrastructure resources

---

## Technology Stack

### Core Technologies

#### Backend

- **Language**: Go 1.21+
- **Web Framework**: net/http (standard library) or gin-gonic/gin
- **Database**: PostgreSQL, MongoDB (depending on service needs)
- **ORM**: GORM or sqlx
- **Migration**: golang-migrate

#### Containerization

- **Container Runtime**: Docker
- **Image Base**: golang:1.21-alpine
- **Orchestration**: Docker Compose (dev), Kubernetes (prod)

#### External Integrations

- **Figma API**: REST API integration for design assets
- **Client Library**: Custom Go client

#### DELM Service (Image Generation)

- **Service**: DELM (Design Element Language Model)
- **Port**: 3005 (default)
- **Runtime**: Python 3.9+
- **AI Backend**: mflux (Stable Diffusion for Apple Silicon)

**Features**:
- UI component mockups
- SVG icon generation
- Logo generation (requires mflux)
- Illustration generation (requires mflux)
- AI image generation (requires mflux)

**Setup**:
```bash
# Clone and install DELM
git clone https://github.com/jareynolds/delm.git
cd delm
pip3 install -r requirements.txt
python3 main.py

# For Stable Diffusion features (Apple Silicon)
pip3 install mflux
```

#### Frontend

- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: CSS with CSS Variables
- **State Management**: React Context

#### Development Tools

- **Version Control**: Git
- **CI/CD**: GitHub Actions
- **Code Quality**: golangci-lint
- **Testing**: Go testing package, testify
- **Documentation**: godoc, Swagger/OpenAPI

### Recommended Libraries

```go
// HTTP routing
"github.com/gorilla/mux"

// Configuration
"github.com/kelseyhightower/envconfig"

// Logging
"go.uber.org/zap"

// Testing
"github.com/stretchr/testify"

// Database
"github.com/jmoiron/sqlx"
"gorm.io/gorm"
```

---

## Best Practices

### Code Quality

1. **Simplicity** - Prefer simple solutions over complex ones
2. **Readability** - Write code for humans first
3. **Consistency** - Follow project conventions
4. **Documentation** - Document why, not what
5. **Testing** - Write tests for all public APIs

### Git Workflow

1. **Branching Strategy**
   - `main` - production-ready code
   - `develop` - integration branch
   - `feature/*` - feature branches
   - `fix/*` - bug fix branches

2. **Commit Messages**
   ```
   <type>: <subject>
   
   <body>
   
   <footer>
   ```
   Types: feat, fix, docs, style, refactor, test, chore

3. **Pull Requests**
   - Keep PRs small and focused
   - Write descriptive titles and descriptions
   - Link to issues
   - Request reviews
   - Ensure CI passes

### Security

1. **Dependency Management**
   - Keep dependencies updated
   - Review security advisories
   - Use `go mod verify`

2. **Secrets Management**
   - Never commit secrets
   - Use environment variables
   - Use secret management tools (Vault, etc.)

3. **Input Validation**
   - Validate all user input
   - Sanitize data
   - Use prepared statements

4. **Authentication/Authorization**
   - Implement proper auth mechanisms
   - Use JWT or OAuth2
   - Validate tokens
   - Implement rate limiting

### Monitoring and Observability

1. **Logging**
   - Use structured logging
   - Include context (request ID, user ID)
   - Log at appropriate levels
   - Don't log sensitive data

2. **Metrics**
   - Track key performance indicators
   - Monitor service health
   - Set up alerts

3. **Tracing**
   - Implement distributed tracing
   - Track request flow across services

### Performance

1. **Caching**
   - Cache expensive operations
   - Use appropriate TTLs
   - Implement cache invalidation

2. **Database Optimization**
   - Use indexes
   - Optimize queries
   - Implement connection pooling

3. **Concurrency**
   - Use goroutines appropriately
   - Implement proper synchronization
   - Avoid goroutine leaks

---

## Continuous Improvement

### Learning and Adaptation

- Conduct regular retrospectives
- Document lessons learned
- Update this guide based on experience
- Share knowledge across teams

### Metrics and KPIs

Track development metrics:

- Code coverage percentage
- Build success rate
- Deployment frequency
- Mean time to recovery (MTTR)
- Lead time for changes

### Feedback Loops

- Code reviews
- Pair programming
- Architecture reviews
- User feedback integration

---

## Conclusion

This guide provides a comprehensive framework for developing the UbeCode application using SAWai (Scaled Agile With AI) methodology. It should be treated as a living document, updated as the project evolves and new patterns emerge.

### Key Takeaways

1. **Specification quality drives AI outcomes** - Well-defined specs enable better AI-assisted development
2. **Capabilities drive development** - All work is organized around delivering business capabilities
3. **Reduced ceremony, increased value** - SAWai minimizes process overhead while maximizing delivery
4. **Quality is built-in** - Testing and refactoring are integral to the process
5. **Architecture evolves** - Design is continuously validated and updated
6. **AI amplifies delivery** - Focus on high-value work; let AI accelerate implementation

### Next Steps

1. Set up development environment
2. Initialize first microservice
3. Implement Figma integration
4. Establish CI/CD pipeline
5. Deploy to development environment

---

**Document Version**: 3.0
**Last Updated**: 2025-12-02
**Maintained By**: Development Team
**Methodology**: SAWai (Scaled Agile With AI)
