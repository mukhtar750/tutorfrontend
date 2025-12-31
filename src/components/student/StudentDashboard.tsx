import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, DashboardData } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
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
  ArrowRight,
  Video,
  BookMarked
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface StudentDashboardProps {
  user: User;
  onNavigate: (page: string, id?: string) => void;
}

export function StudentDashboard({ user, onNavigate }: StudentDashboardProps) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:8000/api/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

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
                <p className="text-3xl font-bold">{data.stats.streak}</p>
              </div>
              <p className="text-sm text-blue-100">Day Streak</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <p className="text-3xl font-bold">{data.stats.completedCourses}</p>
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
            value: data.stats.enrolledCourses,
            icon: BookOpen,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10',
            trend: 'Active'
          },
          {
            label: 'Pending Tasks',
            value: data.pendingAssignments.length,
            icon: FileText,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10',
            trend: 'Due soon'
          },
          {
            label: 'Upcoming Classes',
            value: data.upcomingSessions.length,
            icon: Calendar,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            trend: 'This week'
          },
          {
            label: 'Overall Progress',
            value: `${data.stats.averageProgress}%`,
            icon: Target,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10',
            trend: 'On track'
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
              {data.recentCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 border border-gray-200 dark:border-white/10 cursor-pointer group"
                  onClick={() => onNavigate('course-player', course.id)}
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
                        {course.subject}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-semibold dark:text-white">{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigate('course-player', course.id);
                      }}
                    >
                      <PlayCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}

              {data.recentCourses.length === 0 && (
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
              {data.upcomingSessions.map((session, index) => (
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
                        {session.subject}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(session.startTime).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => session.meetingLink && window.open(session.meetingLink, '_blank')}
                    disabled={!session.meetingLink}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Join Class
                  </Button>
                </motion.div>
              ))}

              {data.upcomingSessions.length === 0 && (
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
            {data.pendingAssignments.length > 0 ? (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.pendingAssignments.map((assignment, index) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + (index * 0.1) }}
                      className="p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                          {assignment.subject}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          Due {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2 dark:text-white line-clamp-1">
                        {assignment.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
                        {assignment.courseName}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                        onClick={() => onNavigate('assignments')}
                      >
                        Submit Now
                      </Button>
                    </motion.div>
                  ))}
               </div>
            ) : (
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
    </div>
  );
}
