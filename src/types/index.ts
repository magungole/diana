export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'member'
  profilePhoto?: string
  niche?: string
  businessStage?: string
  bio?: string
  stripeCustomerId?: string
  createdAt?: string
}

export interface MembershipPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year' | 'once'
  stripeProductId?: string
  stripePriceId?: string
  features: string[]
  isActive: boolean
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  status: 'active' | 'cancelled' | 'past_due'
  stripeSubscriptionId?: string
  currentPeriodEnd?: string
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  isPublished: boolean
  accessLevel: 'free' | 'member' | 'premium'
  order: number
  moduleCount?: number
  lessonCount?: number
}

export interface Module {
  id: string
  courseId: string
  title: string
  order: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: string
  moduleId: string
  courseId: string
  title: string
  content?: string
  videoUrl?: string
  lessonType: 'video' | 'text' | 'download'
  order: number
  duration?: string
  resourceUrl?: string
  resourceName?: string
}

export interface UserProgress {
  id: string
  userId: string
  lessonId: string
  completedAt: string
}

export interface Class {
  id: string
  title: string
  description: string
  dateTime: string
  coachName: string
  meetingLink?: string
  replayLoomId?: string
  programmeId?: string
  isPublished: boolean
  category?: string
}

export interface CommunityPost {
  id: string
  userId: string
  userName: string
  userPhoto?: string
  content: string
  category: string
  isPinned: boolean
  createdAt: string
  likesCount: number
  commentCount?: number
}

export interface Comment {
  id: string
  postId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface Message {
  id: string
  fromUserId: string
  toUserId: string
  fromName: string
  content: string
  isRead: boolean
  createdAt: string
}

export interface Resource {
  id: string
  title: string
  description: string
  fileUrl: string
  category: string
  accessLevel: 'free' | 'member' | 'premium'
  createdAt: string
  fileType?: string
}

export interface Notification {
  id: string
  userId: string
  type: string
  content: string
  isRead: boolean
  createdAt: string
  link?: string
}
