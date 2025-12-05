#!/bin/bash

# =============================================================================
# UbeCode AWS EC2 Deployment Script
# =============================================================================
# This script sets up a fresh AWS EC2 instance with all dependencies required
# to run the UbeCode application.
#
# Recommended EC2 Instance: t3.medium or larger (2 vCPU, 4GB RAM minimum)
# Recommended OS: Ubuntu 22.04 LTS or Amazon Linux 2023
#
# Usage:
#   1. Launch an EC2 instance with Ubuntu 22.04 LTS
#   2. SSH into the instance: ssh -i your-key.pem ubuntu@your-ec2-ip
#   3. Clone the repo: git clone https://github.com/your-org/UbeCode.git
#   4. Run this script: cd UbeCode && chmod +x scripts/aws/deploy-ec2.sh && ./scripts/aws/deploy-ec2.sh
#
# =============================================================================

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/opt/ubecode"
APP_USER="ubecode"
GITHUB_REPO="${GITHUB_REPO:-https://github.com/your-org/UbeCode.git}"
BRANCH="${BRANCH:-main}"

# Detect OS
detect_os() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$ID
        OS_VERSION=$VERSION_ID
    elif [ -f /etc/amazon-linux-release ]; then
        OS="amzn"
    else
        OS=$(uname -s)
    fi
    echo -e "${CYAN}Detected OS: $OS${NC}"
}

# Print header
print_header() {
    echo ""
    echo -e "${BOLD}${BLUE}========================================${NC}"
    echo -e "${BOLD}${BLUE}  UbeCode EC2 Deployment Script${NC}"
    echo -e "${BOLD}${BLUE}========================================${NC}"
    echo ""
}

# Print section
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

# Update system packages
update_system() {
    print_section "Updating System Packages"

    case $OS in
        ubuntu|debian)
            apt-get update -y
            apt-get upgrade -y
            apt-get install -y curl wget git build-essential software-properties-common
            ;;
        amzn|rhel|centos|fedora)
            yum update -y
            yum install -y curl wget git gcc gcc-c++ make
            ;;
        *)
            echo -e "${RED}Unsupported OS: $OS${NC}"
            exit 1
            ;;
    esac

    echo -e "${GREEN}System packages updated${NC}"
}

# Install Docker
install_docker() {
    print_section "Installing Docker"

    if command -v docker &> /dev/null; then
        echo -e "${GREEN}Docker already installed: $(docker --version)${NC}"
        return
    fi

    case $OS in
        ubuntu|debian)
            # Install Docker using official script
            curl -fsSL https://get.docker.com -o get-docker.sh
            sh get-docker.sh
            rm get-docker.sh

            # Install Docker Compose
            apt-get install -y docker-compose-plugin
            ;;
        amzn)
            # Amazon Linux 2023
            yum install -y docker
            systemctl start docker
            systemctl enable docker

            # Install Docker Compose
            curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            chmod +x /usr/local/bin/docker-compose
            ;;
        *)
            echo -e "${RED}Unsupported OS for Docker installation${NC}"
            exit 1
            ;;
    esac

    # Start and enable Docker
    systemctl start docker
    systemctl enable docker

    echo -e "${GREEN}Docker installed: $(docker --version)${NC}"
}

# Install Node.js (v20 LTS)
install_nodejs() {
    print_section "Installing Node.js v20 LTS"

    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        echo -e "${GREEN}Node.js already installed: $NODE_VERSION${NC}"
        return
    fi

    case $OS in
        ubuntu|debian)
            curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
            apt-get install -y nodejs
            ;;
        amzn|rhel|centos|fedora)
            curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
            yum install -y nodejs
            ;;
        *)
            echo -e "${RED}Unsupported OS for Node.js installation${NC}"
            exit 1
            ;;
    esac

    # Install global packages
    npm install -g pm2

    echo -e "${GREEN}Node.js installed: $(node --version)${NC}"
    echo -e "${GREEN}npm installed: $(npm --version)${NC}"
    echo -e "${GREEN}PM2 installed: $(pm2 --version)${NC}"
}

# Install Go
install_go() {
    print_section "Installing Go 1.24"

    if command -v go &> /dev/null; then
        GO_VERSION=$(go version)
        echo -e "${GREEN}Go already installed: $GO_VERSION${NC}"
        return
    fi

    GO_VERSION="1.24.0"
    wget -q "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" -O /tmp/go.tar.gz
    rm -rf /usr/local/go
    tar -C /usr/local -xzf /tmp/go.tar.gz
    rm /tmp/go.tar.gz

    # Set up Go environment
    echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile.d/go.sh
    echo 'export GOPATH=/home/'$APP_USER'/go' >> /etc/profile.d/go.sh
    echo 'export PATH=$PATH:$GOPATH/bin' >> /etc/profile.d/go.sh
    source /etc/profile.d/go.sh

    echo -e "${GREEN}Go installed: $(/usr/local/go/bin/go version)${NC}"
}

# Create application user
create_app_user() {
    print_section "Creating Application User"

    if id "$APP_USER" &>/dev/null; then
        echo -e "${GREEN}User $APP_USER already exists${NC}"
    else
        useradd -r -m -s /bin/bash "$APP_USER"
        echo -e "${GREEN}User $APP_USER created${NC}"
    fi

    # Add user to docker group
    usermod -aG docker "$APP_USER"

    # Create application directory
    mkdir -p "$APP_DIR"
    chown -R "$APP_USER:$APP_USER" "$APP_DIR"

    echo -e "${GREEN}Application directory: $APP_DIR${NC}"
}

# Clone or update repository
setup_repository() {
    print_section "Setting Up Repository"

    if [ -d "$APP_DIR/.git" ]; then
        echo -e "${YELLOW}Repository already exists. Pulling latest changes...${NC}"
        cd "$APP_DIR"
        sudo -u "$APP_USER" git fetch origin
        sudo -u "$APP_USER" git checkout "$BRANCH"
        sudo -u "$APP_USER" git pull origin "$BRANCH"
    else
        echo -e "${CYAN}Cloning repository...${NC}"

        # If we're running from within the repo, copy instead of clone
        if [ -f "$(dirname "$0")/../../CLAUDE.md" ]; then
            echo -e "${YELLOW}Running from within repo, copying files...${NC}"
            SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
            cp -r "$SCRIPT_DIR"/* "$APP_DIR/"
            cp -r "$SCRIPT_DIR"/.env.example "$APP_DIR/" 2>/dev/null || true
            cp -r "$SCRIPT_DIR"/.gitignore "$APP_DIR/" 2>/dev/null || true
        else
            sudo -u "$APP_USER" git clone "$GITHUB_REPO" "$APP_DIR"
            cd "$APP_DIR"
            sudo -u "$APP_USER" git checkout "$BRANCH"
        fi
    fi

    chown -R "$APP_USER:$APP_USER" "$APP_DIR"
    echo -e "${GREEN}Repository ready at $APP_DIR${NC}"
}

# Setup environment file
setup_environment() {
    print_section "Setting Up Environment"

    ENV_FILE="$APP_DIR/.env"

    if [ -f "$ENV_FILE" ]; then
        echo -e "${YELLOW}.env file already exists${NC}"
    else
        if [ -f "$APP_DIR/.env.example" ]; then
            cp "$APP_DIR/.env.example" "$ENV_FILE"
        else
            # Create default .env file
            cat > "$ENV_FILE" << 'EOF'
# =============================================================================
# UbeCode Production Environment Configuration
# =============================================================================

# Database Configuration
DATABASE_URL=postgresql://ubecode_user:ubecode_password@localhost:6432/ubecode_db
DB_HOST=postgres
DB_PORT=5432
DB_USER=ubecode_user
DB_PASSWORD=ubecode_password
DB_NAME=ubecode_db

# JWT Authentication (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google OAuth (Optional - for Google login)
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=http://your-domain.com/auth/google/callback

# Claude AI API Key (for AI features)
ANTHROPIC_API_KEY=

# Figma Integration (Optional)
FIGMA_TOKEN=

# Server Configuration
NODE_ENV=production
LOG_LEVEL=info

# Port Configuration (usually don't need to change)
PORT=9083
EOF
        fi

        echo -e "${YELLOW}Please edit $ENV_FILE with your actual configuration values${NC}"
    fi

    chown "$APP_USER:$APP_USER" "$ENV_FILE"
    chmod 600 "$ENV_FILE"
}

# Install application dependencies
install_dependencies() {
    print_section "Installing Application Dependencies"

    cd "$APP_DIR"

    # Install Node.js dependencies for web-ui
    echo -e "${CYAN}Installing web-ui dependencies...${NC}"
    cd "$APP_DIR/web-ui"
    sudo -u "$APP_USER" npm install

    # Build web-ui for production
    echo -e "${CYAN}Building web-ui for production...${NC}"
    sudo -u "$APP_USER" npm run build

    cd "$APP_DIR"

    # Build Go services
    echo -e "${CYAN}Building Go services...${NC}"
    export PATH=$PATH:/usr/local/go/bin

    # Build Claude Proxy
    if [ -f "$APP_DIR/cmd/claude-proxy/main.go" ]; then
        echo -e "${CYAN}Building Claude CLI Proxy...${NC}"
        sudo -u "$APP_USER" /usr/local/go/bin/go build -o "$APP_DIR/bin/claude-proxy" ./cmd/claude-proxy/
    fi

    echo -e "${GREEN}Dependencies installed${NC}"
}

# Setup systemd services
setup_systemd_services() {
    print_section "Setting Up Systemd Services"

    # Copy service files
    cp "$APP_DIR/scripts/aws/systemd/"*.service /etc/systemd/system/ 2>/dev/null || {
        echo -e "${YELLOW}Creating systemd service files...${NC}"
        create_systemd_services
    }

    # Reload systemd
    systemctl daemon-reload

    # Enable services
    systemctl enable ubecode-docker.service
    systemctl enable ubecode-nodejs.service
    systemctl enable ubecode-frontend.service

    echo -e "${GREEN}Systemd services configured${NC}"
}

# Create systemd service files
create_systemd_services() {
    # Docker services (PostgreSQL and Go microservices)
    cat > /etc/systemd/system/ubecode-docker.service << EOF
[Unit]
Description=UbeCode Docker Services
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
User=root
Group=docker

[Install]
WantedBy=multi-user.target
EOF

    # Node.js backend services
    cat > /etc/systemd/system/ubecode-nodejs.service << EOF
[Unit]
Description=UbeCode Node.js Services
After=ubecode-docker.service
Wants=ubecode-docker.service

[Service]
Type=forking
WorkingDirectory=$APP_DIR/web-ui
ExecStart=/usr/bin/pm2 start ecosystem.config.js
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
User=$APP_USER
Environment=NODE_ENV=production
PIDFile=/home/$APP_USER/.pm2/pm2.pid

[Install]
WantedBy=multi-user.target
EOF

    # Frontend service (serves built static files)
    cat > /etc/systemd/system/ubecode-frontend.service << EOF
[Unit]
Description=UbeCode Frontend Server
After=ubecode-nodejs.service
Wants=ubecode-nodejs.service

[Service]
Type=simple
WorkingDirectory=$APP_DIR/web-ui
ExecStart=/usr/bin/npx serve -s dist -l 6173
User=$APP_USER
Environment=NODE_ENV=production
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

    echo -e "${GREEN}Systemd service files created${NC}"
}

# Create PM2 ecosystem config
create_pm2_config() {
    print_section "Creating PM2 Configuration"

    cat > "$APP_DIR/web-ui/ecosystem.config.js" << 'EOF'
module.exports = {
  apps: [
    {
      name: 'specification-api',
      script: 'server.js',
      cwd: '/opt/ubecode/web-ui',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4001
      }
    },
    {
      name: 'collaboration-server',
      script: 'collaboration-server.js',
      cwd: '/opt/ubecode/web-ui',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 9084
      }
    },
    {
      name: 'shared-workspace-server',
      script: 'shared-workspace-server.js',
      cwd: '/opt/ubecode/web-ui',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 4002
      }
    },
    {
      name: 'claude-proxy',
      script: '/opt/ubecode/bin/claude-proxy',
      cwd: '/opt/ubecode',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      interpreter: 'none',
      env: {
        PORT: 9085
      }
    }
  ]
};
EOF

    chown "$APP_USER:$APP_USER" "$APP_DIR/web-ui/ecosystem.config.js"
    echo -e "${GREEN}PM2 configuration created${NC}"
}

# Setup Nginx (optional, for reverse proxy)
setup_nginx() {
    print_section "Setting Up Nginx Reverse Proxy"

    case $OS in
        ubuntu|debian)
            apt-get install -y nginx
            ;;
        amzn|rhel|centos|fedora)
            yum install -y nginx
            ;;
    esac

    # Create Nginx config
    cat > /etc/nginx/sites-available/ubecode << 'EOF'
upstream frontend {
    server 127.0.0.1:6173;
}

upstream integration_api {
    server 127.0.0.1:9080;
}

upstream design_api {
    server 127.0.0.1:9081;
}

upstream capability_api {
    server 127.0.0.1:9082;
}

upstream auth_api {
    server 127.0.0.1:9083;
}

upstream collaboration_ws {
    server 127.0.0.1:9084;
}

upstream spec_api {
    server 127.0.0.1:4001;
}

upstream workspace_api {
    server 127.0.0.1:4002;
}

server {
    listen 80;
    server_name _;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API endpoints
    location /api/integration/ {
        proxy_pass http://integration_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/design/ {
        proxy_pass http://design_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/capability/ {
        proxy_pass http://capability_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/auth/ {
        proxy_pass http://auth_api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/specifications/ {
        proxy_pass http://spec_api/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/workspaces/ {
        proxy_pass http://workspace_api/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket for collaboration
    location /socket.io/ {
        proxy_pass http://collaboration_ws;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF

    # Enable site
    if [ -d /etc/nginx/sites-enabled ]; then
        ln -sf /etc/nginx/sites-available/ubecode /etc/nginx/sites-enabled/
        rm -f /etc/nginx/sites-enabled/default
    else
        # Amazon Linux / RHEL style
        cp /etc/nginx/sites-available/ubecode /etc/nginx/conf.d/ubecode.conf
    fi

    # Test and restart Nginx
    nginx -t
    systemctl restart nginx
    systemctl enable nginx

    echo -e "${GREEN}Nginx configured${NC}"
}

# Configure firewall
configure_firewall() {
    print_section "Configuring Firewall"

    case $OS in
        ubuntu|debian)
            if command -v ufw &> /dev/null; then
                ufw allow 22/tcp    # SSH
                ufw allow 80/tcp    # HTTP
                ufw allow 443/tcp   # HTTPS
                ufw allow 6173/tcp  # Frontend (if not using Nginx)
                ufw --force enable
                echo -e "${GREEN}UFW firewall configured${NC}"
            fi
            ;;
        amzn|rhel|centos|fedora)
            if command -v firewall-cmd &> /dev/null; then
                firewall-cmd --permanent --add-service=ssh
                firewall-cmd --permanent --add-service=http
                firewall-cmd --permanent --add-service=https
                firewall-cmd --permanent --add-port=6173/tcp
                firewall-cmd --reload
                echo -e "${GREEN}Firewalld configured${NC}"
            fi
            ;;
    esac

    echo -e "${YELLOW}Note: Also configure AWS Security Group to allow inbound traffic on ports 80, 443, and 6173${NC}"
}

# Start all services
start_services() {
    print_section "Starting Services"

    # Start Docker services
    echo -e "${CYAN}Starting Docker services...${NC}"
    systemctl start ubecode-docker.service

    # Wait for Docker services to be healthy
    sleep 10

    # Start Node.js services via PM2
    echo -e "${CYAN}Starting Node.js services...${NC}"
    cd "$APP_DIR/web-ui"
    sudo -u "$APP_USER" pm2 start ecosystem.config.js
    sudo -u "$APP_USER" pm2 save

    # Setup PM2 to start on boot
    env PATH=$PATH:/usr/bin pm2 startup systemd -u "$APP_USER" --hp /home/"$APP_USER"

    # Start frontend service
    echo -e "${CYAN}Starting frontend service...${NC}"
    systemctl start ubecode-frontend.service

    echo -e "${GREEN}All services started${NC}"
}

# Print completion message
print_completion() {
    echo ""
    echo -e "${BOLD}${GREEN}========================================${NC}"
    echo -e "${BOLD}${GREEN}  UbeCode Deployment Complete!${NC}"
    echo -e "${BOLD}${GREEN}========================================${NC}"
    echo ""
    echo -e "${BOLD}Service URLs:${NC}"
    echo -e "  ${CYAN}Frontend (Web UI):${NC}       http://YOUR_EC2_IP:6173"
    echo -e "  ${CYAN}Or via Nginx:${NC}            http://YOUR_EC2_IP"
    echo ""
    echo -e "${BOLD}Service Ports:${NC}"
    echo -e "  ${CYAN}Integration Service:${NC}     9080"
    echo -e "  ${CYAN}Design Service:${NC}          9081"
    echo -e "  ${CYAN}Capability Service:${NC}      9082"
    echo -e "  ${CYAN}Auth Service:${NC}            9083"
    echo -e "  ${CYAN}Collaboration Server:${NC}    9084"
    echo -e "  ${CYAN}Claude CLI Proxy:${NC}        9085"
    echo -e "  ${CYAN}Specification API:${NC}       4001"
    echo -e "  ${CYAN}Shared Workspace API:${NC}    4002"
    echo -e "  ${CYAN}PostgreSQL:${NC}              6432"
    echo ""
    echo -e "${BOLD}Management Commands:${NC}"
    echo -e "  ${CYAN}Check Docker services:${NC}   docker compose ps"
    echo -e "  ${CYAN}Check Node.js services:${NC} pm2 status"
    echo -e "  ${CYAN}View Docker logs:${NC}       docker compose logs -f"
    echo -e "  ${CYAN}View PM2 logs:${NC}          pm2 logs"
    echo -e "  ${CYAN}Restart all:${NC}            systemctl restart ubecode-*"
    echo ""
    echo -e "${BOLD}${YELLOW}IMPORTANT:${NC}"
    echo -e "  1. Edit ${CYAN}$APP_DIR/.env${NC} with your configuration"
    echo -e "  2. Configure AWS Security Group for ports 80, 443, 6173"
    echo -e "  3. Set up SSL certificate for HTTPS (recommended)"
    echo -e "  4. Update GOOGLE_REDIRECT_URL with your domain"
    echo ""
}

# Main function
main() {
    print_header
    check_root
    detect_os

    update_system
    install_docker
    install_nodejs
    install_go
    create_app_user
    setup_repository
    setup_environment
    install_dependencies
    create_pm2_config
    setup_systemd_services
    setup_nginx
    configure_firewall
    start_services

    print_completion
}

# Run main function
main "$@"
