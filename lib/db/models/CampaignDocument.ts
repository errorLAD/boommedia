import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ICampaignDocument extends Document {
  brandId: mongoose.Types.ObjectId
  campaignId?: mongoose.Types.ObjectId
  title: string
  type: 'INVOICE' | 'RECEIPT' | 'PROPOSAL' | 'AGREEMENT' | 'OTHER'
  fileUrl: string
  fileSize?: number
  mimeType?: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const CampaignDocumentSchema = new Schema<ICampaignDocument>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand ID is required'],
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['INVOICE', 'RECEIPT', 'PROPOSAL', 'AGREEMENT', 'OTHER'],
      default: 'OTHER',
    },
    fileUrl: { type: String, required: true },
    fileSize: { type: Number, min: 0 },
    mimeType: { type: String, trim: true },
    status: { type: String, default: 'ACTIVE' },
  },
  {
    timestamps: true,
  }
)

CampaignDocumentSchema.index({ brandId: 1, createdAt: -1 })
CampaignDocumentSchema.index({ campaignId: 1 })

const CampaignDocument: Model<ICampaignDocument> =
  mongoose.models.CampaignDocument ||
  mongoose.model<ICampaignDocument>('CampaignDocument', CampaignDocumentSchema)

export default CampaignDocument
