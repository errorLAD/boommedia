export type UserRole = 'BRAND' | 'INFLUENCER' | 'VEHICLE_PARTNER' | 'ADMIN'
export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
export type CampaignStatus = 'DRAFT' | 'PUBLISHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'PAUSED'
export type CampaignType = 'INFLUENCER' | 'VEHICLE' | 'COMBINED'
export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED'
export type PaymentStatus = 'CREATED' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED'
export type PayoutStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
export type TransactionType = 'BRAND_PAYMENT' | 'PLATFORM_FEE' | 'INFLUENCER_PAYOUT' | 'VEHICLE_PAYOUT' | 'REFUND'
export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
export type ContentStatus = 'PENDING' | 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED'
export type DisputeType = 'PAYMENT' | 'CONTENT' | 'DELIVERABLE' | 'CONDUCT' | 'OTHER'
export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'CLOSED' | 'ESCALATED'
export type VehicleType = 'E_RICKSHAW' | 'AUTO_RICKSHAW' | 'BUS' | 'TEMPO' | 'DELIVERY_VEHICLE' | 'COMMERCIAL_VEHICLE' | 'OTHER'
export type AdPosition = 'FRONT' | 'BACK' | 'LEFT' | 'RIGHT' | 'TOP' | 'INTERIOR' | 'FULL_WRAP'
export type SocialPlatform = 'INSTAGRAM' | 'YOUTUBE' | 'FACEBOOK' | 'TWITTER' | 'LINKEDIN' | 'TIKTOK' | 'OTHER'
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM'
export type DeliverableType =
  | 'INSTAGRAM_REEL'
  | 'INSTAGRAM_POST'
  | 'INSTAGRAM_STORY'
  | 'YOUTUBE_VIDEO'
  | 'FACEBOOK_POST'
  | 'IMAGE'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'URL'
  | 'OTHER'

export type NotificationType =
  | 'NEW_CAMPAIGN'
  | 'INVITATION_RECEIVED'
  | 'APPLICATION_ACCEPTED'
  | 'APPLICATION_REJECTED'
  | 'MESSAGE_RECEIVED'
  | 'CONTENT_SUBMITTED'
  | 'CONTENT_APPROVED'
  | 'REVISION_REQUESTED'
  | 'CAMPAIGN_STARTED'
  | 'CAMPAIGN_COMPLETED'
  | 'PAYMENT_RECEIVED'
  | 'PAYOUT_PROCESSED'
  | 'VERIFICATION_UPDATE'
  | 'DISPUTE_UPDATE'
  | 'SYSTEM'

export type UserStatus = 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BANNED'

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  status: UserStatus
  emailVerified: boolean
  twoFactorEnabled: boolean
  lastLogin?: Date
  loginAttempts: number
  lockUntil?: Date
  createdAt: Date
  updatedAt: Date
}

// ─── Social / Influencer ───────────────────────────────────────────────────────

export interface ISocialAccount {
  platform: SocialPlatform
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

export interface IInfluencerProfile {
  _id: string
  userId: string | IUser
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
  verificationStatus: VerificationStatus
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Brand ────────────────────────────────────────────────────────────────────

export interface IBrandProfile {
  _id: string
  userId: string | IUser
  companyName: string
  contactPerson: string
  industry: string
  website?: string
  description?: string
  logo?: string
  city?: string
  state?: string
  gstNumber?: string
  teamMembers: Array<{ userId: string; role: string; addedAt: Date }>
  totalCampaigns: number
  totalSpend: number
  rating: number
  reviewCount: number
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Vehicle Partner ──────────────────────────────────────────────────────────

export interface IVehiclePartnerProfile {
  _id: string
  userId: string | IUser
  bio?: string
  profileImage?: string
  city: string
  state: string
  totalVehicles: number
  activeVehicles: number
  totalEarnings: number
  pendingEarnings: number
  availableBalance: number
  completedCampaigns: number
  rating: number
  reviewCount: number
  bankDetails: {
    accountNumber?: string
    ifscCode?: string
    bankName?: string
    accountHolderName?: string
    upiId?: string
  }
  verificationStatus: VerificationStatus
  documents: Array<{ type: string; url: string; uploadedAt: Date }>
  createdAt: Date
  updatedAt: Date
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────

export interface IVehicleAdPosition {
  position: AdPosition
  size: { width: number; height: number; unit: string }
  description?: string
  photos: string[]
}

export interface IVehicle {
  _id: string
  partnerId: string
  partnerProfileId?: string
  vehicleType: VehicleType
  registrationNumber: string
  make?: string
  model?: string
  year?: number
  photos: Array<{ url: string; caption?: string; isPrimary?: boolean }>
  city: string
  state: string
  operatingAreas: string[]
  routes: Array<{ name: string; from: string; to: string; distance?: number }>
  adPositions: IVehicleAdPosition[]
  pricing: { perDay?: number; perWeek?: number; perMonth?: number; customDuration?: boolean }
  minimumDuration: number
  maximumDuration: number
  estimatedDailyExposure?: number
  availability: Array<{
    startDate: Date
    endDate: Date
    isBooked: boolean
    campaignId?: string
  }>
  isAvailable: boolean
  verificationStatus: VerificationStatus
  isActive: boolean
  totalCampaigns: number
  rating: number
  createdAt: Date
  updatedAt: Date
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

export interface ICampaignDeliverable {
  type: string
  quantity: number
  description?: string
}

export interface ICampaign {
  _id: string
  brandId: string | IUser
  brandProfileId?: string
  name: string
  slug: string
  type: CampaignType
  status: CampaignStatus
  objective: string
  description: string
  category: string
  tags: string[]
  targetAudience: {
    ageRange: { min: number; max: number }
    gender: string
    locations: string[]
    interests: string[]
  }
  budget: {
    total: number
    influencer?: number
    vehicle?: number
    platformFee?: number
    currency: string
  }
  cities: string[]
  states: string[]
  startDate?: Date
  endDate?: Date
  requirements?: string
  deliverables: ICampaignDeliverable[]
  influencerCriteria: {
    minFollowers?: number
    maxFollowers?: number
    niches: string[]
    platforms: string[]
    minEngagement?: number
  }
  vehicleCriteria: {
    vehicleTypes: string[]
    cities: string[]
    minDuration?: number
  }
  applicationCount: number
  viewCount: number
  isPaid: boolean
  paymentId?: string
  createdAt: Date
  updatedAt: Date
}

// ─── Application / Invitation ─────────────────────────────────────────────────

export interface ICampaignApplication {
  _id: string
  campaignId: string | ICampaign
  applicantId: string | IUser
  applicantType: 'INFLUENCER' | 'VEHICLE_PARTNER'
  vehicleId?: string
  status: ApplicationStatus
  message?: string
  proposedPrice?: number
  agreedPrice?: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ICampaignInvitation {
  _id: string
  campaignId: string | ICampaign
  inviteeId: string | IUser
  inviteeType: 'INFLUENCER' | 'VEHICLE_PARTNER'
  vehicleId?: string
  status: InvitationStatus
  message?: string
  proposedPrice?: number
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ─── Content ──────────────────────────────────────────────────────────────────

export interface IContentSubmission {
  _id: string
  campaignId: string
  influencerId: string | IUser
  deliverableType: DeliverableType
  title?: string
  description?: string
  contentUrl?: string
  contentFiles: Array<{ url: string; type: string; name: string; size?: number }>
  status: ContentStatus
  revisionNotes: Array<{ note: string; requestedBy: string; requestedAt: Date }>
  approvedAt?: Date
  approvedBy?: string
  rejectedAt?: Date
  rejectedBy?: string
  submittedAt: Date
  createdAt: Date
  updatedAt: Date
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export interface IConversation {
  _id: string
  participants: Array<{ userId: string | IUser; role: string; lastSeen?: Date }>
  campaignId?: string
  lastMessage?: {
    content: string
    senderId: string
    sentAt: Date
    type: string
  }
  unreadCounts: Record<string, number>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface IMessage {
  _id: string
  conversationId: string
  senderId: string | IUser
  senderRole: string
  content?: string
  type: MessageType
  attachments: Array<{ url: string; name: string; type: string; size?: number }>
  readBy: Array<{ userId: string; readAt: Date }>
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

// ─── Finance ──────────────────────────────────────────────────────────────────

export interface IPayment {
  _id: string
  brandId: string
  campaignId: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  amount: number
  currency: string
  status: PaymentStatus
  breakdown: {
    influencerAmount?: number
    vehicleAmount?: number
    platformFee?: number
    gst?: number
  }
  notes?: string
  refundId?: string
  refundAmount?: number
  createdAt: Date
  updatedAt: Date
}

export interface ITransaction {
  _id: string
  paymentId?: string
  campaignId?: string
  fromUserId?: string
  toUserId?: string
  type: TransactionType
  amount: number
  currency: string
  status: TransactionStatus
  reference?: string
  description?: string
  metadata?: Record<string, unknown>
  createdAt: Date
  updatedAt: Date
}

export interface IPayout {
  _id: string
  recipientId: string
  recipientRole: 'INFLUENCER' | 'VEHICLE_PARTNER'
  campaignId?: string
  transactionId?: string
  amount: number
  currency: string
  status: PayoutStatus
  razorpayPayoutId?: string
  bankAccount?: { accountNumber?: string; ifscCode?: string; accountHolderName?: string }
  upiId?: string
  failureReason?: string
  processedAt?: Date
  createdAt: Date
  updatedAt: Date
}

// ─── Reviews / Disputes / Notifications ──────────────────────────────────────

export interface IReview {
  _id: string
  campaignId: string
  reviewerId: string | IUser
  reviewerRole: string
  revieweeId: string | IUser
  revieweeRole: string
  rating: number
  comment?: string
  isPublic: boolean
  createdAt: Date
  updatedAt: Date
}

export interface INotification {
  _id: string
  userId: string
  type: NotificationType
  title: string
  body: string
  isRead: boolean
  readAt?: Date
  data?: Record<string, unknown>
  actionUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface IVerification {
  _id: string
  userId: string
  role: string
  documents: Array<{
    documentType: string
    url: string
    uploadedAt: Date
    verifiedAt?: Date
    status: string
  }>
  status: 'PENDING' | 'IN_REVIEW' | 'VERIFIED' | 'REJECTED'
  submittedAt?: Date
  reviewedAt?: Date
  reviewedBy?: string
  adminNotes?: string
  rejectionReason?: string
  createdAt: Date
  updatedAt: Date
}

export interface IDispute {
  _id: string
  campaignId: string
  raisedById: string | IUser
  raisedByRole: string
  againstId: string | IUser
  againstRole: string
  type: DisputeType
  title: string
  description: string
  evidence: Array<{ url: string; description?: string }>
  status: DisputeStatus
  resolution?: string
  resolvedBy?: string
  resolvedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface ISavedItem {
  _id: string
  userId: string
  itemType: 'INFLUENCER' | 'VEHICLE' | 'CAMPAIGN'
  itemId: string
  createdAt: Date
  updatedAt: Date
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface ApiError {
  success: false
  error: string
  details?: Record<string, string>
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  role: UserRole
  phone?: string
}

export interface AuthSession {
  user: {
    id: string
    email: string
    name: string
    role: UserRole
    status: UserStatus
    emailVerified: boolean
  }
  expires: string
}

// ─── Dashboard stats ──────────────────────────────────────────────────────────

export interface BrandDashboardStats {
  totalCampaigns: number
  activeCampaigns: number
  totalSpend: number
  totalInfluencers: number
  totalVehicles: number
  pendingApplications: number
}

export interface InfluencerDashboardStats {
  totalCampaigns: number
  activeCampaigns: number
  totalEarnings: number
  pendingEarnings: number
  availableBalance: number
  totalFollowers: number
  avgEngagementRate: number
  pendingSubmissions: number
}

export interface VehiclePartnerDashboardStats {
  totalVehicles: number
  activeVehicles: number
  totalEarnings: number
  pendingEarnings: number
  availableBalance: number
  totalCampaigns: number
  pendingInvitations: number
}

export interface AdminDashboardStats {
  totalUsers: number
  totalBrands: number
  totalInfluencers: number
  totalVehiclePartners: number
  totalCampaigns: number
  activeCampaigns: number
  totalRevenue: number
  pendingVerifications: number
  openDisputes: number
}
