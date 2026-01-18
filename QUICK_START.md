# 🚀 Quick Start Guide - FitReview

## Prerequisites
- Node.js 18 or higher
- Git

## Step-by-Step Setup

### 1. Pull the Latest Code (if you haven't already)
```bash
git pull origin claude/clothing-review-platform-FzNaf
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Prisma Client
Due to Prisma engine download restrictions, run this setup script:

```bash
chmod +x setup-prisma.sh
./setup-prisma.sh
```

**Or manually:**
```bash
mkdir -p node_modules/.prisma/client
echo 'module.exports = require("@prisma/client");' > node_modules/.prisma/client/index.js
echo 'export * from "@prisma/client";' > node_modules/.prisma/client/index.d.ts
rm -rf .next
```

### 4. Verify Database Exists
```bash
ls -la prisma/dev.db
```

You should see the database file. If not, it will be created automatically when you start the app.

### 5. Start the Development Server
```bash
npm run dev
```

You should see:
```
✓ Starting...
✓ Ready in 1000ms
- Local:        http://localhost:3000
```

### 6. Open Your Browser
Navigate to: **http://localhost:3000**

You should see the beautiful new homepage!

## Test the Application

### Create an Account
1. Click "Sign Up" in the top right
2. Fill in the form:
   - Name: Your name
   - Email: test@example.com
   - Password: password123
   - Optionally add measurements
3. Click "Sign up"
4. You'll be automatically logged in and redirected to the homepage

### Add Your First Product
1. Click "Add Product" in the navbar (or the + icon)
2. Fill in:
   - Product Name: e.g., "Classic White T-Shirt"
   - Brand: e.g., "Nike"
   - Category: Select one
   - Price Range: Select one ($, $$, etc.)
   - Description: Optional
   - Image URL: Use a test image like:
     - https://images.unsplash.com/photo-1521572163474-6864f9cf17ab
     - https://via.placeholder.com/400x600/FF6B6B/FFFFFF?text=T-Shirt
3. Click "Create Product"

### Write a Review
1. Click on the product you just created
2. Click "Write a Review"
3. Fill in all rating fields (1-5 stars each)
4. Write your review (min 50 characters)
5. Add fit information
6. Optionally add photo URLs
7. Click "Submit Review"

## Common Issues

### Issue: "Cannot find module '.prisma/client'"
**Solution:**
```bash
./setup-prisma.sh
# Then restart the dev server
npm run dev
```

### Issue: "Something went wrong" on signup
**Solution:** Check the terminal where `npm run dev` is running for detailed error messages.

### Issue: Build errors
**Solution:**
```bash
# Clean and rebuild
rm -rf .next node_modules/.cache
./setup-prisma.sh
npm run dev
```

### Issue: Database errors
**Solution:**
```bash
# Reset the database
rm prisma/dev.db
# Restart the server - it will recreate the database
npm run dev
```

## Features to Test

### ✅ Authentication
- [x] Sign up with email/password
- [x] Log in
- [x] Log out
- [x] Profile page

### ✅ Products
- [x] Browse all products
- [x] Add new product
- [x] View product details
- [x] See aggregated ratings

### ✅ Reviews
- [x] Write detailed reviews
- [x] 5 different rating categories
- [x] Add photos to reviews
- [x] Include fit information
- [x] Upvote helpful reviews

### ✅ Search & Filter
- [x] Search products by name/brand
- [x] Filter by rating
- [x] Filter by "photos only"
- [x] Sort by newest/rating/most helpful

### ✅ UI/UX
- [x] Yelp-inspired design
- [x] Responsive mobile design
- [x] Smooth animations
- [x] Loading states
- [x] Error handling

## Development Tips

### Clean Start
If you want to start fresh:
```bash
# Stop the dev server (Ctrl+C)
rm -rf .next
./setup-prisma.sh
npm run dev
```

### Check for Errors
- **Terminal**: Watch for server-side errors
- **Browser Console** (F12): Check for client-side errors
- **Network Tab** (F12): Check API responses

### Hot Reload
Next.js automatically reloads when you make changes to files. No need to restart the server!

## Next Steps

Once everything is running:
1. Explore the homepage
2. Create an account
3. Add a product
4. Write a review
5. Test the search
6. Try the filters
7. Check the mobile view

## Need Help?

If you encounter any issues:
1. Check the error message in the terminal
2. Check the browser console (F12)
3. Try the "Clean Start" steps above
4. Create an issue with the error details

## Production Deployment

When ready to deploy:
1. Switch to PostgreSQL (update DATABASE_URL)
2. Update Prisma schema datasource to "postgresql"
3. Run migrations: `npx prisma migrate deploy`
4. Set NEXTAUTH_SECRET to a secure random string
5. Deploy to Vercel/Railway/etc.

---

🎉 **Enjoy using FitReview - Yelp for Clothes!**
