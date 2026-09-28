import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IParticipant {
  userId: mongoose.Types.ObjectId
  role: string
  lastSeen?: Date
}

export interface ILastMessage {
  content: string
  senderId: mongoose.Types.ObjectId
  sentAt: Date
  type: string
}

export interface IConversation extends Document {
  participants: IParticipant[]
  campaignId?: mongoose.Types.ObjectId
  lastMessage?: ILastMessage
  unreadCounts: Map<string, number>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ParticipantSchema = new Schema<IParticipant>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date,
    },
  },
  { _id: false }
)

const LastMessageSchema = new Schema<ILastMessage>(
  {
    content: { type: String, trim: true },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    sentAt: { type: Date, default: Date.now },
    type: { type: String, default: 'TEXT' },
  },
  { _id: false }
)

const ConversationSchema = new Schema<IConversation>(
  {
    participants: {
      type: [ParticipantSchema],
      validate: {
        validator: function (v: IParticipant[]) {
          return v && v.length >= 2
        },
        message: 'A conversation must have at least 2 participants',
      },
    },
    campaignId: {
      type: Schema.Types.ObjectId,
      ref: 'Campaign',
    },
    lastMessage: {
      type: LastMessageSchema,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
ConversationSchema.index({ 'participants.userId': 1 })
ConversationSchema.index({ campaignId: 1 })
ConversationSchema.index({ isActive: 1 })
ConversationSchema.index({ updatedAt: -1 })
ConversationSchema.index({ 'participants.userId': 1, isActive: 1 })

const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>('Conversation', ConversationSchema)

export default Conversation
