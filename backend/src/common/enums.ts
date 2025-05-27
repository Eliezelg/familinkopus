export enum Language {
  EN = 'EN',
  HE = 'HE',
  FR = 'FR',
  ES = 'ES',
  AR = 'AR',
  RU = 'RU',
  DE = 'DE',
  PT = 'PT'
}

export enum FamilyRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED'
}

export enum GazetteStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  SENT = 'SENT',
  FAILED = 'FAILED'
}

export enum ShipmentStatus {
  PENDING = 'PENDING',
  PRINTING = 'PRINTING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
  FAILED = 'FAILED'
}

export enum ShippingMethod {
  STANDARD = 'STANDARD',
  EXPRESS = 'EXPRESS',
  PRIORITY = 'PRIORITY'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAST_DUE = 'PAST_DUE'
}

export enum SubscriptionPlan {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentProvider {
  ZCREDIT = 'ZCREDIT',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL'
}

export enum DiscountType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE'
}

export enum NotificationType {
  GAZETTE_READY = 'GAZETTE_READY',
  GAZETTE_SENT = 'GAZETTE_SENT',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  MEMBER_JOINED = 'MEMBER_JOINED',
  PHOTO_UPLOADED = 'PHOTO_UPLOADED',
  INVITATION_RECEIVED = 'INVITATION_RECEIVED',
  SUBSCRIPTION_EXPIRING = 'SUBSCRIPTION_EXPIRING',
  GENERAL = 'GENERAL'
}
