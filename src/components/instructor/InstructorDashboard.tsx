import { useState } from 'react';
import { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Star,
  FileText,
  Calendar,
  MessageSquare,
  BarChart3,
  Award,
  Video,
  CheckCircle,
  Clock,
  ArrowRight,
  PlayCircle,
  Plus,
  Brain,
  Target,
  Zap,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { mockCourses, mockEnrollments, mockSubmissions, getCoursesByInstructor, mockLiveSessions } from '../../lib/mockData';
import { formatCurrency } from '../../lib/utils';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'motion/react';

interface InstructorDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function InstructorDashboard({ user, onNavigate }: InstructorDashboardProps) {
  const instructorCourses = getCoursesByInstructor(user.id);
  const totalEnrollments = instructorCourses.reduce((sum, course) => sum + course.enrollmentCount, 0);
  const totalRevenue = instructorCourses.reduce((sum, course) => sum + (course.price * course.enrollmentCount), 0);
  const averageRating = instructorCourses.reduce((sum, course) => sum + course.rating, 0) / instructorCourses.length;
  const pendingSubmissions = mockSubmissions.filter(s => s.status === 'submitted').length;
  
  const upcomingClasses = mockLiveSessions.slice(0, 3);
  const recentSubmissions = mockSubmissions.filter(s => s.status === 'submitted').slice(0, 5);

  // Mock chart data
  const enrollmentData = [
    { month: 'Jul', students: 45, revenue: 675000 },
    { month: 'Aug', students: 62, revenue: 930000 },
    { month: 'Sep', students: 78, revenue: 1170000 },
    { month: 'Oct', students: 95, revenue: 1425000 },
    { month: 'Nov', students: 142, revenue: 2130000 },
  ];

  const coursePerformanceData = instructorCourses.slice(0, 4).map(course => ({
    name: course.title.split(' ').slice(0, 2).join(' '),
    students: course.enrollmentCount,
    rating: course.rating * 20,
  }));

  const studentEngagement = [
    { name: 'Active', value: 78, color: '#10b981' },
    { name: 'Moderate', value: 15, color: '#f59e0b' },
    { name: 'Inactive', value: 7, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-8 text-white"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-blue-100 mb-2">Welcome back,</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Prof. {user.lastName} 👨‍🏫
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl">
                You're making an impact! {totalEnrollments} students are learning from your expertise.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 mt-6"
            >
              <Button 
                size="lg"
                className="bg-white text-purple-600 hover:bg-blue-50 shadow-xl"
                onClick={() => onNavigate('create-course')}
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Course
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
                onClick={() => onNavigate('schedule')}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Schedule Class
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4"
          >
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <p className="text-3xl font-bold">{averageRating.toFixed(1)}</p>
              </div>
              <p className="text-sm text-blue-100">Avg Rating</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-green-400" />
                <p className="text-3xl font-bold">{instructorCourses.length}</p>
              </div>
              <p className="text-sm text-blue-100">Courses</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Students',
            value: totalEnrollments,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10',
            trend: '+12% this month',
            trendUp: true
          },
          {
            label: 'Pending Reviews',
            value: pendingSubmissions,
            icon: FileText,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10',
            trend: 'Needs attention',
            trendUp: false
          },
          {
            label: 'Total Revenue',
            value: formatCurrency(totalRevenue),
            icon: DollarSign,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10',
            trend: '+23% growth',
            trendUp: true
          },
          {
            label: 'Engagement Rate',
            value: '87%',
            icon: Target,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            trend: '+5% increase',
            trendUp: true
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="relative overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant="outline" className={`bg-white/50 dark:bg-black/50 backdrop-blur-xl border-0 ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-3xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Analytics Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="dark:text-white">Enrollment Trend</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={enrollmentData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: 'none', 
                          borderRadius: '8px',
                          color: 'white'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="students" 
                        stroke="url(#colorStudents)" 
                        strokeWidth={3}
                        dot={{ fill: '#6366f1', r: 4 }}
                      />
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="dark:text-white">Student Engagement</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={studentEngagement}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {studentEngagement.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Pending Submissions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="dark:text-white">Submissions to Review</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('assignments')}
                    className="dark:text-gray-300 dark:hover:text-white"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSubmissions.map((submission, index) => {
                    const course = mockCourses.find(c => c.id === submission.assignmentId.split('-')[0]);
                    
                    return (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (index * 0.05) }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border border-orange-200 dark:border-orange-500/30 cursor-pointer group"
                        onClick={() => onNavigate('assignments')}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </Badge>
                              <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
                            </div>
                            <h4 className="font-semibold mb-1 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              Assignment Submission
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Student ID: {submission.studentId} • {course?.title || 'Unknown Course'}
                            </p>
                          </div>
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Review
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {recentSubmissions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">All caught up!</p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">No pending submissions to review</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* My Courses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="dark:text-white">My Courses</CardTitle>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onNavigate('my-courses')}
                    className="dark:text-gray-300 dark:hover:text-white"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {instructorCourses.slice(0, 4).map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9 + (index * 0.05) }}
                      whileHover={{ y: -5 }}
                      className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 border border-gray-200 dark:border-white/10 cursor-pointer group"
                      onClick={() => onNavigate('my-courses')}
                    >
                      <div className="flex gap-4">
                        <img 
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-24 h-24 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{course.enrollmentCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors"
                          >
                            Manage
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Classes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Upcoming Classes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.map((session, index) => {
                  const course = mockCourses.find(c => c.id === session.courseId);
                  
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + (index * 0.1) }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 dark:border-purple-500/30 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm mb-1 dark:text-white">
                            {session.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {course?.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(session.scheduledAt).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Start Class
                      </Button>
                    </motion.div>
                  );
                })}

                {upcomingClasses.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No upcoming classes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: 'Create Course', icon: Plus, page: 'create-course', gradient: 'from-blue-500 to-purple-600' },
                  { label: 'Schedule Class', icon: Calendar, page: 'schedule', gradient: 'from-purple-500 to-pink-600' },
                  { label: 'View Analytics', icon: BarChart3, page: 'analytics', gradient: 'from-green-500 to-emerald-600' },
                  { label: 'Messages', icon: MessageSquare, page: 'messages', gradient: 'from-orange-500 to-red-600' },
                ].map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + (index * 0.05) }}
                    whileHover={{ scale: 1.02, x: 5 }}
                  >
                    <Button 
                      variant="outline"
                      className="w-full justify-start dark:border-white/10 dark:hover:bg-white/5 group"
                      onClick={() => onNavigate(action.page)}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mr-3`}>
                        <action.icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="flex-1 text-left dark:text-white">{action.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              <CardContent className="p-6 relative z-10">
                <Brain className="w-10 h-10 mb-4 opacity-80" />
                <p className="text-2xl font-bold mb-2">Premium Insights</p>
                <p className="text-blue-100 text-sm mb-4">
                  Your teaching performance is in the top 10% of instructors!
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => onNavigate('analytics')}
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
