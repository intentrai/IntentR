#!/bin/bash

# =============================================================================
# UbeCode Update Deployment Script
# =============================================================================
# This script updates an existing UbeCode deployment with the latest changes
# from the git repository.
#
# Usage:
#   ./scripts/aws/update-deployment.sh [--rebuild]
#
# Options:
#   --rebuild    Force rebuild of Docker containers
#
# =============================================================================

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
APP_DIR="/opt/ubecode"
APP_USER="ubecode"
REBUILD=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --rebuild)
            REBUILD=true
            shift
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}========================================${NC}"
    echo -e "${BOLD}${BLUE}  UbeCode Update Deployment${NC}"
    echo -e "${BOLD}${BLUE}========================================${NC}"
    echo ""
}

print_section() {
    echo ""
    echo -e "${BOLD}${YELLOW}>>> $1${NC}"
    echo ""
}

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${YELLOW}This script requires root privileges. Re-running with sudo...${NC}"
        exec sudo "$0" "$@"
    fi
}

# Pull latest code
pull_latest() {
    print_section "Pulling Latest Changes"

    cd "$APP_DIR"

    # Stash any local changes
    sudo -u "$APP_USER" git stash 2>/dev/null || true

    # Pull latest
    sudo -u "$APP_USER" git pull origin main

    echo -e "${GREEN}Code updated${NC}"
}

# Stop services
stop_services() {
    print_section "Stopping Services"

    # Stop PM2 services
    echo -e "${CYAN}Stopping Node.js services...${NC}"
    sudo -u "$APP_USER" pm2 stop all 2>/dev/null || true

    # Stop frontend service
    echo -e "${CYAN}Stopping frontend service...${NC}"
    systemctl stop ubecode-frontend.service 2>/dev/null || true

    # Stop Docker services
    if [ "$REBUILD" = true ]; then
        echo -e "${CYAN}Stopping Docker services...${NC}"
        cd "$APP_DIR"
        docker compose down
    fi

    echo -e "${GREEN}Services stopped${NC}"
}

# Update dependencies
update_dependencies() {
    print_section "Updating Dependencies"

    cd "$APP_DIR/web-ui"

    # Update Node.js dependencies
    echo -e "${CYAN}Updating Node.js dependencies...${NC}"
    sudo -u "$APP_USER" npm install

    # Rebuild frontend
    echo -e "${CYAN}Rebuilding frontend...${NC}"
    sudo -u "$APP_USER" npm run build

    # Rebuild Go services if needed
    if [ "$REBUILD" = true ]; then
        echo -e "${CYAN}Rebuilding Go services...${NC}"
        cd "$APP_DIR"
        export PATH=$PATH:/usr/local/go/bin

        if [ -f "$APP_DIR/cmd/claude-proxy/main.go" ]; then
            sudo -u "$APP_USER" /usr/local/go/bin/go build -o "$APP_DIR/bin/claude-proxy" ./cmd/claude-proxy/
        fi
    fi

    echo -e "${GREEN}Dependencies updated${NC}"
}

# Restart services
restart_services() {
    print_section "Restarting Services"

    cd "$APP_DIR"

    # Start Docker services
    if [ "$REBUILD" = true ]; then
        echo -e "${CYAN}Rebuilding and starting Docker services...${NC}"
        docker compose up -d --build
    else
        echo -e "${CYAN}Restarting Docker services...${NC}"
        docker compose restart
    fi

    # Wait for Docker services
    sleep 10

    # Start PM2 services
    echo -e "${CYAN}Starting Node.js services...${NC}"
    cd "$APP_DIR/web-ui"
    sudo -u "$APP_USER" pm2 start ecosystem.config.js 2>/dev/null || sudo -u "$APP_USER" pm2 restart all
    sudo -u "$APP_USER" pm2 save

    # Start frontend service
    echo -e "${CYAN}Starting frontend service...${NC}"
    systemctl start ubecode-frontend.service

    # Restart Nginx
    systemctl reload nginx 2>/dev/null || true

    echo -e "${GREEN}Services restarted${NC}"
}

# Verify services
verify_services() {
    print_section "Verifying Services"

    echo -e "${CYAN}Checking Docker services...${NC}"
    docker compose ps

    echo ""
    echo -e "${CYAN}Checking Node.js services...${NC}"
    sudo -u "$APP_USER" pm2 status

    echo ""
    echo -e "${CYAN}Checking service health...${NC}"

    # Check health endpoints
    services=(
        "http://localhost:9080/health:Integration Service"
        "http://localhost:9081/health:Design Service"
        "http://localhost:9082/health:Capability Service"
        "http://localhost:9083/health:Auth Service"
        "http://localhost:4001/api/health:Specification API"
        "http://localhost:4002/api/health:Workspace API"
        "http://localhost:6173:Frontend"
    )

    for service in "${services[@]}"; do
        url="${service%%:*}"
        name="${service##*:}"
        if curl -s -f "$url" > /dev/null 2>&1; then
            echo -e "  ${GREEN}✓${NC} $name"
        else
            echo -e "  ${RED}✗${NC} $name"
        fi
    done
}

# Main
main() {
    print_header
    check_root

    pull_latest
    stop_services
    update_dependencies
    restart_services
    verify_services

    echo ""
    echo -e "${BOLD}${GREEN}Update complete!${NC}"
    echo ""
}

main "$@"
