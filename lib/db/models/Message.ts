import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IAttachment {
  url: string
  name: string
  type: string
  size?: number
}

export interface IReadReceipt {
  userId: mongoose.Types.ObjectId
  readAt: Date
}

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  senderRole: string
  content?: string
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
  attachments: IAttachment[]
  readBy: IReadReceipt[]
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const AttachmentSchema = new Schema<IAttachment>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, required: true },
    size: { type: Number, min: 0 },
  },
  { _id: false }
)

const ReadReceiptSchema = new Schema<IReadReceipt>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    readAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'Conversation ID is required'],
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender ID is required'],
    },
    senderRole: {
      type: String,
      required: [true, 'Sender role is required'],
    },
    content: {
      type: String,
      trim: true,
      maxlength: [10000, 'Message content cannot exceed 10000 characters'],
    },
    type: {
      type: String,
      enum: ['TEXT', 'IMAGE', 'FILE', 'SYSTEM'],
      default: 'TEXT',
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
    readBy: {
      type: [ReadReceiptSchema],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 })
MessageSchema.index({ senderId: 1 })
MessageSchema.index({ conversationId: 1, isDeleted: 1 })
MessageSchema.index({ 'readBy.userId': 1 })

const Message: Model<IMessage> =
  mongoose.models.Message ||
  mongoose.model<IMessage>('Message', MessageSchema)

export default Message
