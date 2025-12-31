import { useState } from 'react';
import { User } from './types';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { DashboardLayout } from './components/layouts/DashboardLayout';
import { StudentDashboard } from './components/student/StudentDashboard';
import { CourseCatalog } from './components/student/CourseCatalog';
import { MyCoursesPage } from './components/student/MyCoursesPage';
import { PaymentsPage } from './components/student/PaymentsPage';
import { AssignmentsPage } from './components/student/AssignmentsPage';
import { StudentSchedule } from './components/student/StudentSchedule';
import { StudentMessages } from './components/student/StudentMessages';
import { CoursePlayer } from './components/student/CoursePlayer';
import { GradesPage } from './components/student/GradesPage';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { MyCourses } from './components/instructor/MyCourses';
import { CreateCourse } from './components/instructor/CreateCourse';
import { Students } from './components/instructor/Students';
import { InstructorAssignments } from './components/instructor/InstructorAssignments';
import { Schedule } from './components/instructor/Schedule';
import { InstructorAnalytics } from './components/instructor/InstructorAnalytics';
import { Messages } from './components/instructor/Messages';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PaymentManagement } from './components/admin/PaymentManagement';
import { AdminSettings } from './components/admin/AdminSettings';
import { UserManagement } from './components/admin/UserManagement';
import { CoursesManagement } from './components/admin/CoursesManagement';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './lib/theme-context';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const handleGetStarted = () => {
    setShowAuth(true);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('dashboard');
    setShowAuth(false);
  };

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (id) setSelectedCourseId(id);
  };

  return (
    <ThemeProvider>
      {/* Show landing page if not logged in and not showing auth */}
      {!currentUser && !showAuth && <LandingPage onGetStarted={handleGetStarted} />}

      {/* Show auth page if requested */}
      {!currentUser && showAuth && <AuthPage onLogin={handleLogin} />}

      {/* Show dashboard if logged in */}
      {currentUser && (
        <>
          <DashboardLayout
            user={currentUser}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          >
            {renderPage()}
          </DashboardLayout>
          <Toaster />
        </>
      )}
    </ThemeProvider>
  );

  function renderPage() {
    if (!currentUser) return null;

    // Student Pages
    if (currentUser.role === 'student') {
      switch (currentPage) {
        case 'dashboard':
          return <StudentDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'my-courses':
          return <MyCoursesPage userId={currentUser.id} onNavigate={handleNavigate} />;
        case 'course-player':
          return selectedCourseId ? (
            <CoursePlayer 
              courseId={selectedCourseId} 
              onNavigate={handleNavigate} 
            />
          ) : (
            <MyCoursesPage userId={currentUser.id} onNavigate={handleNavigate} />
          );
        case 'course-catalog':
          return <CourseCatalog userId={currentUser.id} onNavigate={handleNavigate} />;
        case 'payments':
          return <PaymentsPage userId={currentUser.id} />;
        case 'assignments':
          return <AssignmentsPage userId={currentUser.id} />;
        case 'schedule':
          return <StudentSchedule userId={currentUser.id} />;
        case 'grades':
          return <GradesPage userId={currentUser.id} />;
        case 'messages':
          return <StudentMessages userId={currentUser.id} />;
        case 'settings':
          return <StudentSettings userId={currentUser.id} />;
        default:
          return <StudentDashboard user={currentUser} onNavigate={handleNavigate} />;
      }
    }

    // Instructor Pages
    if (currentUser.role === 'instructor') {
      switch (currentPage) {
        case 'dashboard':
          return <InstructorDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'my-courses':
          return <MyCourses user={currentUser} onNavigate={handleNavigate} />;
        case 'create-course':
          return <CreateCourse />;
        case 'students':
          return <Students user={currentUser} onNavigate={handleNavigate} />;
        case 'assignments':
          return <InstructorAssignments />;
        case 'schedule':
          return <Schedule />;
        case 'analytics':
          return <InstructorAnalytics />;
        case 'messages':
          return <Messages user={currentUser} />;
        default:
          return <InstructorDashboard user={currentUser} onNavigate={handleNavigate} />;
      }
    }

    // Admin Pages
    if (currentUser.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard user={currentUser} onNavigate={handleNavigate} />;
        case 'users':
          return <UserManagement user={currentUser} />;
        case 'courses':
          return <CoursesManagement user={currentUser} />;
        case 'payments':
          return <PaymentManagement />;
        case 'analytics':
          return <AnalyticsPlaceholder />;
        case 'settings':
          return <AdminSettings />;
        default:
          return <AdminDashboard user={currentUser} onNavigate={handleNavigate} />;
      }
    }

    return <StudentDashboard user={currentUser} onNavigate={handleNavigate} />;
  }

  // Placeholder components for pages not yet implemented
  function SchedulePlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Schedule</h1>
          <p className="text-muted-foreground">View your upcoming live classes and sessions</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Schedule page coming soon...</p>
        </div>
      </div>
    );
  }

  function GradesPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Grades</h1>
          <p className="text-muted-foreground">View your grades and academic progress</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Grades page coming soon...</p>
        </div>
      </div>
    );
  }

  function MessagesPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Messages</h1>
          <p className="text-muted-foreground">Communicate with instructors and students</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Messages page coming soon...</p>
        </div>
      </div>
    );
  }

  function InstructorCoursesPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">My Courses</h1>
          <p className="text-muted-foreground">Manage your courses and content</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Course management page coming soon...</p>
        </div>
      </div>
    );
  }

  function CreateCoursePlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Create Course</h1>
          <p className="text-muted-foreground">Create a new course and add content</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Course creation page coming soon...</p>
        </div>
      </div>
    );
  }

  function StudentsPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Students</h1>
          <p className="text-muted-foreground">View and manage your students</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Students page coming soon...</p>
        </div>
      </div>
    );
  }

  function InstructorAssignmentsPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Assignments</h1>
          <p className="text-muted-foreground">Create and grade assignments</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Assignment management page coming soon...</p>
        </div>
      </div>
    );
  }

  function AnalyticsPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Analytics</h1>
          <p className="text-muted-foreground">Detailed analytics and insights</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Analytics page coming soon...</p>
        </div>
      </div>
    );
  }

  function UsersManagementPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Users Management</h1>
          <p className="text-muted-foreground">Manage students, instructors, and admins</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">User management page coming soon...</p>
        </div>
      </div>
    );
  }

  function CoursesManagementPlaceholder() {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl dark:text-white">Courses Management</h1>
          <p className="text-muted-foreground">Manage all courses on the platform</p>
        </div>
        <div className="bg-white dark:bg-gray-900/50 rounded-lg border dark:border-white/10 p-12 text-center">
          <p className="text-muted-foreground">Course management page coming soon...</p>
        </div>
      </div>
    );
  }
}