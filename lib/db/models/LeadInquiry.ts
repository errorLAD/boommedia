import mongoose, { Model, Schema } from 'mongoose'

export type LeadService = 'influencer' | 'vehicle' | 'both'
export type LeadStatus = 'new' | 'contacted' | 'in-progress' | 'converted' | 'closed'

export interface ILeadInquiry {
  companyName: string
  contactPersonName: string
  email: string
  phone: string
  service: LeadService
  message: string
  city?: string
  state?: string
  vehicleTypes?: string[]
  budget?: string
  source?: string
  status: LeadStatus
  adminNotes: string
  createdAt: Date
  updatedAt: Date
}

const LeadInquirySchema = new Schema<ILeadInquiry>(
  {
    companyName: { type: String, required: true, trim: true, maxlength: 120 },
    contactPersonName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 25, default: '' },
    service: { type: String, required: true, enum: ['influencer', 'vehicle', 'both'] },
    message: { type: String, trim: true, maxlength: 5000, default: '' },
    city: { type: String, trim: true, default: '' },
    state: { type: String, trim: true, default: '' },
    vehicleTypes: { type: [String], default: [] },
    budget: { type: String, trim: true, default: '' },
    source: { type: String, trim: true, default: 'landing_page' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'converted', 'closed'],
      default: 'new',
      index: true,
    },
    adminNotes: { type: String, trim: true, maxlength: 5000, default: '' },
  },
  { timestamps: true }
)

LeadInquirySchema.index({ createdAt: -1 })
LeadInquirySchema.index({ service: 1, status: 1, createdAt: -1 })
LeadInquirySchema.index({ companyName: 'text', contactPersonName: 'text', email: 'text', phone: 'text' })

const LeadInquiry: Model<ILeadInquiry> =
  mongoose.models.LeadInquiry || mongoose.model<ILeadInquiry>('LeadInquiry', LeadInquirySchema)

export default LeadInquiry
