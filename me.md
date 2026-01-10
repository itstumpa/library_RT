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