import mongoose, { Document, Model, Schema } from 'mongoose'

export type NotificationType =
  | 'NEW_CAMPAIGN'
  | 'INVITATION_RECEIVED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'MESSAGE_RECEIVED'
  | 'CONTENT_SUBMITTED'
  | 'CONTENT_APPROVED'
  | 'REVISION_REQUESTED'
  | 'CAMPAIGN_STARTED'
  | 'CAMPAIGN_COMPLETED'
  | 'PAYMENT_RECEIVED'
  | 'PAYOUT_PROCESSED'
  | 'VERIFICATION_UPDATE'
  | 'DISPUTE_UPDATE'
  | 'SYSTEM'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  readAt?: Date
  data?: Record<string, unknown>
  actionUrl?: string
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    type: {
      type: String,
      enum: [
        'NEW_CAMPAIGN',
        'INVITATION_RECEIVED',
        'APPLICATION_ACCEPTED',
        'APPLICATION_REJECTED',
        'MESSAGE_RECEIVED',
        'CONTENT_SUBMITTED',
        'CONTENT_APPROVED',
        'REVISION_REQUESTED',
        'CAMPAIGN_STARTED',
        'CAMPAIGN_COMPLETED',
        'PAYMENT_RECEIVED',
        'PAYOUT_PROCESSED',
        'VERIFICATION_UPDATE',
        'DISPUTE_UPDATE',
        'SYSTEM',
      ],
      required: [true, 'Notification type is required'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    body: {
      type: String,
      required: [true, 'Body is required'],
      trim: true,
      maxlength: [1000, 'Body cannot exceed 1000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    data: {
      type: Schema.Types.Mixed,
    },
    actionUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 })
NotificationSchema.index({ userId: 1, createdAt: -1 })
NotificationSchema.index({ createdAt: -1 })

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema)

export default Notification
