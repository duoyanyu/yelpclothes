# ClothesReview - Setup Guide

## What Was Fixed

The errors you encountered were due to:

1. **NextAuth Configuration Issue**: Using `PrismaAdapter` with `CredentialsProvider` is incompatible
   - **Fix**: Removed PrismaAdapter and using JWT sessions only

2. **Database Not Initialized**: The SQLite database didn't exist
   - **Fix**: Created the database with all necessary tables

3. **Missing Type Definitions**: NextAuth types weren't properly extended
   - **Fix**: Added type definitions in `src/types/next-auth.d.ts`

## Quick Start

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```

### 3. Open Your Browser
Navigate to: http://localhost:3000

## Creating Your First Account

1. Go to http://localhost:3000/auth/signup
2. Fill in:
   - **Name**: Your name
   - **Email**: Any email (e.g., test@example.com)
   - **Password**: At least 6 characters
   - **Measurements** (optional): Height, weight, body type
3. Click "Sign Up"
4. You'll be automatically redirected to the homepage

## Test the Features

### Add a Product
1. Go to http://localhost:3000/products/add
2. Fill in the product details:
   - Name (e.g., "Classic Cotton T-Shirt")
   - Brand (e.g., "Nike")
   - Category (select from dropdown)
   - Price Range (select from dropdown)
   - Description (optional)
   - Image URL (optional - use any image URL like https://via.placeholder.com/300)
3. Click "Create Product"

### Write a Review
1. Go to the product page you just created
2. Click "Write a Review"
3. Fill in all the rating fields (1-5 stars each):
   - Overall Rating
   - Fit Accuracy
   - Comfort
   - Value for Money
   - Durability
4. Write your review (minimum 50 characters)
5. Add fit information:
   - Size purchased
   - Your usual size
   - Fit description (runs small/true to size/runs large)
6. Add photo URLs (optional, 3-5 URLs separated by commas)
7. Click "Submit Review"

### Browse Products
- **Homepage**: See trending and recently reviewed products
- **Search**: Use the search bar to find products by name or brand
- **Filter**: Filter by rating or photos only
- **Sort**: Sort by newest, highest rated, or most helpful

## Database Location

Your SQLite database is located at:
```
prisma/dev.db
```

You can inspect it using any SQLite browser tool, or use the Prisma Studio:
```bash
# Note: This requires Prisma CLI engines which may not be available
npx prisma studio
```

## Troubleshooting

### If you still see NextAuth errors:
1. Make sure `.env` file exists with these values:
   ```
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="dev-secret-key-change-in-production"
   NEXTAUTH_URL="http://localhost:3000"
   ```

2. Restart the development server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

### If the database seems empty:
The database is created automatically. If you want to reset it:
```bash
rm prisma/dev.db
# Then restart the app - it will recreate the database
```

### If you can't sign up:
1. Check the browser console for errors (F12 → Console tab)
2. Check the terminal where `npm run dev` is running for server errors
3. Make sure all required fields are filled in the signup form

## Features Working

✅ User registration and login
✅ User profile with measurements
✅ Add new products
✅ Write reviews with 5 rating types
✅ Upload photos (via URLs)
✅ View all reviews on product pages
✅ Aggregated review scores
✅ Search products by name/brand
✅ Filter by rating and photos
✅ Sort by various criteria
✅ Upvote helpful reviews
✅ User profile with review history
✅ Following system (API ready, UI basic)
✅ Where to buy links
✅ Responsive design
✅ Homepage with trending/recent products

## Need Help?

If you encounter any issues:
1. Check the browser console (F12)
2. Check the terminal where the dev server is running
3. Look for specific error messages
4. Make sure all dependencies are installed: `npm install`

## Production Deployment

For production (e.g., Vercel):
1. Change `DATABASE_URL` to use PostgreSQL:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   ```
2. Update `prisma/schema.prisma` datasource from `sqlite` to `postgresql`
3. Run migrations: `npx prisma migrate deploy`
4. Generate client: `npx prisma generate`
5. Set `NEXTAUTH_SECRET` to a secure random string
6. Set `NEXTAUTH_URL` to your production URL

Enjoy building your clothing review platform! 🎉
