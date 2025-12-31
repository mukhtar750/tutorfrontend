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
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface UserDetailsDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailsDialog({ user: initialUser, open, onOpenChange }: UserDetailsDialogProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(initialUser);
    if (open && initialUser) {
        fetchUserDetails(initialUser.id);
    }
  }, [initialUser, open]);

  const fetchUserDetails = async (userId: string) => {
    setLoading(true);
    try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const res = await axios.get(`http://localhost:8000/api/admin/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setDetails(res.data.details);
        // Update user info if needed
        // setUser(prev => ({ ...prev, ...res.data.user }));
    } catch (error) {
        console.error('Failed to fetch user details', error);
    } finally {
        setLoading(false);
    }
  };

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

  // Get user-specific data from API response or fallbacks
  const userEnrollments = details?.enrollments || [];
  const userPayments = details?.payments || [];
  const userCourses = details?.courses || (user.role === 'student' ? userEnrollments.map((e: any) => ({
      id: e.courseId,
      title: e.courseTitle,
      thumbnail: e.thumbnail,
      instructorName: 'Unknown', // Backend might need to provide this
      paymentStatus: e.paymentStatus
  })) : []);

  // Calculate statistics
  const totalPaid = details?.stats?.totalPaid || 0;
  const pendingPayments = userPayments.filter((p: any) => p.status === 'pending').length;
  const completedCourses = details?.stats?.completedCourses || 0;
  const activeCourses = userEnrollments.filter((e: any) => e.status === 'active').length;

  // Mock additional data (still mocked until backend fully supports these)
  const mockAssignments = details?.assignments || [];

  const mockAttendance = {
    totalClasses: 24,
    attended: 22,
    percentage: details?.stats?.attendance || 0
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
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading details...</div>
            ) : user.role === 'student' ? (
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
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${stat.bgGradient} border border-transparent hover:border-${stat.gradient.split(' ')[1]}`}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center mb-3 shadow-lg`}>
                        <stat.icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-2xl font-bold dark:text-white mb-1">{stat.value}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent Activity & Enrolled Courses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                    <CardHeader>
                      <CardTitle className="dark:text-white flex items-center gap-2">
                        <Activity className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { action: 'Submitted Assignment', target: 'Algebra 101', time: '2 hours ago', icon: FileText, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
                          { action: 'Joined Live Class', target: 'Physics Lab', time: 'Yesterday', icon: Video, color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30' },
                          { action: 'Course Completed', target: 'Intro to Chemistry', time: '3 days ago', icon: CheckCircle, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium dark:text-white">{item.action}</p>
                              <p className="text-xs text-gray-500">{item.target} • {item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

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
                          {userCourses.map((course: any) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-white/5"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded bg-gray-200 dark:bg-white/10 overflow-hidden">
                                  {course.thumbnail && (
                                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-sm dark:text-white">{course.title}</p>
                                  <p className="text-xs text-gray-500">{course.instructorName}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center text-gray-500 py-4 text-sm">No courses found</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              // Instructor View (Simplified for now)
              <div className="grid grid-cols-2 gap-4">
                 <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                    <CardHeader><CardTitle>Courses Taught</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{details?.stats?.totalCourses || 0}</div>
                    </CardContent>
                 </Card>
                 <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10">
                    <CardHeader><CardTitle>Total Students</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{details?.stats?.totalStudents || 0}</div>
                    </CardContent>
                 </Card>
              </div>
            )}
          </TabsContent>

          {/* Other tabs can be implemented similarly using the `details` state */}
          <TabsContent value="payments">
            <Card>
                <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
                <CardContent>
                    {userPayments.length > 0 ? (
                        <div className="space-y-2">
                            {userPayments.map((p: any) => (
                                <div key={p.id} className="flex justify-between items-center p-2 border-b">
                                    <div>
                                        <p className="font-medium">{p.courseName}</p>
                                        <p className="text-xs text-gray-500">{formatDate(p.date)}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{formatCurrency(p.amount)}</p>
                                        <Badge variant={p.status === 'completed' ? 'default' : 'secondary'}>{p.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-gray-500">No payments found</p>}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
