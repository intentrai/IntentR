# UbeCode AWS EC2 Deployment Guide

This guide provides step-by-step instructions for deploying UbeCode on an AWS EC2 instance.

## Prerequisites

- AWS Account with EC2 access
- SSH key pair for EC2 access
- Domain name (optional, for production)

## Recommended EC2 Instance

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Instance Type | t3.medium | t3.large |
| vCPU | 2 | 2+ |
| Memory | 4 GB | 8 GB |
| Storage | 30 GB SSD | 50 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 22.04 LTS |

## Quick Start

### 1. Launch EC2 Instance

1. Go to AWS Console > EC2 > Launch Instance
2. Select **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
3. Choose instance type (t3.medium or larger)
4. Configure instance details:
   - Enable "Auto-assign Public IP"
5. Add storage: 30 GB minimum (gp3 recommended)
6. Configure Security Group:
   ```
   SSH (22)        - Your IP
   HTTP (80)       - 0.0.0.0/0
   HTTPS (443)     - 0.0.0.0/0
   Custom (6173)   - 0.0.0.0/0  (Direct frontend access)
   ```
7. Launch with your key pair

### 2. Connect to Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 3. Clone Repository

```bash
git clone https://github.com/your-org/UbeCode.git
cd UbeCode
```

### 4. Run Deployment Script

```bash
chmod +x scripts/aws/deploy-ec2.sh
sudo ./scripts/aws/deploy-ec2.sh
```

This script will:
- Update system packages
- Install Docker, Node.js 20, and Go 1.24
- Create application user and directories
- Clone/update the repository
- Install all dependencies
- Build the frontend
- Set up systemd services
- Configure Nginx reverse proxy
- Start all services

### 5. Configure Environment

Edit the environment file with your credentials:

```bash
sudo nano /opt/ubecode/.env
```

Required configurations:
- `JWT_SECRET` - Generate with: `openssl rand -base64 64`
- `ANTHROPIC_API_KEY` - For AI features
- `GOOGLE_CLIENT_ID/SECRET` - For Google OAuth (optional)
- `FIGMA_TOKEN` - For Figma integration (optional)

### 6. Restart Services

```bash
sudo systemctl restart ubecode-docker.service
sudo -u ubecode pm2 restart all
```

## Service Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        Nginx (Port 80/443)                    │
│                      Reverse Proxy + SSL                      │
└──────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   Frontend    │   │  Node.js APIs   │   │ Go Microservices│
│   (6173)      │   │  (PM2 managed)  │   │    (Docker)     │
└───────────────┘   └─────────────────┘   └─────────────────┘
                              │                     │
                    ┌─────────┴─────────┐          │
                    │                   │          │
              ┌─────┴─────┐     ┌───────┴───────┐  │
              │ Spec API  │     │ Collab Server │  │
              │  (4001)   │     │    (9084)     │  │
              └───────────┘     └───────────────┘  │
                                                   │
        ┌──────────────────────────────────────────┘
        │
┌───────┴───────────────────────────────────────────────────────┐
│                    Docker Compose Services                      │
├─────────────────┬─────────────────┬─────────────────┬─────────┤
│ Integration     │ Design          │ Capability      │ Auth    │
│ Service (9080)  │ Service (9081)  │ Service (9082)  │ (9083)  │
└─────────────────┴─────────────────┴─────────────────┴─────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
              ┌─────┴─────┐     ┌───────┴───────┐
              │PostgreSQL │     │ Claude Proxy  │
              │  (6432)   │     │    (9085)     │
              └───────────┘     └───────────────┘
```

## Management Commands

### Service Control

```bash
# Check all service status
systemctl status ubecode-docker.service
pm2 status
systemctl status ubecode-frontend.service

# Restart Docker services (Go microservices + PostgreSQL)
sudo systemctl restart ubecode-docker.service

# Restart Node.js services
sudo -u ubecode pm2 restart all

# Restart frontend
sudo systemctl restart ubecode-frontend.service

# Stop everything
sudo systemctl stop ubecode-docker.service
sudo -u ubecode pm2 stop all
sudo systemctl stop ubecode-frontend.service
```

### View Logs

```bash
# Docker service logs
docker compose logs -f

# Specific Docker service
docker compose logs -f integration-service

# PM2 logs (all Node.js services)
sudo -u ubecode pm2 logs

# Specific PM2 service
sudo -u ubecode pm2 logs specification-api

# Nginx access log
sudo tail -f /var/log/nginx/access.log
```

### Update Deployment

```bash
cd /opt/ubecode
sudo ./scripts/aws/update-deployment.sh

# Force rebuild Docker containers
sudo ./scripts/aws/update-deployment.sh --rebuild
```

## SSL/HTTPS Setup

### Option 1: Let's Encrypt (Recommended for single instance)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

### Option 2: AWS Certificate Manager (For ALB/CloudFront)

1. Request a certificate in ACM
2. Create an Application Load Balancer
3. Add HTTPS listener with ACM certificate
4. Update Security Group to allow ALB traffic

## Troubleshooting

### Services Not Starting

```bash
# Check Docker
sudo systemctl status docker
docker compose ps

# Check specific service logs
docker compose logs integration-service

# Check PM2
sudo -u ubecode pm2 status
sudo -u ubecode pm2 logs
```

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Connect to database
docker compose exec postgres psql -U ubecode_user -d ubecode_db
```

### Frontend Not Loading

```bash
# Check if built
ls -la /opt/ubecode/web-ui/dist

# Rebuild if needed
cd /opt/ubecode/web-ui
sudo -u ubecode npm run build

# Check Nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Port Conflicts

```bash
# Check what's using a port
sudo lsof -i :9080

# Kill process if needed
sudo kill -9 <PID>
```

## Security Recommendations

1. **Change default passwords** in `.env`
2. **Use strong JWT secret**: `openssl rand -base64 64`
3. **Enable HTTPS** with Let's Encrypt or AWS ACM
4. **Restrict SSH access** to your IP in Security Group
5. **Regular updates**: Run `sudo apt update && sudo apt upgrade`
6. **Enable AWS CloudWatch** for monitoring
7. **Set up automated backups** for PostgreSQL data volume

## Backup PostgreSQL Data

```bash
# Create backup
docker compose exec postgres pg_dump -U ubecode_user ubecode_db > backup.sql

# Restore backup
docker compose exec -T postgres psql -U ubecode_user ubecode_db < backup.sql
```

## Scaling Considerations

For higher traffic:

1. **Vertical scaling**: Upgrade to larger instance (t3.xlarge, m5.large)
2. **Horizontal scaling**:
   - Use AWS RDS for PostgreSQL
   - Deploy multiple EC2 instances behind ALB
   - Use ElastiCache for session storage
3. **CDN**: Use CloudFront for static assets

## Support

For issues, check:
1. This README
2. Main project documentation in `/docs`
3. GitHub Issues
