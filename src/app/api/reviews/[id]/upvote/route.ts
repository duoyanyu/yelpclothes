import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if already upvoted
    const existingUpvote = await prisma.reviewUpvote.findUnique({
      where: {
        userId_reviewId: {
          userId: session.user.id,
          reviewId: id,
        },
      },
    });

    if (existingUpvote) {
      // Remove upvote
      await prisma.reviewUpvote.delete({
        where: { id: existingUpvote.id },
      });

      // Decrease count
      await prisma.review.update({
        where: { id },
        data: { helpfulCount: { decrement: 1 } },
      });

      return NextResponse.json({ upvoted: false });
    } else {
      // Add upvote
      await prisma.reviewUpvote.create({
        data: {
          userId: session.user.id,
          reviewId: id,
        },
      });

      // Increase count and user's helpful votes
      await prisma.review.update({
        where: { id },
        data: { helpfulCount: { increment: 1 } },
      });

      const review = await prisma.review.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (review) {
        await prisma.user.update({
          where: { id: review.userId },
          data: { helpfulVotes: { increment: 1 } },
        });
      }

      return NextResponse.json({ upvoted: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upvote review" },
      { status: 500 }
    );
  }
}
