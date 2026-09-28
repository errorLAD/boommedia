import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ISavedItem extends Document {
  userId: mongoose.Types.ObjectId
  itemType: 'INFLUENCER' | 'VEHICLE' | 'CAMPAIGN'
  itemId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SavedItemSchema = new Schema<ISavedItem>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    itemType: {
      type: String,
      enum: ['INFLUENCER', 'VEHICLE', 'CAMPAIGN'],
      required: [true, 'Item type is required'],
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: [true, 'Item ID is required'],
      refPath: 'itemType',
    },
  },
  {
    timestamps: true,
  }
)

// Compound unique: one bookmark per user per item
SavedItemSchema.index(
  { userId: 1, itemType: 1, itemId: 1 },
  { unique: true }
)
SavedItemSchema.index({ userId: 1, itemType: 1 })
SavedItemSchema.index({ itemType: 1, itemId: 1 })

const SavedItem: Model<ISavedItem> =
  mongoose.models.SavedItem ||
  mongoose.model<ISavedItem>('SavedItem', SavedItemSchema)

export default SavedItem
