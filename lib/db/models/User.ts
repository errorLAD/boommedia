import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  passwordHash: string
  role: 'BRAND' | 'INFLUENCER' | 'VEHICLE_PARTNER' | 'ADMIN'
  adminRole?: 'SUPER_ADMIN' | 'ADMIN' | 'SUPPORT_ADMIN'
  name: string
  phone?: string
  emailVerified: boolean
  emailVerificationToken?: string
  emailVerificationExpiry?: Date
  passwordResetToken?: string
  passwordResetExpiry?: Date
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'
  isActive?: boolean
  isVerified?: boolean
  twoFactorEnabled: boolean
  twoFactorSecret?: string
  lastLogin?: Date
  loginAttempts: number
  lockUntil?: Date
  isDeleted: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['BRAND', 'INFLUENCER', 'VEHICLE_PARTNER', 'ADMIN'],
      required: [true, 'Role is required'],
    },
    adminRole: {
      type: String,
      enum: ['SUPER_ADMIN', 'ADMIN', 'SUPPORT_ADMIN'],
      default: 'ADMIN',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpiry: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpiry: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'PENDING', 'SUSPENDED', 'BANNED'],
      default: 'PENDING',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ email: 1, role: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ status: 1 })
UserSchema.index({ role: 1, status: 1 })
UserSchema.index({ isDeleted: 1 })

// Pre-save hook: reset loginAttempts when status changes to ACTIVE
UserSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'ACTIVE') {
    this.loginAttempts = 0
    this.lockUntil = undefined
  }
  next()
})

// Virtual: check if account is locked
UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > new Date())
})

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User
