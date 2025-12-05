// Core type definitions for My Tutor+ LMS

export type UserRole = 'student' | 'instructor' | 'admin';

export type ClassLevel = 'SS1' | 'SS2' | 'SS3';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  phoneNumber?: string;
  classLevel?: ClassLevel;
  createdAt: string;
  isActive?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructorId: string;
  instructorName: string;
  price: number;
  currency: string;
  category: string;
  level: ClassLevel[];
  duration: string;
  enrollmentCount: number;
  rating: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
  lastAccessedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'live' | 'recorded' | 'reading';
  duration: number;
  order: number;
  videoUrl?: string;
  resources: Resource[];
  isPublished: boolean;
}

export interface LiveSession {
  id: string;
  lessonId: string;
  courseId: string;
  title: string;
  scheduledAt: string;
  duration: number;
  meetingUrl: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  attendees: string[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  totalPoints: number;
  attachments: Resource[];
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  attachments: Resource[];
  submittedAt: string;
  grade?: number;
  feedback?: string;
  gradedAt?: string;
  status: 'submitted' | 'graded' | 'late';
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  duration: number;
  totalPoints: number;
  questions: Question[];
  dueDate: string;
  attemptsAllowed: number;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'essay';
  question: string;
  options?: string[];
  correctAnswer?: string | number;
  points: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  answers: Record<string, any>;
  score: number;
  startedAt: string;
  submittedAt: string;
  gradedAt?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'video' | 'document' | 'link';
  url: string;
  size?: number;
}

export interface Payment {
  id: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'paystack' | 'flutterwave' | 'stripe';
  reference: string;
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  subject: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface Attendance {
  id: string;
  sessionId: string;
  studentId: string;
  joinedAt: string;
  leftAt?: string;
  duration: number;
  status: 'present' | 'absent' | 'late';
}

export interface Analytics {
  totalRevenue: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  activeEnrollments: number;
  completionRate: number;
  averageRating: number;
  revenueGrowth: number;
}
