import mongoose, { Document, Model, Schema } from 'mongoose'

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Requirement Confirmed'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Approved'
  | 'Campaign Active'
  | 'Completed'
  | 'Cancelled'

export type EnquiryPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface IAdminNote {
  _id?: any
  note: string
  authorName?: string
  authorId?: mongoose.Types.ObjectId
  createdAt: Date
}

export interface IVehicleAdvertisingEnquiry extends Document {
  companyName: string
  contactPersonName: string
  email: string
  mobile: string
  city: string
  state?: string
  area?: string
  vehicleTypes: string[]
  campaignStartDate?: Date
  campaignEndDate?: Date
  budget?: string
  vehicleCount?: string | number
  advertisingFormat?: string
  campaignDescription: string
  status: EnquiryStatus
  priority: EnquiryPriority
  adminNotes: IAdminNote[]
  assignedAdmin?: mongoose.Types.ObjectId
  source: string
  createdAt: Date
  updatedAt: Date
}

const AdminNoteSchema = new Schema<IAdminNote>(
  {
    note: { type: String, required: true, trim: true },
    authorName: { type: String, default: 'Admin' },
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
)

const VehicleAdvertisingEnquirySchema = new Schema<IVehicleAdvertisingEnquiry>(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 120,
    },
    contactPersonName: {
      type: String,
      required: [true, 'Contact person name is required'],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, 'Business email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: 80,
    },
    state: {
      type: String,
      trim: true,
      default: 'Bihar',
    },
    area: {
      type: String,
      trim: true,
    },
    vehicleTypes: {
      type: [String],
      required: [true, 'At least one vehicle category must be selected'],
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0,
        message: 'Please select at least one vehicle category',
      },
    },
    campaignStartDate: {
      type: Date,
    },
    campaignEndDate: {
      type: Date,
    },
    budget: {
      type: String,
      trim: true,
    },
    vehicleCount: {
      type: Schema.Types.Mixed,
      default: 1,
    },
    advertisingFormat: {
      type: String,
      trim: true,
      default: 'Flexible / Need Recommendation',
    },
    campaignDescription: {
      type: String,
      required: [true, 'Campaign requirements are required'],
      trim: true,
      maxlength: 2500,
    },
    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Requirement Confirmed',
        'Proposal Sent',
        'Negotiation',
        'Approved',
        'Campaign Active',
        'Completed',
        'Cancelled',
      ],
      default: 'New',
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
      index: true,
    },
    adminNotes: {
      type: [AdminNoteSchema],
      default: [],
    },
    assignedAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    source: {
      type: String,
      default: 'web_enquiry',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for optimal admin search, filtering, and reporting
VehicleAdvertisingEnquirySchema.index({ createdAt: -1 })
VehicleAdvertisingEnquirySchema.index({ status: 1, createdAt: -1 })
VehicleAdvertisingEnquirySchema.index({ city: 1, status: 1 })
VehicleAdvertisingEnquirySchema.index({ companyName: 'text', contactPersonName: 'text', email: 'text', mobile: 'text', city: 'text' })

const VehicleAdvertisingEnquiry: Model<IVehicleAdvertisingEnquiry> =
  mongoose.models.VehicleAdvertisingEnquiry ||
  mongoose.model<IVehicleAdvertisingEnquiry>(
    'VehicleAdvertisingEnquiry',
    VehicleAdvertisingEnquirySchema
  )

export default VehicleAdvertisingEnquiry
