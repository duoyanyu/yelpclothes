import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  fitRating: z.number().min(1).max(5),
  comfort: z.number().min(1).max(5),
  value: z.number().min(1).max(5),
  durability: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().min(50),
  sizePurchased: z.string(),
  usualSize: z.string(),
  fitDescription: z.enum(["runs_small", "true_to_size", "runs_large"]),
  photos: z.array(z.string()).optional(),
});

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
    const validatedData = reviewSchema.parse(body);

    // Get user's current measurements
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { heightCm: true, weightKg: true, bodyType: true },
    });

    // Create the review
    const review = await prisma.review.create({
      data: {
        ...validatedData,
        userId: session.user.id,
        photos: validatedData.photos || [],
        heightCm: user?.heightCm,
        weightKg: user?.weightKg,
        bodyType: user?.bodyType,
      },
    });

    // Update product aggregated stats
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId },
      include: { reviews: true },
    });

    if (product) {
      const reviews = product.reviews;
      type ReviewType = typeof reviews[0];
      const avgRating = reviews.reduce((sum: number, r: ReviewType) => sum + r.rating, 0) / reviews.length;
      const avgFitRating = reviews.reduce((sum: number, r: ReviewType) => sum + r.fitRating, 0) / reviews.length;
      const avgComfort = reviews.reduce((sum: number, r: ReviewType) => sum + r.comfort, 0) / reviews.length;
      const avgValue = reviews.reduce((sum: number, r: ReviewType) => sum + r.value, 0) / reviews.length;
      const avgDurability = reviews.reduce((sum: number, r: ReviewType) => sum + r.durability, 0) / reviews.length;

      await prisma.product.update({
        where: { id: validatedData.productId },
        data: {
          avgRating,
          avgFitRating,
          avgComfort,
          avgValue,
          avgDurability,
          totalReviews: reviews.length,
        },
      });
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
