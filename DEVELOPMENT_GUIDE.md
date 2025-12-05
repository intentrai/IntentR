# SAFe Capability-Driven Development Guide for Claude Code

## Overview

This document provides comprehensive guidance for Claude Code to design, analyze, implement, test, refactor, reverse-to-design, and retire software applications using the SAFe (Scaled Agile Framework) capability-driven framework. This serves as the single source of truth for all software development activities in the UbeCode project.

## Table of Contents

1. [SAFe Framework Principles](#safe-framework-principles)
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

## SAFe Framework Principles

### Core Values

1. **Alignment** - Synchronize strategy and execution across the organization
2. **Built-in Quality** - Ensure quality at every development stage
3. **Transparency** - Make work visible to enable collaboration
4. **Program Execution** - Focus on working systems and business outcomes

### Capability-Driven Approach

Capabilities are higher-level solution behaviors that typically span multiple ARTs (Agile Release Trains) and value streams. Each capability:

- Delivers value to end-users
- Is documented with clear acceptance criteria
- Can be broken down into features and stories
- Has measurable business outcomes

### Lean-Agile Principles

1. Take an economic view
2. Apply systems thinking
3. Assume variability; preserve options
4. Build incrementally with fast, integrated learning cycles
5. Base milestones on objective evaluation of working systems
6. Visualize and limit WIP, reduce batch sizes, manage queue lengths
7. Apply cadence, synchronize with cross-domain planning
8. Unlock the intrinsic motivation of knowledge workers
9. Decentralize decision-making
10. Organize around value

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

### Capability Development Workflow

```
Capability Definition → Feature Breakdown → Story Implementation → Testing → Integration → Deployment
```

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
- Validate business requirements
- Verify non-functional requirements
- Maintain high code coverage

### Testing Strategy

#### 1. Unit Testing

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

#### 2. Integration Testing

Test service integrations:

```go
func TestFigmaClientIntegration(t *testing.T) {
    if testing.Short() {
        t.Skip("skipping integration test")
    }
    
    client := figma.NewClient(os.Getenv("FIGMA_TOKEN"))
    file, err := client.GetFile(context.Background(), "test-file-key")
    
    if err != nil {
        t.Fatalf("failed to get file: %v", err)
    }
    
    if file == nil {
        t.Error("expected file, got nil")
    }
}
```

#### 3. Contract Testing

Verify API contracts between services using tools like Pact.

#### 4. End-to-End Testing

Test complete user workflows across services.

### Testing Best Practices

- Write tests before or alongside implementation (TDD)
- Use table-driven tests for multiple scenarios
- Mock external dependencies
- Test error conditions
- Maintain test data fixtures
- Use meaningful test names
- Keep tests independent and isolated

### Running Tests

```bash
# Run all tests
go test ./...

# Run with coverage
go test -cover ./...

# Run integration tests
go test -tags=integration ./...

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

This guide provides a comprehensive framework for developing the UbeCode application using SAFe capability-driven principles. It should be treated as a living document, updated as the project evolves and new patterns emerge.

### Key Takeaways

1. **Capabilities drive development** - All work is organized around delivering capabilities
2. **Quality is built-in** - Testing and refactoring are integral to the process
3. **Architecture evolves** - Design is continuously validated and updated
4. **Microservices enable scale** - Services are independent and scalable
5. **Documentation is essential** - Keep design and code in sync

### Next Steps

1. Set up development environment
2. Initialize first microservice
3. Implement Figma integration
4. Establish CI/CD pipeline
5. Deploy to development environment

---

**Document Version**: 1.1
**Last Updated**: 2025-11-23
**Maintained By**: Development Team
