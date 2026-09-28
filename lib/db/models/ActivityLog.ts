import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IActivityLog extends Document {
  userId?: mongoose.Types.ObjectId
  userName?: string
  userRole?: string
  action: string
  targetType: 'BRAND' | 'INFLUENCER' | 'VEHICLE_PARTNER' | 'VEHICLE' | 'CAMPAIGN' | 'PAYMENT' | 'PAYOUT' | 'SYSTEM'
  targetId?: mongoose.Types.ObjectId
  targetName?: string
  details?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  createdAt: Date
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, trim: true },
    userRole: { type: String, trim: true },
    action: { type: String, required: true, trim: true },
    targetType: {
      type: String,
      enum: ['BRAND', 'INFLUENCER', 'VEHICLE_PARTNER', 'VEHICLE', 'CAMPAIGN', 'PAYMENT', 'PAYOUT', 'SYSTEM'],
      default: 'SYSTEM',
    },
    targetId: { type: Schema.Types.ObjectId },
    targetName: { type: String, trim: true },
    details: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
)

ActivityLogSchema.index({ createdAt: -1 })
ActivityLogSchema.index({ targetType: 1, createdAt: -1 })
ActivityLogSchema.index({ userId: 1, createdAt: -1 })

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema)

export default ActivityLog
