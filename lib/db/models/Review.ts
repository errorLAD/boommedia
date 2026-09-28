import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IReview extends Document {
  campaignId: mongoose.Types.ObjectId
  reviewerId: mongoose.Types.ObjectId
  reviewerRole: string
  revieweeId: mongoose.Types.ObjectId
  revieweeRole: string
  rating: number
  comment?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign ID is required'],
    },
    reviewerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer ID is required'],
    },
    reviewerRole: {
      type: String,
      required: [true, 'Reviewer role is required'],
    },
    revieweeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewee ID is required'],
    },
    revieweeRole: {
      type: String,
      required: [true, 'Reviewee role is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Compound unique: one review per reviewer per reviewee per campaign
ReviewSchema.index(
  { campaignId: 1, reviewerId: 1, revieweeId: 1 },
  { unique: true }
)
ReviewSchema.index({ revieweeId: 1, isPublic: 1 })
ReviewSchema.index({ campaignId: 1 })
ReviewSchema.index({ rating: -1 })

const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>('Review', ReviewSchema)

export default Review
