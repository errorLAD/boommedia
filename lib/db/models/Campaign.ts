import mongoose, { Document, Model, Schema } from 'mongoose'

export type CampaignServiceType = 'INFLUENCER' | 'VEHICLE' | 'BOTH' | 'COMBINED'

export type CampaignStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'OPTIONS_READY'
  | 'WAITING_APPROVAL'
  | 'APPROVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'PAUSED'
  | 'PUBLISHED'

export interface ICampaignFile {
  url: string
  name: string
  size?: number
  type?: string
  category?: string
  uploadedAt?: Date
}

export interface IInternalAdminNote {
  note: string
  authorName?: string
  authorId?: mongoose.Types.ObjectId
  createdAt: Date
}

export interface ICampaign extends Document {
  brandId: mongoose.Types.ObjectId
  brandProfileId?: mongoose.Types.ObjectId
  name: string
  slug?: string
  serviceType: CampaignServiceType
  type: CampaignServiceType // Synced with serviceType for backwards compat
  product?: string
  goal?: string
  objective?: string
  description?: string
  category?: string
  tags: string[]
  targetLocations: Array<{ state: string; city: string; area?: string }>
  targetAudience: {
    ageGroup?: string
    ageRange?: { min: number; max: number }
    gender?: string
    customerType?: string
    locations?: string[]
    interests?: string[]
    language?: string
  }
  languages: string[]
  influencerRequirements?: {
    creatorType?: string
    preferredLocation?: string
    contentTypes?: string[]
    numberOfCreators?: number
    creatorRequirements?: string
    contentRequirements?: string
    minFollowers?: number
  }
  vehicleRequirements?: {
    vehicleTypes?: string[]
    city?: string
    areas?: string[]
    preferredRoutes?: string
    numberOfVehicles?: number
    advertisingType?: string
    campaignDuration?: string
    startDate?: Date
    endDate?: Date
    additionalRequirements?: string
  }
  budget: {
    total: number
    type?: 'EXACT' | 'RANGE' | 'FLEXIBLE'
    min?: number
    max?: number
    influencer?: number
    vehicle?: number
    platformFee?: number
    currency: string
  }
  budgetAmount?: number
  budgetType?: 'EXACT' | 'RANGE' | 'FLEXIBLE'
  budgetMin?: number
  budgetMax?: number
  files: ICampaignFile[]
  cities: string[]
  states: string[]
  startDate?: Date
  endDate?: Date
  status: CampaignStatus
  isPaid: boolean
  paidAmount: number
  pendingAmount: number
  paymentId?: mongoose.Types.ObjectId
  selectedInfluencers: Array<{
    influencerId: mongoose.Types.ObjectId
    status: string
    agreedPrice?: number
  }>
  selectedVehicles: Array<{
    vehicleId: mongoose.Types.ObjectId
    status: string
    agreedPrice?: number
  }>
  internalAdminNotes: IInternalAdminNote[]
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const CampaignFileSchema = new Schema<ICampaignFile>(
  {
    url: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number },
    type: { type: String },
    category: { type: String, default: 'OTHER' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const InternalNoteSchema = new Schema<IInternalAdminNote>(
  {
    note: { type: String, required: true, trim: true },
    authorName: { type: String, default: 'Admin' },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const SelectedInfluencerSchema = new Schema(
  {
    influencerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['INVITED', 'ACCEPTED', 'ACTIVE', 'COMPLETED', 'DROPPED'],
      default: 'INVITED',
    },
    agreedPrice: { type: Number, min: 0 },
  },
  { _id: false }
)

const SelectedVehicleSchema = new Schema(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    status: {
      type: String,
      enum: ['INVITED', 'ACCEPTED', 'ACTIVE', 'COMPLETED', 'DROPPED'],
      default: 'INVITED',
    },
    agreedPrice: { type: Number, min: 0 },
  },
  { _id: false }
)

const CampaignSchema = new Schema<ICampaign>(
  {
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand ID is required'],
    },
    brandProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'BrandProfile',
    },
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    serviceType: {
      type: String,
      enum: ['INFLUENCER', 'VEHICLE', 'BOTH', 'COMBINED'],
      default: 'COMBINED',
    },
    type: {
      type: String,
      enum: ['INFLUENCER', 'VEHICLE', 'BOTH', 'COMBINED'],
      default: 'COMBINED',
    },
    product: {
      type: String,
      trim: true,
    },
    goal: {
      type: String,
      trim: true,
    },
    objective: {
      type: String,
      trim: true,
      default: 'Brand Awareness',
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    targetLocations: [
      {
        state: { type: String },
        city: { type: String },
        area: { type: String },
      },
    ],
    targetAudience: {
      ageGroup: { type: String },
      ageRange: {
        min: { type: Number, default: 18 },
        max: { type: Number, default: 45 },
      },
      gender: { type: String, default: 'ALL' },
      customerType: { type: String },
      locations: { type: [String], default: [] },
      interests: { type: [String], default: [] },
      language: { type: String },
    },
    languages: {
      type: [String],
      default: ['Hindi'],
    },
    influencerRequirements: {
      creatorType: { type: String },
      preferredLocation: { type: String },
      contentTypes: { type: [String], default: [] },
      numberOfCreators: { type: Number },
      creatorRequirements: { type: String },
      contentRequirements: { type: String },
      minFollowers: { type: Number },
    },
    vehicleRequirements: {
      vehicleTypes: { type: [String], default: [] },
      city: { type: String },
      areas: { type: [String], default: [] },
      preferredRoutes: { type: String },
      numberOfVehicles: { type: Number, default: 1 },
      advertisingType: { type: String },
      campaignDuration: { type: String, default: '1 Month' },
      startDate: { type: Date },
      endDate: { type: Date },
      additionalRequirements: { type: String },
    },
    budget: {
      total: { type: Number, default: 0 },
      type: { type: String, enum: ['EXACT', 'RANGE', 'FLEXIBLE'], default: 'EXACT' },
      min: { type: Number },
      max: { type: Number },
      influencer: { type: Number, default: 0 },
      vehicle: { type: Number, default: 0 },
      platformFee: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
    },
    budgetAmount: { type: Number, default: 0 },
    budgetType: { type: String, enum: ['EXACT', 'RANGE', 'FLEXIBLE'], default: 'EXACT' },
    budgetMin: { type: Number },
    budgetMax: { type: Number },
    files: {
      type: [CampaignFileSchema],
      default: [],
    },
    cities: {
      type: [String],
      default: [],
    },
    states: {
      type: [String],
      default: [],
    },
    startDate: { type: Date },
    endDate: { type: Date },
    status: {
      type: String,
      enum: [
        'DRAFT',
        'SUBMITTED',
        'UNDER_REVIEW',
        'OPTIONS_READY',
        'WAITING_APPROVAL',
        'APPROVED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
        'PAUSED',
        'PUBLISHED',
      ],
      default: 'SUBMITTED',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    selectedInfluencers: {
      type: [SelectedInfluencerSchema],
      default: [],
    },
    selectedVehicles: {
      type: [SelectedVehicleSchema],
      default: [],
    },
    internalAdminNotes: {
      type: [InternalNoteSchema],
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

CampaignSchema.pre('save', function (next) {
  if (this.serviceType && !this.type) {
    this.type = this.serviceType
  } else if (this.type && !this.serviceType) {
    this.serviceType = this.type
  }

  if (this.budgetAmount && (!this.budget || !this.budget.total)) {
    this.budget = { ...this.budget, total: this.budgetAmount }
  } else if (this.budget?.total && !this.budgetAmount) {
    this.budgetAmount = this.budget.total
  }

  if (!this.slug && this.name) {
    this.slug = `${this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString(36)}`
  }

  next()
})

CampaignSchema.index({ brandId: 1, status: 1 })
CampaignSchema.index({ brandId: 1, isDeleted: 1, createdAt: -1 })
CampaignSchema.index({ serviceType: 1 })
CampaignSchema.index({ status: 1 })
CampaignSchema.index({ isDeleted: 1 })
CampaignSchema.index({ createdAt: -1 })

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema)

export default Campaign
