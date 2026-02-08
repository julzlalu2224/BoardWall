# Deployment Guide for BoardWall

This guide covers deploying BoardWall to production using various hosting platforms.

## Prerequisites

- GitHub repository with your code
- Environment variables configured
- Production database ready

## Frontend Deployment (Vercel)

### Step 1: Prepare Your Frontend

```bash
cd frontend
npm install
npm run build
```

### Step 2: Deploy to Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel Dashboard:
- Go to your project settings
- Add environment variable:
  - `VITE_API_URL`: Your backend API URL

### Alternative: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repository
4. Set root directory to `frontend`
5. Add environment variables
6. Deploy

## Backend Deployment (Render)

### Step 1: Prepare Your Backend

Ensure your `package.json` has production scripts:
```json
{
  "scripts": {
    "start": "node dist/main",
    "build": "nest build"
  }
}
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: boardwall-backend
   - **Root Directory**: backend
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Plan**: Choose your plan

### Step 3: Add Environment Variables

In Render Dashboard, add:
```
DATABASE_URL=your-database-url
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
FRONTEND_URL=your-frontend-url
```

### Step 4: Run Database Migrations

After first deployment, run in Render Shell:
```bash
npx prisma migrate deploy
npx prisma db seed
```

## Database Deployment (Supabase)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for database to be ready
4. Get your connection string from Settings → Database

### Step 2: Configure Connection

Your DATABASE_URL format:
```
postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### Step 3: Run Migrations

```bash
cd backend
DATABASE_URL="your-supabase-url" npx prisma migrate deploy
DATABASE_URL="your-supabase-url" npx prisma db seed
```

## Alternative: Database on Neon

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Get connection string
4. Use it as DATABASE_URL

## Alternative: Backend on Railway

### Step 1: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: backend
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:prod`

### Step 2: Add Environment Variables

Same as Render configuration above.

### Step 3: Add PostgreSQL

1. In Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway will auto-generate DATABASE_URL
4. Connect it to your backend service

## Docker Deployment (Self-Hosted)

### Step 1: Prepare Your Server

Install Docker and Docker Compose on your server:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Step 2: Clone Repository

```bash
git clone https://github.com/julzlalu2224/BoardWall.git
cd BoardWall
```

### Step 3: Configure Environment

Create `.env` files:

Backend (.env):
```bash
DATABASE_URL=postgresql://boardwall:boardwall123@postgres:5432/boardwall
JWT_SECRET=your-production-secret-here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-secret-here
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
```

Frontend (.env):
```bash
VITE_API_URL=http://your-server-ip:3001
```

### Step 4: Deploy

```bash
docker-compose up -d
```

### Step 5: Run Migrations

```bash
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npx prisma db seed
```

## SSL/HTTPS Configuration

### Option 1: Cloudflare (Recommended)

1. Add your domain to Cloudflare
2. Update DNS records:
   - A record: `@` → Your server IP
   - A record: `api` → Your server IP
3. Enable "Full" SSL mode
4. Cloudflare handles SSL automatically

### Option 2: Let's Encrypt with Nginx

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Environment Variables Checklist

### Backend
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ JWT_EXPIRES_IN
- ✅ REFRESH_TOKEN_SECRET
- ✅ REFRESH_TOKEN_EXPIRES_IN
- ✅ PORT
- ✅ NODE_ENV
- ✅ FRONTEND_URL

### Frontend
- ✅ VITE_API_URL

## Post-Deployment Checklist

- [ ] Frontend is accessible
- [ ] Backend API is responding
- [ ] Database migrations ran successfully
- [ ] Seed data loaded (if needed)
- [ ] Environment variables set correctly
- [ ] SSL certificate installed
- [ ] CORS configured properly
- [ ] API documentation accessible
- [ ] Error logging configured
- [ ] Backup strategy in place

## Monitoring and Maintenance

### Application Monitoring

Use services like:
- Sentry for error tracking
- LogRocket for session replay
- New Relic for performance monitoring

### Database Backups

For Supabase:
- Automatic backups included in paid plans
- Manual backups via Dashboard

For Self-hosted:
```bash
# Backup
docker-compose exec postgres pg_dump -U boardwall boardwall > backup.sql

# Restore
docker-compose exec -T postgres psql -U boardwall boardwall < backup.sql
```

### Updates

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up -d --build

# Run new migrations
docker-compose exec backend npx prisma migrate deploy
```

## Troubleshooting

### Frontend can't connect to backend
- Check VITE_API_URL is correct
- Verify CORS settings in backend
- Check network/firewall rules

### Database connection failed
- Verify DATABASE_URL format
- Check database is running
- Verify credentials
- Check IP whitelist (Supabase/Neon)

### Build failures
- Clear node_modules and reinstall
- Check Node.js version (20+)
- Verify all dependencies installed

## Cost Estimates

### Free Tier
- Vercel: Free for frontend
- Render: Free tier available (limited)
- Supabase: Free tier includes 500MB database
- **Total**: $0/month (with limitations)

### Production Tier
- Vercel Pro: $20/month
- Render Standard: $7/month
- Supabase Pro: $25/month
- **Total**: ~$52/month

### Scale Tier
- Vercel Enterprise: Custom
- Render Pro: $25/month
- Supabase Team: $599/month
- **Total**: From $624/month

## Support

For deployment issues:
- Check documentation: https://github.com/julzlalu2224/BoardWall
- Open an issue: https://github.com/julzlalu2224/BoardWall/issues
- Email: support@boardwall.com