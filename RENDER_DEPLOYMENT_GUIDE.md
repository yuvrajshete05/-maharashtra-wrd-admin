# 🚀 Deploy Maharashtra WRD Admin to Render

## ✅ Prerequisites Complete

Your project is now **ready for deployment** on Render! Here's what we've prepared:

### 📦 Build Configuration
- ✅ **package.json**: Updated with dynamic port support `${PORT:-3005}`
- ✅ **next.config.js**: Optimized for production deployment
- ✅ **render.yaml**: Deployment configuration file created
- ✅ **Build Test**: Production build successful (8/8 pages compiled)
- ✅ **Dependencies**: All required packages included

---

## 🎯 Deployment Steps

### Step 1: Push to GitHub (Already Done ✅)
```bash
git add .
git commit -m "Prepare for Render deployment - Add render.yaml and optimize build"
git push origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (recommended)
3. Connect your GitHub account to Render

### Step 3: Deploy from GitHub
1. **Click "New +"** in Render dashboard
2. **Select "Web Service"**
3. **Connect Repository**: `yuvrajshete05/-maharashtra-wrd-admin`
4. **Configure Service**:

```yaml
Name: maharashtra-wrd-admin
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: npm ci && npm run build
Start Command: npm run start
```

### Step 4: Environment Variables
Add these environment variables in Render:

```bash
NODE_ENV=production
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_APP_URL=https://your-app-name.onrender.com
```

### Step 5: Advanced Settings
```yaml
Instance Type: Free
Auto-Deploy: Yes (recommended)
Health Check Path: /
```

---

## 🔧 Configuration Details

### render.yaml Features
```yaml
services:
  - type: web
    name: maharashtra-wrd-admin
    env: node
    plan: free                    # Free tier
    buildCommand: npm ci && npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
    healthCheckPath: /
```

### Port Configuration
Your app automatically detects Render's PORT:
```json
"start": "next start -p ${PORT:-3005}"
```

### Build Optimizations
- ✅ Static optimization enabled
- ✅ SWC minification active
- ✅ Compression enabled
- ✅ Security headers configured

---

## 🌐 After Deployment

### Your App Will Be Available At:
```
https://maharashtra-wrd-admin.onrender.com
```

### Default Routes:
- **Homepage**: `/` → Redirects to `/admin/login`
- **Admin Login**: `/admin/login`
- **Nominee Login**: `/welcome`
- **Dashboard**: `/admin/dashboard`

### Test User Accounts:
Based on your existing test data:
```javascript
// Admin Login
Email: admin@test.com
Password: admin123

// Test if you have nominee accounts
Email: nominee@test.com  
Password: nominee123
```

---

## 🐛 Troubleshooting

### Common Issues:

#### 1. Build Fails
- Check all imports are correct
- Ensure no unused API endpoints
- ✅ Fixed: Removed unused session API

#### 2. MongoDB Connection
```javascript
// Add to environment variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

#### 3. Environment Variables
Make sure to add in Render dashboard:
- `NODE_ENV=production`
- `MONGODB_URI=your-connection-string`
- `JWT_SECRET=your-secret-key`

#### 4. Port Issues
- ✅ Fixed: Using `${PORT:-3005}` for dynamic port
- Render automatically assigns PORT

### 5. First Deployment Takes Time
- First deployment: 5-10 minutes
- Subsequent deployments: 2-5 minutes
- Free tier may have cold starts

---

## 📊 Performance Expectations

### Free Tier Limits:
- **RAM**: 512 MB
- **CPU**: Shared
- **Bandwidth**: 100 GB/month
- **Build Time**: 500 build minutes/month
- **Sleep**: After 15 minutes of inactivity

### Load Times:
- **Cold Start**: 10-30 seconds (first request after sleep)
- **Warm Requests**: 1-3 seconds
- **Static Assets**: Fast (CDN cached)

---

## 🔄 Auto-Deploy Setup

With render.yaml configuration:
1. **Auto-deploy enabled** from `main` branch
2. Every `git push` triggers new deployment
3. **Build logs** available in Render dashboard
4. **Rollback** available if needed

---

## 🎯 Production Checklist

### ✅ Completed:
- [x] Build configuration optimized
- [x] Dynamic port configuration
- [x] Production Next.js config
- [x] Render.yaml deployment file
- [x] Build test successful
- [x] Session management browser-only
- [x] Logout buttons on all pages

### 🚀 Ready to Deploy:
Your Maharashtra WRD Admin System is **production-ready** for Render deployment!

### 📝 Next Steps:
1. Go to [render.com](https://render.com)
2. Connect your GitHub repository
3. Deploy with the configuration above
4. Add environment variables
5. Test your live application

---

## 🎉 Success!

Once deployed, your government admin portal will be live and accessible worldwide with:
- ✅ Browser-only session management
- ✅ Multi-location access support
- ✅ Bilingual interface (English/Marathi)
- ✅ Professional government design
- ✅ Secure authentication system
- ✅ Mobile-responsive layout

**Your app will be live at**: `https://maharashtra-wrd-admin.onrender.com` 🚀