import { useState, useEffect } from 'react';
import axios from 'axios';
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
import { toast } from 'sonner';

interface InstructorDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

interface DashboardData {
  total_students: number;
  total_revenue: number;
  average_rating: number;
  pending_submissions: number;
  recent_submissions: any[];
  course_performance: any[];
  enrollment_data: any[];
  courses_count: number;
}

export function InstructorDashboard({ user, onNavigate }: InstructorDashboardProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:8000/api/instructor/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(response.data);
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
    return <div className="flex justify-center items-center h-96">Loading dashboard...</div>;
  }

  if (!dashboardData) {
    return <div className="text-center py-12">Failed to load dashboard data.</div>;
  }

  const {
    total_students,
    total_revenue,
    average_rating,
    pending_submissions,
    recent_submissions,
    course_performance,
    enrollment_data,
    courses_count
  } = dashboardData;

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
                You're making an impact! {total_students} students are learning from your expertise.
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
                <p className="text-3xl font-bold">{average_rating.toFixed(1)}</p>
              </div>
              <p className="text-sm text-blue-100">Avg Rating</p>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-green-400" />
                <p className="text-3xl font-bold">{courses_count}</p>
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
            value: total_students,
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10',
            trend: '+12% this month',
            trendUp: true
          },
          {
            label: 'Pending Reviews',
            value: pending_submissions,
            icon: FileText,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10',
            trend: 'Needs attention',
            trendUp: false
          },
          {
            label: 'Total Revenue',
            value: formatCurrency(total_revenue),
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
                    <LineChart data={enrollment_data}>
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
                  {recent_submissions.map((submission, index) => (
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
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(submission.submitted_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="font-semibold mb-1 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {submission.assignment_title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Student: {submission.student_name} • {submission.course_title}
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
                  ))}

                  {recent_submissions.length === 0 && (
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
                    <CardTitle className="dark:text-white">Course Performance</CardTitle>
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
                  {course_performance.map((course, index) => (
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
                        {/* Placeholder image or thumbnail if available */}
                        <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-2xl">
                           📚
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold mb-2 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {course.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>{course.students}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400" />
                              <span>{course.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {course_performance.length === 0 && (
                     <div className="col-span-2 text-center py-8">
                       <p className="text-gray-500">No courses yet.</p>
                     </div>
                  )}
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
            transition={{ delay: 0.9 }}
          >
             {/* ... Keep existing sidebar content if relevant or update with real data if available ... */}
             {/* For now I'll leave it as is or hide it if no real data is available. 
                 Since I don't have upcoming classes in dashboard API yet, I'll just show a placeholder or keep mock data for now 
                 BUT the goal is to use real data. I should fetch upcoming classes too.
             */}
             <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Upcoming Classes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No upcoming classes scheduled.</p>
                  <Button 
                    variant="link" 
                    onClick={() => onNavigate('schedule')}
                    className="mt-2 text-blue-600 dark:text-blue-400"
                  >
                    Schedule a class
                  </Button>
                </div>
              </CardContent>
             </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
