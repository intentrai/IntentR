#!/bin/bash

# =============================================================================
# UbeCode Health Check Script
# =============================================================================
# Checks the health of all UbeCode services
# =============================================================================

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}${BLUE}========================================${NC}"
echo -e "${BOLD}${BLUE}  UbeCode Health Check${NC}"
echo -e "${BOLD}${BLUE}========================================${NC}"
echo ""

# Check function
check_service() {
    local name="$1"
    local url="$2"
    local timeout="${3:-5}"

    printf "  %-30s" "$name"

    if curl -s -f --max-time "$timeout" "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Healthy${NC}"
        return 0
    else
        echo -e "${RED}✗ Unhealthy${NC}"
        return 1
    fi
}

# Check process
check_process() {
    local name="$1"
    local pattern="$2"

    printf "  %-30s" "$name"

    if pgrep -f "$pattern" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not Running${NC}"
        return 1
    fi
}

FAILURES=0

echo -e "${BOLD}Docker Services:${NC}"
check_service "PostgreSQL" "http://localhost:6432" 2 || ((FAILURES++))
check_service "Integration Service" "http://localhost:9080/health" || ((FAILURES++))
check_service "Design Service" "http://localhost:9081/health" || ((FAILURES++))
check_service "Capability Service" "http://localhost:9082/health" || ((FAILURES++))
check_service "Auth Service" "http://localhost:9083/health" || ((FAILURES++))

echo ""
echo -e "${BOLD}Node.js Services:${NC}"
check_service "Specification API" "http://localhost:4001/api/health" || ((FAILURES++))
check_service "Collaboration Server" "http://localhost:9084" 2 || ((FAILURES++))
check_service "Shared Workspace API" "http://localhost:4002/api/health" || ((FAILURES++))
check_service "Claude CLI Proxy" "http://localhost:9085/health" || ((FAILURES++))

echo ""
echo -e "${BOLD}Frontend:${NC}"
check_service "Web UI" "http://localhost:6173" || ((FAILURES++))

echo ""
echo -e "${BOLD}Infrastructure:${NC}"
check_process "Docker" "dockerd" || ((FAILURES++))
check_process "Nginx" "nginx" || ((FAILURES++))
check_process "PM2" "pm2" || ((FAILURES++))

echo ""
echo -e "${BOLD}Docker Container Status:${NC}"
docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo -e "${YELLOW}  Docker Compose not available${NC}"

echo ""
echo -e "${BOLD}PM2 Process Status:${NC}"
pm2 jlist 2>/dev/null | jq -r '.[] | "  \(.name): \(.pm2_env.status)"' 2>/dev/null || echo -e "${YELLOW}  PM2 not available${NC}"

echo ""
echo -e "${BOLD}System Resources:${NC}"
echo -e "  CPU Load:    $(uptime | awk -F'load average:' '{print $2}')"
echo -e "  Memory:      $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
echo -e "  Disk:        $(df -h / | awk 'NR==2 {print $3 "/" $2 " (" $5 " used)"}')"

echo ""
if [ $FAILURES -eq 0 ]; then
    echo -e "${BOLD}${GREEN}All services healthy!${NC}"
else
    echo -e "${BOLD}${RED}$FAILURES service(s) unhealthy${NC}"
    exit 1
fi
echo ""
