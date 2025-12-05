import { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  Award, 
  Clock, 
  TrendingUp,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  Target,
  Flame,
  Trophy,
  Star,
  ArrowRight,
  Video,
  BookMarked,
  Zap,
  Brain
} from 'lucide-react';
import { mockEnrollments, mockCourses, mockLiveSessions, mockAssignments, getEnrolledCourses } from '../../lib/mockData';
import { formatCurrency, formatDateTime, getDaysUntil, getInitials } from '../../lib/utils';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function StudentDashboard({ user, onNavigate }: StudentDashboardProps) {
  const enrolledCourses = getEnrolledCourses(user.id);
  const upcomingSessions = mockLiveSessions.slice(0, 3);
  const pendingAssignments = mockAssignments.filter(a => {
    const daysUntil = getDaysUntil(a.dueDate);
    return daysUntil >= 0;
  }).slice(0, 5);

  const totalProgress = enrolledCourses.reduce((acc, course) => {
    const enrollment = mockEnrollments.find(e => e.courseId === course.id && e.userId === user.id);
    return acc + (enrollment?.progress || 0);
  }, 0) / (enrolledCourses.length || 1);

  const completedCourses = enrolledCourses.filter(course => {
    const enrollment = mockEnrollments.find(e => e.courseId === course.id && e.userId === user.id);
    return enrollment?.progress === 100;
  }).length;

  const currentStreak = 24; // Mock data

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
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
                {user.firstName} {user.lastName} 👋
              </h1>
              <p className="text-lg text-blue-100 max-w-2xl">
                Ready to continue your learning journey? You're making great progress!
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
                onClick={() => onNavigate('my-courses')}
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Continue Learning
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
                onClick={() => onNavigate('course-catalog')}
              >
                <Video className="w-5 h-5 mr-2" />
                Browse Courses
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
                <Flame className="w-6 h-6 text-orange-400" />
                <p className="text-3xl font-bold">{currentStreak}</p>
              </div>
              <p className="text-sm text-blue-100">Day Streak</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <p className="text-3xl font-bold">{completedCourses}</p>
              </div>
              <p className="text-sm text-blue-100">Completed</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Enrolled Courses',
            value: enrolledCourses.length,
            icon: BookOpen,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10',
            trend: '+2 this month'
          },
          {
            label: 'Pending Tasks',
            value: pendingAssignments.length,
            icon: FileText,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10',
            trend: '3 due soon'
          },
          {
            label: 'Upcoming Classes',
            value: upcomingSessions.length,
            icon: Calendar,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            trend: 'Next in 2 hours'
          },
          {
            label: 'Overall Progress',
            value: `${Math.round(totalProgress)}%`,
            icon: Target,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10',
            trend: '+15% this week'
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
                  <Badge variant="outline" className="bg-white/50 dark:bg-black/50 backdrop-blur-xl border-0">
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
        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <BookMarked className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Continue Learning</CardTitle>
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
            <CardContent className="space-y-4">
              {enrolledCourses.slice(0, 3).map((course, index) => {
                const enrollment = mockEnrollments.find(e => e.courseId === course.id && e.userId === user.id);
                const progress = enrollment?.progress || 0;
                
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (index * 0.1) }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 border border-gray-200 dark:border-white/10 cursor-pointer group"
                    onClick={() => onNavigate('my-courses')}
                  >
                    <div className="flex items-start gap-4">
                      <img 
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold mb-1 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {course.instructor}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="font-semibold dark:text-white">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <PlayCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}

              {enrolledCourses.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">No enrolled courses yet</p>
                  <Button onClick={() => onNavigate('course-catalog')}>
                    Browse Courses
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Live Classes */}
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
              {upcomingSessions.map((session, index) => {
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
                    <div className="flex items-start gap-3">
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
                      className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Join Class
                    </Button>
                  </motion.div>
                );
              })}

              {upcomingSessions.length === 0 && (
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
      </div>

      {/* Pending Assignments */}
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
                <CardTitle className="dark:text-white">Pending Assignments</CardTitle>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingAssignments.map((assignment, index) => {
                const course = mockCourses.find(c => c.id === assignment.courseId);
                const daysUntil = getDaysUntil(assignment.dueDate);
                const isUrgent = daysUntil <= 2;
                
                return (
                  <motion.div
                    key={assignment.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (index * 0.05) }}
                    whileHover={{ y: -5 }}
                    className={`p-4 rounded-2xl border ${
                      isUrgent 
                        ? 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-500/10 dark:to-orange-500/10 border-red-200 dark:border-red-500/30' 
                        : 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border-blue-200 dark:border-blue-500/30'
                    } cursor-pointer group`}
                    onClick={() => onNavigate('assignments')}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Badge 
                        variant="outline" 
                        className={`${
                          isUrgent 
                            ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30' 
                            : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30'
                        }`}
                      >
                        {isUrgent ? <AlertCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        Due in {daysUntil} days
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {assignment.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {course?.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-600 dark:text-gray-400">{assignment.points} pts</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                      >
                        Start
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {pendingAssignments.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-semibold mb-1">All caught up!</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">No pending assignments at the moment</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Learning Insights */}
      <div className="grid md:grid-cols-3 gap-6">
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
              <p className="text-2xl font-bold mb-2">85%</p>
              <p className="text-blue-100 text-sm">Average Quiz Score</p>
              <p className="text-xs text-blue-200 mt-2">↑ 12% from last month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <CardContent className="p-6 relative z-10">
              <Zap className="w-10 h-10 mb-4 opacity-80" />
              <p className="text-2xl font-bold mb-2">32h</p>
              <p className="text-purple-100 text-sm">Learning Time</p>
              <p className="text-xs text-purple-200 mt-2">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="bg-gradient-to-br from-orange-600 to-red-600 text-white border-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            <CardContent className="p-6 relative z-10">
              <Star className="w-10 h-10 mb-4 opacity-80" />
              <p className="text-2xl font-bold mb-2">4.8</p>
              <p className="text-orange-100 text-sm">Your Rating</p>
              <p className="text-xs text-orange-200 mt-2">Top 10% of students</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
