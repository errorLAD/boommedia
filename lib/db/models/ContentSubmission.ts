import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IRevisionNote {
  note: string
  requestedBy: mongoose.Types.ObjectId
  requestedAt: Date
}

export interface IContentFile {
  url: string
  type: string
  name: string
  size?: number
}

export interface IContentSubmission extends Document {
  campaignId: mongoose.Types.ObjectId
  influencerId: mongoose.Types.ObjectId
  deliverableType:
    | 'INSTAGRAM_REEL'
    | 'INSTAGRAM_POST'
    | 'INSTAGRAM_STORY'
    | 'YOUTUBE_VIDEO'
    | 'FACEBOOK_POST'
    | 'IMAGE'
    | 'VIDEO'
    | 'DOCUMENT'
    | 'URL'
    | 'OTHER'
  title?: string
  description?: string
  contentUrl?: string
  contentFiles: IContentFile[]
  status: 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED'
  revisionNotes: IRevisionNote[]
  approvedAt?: Date
  approvedBy?: mongoose.Types.ObjectId
  rejectedAt?: Date
  rejectedBy?: mongoose.Types.ObjectId
  submittedAt: Date
  createdAt: Date
  updatedAt: Date
}

const RevisionNoteSchema = new Schema<IRevisionNote>(
  {
    note: { type: String, required: true, trim: true },
    requestedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const ContentFileSchema = new Schema<IContentFile>(
  {
    url: { type: String, required: true },
    type: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    size: { type: Number, min: 0 },
  },
  { _id: false }
)

const ContentSubmissionSchema = new Schema<IContentSubmission>(
  {
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign ID is required'],
    },
    influencerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Influencer ID is required'],
    },
    deliverableType: {
      type: String,
      enum: [
        'INSTAGRAM_REEL',
        'INSTAGRAM_POST',
        'INSTAGRAM_STORY',
        'YOUTUBE_VIDEO',
        'FACEBOOK_POST',
        'IMAGE',
        'VIDEO',
        'DOCUMENT',
        'URL',
        'OTHER',
      ],
      required: [true, 'Deliverable type is required'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    contentUrl: {
      type: String,
      trim: true,
    },
    contentFiles: {
      type: [ContentFileSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'CHANGES_REQUESTED', 'REJECTED'],
      default: 'PENDING',
    },
    revisionNotes: {
      type: [RevisionNoteSchema],
      default: [],
    },
    approvedAt: { type: Date },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rejectedAt: { type: Date },
    rejectedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
ContentSubmissionSchema.index({ campaignId: 1, influencerId: 1 })
ContentSubmissionSchema.index({ influencerId: 1 })
ContentSubmissionSchema.index({ status: 1 })
ContentSubmissionSchema.index({ campaignId: 1, status: 1 })

const ContentSubmission: Model<IContentSubmission> =
  mongoose.models.ContentSubmission ||
  mongoose.model<IContentSubmission>(
    'ContentSubmission',
    ContentSubmissionSchema
  )

export default ContentSubmission
