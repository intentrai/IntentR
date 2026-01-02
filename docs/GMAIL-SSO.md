# Google OAuth (Gmail SSO) Configuration Guide

This guide explains how to configure Google OAuth/SSO to enable "Sign in with Google" functionality in IntentR.

## Overview

IntentR supports Google OAuth 2.0 for single sign-on (SSO) authentication. When configured, users can sign in using their Google/Gmail accounts instead of creating separate credentials.

## Prerequisites

- A Google Cloud Console account
- Access to the IntentR server environment variables
- The Auth Service running (port 9083)

## Step 1: Create Google OAuth Credentials

### 1.1 Go to Google Cloud Console

1. Navigate to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one

### 1.2 Enable OAuth APIs

1. Go to **APIs & Services** > **Library**
2. Search for and enable:
   - Google+ API (or Google People API)
   - Google Identity Services

### 1.3 Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (or Internal for Google Workspace)
3. Fill in the required fields:
   - **App name**: IntentR (or your application name)
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Add test users if in testing mode

### 1.4 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application**
4. Configure:
   - **Name**: IntentR Web Client
   - **Authorized JavaScript origins**:
     - `http://YOUR_PUBLIC_IP` (e.g., `http://52.10.123.45`)
     - `https://yourdomain.com` (if using a domain name)
   - **Authorized redirect URIs**:
     - `http://YOUR_PUBLIC_IP/auth/google/callback` (e.g., `http://52.10.123.45/auth/google/callback`)
     - `https://yourdomain.com/auth/google/callback` (if using a domain name)
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

> **Important**: Replace `YOUR_PUBLIC_IP` with your actual server's public IP address. If you have a domain name pointing to your server, use that instead for a cleaner setup.

## Step 2: Configure Environment Variables

Add the following environment variables to your IntentR deployment:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URL=http://YOUR_PUBLIC_IP/auth/google/callback
```

### Environment Variable Details

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Console | `123456789-abc.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Console | `GOCSPX-xxxxxxxxxxxxx` |
| `GOOGLE_REDIRECT_URL` | Callback URL (must match Google Console exactly) | `http://52.10.123.45/auth/google/callback` |

> **Critical**: The `GOOGLE_REDIRECT_URL` must **exactly match** one of the Authorized redirect URIs you configured in Google Cloud Console, including the protocol (`http://` or `https://`).

### Where to Set Environment Variables

**For this deployment**, add to `/data/IntentR/.env`:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URL=http://YOUR_PUBLIC_IP/auth/google/callback
```

**For Docker deployment**, add to your `.env` file or `docker-compose.yml`:

```yaml
services:
  auth-service:
    environment:
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - GOOGLE_REDIRECT_URL=${GOOGLE_REDIRECT_URL}
```

## Step 3: Restart the Auth Service

After configuring the environment variables, restart the Auth Service:

```bash
# If using the start script
./stop.sh
./start.sh

# Or restart just the auth service
# (method depends on your deployment)
```

### Verify Configuration

Check the Auth Service logs for confirmation:

```
Google OAuth configured successfully
```

If credentials are missing, you'll see:

```
Google OAuth not configured (missing client ID or secret)
```

## Step 4: Test the Integration

1. Navigate to the IntentR login page
2. Click "Sign in with Google"
3. You should be redirected to Google's OAuth consent screen
4. After authenticating, you'll be redirected back to IntentR
5. A new user account is automatically created if one doesn't exist

## How It Works

### Authentication Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Login Page    │     │  Auth Service   │     │  Google OAuth   │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │  Click "Sign in      │                       │
         │  with Google"        │                       │
         │──────────────────────>│                       │
         │                       │                       │
         │  Return Google URL   │                       │
         │<──────────────────────│                       │
         │                       │                       │
         │  Redirect to Google  │                       │
         │───────────────────────────────────────────────>
         │                       │                       │
         │                       │    User authenticates │
         │                       │<──────────────────────│
         │                       │                       │
         │  Callback with code  │                       │
         │──────────────────────>│                       │
         │                       │                       │
         │                       │  Exchange code       │
         │                       │  for token           │
         │                       │──────────────────────>│
         │                       │                       │
         │                       │  Return user info    │
         │                       │<──────────────────────│
         │                       │                       │
         │  Return JWT + user   │                       │
         │<──────────────────────│                       │
         │                       │                       │
         │  Redirect to app     │                       │
         │                       │                       │
```

### User Auto-Provisioning

When a user signs in with Google for the first time:

1. The system checks if a user with that email exists
2. If not, a new user account is automatically created with:
   - Email from Google account
   - Name from Google profile
   - Default role: `product_owner`
   - No password (OAuth-only authentication)
3. The user is logged in and receives a JWT token

### Security Features

- **CSRF Protection**: State tokens with 5-minute expiration
- **JWT Tokens**: 24-hour session validity
- **Secure Storage**: Tokens stored in sessionStorage (tab-specific)
- **Minimal Scopes**: Only requests email and profile information

## Troubleshooting

### "Google OAuth not configured" in logs

**Cause**: Missing `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET`

**Solution**: Verify environment variables are set and the Auth Service was restarted

### "redirect_uri_mismatch" error from Google

**Cause**: The callback URL doesn't match Google Console configuration

**Solution**:
1. Check `GOOGLE_REDIRECT_URL` matches exactly what's in Google Console
2. Include the full URL with protocol (`http://` or `https://`)
3. Ensure no trailing slash differences

### "Invalid state token" error

**Cause**: CSRF token expired or was tampered with

**Solution**:
1. Try the login flow again (state tokens expire after 5 minutes)
2. Ensure cookies are enabled in the browser
3. Check for clock sync issues between client and server

### User created but with wrong role

**Cause**: OAuth users default to `product_owner` role

**Solution**: An admin can change the user's role in the Admin Panel after they've logged in

### OAuth not working on public IP

**Cause**: Redirect URL mismatch or not configured in Google Console

**Solution**:
1. Ensure your public IP is added to Google Console's authorized redirect URIs
2. The `GOOGLE_REDIRECT_URL` environment variable must exactly match what's in Google Console
3. Include the full URL: `http://YOUR_PUBLIC_IP/auth/google/callback`
4. Verify nginx is correctly proxying to the Auth Service

> **Note**: Google OAuth works with HTTP on public IPs for development/testing, but HTTPS is recommended for production.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/google/login` | GET | Initiates OAuth flow, returns Google auth URL |
| `/api/auth/google/callback` | GET | Handles OAuth callback, returns JWT token |

## File Locations

| File | Purpose |
|------|---------|
| `internal/auth/oauth.go` | OAuth configuration and token exchange |
| `internal/auth/handler.go` | HTTP handlers for OAuth endpoints |
| `internal/auth/service.go` | User creation for OAuth users |
| `cmd/auth-service/main.go` | Service initialization and env var loading |
| `web-ui/src/context/AuthContext.tsx` | Frontend OAuth state management |
| `web-ui/src/pages/Login.tsx` | Google sign-in button UI |
| `web-ui/src/pages/GoogleCallback.tsx` | Callback page handler |

## Configuration Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth credentials (Client ID and Secret) created
- [ ] Your server's public IP added to **Authorized JavaScript origins** in Google Console
- [ ] `http://YOUR_PUBLIC_IP/auth/google/callback` added to **Authorized redirect URIs** in Google Console
- [ ] `GOOGLE_CLIENT_ID` environment variable set in `/data/IntentR/.env`
- [ ] `GOOGLE_CLIENT_SECRET` environment variable set in `/data/IntentR/.env`
- [ ] `GOOGLE_REDIRECT_URL` environment variable set (must match Google Console exactly)
- [ ] Auth Service restarted after configuration (`./stop.sh` then `./start.sh`)
- [ ] Test login flow end-to-end

### For Production with HTTPS

- [ ] Domain name configured and pointing to server
- [ ] SSL certificate configured in nginx
- [ ] Update Google Console redirect URIs to use `https://`
- [ ] Update `GOOGLE_REDIRECT_URL` to use `https://`

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Scopes for Google APIs](https://developers.google.com/identity/protocols/oauth2/scopes)
