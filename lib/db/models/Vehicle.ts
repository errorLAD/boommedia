import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IAdPosition {
  position: 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT' | 'TOP' | 'INTERIOR' | 'FULL_WRAP'
  size?: { width: number; height: number; unit: string }
  description?: string
  photos?: string[]
}

export interface IVehicleRoute {
  name?: string
  from?: string
  to?: string
  startingPoint?: string
  endPoint?: string
  majorStops?: string[]
  areasCovered?: string[]
  distance?: number
  operatingHours?: string
  routeFrequency?: string
  operatingDays?: string[]
}

export interface IAvailabilitySlot {
  startDate: Date
  endDate: Date
  isBooked: boolean
  campaignId?: mongoose.Types.ObjectId
}

export interface IVehicleImage {
  url: string
  tag?: string // 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT' | 'INTERIOR' | 'AD_AREA' | 'OTHER'
  caption?: string
  isPrimary?: boolean
}

export interface IVehicle extends Omit<Document, 'model'> {
  partnerId: mongoose.Types.ObjectId
  partnerProfileId?: mongoose.Types.ObjectId
  title: string
  vehicleType: string
  vehicleNumber?: string
  registrationNumber?: string
  make?: string
  model?: string
  year?: number
  color?: string
  fuelType?: 'ELECTRIC' | 'PETROL' | 'DIESEL' | 'CNG' | 'OTHER'
  images: IVehicleImage[]
  photos: Array<{ url: string; caption?: string; isPrimary?: boolean }>
  advertisingAreas: string[]
  advertisingFormats: string[]
  price: number
  priceType: 'PER_MONTH' | 'PER_WEEK' | 'PER_DAY' | 'PER_CAMPAIGN'
  pricing: {
    perDay?: number
    perWeek?: number
    perMonth?: number
    customDuration?: boolean
  }
  minimumCampaignDuration: string
  minimumDuration: number
  maximumDuration: number
  securityDeposit?: number
  isNegotiable: boolean
  state: string
  city: string
  areas: string[]
  operatingAreas: string[]
  routes: IVehicleRoute[]
  operatingDays: string[]
  operatingHours?: string
  availabilityStatus: 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE' | 'NOT_AVAILABLE'
  availableFrom?: Date
  availableUntil?: Date
  availability: IAvailabilitySlot[]
  description?: string
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'VERIFIED' | 'UNVERIFIED'
  verificationNotes?: string
  rejectionReason?: string
  campaignStatus:
    | 'AVAILABLE'
    | 'REQUEST_RECEIVED'
    | 'UNDER_REVIEW'
    | 'ACCEPTED'
    | 'SCHEDULED'
    | 'ACTIVE'
    | 'COMPLETED'
    | 'CANCELLED'
  isAvailable: boolean
  isActive: boolean
  isDeleted: boolean
  totalCampaigns: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

const RouteSchema = new Schema<IVehicleRoute>(
  {
    name: { type: String, trim: true },
    from: { type: String, trim: true },
    to: { type: String, trim: true },
    startingPoint: { type: String, trim: true },
    endPoint: { type: String, trim: true },
    majorStops: { type: [String], default: [] },
    areasCovered: { type: [String], default: [] },
    distance: { type: Number, min: 0 },
    operatingHours: { type: String, trim: true },
    routeFrequency: { type: String, trim: true },
    operatingDays: { type: [String], default: [] },
  },
  { _id: false }
)

const AvailabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isBooked: { type: Boolean, default: false },
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
  },
  { _id: false }
)

const VehicleImageSchema = new Schema<IVehicleImage>(
  {
    url: { type: String, required: true },
    tag: { type: String, default: 'OTHER' },
    caption: { type: String },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
)

const VehicleSchema = new Schema<IVehicle>(
  {
    partnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Partner ID is required'],
    },
    partnerProfileId: {
      type: Schema.Types.ObjectId,
      ref: 'VehiclePartnerProfile',
    },
    title: {
      type: String,
      required: [true, 'Vehicle title is required'],
      trim: true,
      default: 'Commercial Vehicle',
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      trim: true,
    },
    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    year: { type: Number },
    color: { type: String, trim: true },
    fuelType: {
      type: String,
      enum: ['ELECTRIC', 'PETROL', 'DIESEL', 'CNG', 'OTHER'],
      default: 'OTHER',
    },
    images: {
      type: [VehicleImageSchema],
      default: [],
    },
    photos: {
      type: [
        {
          url: { type: String, required: true },
          caption: { type: String },
          isPrimary: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    advertisingAreas: {
      type: [String],
      default: ['LEFT_SIDE', 'RIGHT_SIDE'],
    },
    advertisingFormats: {
      type: [String],
      default: ['VINYL'],
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    priceType: {
      type: String,
      enum: ['PER_MONTH', 'PER_WEEK', 'PER_DAY', 'PER_CAMPAIGN'],
      default: 'PER_MONTH',
    },
    pricing: {
      perDay: { type: Number, min: 0 },
      perWeek: { type: Number, min: 0 },
      perMonth: { type: Number, min: 0 },
      customDuration: { type: Boolean, default: false },
    },
    minimumCampaignDuration: {
      type: String,
      default: '1_MONTH',
    },
    minimumDuration: {
      type: Number,
      default: 30,
      min: 1,
    },
    maximumDuration: {
      type: Number,
      default: 365,
    },
    securityDeposit: {
      type: Number,
      min: 0,
    },
    isNegotiable: {
      type: Boolean,
      default: false,
    },
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
    areas: {
      type: [String],
      default: [],
    },
    operatingAreas: {
      type: [String],
      default: [],
    },
    routes: {
      type: [RouteSchema],
      default: [],
    },
    operatingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    operatingHours: {
      type: String,
      trim: true,
    },
    availabilityStatus: {
      type: String,
      enum: ['AVAILABLE', 'BOOKED', 'MAINTENANCE', 'NOT_AVAILABLE'],
      default: 'AVAILABLE',
    },
    availableFrom: { type: Date },
    availableUntil: { type: Date },
    availability: {
      type: [AvailabilitySlotSchema],
      default: [],
    },
    description: {
      type: String,
      trim: true,
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED', 'VERIFIED', 'UNVERIFIED'],
      default: 'PENDING',
    },
    verificationNotes: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },
    campaignStatus: {
      type: String,
      enum: [
        'AVAILABLE',
        'REQUEST_RECEIVED',
        'UNDER_REVIEW',
        'ACCEPTED',
        'SCHEDULED',
        'ACTIVE',
        'COMPLETED',
        'CANCELLED',
      ],
      default: 'AVAILABLE',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    totalCampaigns: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
)

// Pre-save to sync vehicleNumber / registrationNumber & price / pricing
VehicleSchema.pre('save', function (next) {
  if (this.vehicleNumber && !this.registrationNumber) {
    this.registrationNumber = this.vehicleNumber
  } else if (this.registrationNumber && !this.vehicleNumber) {
    this.vehicleNumber = this.registrationNumber
  }

  if (this.price && (!this.pricing || !this.pricing.perMonth)) {
    this.pricing = { ...this.pricing, perMonth: this.price }
  } else if (this.pricing?.perMonth && !this.price) {
    this.price = this.pricing.perMonth
  }

  if (this.areas && this.areas.length > 0 && (!this.operatingAreas || this.operatingAreas.length === 0)) {
    this.operatingAreas = this.areas
  } else if (this.operatingAreas && this.operatingAreas.length > 0 && (!this.areas || this.areas.length === 0)) {
    this.areas = this.operatingAreas
  }

  if (this.images && this.images.length > 0 && (!this.photos || this.photos.length === 0)) {
    this.photos = this.images.map((img) => ({
      url: img.url,
      caption: img.caption || img.tag,
      isPrimary: img.isPrimary,
    }))
  }

  next()
})

// Indexes
VehicleSchema.index({ partnerId: 1 })
VehicleSchema.index({ city: 1 })
VehicleSchema.index({ state: 1 })
VehicleSchema.index({ vehicleType: 1 })
VehicleSchema.index({ verificationStatus: 1 })
VehicleSchema.index({ isAvailable: 1, isActive: 1 })
VehicleSchema.index({ isDeleted: 1 })
VehicleSchema.index({ city: 1, vehicleType: 1, verificationStatus: 1 })

const Vehicle: Model<IVehicle> =
  mongoose.models.Vehicle || mongoose.model<IVehicle>('Vehicle', VehicleSchema)

export default Vehicle
