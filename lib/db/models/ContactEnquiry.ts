import mongoose, { Model, Schema } from 'mongoose'

export interface IContactEnquiry {
  companyName: string
  contactName: string
  email: string
  phone: string
  service: 'INFLUENCER' | 'VEHICLE' | 'BOTH'
  message?: string
  source: string
  createdAt: Date
  updatedAt: Date
}

const ContactEnquirySchema = new Schema<IContactEnquiry>(
  {
    companyName: { type: String, required: true, trim: true, maxlength: 120 },
    contactName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 20, default: '' },
    service: { type: String, required: true, enum: ['INFLUENCER', 'VEHICLE', 'BOTH'] },
    message: { type: String, trim: true, maxlength: 2500, default: '' },
    source: { type: String, default: 'landing_page', trim: true },
  },
  { timestamps: true }
)

ContactEnquirySchema.index({ createdAt: -1 })
ContactEnquirySchema.index({ email: 1, createdAt: -1 })

const ContactEnquiry: Model<IContactEnquiry> =
  mongoose.models.ContactEnquiry || mongoose.model<IContactEnquiry>('ContactEnquiry', ContactEnquirySchema)

export default ContactEnquiry
