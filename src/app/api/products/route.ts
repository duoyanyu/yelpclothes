import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  category: z.string().min(1),
  priceRange: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string()).optional(),
});

// GET all products with optional filters
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minRating = searchParams.get("minRating");
    const photosOnly = searchParams.get("photosOnly");
    const sort = searchParams.get("sort") || "newest";

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (minRating) {
      where.avgRating = { gte: parseFloat(minRating) };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "highest_rated") {
      orderBy = { avgRating: "desc" };
    } else if (sort === "most_reviewed") {
      orderBy = { totalReviews: "desc" };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        reviews: photosOnly === "true" ? {
          where: {
            photos: {
              isEmpty: false,
            },
          },
          take: 1,
        } : false,
        retailerLinks: true,
      },
    });

    // Filter out products without photo reviews if photosOnly is true
    const filteredProducts = photosOnly === "true"
      ? products.filter((p: typeof products[0]) => p.reviews && p.reviews.length > 0)
      : products;

    return NextResponse.json({ products: filteredProducts });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST create new product
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        images: validatedData.images || [],
      },
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
