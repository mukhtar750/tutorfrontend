import { User } from '../../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Award,
  Crown,
  DollarSign,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
  Video,
  Target,
  Zap,
  XCircle,
  Download,
  Eye,
  BarChart3,
  Activity,
} from 'lucide-react';
import { getInitials, formatCurrency, formatDate } from '../../lib/utils';
import { mockCourses, mockPayments, mockUsers, mockEnrollments } from '../../lib/mockData';
import { motion } from 'motion/react';

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, onOpenChange }: UserDetailsDialogProps) {
  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Crown;
      case 'instructor':
        return Award;
      case 'student':
        return GraduationCap;
      default:
        return UserIcon;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0';
      case 'instructor':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0';
      case 'student':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const RoleIcon = getRoleIcon(user.role);

  // Get user-specific data
  const userEnrollments = mockEnrollments.filter(e => e.studentId === user.id);
  const userPayments = mockPayments.filter(p => p.studentId === user.id);
  const userCourses = user.role === 'instructor' 
    ? mockCourses.filter(c => c.instructorId === user.id)
    : mockCourses.filter(c => userEnrollments.some(e => e.courseId === c.id));

  // Calculate statistics
  const totalPaid = userPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = userPayments.filter(p => p.status === 'pending').length;
  const completedCourses = userEnrollments.filter(e => e.status === 'completed').length;
  const activeCourses = userEnrollments.filter(e => e.status === 'active').length;

  // Mock additional data
  const mockAssignments = [
    {
      id: 'a1',
      title: 'Algebra Problem Set',
      course: 'Advanced Mathematics for SS2',
      submittedAt: '2024-11-20T14:30:00Z',
      grade: 85,
      status: 'graded'
    },
    {
      id: 'a2',
      title: 'Essay on Macbeth',
      course: 'English Language & Literature',
      submittedAt: '2024-11-18T16:45:00Z',
      grade: 92,
      status: 'graded'
    },
    {
      id: 'a3',
      title: 'Physics Lab Report',
      course: 'Physics for SS3',
      dueDate: '2024-11-30T23:59:00Z',
      status: 'pending'
    },
  ];

  const mockAttendance = {
    totalClasses: 24,
    attended: 22,
    percentage: 91.7
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="dark:bg-gray-900 dark:border-white/10 max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="dark:text-white">User Details</DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            View complete user information, activity, and history
          </DialogDescription>
        </DialogHeader>

        {/* User Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white mb-6">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex items-start gap-6">
            <Avatar className="w-24 h-24 border-4 border-white/30">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                {getInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <Badge className={getRoleBadgeColor(user.role)}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    {user.classLevel && (
                      <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
                        {user.classLevel}
                      </Badge>
                    )}
                    {user.isActive !== false ? (
                      <Badge className="bg-green-500/80 text-white border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/80 text-white border-0">
                        <XCircle className="w-3 h-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 opacity-80" />
                  <span className="text-sm">{user.email}</span>
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 opacity-80" />
                    <span className="text-sm">{user.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 opacity-80" />
                  <span className="text-sm">Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 dark:bg-white/5">
            <TabsTrigger value="overview" className="dark:text-white">Overview</TabsTrigger>
            {user.role === 'student' && (
              <>
                <TabsTrigger value="payments" className="dark:text-white">Payments</TabsTrigger>
                <TabsTrigger value="academic" className="dark:text-white">Academic</TabsTrigger>
                <TabsTrigger value="activity" className="dark:text-white">Activity</TabsTrigger>
              </>
            )}
            {user.role === 'instructor' && (
              <>
                <TabsTrigger value="courses" className="dark:text-white">Courses</TabsTrigger>
                <TabsTrigger value="students" className="dark:text-white">Students</TabsTrigger>
                <TabsTrigger value="performance" className="dark:text-white">Performance</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-6">
            {user.role === 'student' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Total Paid',
                      value: formatCurrency(totalPaid),
                      icon: DollarSign,
                      gradient: 'from-green-500 to-emerald-500',
                      bgGradient: 'from-green-500/10 to-emerald-500/10'
                    },
                    {
                      label: 'Enrolled Courses',
                      value: userEnrollments.length,
                      icon: BookOpen,
                      gradient: 'from-blue-500 to-cyan-500',
                      bgGradient: 'from-blue-500/10 to-cyan-500/10'
                    },
                    {
                      label: 'Completed',
                      value: completedCourses,
                      icon: CheckCircle,
                      gradient: 'from-purple-500 to-pink-500',
                      bgGradient: 'from-purple-500/10 to-pink-500/10'
                    },
                    {
                      label: 'Attendance',
                      value: `${mockAttendance.percentage}%`,
                      icon: Activity,
                      gradient: 'from-orange-500 to-red-500',
                      bgGradient: 'from-orange-500/10 to-red-500/10'
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="relative overflow-hidden bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
                        <CardContent className="p-4 relative z-10">
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                            <stat.icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="text-2xl font-bold mb-1 dark:text-white">{stat.value}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Enrolled Courses */}
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Enrolled Courses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userCourses.length > 0 ? (
                      <div className="space-y-3">
                        {userCourses.map((course) => {
                          const enrollment = userEnrollments.find(e => e.courseId === course.id);
                          return (
                            <div
                              key={course.id}
                              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/30"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold dark:text-white truncate">
                                    {course.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {course.instructorName}
                                  </p>
                                  {enrollment && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                          style={{ width: `${enrollment.progress}%` }}
                                        />
                                      </div>
                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {enrollment.progress}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              {enrollment && (
                                <Badge
                                  className={
                                    enrollment.status === 'completed'
                                      ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30'
                                      : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                                  }
                                >
                                  {enrollment.status}
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                        No enrolled courses yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </>
            )}

            {user.role === 'instructor' && (
              <>
                {/* Instructor Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: 'Courses Teaching',
                      value: userCourses.length,
                      icon: BookOpen,
                      gradient: 'from-blue-500 to-cyan-500',
                    },
                    {
                      label: 'Total Students',
                      value: userCourses.reduce((sum, c) => sum + c.enrollmentCount, 0),
                      icon: Users,
                      gradient: 'from-green-500 to-emerald-500',
                    },
                    {
                      label: 'Avg Rating',
                      value: (userCourses.reduce((sum, c) => sum + c.rating, 0) / userCourses.length || 0).toFixed(1),
                      icon: Award,
                      gradient: 'from-purple-500 to-pink-500',
                    },
                    {
                      label: 'Total Revenue',
                      value: formatCurrency(userCourses.reduce((sum, c) => sum + (c.price * c.enrollmentCount), 0)),
                      icon: DollarSign,
                      gradient: 'from-orange-500 to-red-500',
                    },
                  ].map((stat, index) => (
                    <Card key={index} className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                      <CardContent className="p-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-2xl font-bold mb-1 dark:text-white">{stat.value}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Courses Teaching */}
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardHeader>
                    <CardTitle className="dark:text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Courses Teaching
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userCourses.map((course) => (
                        <div
                          key={course.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/30"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold dark:text-white">{course.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {course.enrollmentCount} students • {course.rating} ⭐
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(course.price * course.enrollmentCount)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total revenue</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* Payments Tab (Students Only) */}
          {user.role === 'student' && (
            <TabsContent value="payments" className="space-y-4 mt-6">
              {/* Payment Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Paid</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(totalPaid)}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {userPayments.filter(p => p.status === 'completed').length} completed transactions
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {pendingPayments}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Awaiting confirmation
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Transactions</p>
                        <p className="text-2xl font-bold dark:text-white">
                          {userPayments.length}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      All payment records
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment History */}
              <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="dark:text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Payment History
                    </CardTitle>
                    <Button variant="outline" size="sm" className="dark:border-white/10">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {userPayments.length > 0 ? (
                    <div className="space-y-3">
                      {userPayments.map((payment) => {
                        const course = mockCourses.find(c => c.id === payment.courseId);
                        return (
                          <motion.div
                            key={payment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  payment.status === 'completed'
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                    : payment.status === 'pending'
                                    ? 'bg-gradient-to-br from-orange-500 to-red-500'
                                    : 'bg-gradient-to-br from-red-500 to-pink-500'
                                }`}
                              >
                                {payment.status === 'completed' ? (
                                  <CheckCircle className="w-6 h-6 text-white" />
                                ) : payment.status === 'pending' ? (
                                  <Clock className="w-6 h-6 text-white" />
                                ) : (
                                  <XCircle className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold dark:text-white truncate">
                                  {course?.title || 'Course Payment'}
                                </h4>
                                <div className="flex items-center gap-3 mt-1">
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(payment.paidAt || payment.createdAt)}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="text-xs dark:border-white/20 dark:text-gray-300"
                                  >
                                    {payment.paymentMethod}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg dark:text-white">
                                {formatCurrency(payment.amount)}
                              </p>
                              <Badge
                                className={
                                  payment.status === 'completed'
                                    ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30'
                                    : payment.status === 'pending'
                                    ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
                                    : 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30'
                                }
                              >
                                {payment.status}
                              </Badge>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">No payment records found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Academic Tab (Students Only) */}
          {user.role === 'student' && (
            <TabsContent value="academic" className="space-y-4 mt-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average Grade</p>
                        <p className="text-2xl font-bold dark:text-white">88.5%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {mockAttendance.percentage}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Assignments</p>
                        <p className="text-2xl font-bold dark:text-white">
                          {mockAssignments.filter(a => a.status === 'graded').length}/{mockAssignments.length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Assignments */}
              <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Recent Assignments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockAssignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold dark:text-white">{assignment.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {assignment.course}
                          </p>
                          {assignment.submittedAt && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Submitted: {formatDate(assignment.submittedAt)}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          {assignment.status === 'graded' ? (
                            <>
                              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {assignment.grade}%
                              </p>
                              <Badge className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30">
                                Graded
                              </Badge>
                            </>
                          ) : (
                            <Badge className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Attendance */}
              <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Attendance Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/30">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Classes Attended</p>
                        <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                          {mockAttendance.attended} / {mockAttendance.totalClasses}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-24 h-24 rounded-full border-8 border-green-500 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {mockAttendance.percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{mockAttendance.attended}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Present</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          {mockAttendance.totalClasses - mockAttendance.attended}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Absent</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                        <p className="text-2xl font-bold dark:text-white">{mockAttendance.totalClasses}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Total</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Activity Tab (Students Only) */}
          {user.role === 'student' && (
            <TabsContent value="activity" className="space-y-4 mt-6">
              <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                <CardHeader>
                  <CardTitle className="dark:text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: 'Submitted assignment',
                        details: 'Algebra Problem Set - Advanced Mathematics',
                        time: '2 hours ago',
                        icon: FileText,
                        color: 'from-blue-500 to-cyan-500'
                      },
                      {
                        action: 'Attended live class',
                        details: 'English Literature - Macbeth Analysis',
                        time: '1 day ago',
                        icon: Video,
                        color: 'from-purple-500 to-pink-500'
                      },
                      {
                        action: 'Completed lesson',
                        details: 'Trigonometry Basics - Chapter 5',
                        time: '2 days ago',
                        icon: CheckCircle,
                        color: 'from-green-500 to-emerald-500'
                      },
                      {
                        action: 'Payment completed',
                        details: 'Physics for SS3 - ₦25,000',
                        time: '3 days ago',
                        icon: DollarSign,
                        color: 'from-orange-500 to-red-500'
                      },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10"
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center flex-shrink-0`}>
                          <activity.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold dark:text-white">{activity.action}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activity.details}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
