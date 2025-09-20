# Supabase Database Workflow

This package is configured for **remote-first** database operations with local development support via Docker.

⚠️ **Important**: Your remote database uses PostGIS geometry types, which are not fully supported in local Supabase development. **Use Option 1 (Remote Database)** for the most reliable workflow.

## 🚀 Quick Start

1. **Install Docker Desktop** (required for local development):
   - Download from: https://docs.docker.com/desktop/
   - Start Docker Desktop

2. **Login to Supabase CLI:**
   ```bash
   cd packages/database
   npx supabase login
   ```

3. **Link to your remote project:**
   ```bash
   npx supabase link --project-ref pbnutmoiwykadzkqviay
   ```

4. **Start local Supabase services:**
   ```bash
   npx supabase start
   ```

5. **Sync local database with remote:**
   ```bash
   npx supabase db pull
   ```

## 📋 Available Commands

### From the monorepo root:
```bash
npm run db:pull          # Pull schema from remote to local
npm run db:push          # Push migrations to remote
npm run db:diff          # Generate schema diff
npm run db:types         # Generate TypeScript types
npm run db:migration:new # Create new migration
npm run db:backup        # Backup remote data
npm run db:status        # List Supabase projects
```

### From packages/database directory:
```bash
# All commands must be run from packages/database directory
npx supabase db pull                    # Pull schema from remote to local
npx supabase db push                    # Push migrations to remote
npx supabase db diff                    # Generate schema diff
npx supabase gen types typescript --project-id=pbnutmoiwykadzkqviay > src/types/database.ts
npx supabase migration new "name"       # Create new migration
npx supabase migration list             # List migrations
npx supabase db dump --data-only > backup_$(date +%Y%m%d_%H%M%S).sql
npx supabase projects list              # List Supabase projects
npx supabase db reset                   # Reset local database
```

## 🔄 Visual DB Tool Workflow

### Using DbSchema or DBeaver:

**Option 1: Work with Remote Database (Recommended - PostGIS Compatible)**
1. **Connect visual tool to REMOTE database:**
   - Host: `aws-1-eu-central-1.pooler.supabase.com`
   - Port: `5432`
   - Database: `postgres`
   - Username: `postgres.pbnutmoiwykadzkqviay`
   - Password: (from your Supabase project settings)

2. **Make changes in your visual tool**

3. **Create migration manually:**
   ```bash
   # From packages/database directory
   npx supabase migration new "descriptive_name"
   ```

4. **Write SQL changes** into the migration file

5. **Push to remote:**
   ```bash
   # From packages/database directory
   npx supabase db push
   ```

6. **Generate updated types:**
   ```bash
   # From packages/database directory
   npx supabase gen types typescript --project-id=pbnutmoiwykadzkqviay > src/types/database.ts
   ```

**Option 2: Work with Local Database (Advanced - PostGIS Issues)**
⚠️ **Note**: This option has PostGIS compatibility issues with local Supabase setup.

1. **Ensure local Supabase is running:**
   ```bash
   cd packages/database
   npx supabase start
   ```

2. **Connect visual tool to LOCAL database:**
   - Host: `localhost`
   - Port: `54322`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `postgres`

3. **Make changes in your visual tool**

4. **Create migration manually:**
   ```bash
   # From packages/database directory
   npx supabase migration new "descriptive_name"
   ```

5. **Write SQL changes** into the migration file

6. **Push to remote:**
   ```bash
   # From packages/database directory
   npx supabase db push
   ```

## ⚠️ Important Notes

- **Always backup before changes:** `npx supabase db dump --data-only > backup_$(date +%Y%m%d_%H%M%S).sql`
- **Test migrations locally first** (if possible)
- **Review generated SQL** before pushing
- **Use descriptive migration names**
- **Keep migrations small and focused**
- **All commands must be run from `packages/database` directory**

## 🔧 Troubleshooting

### Authentication Issues:
```bash
cd packages/database
npx supabase login
npx supabase link --project-ref pbnutmoiwykadzkqviay
```

### Connection Issues:
- Check your Supabase project settings for database connection details
- Ensure your IP is whitelisted in Supabase (if using IP restrictions)
- Verify Docker is running for local development

### Migration Issues:
- Check migration file syntax
- Ensure migration files are in `supabase/migrations/`
- Use `npx supabase migration list` to see applied migrations

### Local Development Issues:
- Ensure Docker Desktop is running
- Check if local Supabase services are running: `npx supabase status`
- Restart services if needed: `npx supabase stop && npx supabase start`
