import mongoose, { Document, Model, Schema } from 'mongoose'

export interface ISocialAccount {
  platform: 'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'TIKTOK' | 'OTHER'
  handle: string
  url?: string
  followers: number
  engagementRate?: number
  isVerified?: boolean
}

export interface IPortfolioItem {
  title: string
  url: string
  platform?: string
  type?: string
  thumbnail?: string
  createdAt?: Date
}

export interface IInfluencerProfile extends Document {
  userId: mongoose.Types.ObjectId
  bio?: string
  profileImage?: string
  coverImage?: string
  city: string
  state: string
  niche: string
  categories: string[]
  languages: string[]
  socialAccounts: ISocialAccount[]
  totalFollowers: number
  avgEngagementRate: number
  audienceLocations: Array<{ city: string; percentage: number }>
  audienceDemographics: {
    ageGroups: Array<{ range: string; percentage: number }>
    genderSplit: { male: number; female: number; other: number }
  }
  pricing: {
    reel?: number
    post?: number
    story?: number
    youtubeVideo?: number
    customCampaign?: number
  }
  portfolio: IPortfolioItem[]
  completedCampaigns: number
  activeKampaigns: number
  rating: number
  reviewCount: number
  totalEarnings: number
  pendingEarnings: number
  availableBalance: number
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

const SocialAccountSchema = new Schema<ISocialAccount>(
  {
    platform: {
      type: String,
      enum: ['INSTAGRAM', 'YOUTUBE', 'FACEBOOK', 'TWITTER', 'LINKEDIN', 'TIKTOK', 'OTHER'],
      required: true,
    },
    handle: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    followers: {
      type: Number,
      default: 0,
      min: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
)

const PortfolioItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    platform: { type: String, trim: true },
    type: { type: String, trim: true },
    thumbnail: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const InfluencerProfileSchema = new Schema<IInfluencerProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    },
    profileImage: { type: String },
    coverImage: { type: String },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    niche: {
      type: String,
      required: [true, 'Niche is required'],
      trim: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },
    socialAccounts: {
      type: [SocialAccountSchema],
      default: [],
    },
    totalFollowers: {
      type: Number,
      default: 0,
      min: 0,
    },
    avgEngagementRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    audienceLocations: {
      type: [
        {
          city: { type: String, required: true },
          percentage: { type: Number, required: true, min: 0, max: 100 },
        },
      ],
      default: [],
    },
    audienceDemographics: {
      ageGroups: {
        type: [
          {
            range: { type: String },
            percentage: { type: Number, min: 0, max: 100 },
          },
        ],
        default: [],
      },
      genderSplit: {
        male: { type: Number, default: 0, min: 0, max: 100 },
        female: { type: Number, default: 0, min: 0, max: 100 },
        other: { type: Number, default: 0, min: 0, max: 100 },
      },
    },
    pricing: {
      reel: { type: Number, min: 0 },
      post: { type: Number, min: 0 },
      story: { type: Number, min: 0 },
      youtubeVideo: { type: Number, min: 0 },
      customCampaign: { type: Number, min: 0 },
    },
    portfolio: {
      type: [PortfolioItemSchema],
      default: [],
    },
    completedCampaigns: {
      type: Number,
      default: 0,
    },
    activeKampaigns: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    verificationStatus: {
      type: String,
      enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'],
      default: 'UNVERIFIED',
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

// Indexes
InfluencerProfileSchema.index({ userId: 1 }, { unique: true })
InfluencerProfileSchema.index({ city: 1 })
InfluencerProfileSchema.index({ state: 1 })
InfluencerProfileSchema.index({ niche: 1 })
InfluencerProfileSchema.index({ verificationStatus: 1 })
InfluencerProfileSchema.index({ totalFollowers: -1 })
InfluencerProfileSchema.index({ rating: -1 })
InfluencerProfileSchema.index({ isPublic: 1, verificationStatus: 1 })
InfluencerProfileSchema.index({ niche: 'text', bio: 'text', categories: 'text' })

const InfluencerProfile: Model<IInfluencerProfile> =
  mongoose.models.InfluencerProfile ||
  mongoose.model<IInfluencerProfile>('InfluencerProfile', InfluencerProfileSchema)

export default InfluencerProfile
