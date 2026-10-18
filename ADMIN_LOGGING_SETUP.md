# Admin Logging & Dev Auth Setup Guide

## ✅ Changes Made

### 1. **Removed Hardcoded Dev Credentials**
- **File:** `lib/devAuth.ts`
- **Change:** Moved hardcoded passwords to environment variables
  ```typescript
  // BEFORE (vulnerable):
  email: "admin@example.com",
  password: "Admin123!"
  
  // AFTER (secure):
  email: process.env.DEV_ADMIN_EMAIL || "admin@example.com",
  password: process.env.DEV_ADMIN_PASSWORD || ""
  ```

### 2. **Updated Environment Files**
- **`.env.local`** (NEVER commit to Git)
  - Removed hardcoded JWT secret
  - Added placeholder dev credentials (UNCOMMENTED FOR LOCAL USE ONLY)
  - Contains actual sensitive values

- **`.env.example`** (Safe to commit)
  - Template file showing structure
  - All sensitive values are placeholder/redacted
  - Safe to share with team

### 3. **Created GitHub Audit Logging System**
- **File:** `lib/githubAuditLogger.ts`
- **Features:**
  - Logs admin actions to local JSON file (`logs/admin-audit.jsonl`)
  - Automatically sanitizes passwords, tokens, secrets
  - Pushes audit logs to GitHub repository
  - Queries historical audit data
  - Optional Telegram real-time notifications

---

## 🔐 Setup Instructions

### Step 1: Configure Local Environment

Edit `.env.local` and uncomment the dev credentials section:

```bash
# Development-Only Auth Credentials (ONLY IN .env.local, NEVER in Git)
DEV_ADMIN_EMAIL=admin@example.com
DEV_ADMIN_PASSWORD=YourSecureDevPassword123!
DEV_ADMIN_EMAIL_2=admin@anua.com
DEV_ADMIN_PASSWORD_2=YourSecureDevPassword123!
DEV_ADMIN_EMAIL_3=help.anuaglobal@gmail.com
DEV_ADMIN_PASSWORD_3=YourSecureDevPassword123!
DEV_CUSTOMER_EMAIL=user@example.com
DEV_CUSTOMER_PASSWORD=YourSecureCustomerPassword123!

# Change these to secure random values!
JWT_SECRET=your-secure-random-jwt-secret-min-32-chars
```

### Step 2: Configure GitHub Audit Logging

#### Option A: Direct GitHub Push (Recommended)

1. Ensure git is initialized and remote is configured:
   ```bash
   git remote -v  # Should show origin pointing to your repo
   ```

2. Create `logs/.gitkeep` so the directory is tracked:
   ```bash
   mkdir -p logs && touch logs/.gitkeep && git add logs/.gitkeep
   ```

3. Use the audit logger in your admin routes:
   ```typescript
   import { logAdminActionWithGitHub } from "@/lib/githubAuditLogger";
   
   // In your admin API route (e.g., /api/admin/create-product):
   await logAdminActionWithGitHub({
     adminEmail: user.email,
     action: "Created new product",
     category: "Products",
     details: { productId, name, price },
     status: "success"
   });
   ```

4. Set up a daily cron job to push logs:
   ```typescript
   // Create: app/api/admin/push-audit-logs/route.ts
   import { pushAuditLogsToGitHub } from "@/lib/githubAuditLogger";
   
   export async function GET() {
     const success = await pushAuditLogsToGitHub();
     return Response.json({ success });
   }
   ```

#### Option B: Telegram Notifications (Real-time)

Configure Telegram bot token in `.env.local`:
```bash
TELEGRAM_BOT_TOKEN=your-bot-token-here
TELEGRAM_CHAT_ID=your-channel-or-group-id
```

The audit logger will automatically send notifications when admin actions occur.

---

## 📋 Usage Examples

### Log an Admin Action

```typescript
import { logAdminActionWithGitHub } from "@/lib/githubAuditLogger";

// In any admin API route:
await logAdminActionWithGitHub({
  adminEmail: "admin@anua.com",
  action: "Deleted user account",
  category: "Users",
  details: {
    deletedUserEmail: "malicious-user@example.com",
    reason: "Suspicious activity detected"
  },
  status: "success"
});
```

### Query Audit Logs

```typescript
import { queryAuditLogs } from "@/lib/githubAuditLogger";

// Fetch logs for a specific admin
const adminLogs = await queryAuditLogs({
  adminEmail: "admin@anua.com",
  limit: 50
});

// Fetch logs by category and date range
const productLogs = await queryAuditLogs({
  category: "Products",
  startDate: new Date("2026-01-01"),
  endDate: new Date("2026-07-31")
});
```

### Manual Push to GitHub

```typescript
import { pushAuditLogsToGitHub } from "@/lib/githubAuditLogger";

// Manually push audit logs to GitHub
const success = await pushAuditLogsToGitHub();
console.log(success ? "✅ Pushed" : "❌ No changes");
```

---

## 🔍 Audit Log Format

Audit logs are stored in `logs/admin-audit.jsonl` (one JSON object per line):

```json
{
  "timestamp": "2026-07-31T14:30:45.123Z",
  "adminEmail": "admin@anua.com",
  "action": "Created promotion code",
  "category": "Promotions",
  "details": {
    "voucherCode": "SUMMER25",
    "discountPercent": 25,
    "password": "***REDACTED***"
  },
  "status": "success"
}
```

### Key Features
✅ **Sensitive data automatically redacted** (passwords, tokens, secrets)
✅ **Timestamped entries** for audit trail
✅ **Queryable by admin, category, date range**
✅ **Commitable to GitHub** for compliance
✅ **Real-time Telegram alerts** for critical actions

---

## 🚀 GitHub Workflow Setup

### Add a GitHub Actions Workflow (Optional)

Create `.github/workflows/audit-logs.yml`:

```yaml
name: Push Admin Audit Logs

on:
  schedule:
    # Daily at midnight UTC
    - cron: "0 0 * * *"
  workflow_dispatch:

jobs:
  push-logs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      
      - name: Push Audit Logs
        run: npm run push:audit-logs
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### Add npm script to `package.json`:

```json
{
  "scripts": {
    "push:audit-logs": "node -e \"require('./lib/githubAuditLogger').pushAuditLogsToGitHub()\"",
    "query:audit-logs": "node -e \"require('./lib/githubAuditLogger').queryAuditLogs().then(logs => console.log(JSON.stringify(logs, null, 2)))\""
  }
}
```

---

## 🛡️ Security Best Practices

1. **Never commit `.env.local`** to Git
2. **Keep `.env.example` safe** - only placeholder values
3. **Rotate dev passwords** regularly
4. **Use strong JWT_SECRET** - minimum 32 characters
5. **Review audit logs weekly** for suspicious activity
6. **Store GitHub tokens securely** (use Actions secrets, not .env)

---

## ❌ What Was Removed

Hardcoded credentials that were previously in the repo:

```typescript
// DELETED from lib/devAuth.ts
email: "admin@example.com",
password: "Admin123!",  // ❌ Hardcoded plaintext password

email: "help.anuaglobal@gmail.com",
password: "Admin123!",  // ❌ Hardcoded plaintext password

// DELETED from .env.local / .env.example
JWT_SECRET=anua-clean-skincare-secret-key-2026  // ❌ Default/predictable secret
```

---

## ✨ Next Steps

1. ✅ Uncomment dev credentials in `.env.local` (local file only)
2. ✅ Generate a strong JWT_SECRET and add to `.env.local`
3. ✅ Create `logs/` directory and add `.gitkeep`
4. ✅ Set up Telegram bot (optional but recommended)
5. ✅ Create GitHub Actions workflow for daily log pushes
6. ✅ Add audit logging calls to admin API routes
7. ✅ Review `.gitignore` to ensure `.env.local` is never committed

---

## 📞 Support

For questions on setting up audit logging or GitHub integration, refer to:
- `lib/githubAuditLogger.ts` - Implementation details
- `.env.example` - Configuration template
- `lib/devAuth.ts` - Dev account setup

