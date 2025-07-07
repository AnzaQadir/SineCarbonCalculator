export interface SignupUserData {
  email: string;
  firstName?: string;
  age?: string;
  gender?: string;
  profession?: string;
  country?: string;
  city?: string;
  household?: string;
  waitlistPosition?: number;
  ctaVariant?: 'A' | 'B';
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  age?: string;
  gender?: string;
  profession?: string;
  country?: string;
  city?: string;
  household?: string;
  waitlistPosition: number;
  ctaVariant: 'A' | 'B';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserActivity {
  id: string;
  userId: string;
  activityType: 'SIGNUP' | 'EMAIL_SENT' | 'COMMUNITY_JOINED' | 'PROFILE_UPDATED';
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface SignupResponse {
  success: boolean;
  user: User;
  waitlistPosition: number;
  message: string;
}

export interface UserActivityResponse {
  success: boolean;
  activity: UserActivity;
  message: string;
} 