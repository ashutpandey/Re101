# Supabase Setup Guide

This project uses Supabase (PostgreSQL) instead of MongoDB for data persistence.

## Environment Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project
   - Copy your project URL and anon key

2. **Set Environment Variables**
   - Add to `.env` files:
     ```
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_ANON_KEY=your-anon-key
     ```

3. **Create Database Tables**
   - The migration script at `scripts/supabase-migration.sql` creates all necessary tables
   - Run it in Supabase SQL Editor or execute via CLI

## Database Schema

### Tools Table
- `id`: UUID (primary key)
- `name`: Text
- `desc`: Text
- `category`: Text
- `categoryLabel`: Text
- `categoryColor`: Text
- `categoryIcon`: Text
- `categoryDesc`: Text
- `url`: Text
- `free`: Boolean
- `platform`: Text
- `level`: Text
- `commonCommands`: JSON (optional)
- `automationScripts`: JSON (optional)

### People Table
- `id`: UUID (primary key)
- `name`: Text
- `title`: Text
- `bio`: Text
- `url`: Text
- `platform`: Text
- `category`: Text

### Blogs Table
- `id`: UUID (primary key)
- `title`: Text
- `desc`: Text
- `url`: Text
- `author`: Text
- `platform`: Text
- `category`: Text
- `created_at`: Timestamp

### Communities Table
- `id`: UUID (primary key)
- `reddits`: JSON (array of Reddit communities)
- `discords`: JSON (array of Discord servers)
- `created_at`: Timestamp
- `updated_at`: Timestamp

## Seeding Data

Run the seed script to populate initial data:
```bash
npm run seed
```

This will insert sample data into all tables.

## API Routes

All routes remain the same:
- `GET /api/tools` - Get all tools
- `GET /api/tools/:id` - Get specific tool
- `POST /api/tools` - Create new tool
- `PUT /api/tools/:id` - Update tool
- `DELETE /api/tools/:id` - Delete tool

Same pattern applies to `/api/people`, `/api/blogs`, and `/api/communities`.

## Deployment to Vercel

1. Add Supabase credentials to Vercel project settings:
   - Go to Vercel project → Settings → Environment Variables
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`

2. Deploy as normal:
   ```bash
   git push origin main
   ```

The application will automatically use Supabase for all database operations.
