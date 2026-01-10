git branch -vv


git checkout Tumpa 
git push -u origin Tumpa 

git checkout Dev 
git push -u origin Dev



npx prisma generate
npx tsx src/script.ts
npx tsx scripts/seed.ts
npx prisma validate
npx prisma migrate dev --name init_category
npm install @prisma/adapter-pg pg

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Push schema changes (development only)
npx prisma db push

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database
npx ts-node prisma/seeds/index.ts