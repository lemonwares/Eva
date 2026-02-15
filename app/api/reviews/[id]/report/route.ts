import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { sendEmail } from "@/lib/email";

const reportReviewSchema = z.object({
  reason: z.enum([
    "SPAM",
    "INAPPROPRIATE",
    "FAKE",
    "HARASSMENT",
    "CONFLICT_OF_INTEREST",
    "OTHER",
  ]),
  details: z.string().max(1000).optional(),
});

// POST /api/reviews/:id/report - Report a review for moderation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await request.json();
    const validation = reportReviewSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    const { reason, details } = validation.data;

    const review = await prisma.review.findUnique({
      where: { id },
      select: {
        id: true,
        isApproved: true,
        isFlagged: true,
      },
    });

    if (!review) {
      return NextResponse.json(
        { message: "Review not found" },
        { status: 404 }
      );
    }

    if (!review.isApproved) {
      return NextResponse.json(
        { message: "Only approved reviews can be reported" },
        { status: 400 }
      );
    }

    // Flag the review for moderation
    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        isFlagged: true,
      },
      include: {
        provider: { select: { businessName: true } },
      },
    });

    // Notify admins about flagged review
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `⚠️ Review Flagged for Moderation - ${updatedReview.provider.businessName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2>⚠️ Review Reported</h2>
            <p>A review has been flagged and requires moderation.</p>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p><strong>Review ID:</strong> ${id}</p>
              <p><strong>Provider:</strong> ${
                updatedReview.provider.businessName
              }</p>
              <p><strong>Reason:</strong> ${reason}</p>
              ${details ? `<p><strong>Details:</strong> ${details}</p>` : ""}
              ${
                session?.user?.email
                  ? `<p><strong>Reporter:</strong> ${session.user.email}</p>`
                  : ""
              }
            </div>
            
            <p>Please review this in the admin dashboard:</p>
            <a href="${
              process.env.NEXTAUTH_URL || "http://localhost:3000"
            }/admin/reviews?flagged=true" 
               style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review in Dashboard
            </a>
          </div>
        `,
      }).catch((err) =>
        logger.error("Failed to send admin notification:", err)
      );
    }

    return NextResponse.json({
      message: "Review reported successfully. Our team will review it shortly.",
    });
  } catch (error: any) {
    logger.error("Error reporting review:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
