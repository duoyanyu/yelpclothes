# ClothesReview - Yelp for Clothes

A full-stack clothing review platform where users can discover, review, and share their experiences with clothing products. Think Yelp, but specifically for clothes, with detailed fit information and measurements.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login with NextAuth
- **Product Management**: Add and browse clothing products with images
- **Detailed Reviews**: Write comprehensive reviews with:
  - 5-star ratings (overall, fit, comfort, value, durability)
  - Size and fit information
  - Body measurements
  - Photo uploads (3-5 per review)
  - Written reviews (minimum 50 characters)
- **Search & Discovery**:
  - Search by product name and brand
  - Filter by category, rating, and photos
  - Sort by newest, highest rated, or most reviewed
- **Where to Buy**: Multiple retailer links with price comparison
- **Social Features**:
  - Upvote helpful reviews
  - Follow other users
  - View user profiles with review history
- **Homepage**: Trending products and recently reviewed items

## Tech Stack

### Frontend
- **Next.js 15** (App Router)
- **React 18**
- **TypeScript** (strict mode)
- **Tailwind CSS** for styling
- **NextAuth** for authentication

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **SQLite** (development) / **PostgreSQL** (production ready)
- **Zod** for validation

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd yelpclothes
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
# Database (SQLite for dev)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# UploadThing (optional for image uploads)
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
```

4. **Generate Prisma Client**

**Note**: Due to network restrictions in this environment, you may need to generate the Prisma client manually. In a normal environment, run:

```bash
npx prisma generate
```

If you encounter issues, the project includes a shim that allows it to build. For production, ensure Prisma is properly generated.

5. **Run database migrations**
```bash
npx prisma db push
```

6. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main models:

- **User**: Authentication and profile information with measurements
- **Product**: Clothing items with brand, category, price range, and images
- **Review**: Detailed reviews with ratings, fit info, and photos
- **ReviewUpvote**: Track helpful review votes
- **RetailerLink**: Where to buy information with prices
- **Follow**: User following system

## Project Structure

```
yelpclothes/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── auth/             # Authentication pages
│   │   ├── products/         # Product pages
│   │   ├── profile/          # User profile
│   │   └── page.tsx          # Homepage
│   ├── components/           # Reusable components
│   ├── lib/                  # Utilities (Prisma, auth)
│   └── types/                # TypeScript definitions
├── prisma/
│   └── schema.prisma         # Database schema
└── public/                   # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features Implementation

### Authentication
Users can register with:
- Email and password
- Name
- Optional: Height, weight, body type

### Product Pages
- Browse all products with filtering
- View detailed product information
- See aggregated review scores
- Compare prices across retailers

### Review System
- Comprehensive rating system (5 metrics)
- Fit information (runs small/true/large)
- Photo uploads via URL
- Filter reviews by size and body type

### User Profiles
- View all user reviews
- See follower/following counts
- Display helpful vote badges
- Track review history

## Deployment

### Database
For production, update your `.env` to use PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### Vercel Deployment
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Known Limitations

1. **Image Uploads**: Currently uses URL inputs. For production, integrate with Uploadthing or Cloudinary for direct file uploads.
2. **Affiliate Links**: Structure is in place but needs actual affiliate account integration.
3. **Email Verification**: Not implemented (can be added via NextAuth)
4. **Search**: Basic text search (can be enhanced with full-text search)
5. **Prisma Generation**: May require manual setup in restricted environments

## Future Enhancements

- Direct image upload functionality
- Email notifications for follows/upvotes
- Advanced search with Elasticsearch
- Product recommendations based on body type
- Size recommendation algorithm
- Mobile app (React Native)
- Social sharing features
- Product comparison tool

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Prisma, and TypeScript
