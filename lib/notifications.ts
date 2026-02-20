import { logger } from '@/lib/logger';
import { prisma } from "@/lib/prisma";

export type NotificationChannelType = "EMAIL" | "SMS" | "PUSH";

interface CreateNotificationParams {
  recipient: string;
  type: NotificationChannelType;
  subject?: string;
  body: string;
  metadata?: Record<string, any>;
}

/**
 * Create a notification for a user (queues for later delivery)
 */
export async function createNotification({
  recipient,
  type,
  subject,
  body,
  metadata,
}: CreateNotificationParams) {
  try {
    const notification = await prisma.notificationQueue.create({
      data: {
        recipient,
        type,
        subject,
        body,
        metadata: metadata || {},
        status: "PENDING",
      },
    });
    return notification;
  } catch (error) {
    logger.error("Error creating notification:", error);
    throw error;
  }
}

/**
 * Create notifications for multiple recipients
 */
export async function createBulkNotifications(
  recipients: string[],
  notification: Omit<CreateNotificationParams, "recipient">
) {
  try {
    const notifications = await prisma.notificationQueue.createMany({
      data: recipients.map((recipient) => ({
        recipient,
        type: notification.type,
        subject: notification.subject,
        body: notification.body,
        metadata: notification.metadata || {},
        status: "PENDING" as const,
      })),
    });
    return notifications;
  } catch (error) {
    logger.error("Error creating bulk notifications:", error);
    throw error;
  }
}

/**
 * Notification templates for common events
 */
export const NotificationTemplates = {
  inquiryReceived: (providerEmail: string, inquiryId: string) => ({
    recipient: providerEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "New Inquiry Received",
    body: `You have received a new inquiry for your services. View it at /vendor/inquiries/${inquiryId}`,
    metadata: { inquiryId },
  }),

  inquiryResponse: (
    clientEmail: string,
    providerName: string,
    inquiryId: string
  ) => ({
    recipient: clientEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Inquiry Response",
    body: `${providerName} has responded to your inquiry.`,
    metadata: { inquiryId, providerName },
  }),

  quoteReceived: (
    clientEmail: string,
    providerName: string,
    quoteId: string,
    amount: number
  ) => ({
    recipient: clientEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "New Quote Received",
    body: `${providerName} has sent you a quote for $${amount.toLocaleString()}.`,
    metadata: { quoteId, providerName, amount },
  }),

  quoteAccepted: (
    providerEmail: string,
    clientName: string,
    quoteId: string
  ) => ({
    recipient: providerEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Quote Accepted!",
    body: `${clientName} has accepted your quote.`,
    metadata: { quoteId, clientName },
  }),

  quoteRejected: (
    providerEmail: string,
    clientName: string,
    quoteId: string
  ) => ({
    recipient: providerEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Quote Declined",
    body: `${clientName} has declined your quote.`,
    metadata: { quoteId, clientName },
  }),

  bookingConfirmed: (
    clientEmail: string,
    providerName: string,
    bookingId: string,
    eventDate: Date
  ) => ({
    recipient: clientEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Booking Confirmed",
    body: `Your booking with ${providerName} for ${eventDate.toLocaleDateString()} has been confirmed.`,
    metadata: { bookingId, providerName, eventDate: eventDate.toISOString() },
  }),

  bookingCompleted: (clientEmail: string, bookingId: string) => ({
    recipient: clientEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Booking Completed",
    body: `Your booking has been marked as completed. Please leave a review!`,
    metadata: { bookingId },
  }),

  bookingCancelled: (
    clientEmail: string,
    providerName: string,
    bookingId: string
  ) => ({
    recipient: clientEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Booking Cancelled",
    body: `Your booking with ${providerName} has been cancelled.`,
    metadata: { bookingId, providerName },
  }),

  paymentReceived: (
    providerEmail: string,
    amount: number,
    bookingId: string
  ) => ({
    recipient: providerEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Payment Received",
    body: `Payment of $${amount.toLocaleString()} has been received.`,
    metadata: { amount, bookingId },
  }),

  reviewReceived: (
    providerEmail: string,
    clientName: string,
    rating: number,
    providerId: string
  ) => ({
    recipient: providerEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "New Review Received",
    body: `${clientName} left you a ${rating}-star review.`,
    metadata: { clientName, rating, providerId },
  }),

  providerApproved: (providerEmail: string, providerName: string) => ({
    recipient: providerEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Provider Account Approved!",
    body: `Congratulations! Your provider account "${providerName}" has been approved. You can now receive bookings.`,
    metadata: { providerName },
  }),

  providerRejected: (providerEmail: string, reason: string) => ({
    recipient: providerEmail,
    type: "EMAIL" as NotificationChannelType,
    subject: "Provider Application Update",
    body: `Your provider application needs attention: ${reason}`,
    metadata: { reason },
  }),
};

/**
 * Get pending notification count
 */
export async function getPendingNotificationCount(): Promise<number> {
  try {
    const count = await prisma.notificationQueue.count({
      where: {
        status: "PENDING",
      },
    });
    return count;
  } catch (error) {
    logger.error("Error getting pending count:", error);
    return 0;
  }
}

/**
 * Mark notification as sent
 */
export async function markAsSent(notificationId: string) {
  try {
    const result = await prisma.notificationQueue.update({
      where: { id: notificationId },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });
    return result;
  } catch (error) {
    logger.error("Error marking as sent:", error);
    throw error;
  }
}

/**
 * Delete old notifications (e.g., older than 30 days)
 */
export async function cleanupOldNotifications(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  try {
    const result = await prisma.notificationQueue.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        status: "SENT",
      },
    });
    return result;
  } catch (error) {
    logger.error("Error cleaning up old notifications:", error);
    throw error;
  }
}
