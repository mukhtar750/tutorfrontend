export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin' | 'instructor';
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  subject: string;
  level: string;
  thumbnail_url: string;
  instructor_id: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  video_url: string;
  duration_minutes: number;
  lesson_order: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  enrolledCourses: number;
  completedCourses: number;
  averageProgress: number;
  studyHours: number;
  streak: number;
}

export interface EnrolledCourse {
  id: string;
  title: string;
  thumbnail: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  subject: string;
  lastAccessed: string;
}

export interface UpcomingSession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  duration: number;
  instructorName: string;
  meetingLink?: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseName: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  subject: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentCourses: EnrolledCourse[];
  upcomingSessions: UpcomingSession[];
  pendingAssignments: Assignment[];
}
