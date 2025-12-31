import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  DollarSign,
  Star,
  Clock,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { toast } from 'sonner';
import { formatCurrency } from '../../lib/utils';

interface AnalyticsData {
  stats: {
    total_revenue: number;
    active_students: number;
    avg_rating: number;
    course_hours: number;
  };
  enrollment_data: any[];
  performance_data: any[];
  course_engagement: any[];
}

export function InstructorAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:8000/api/instructor/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-96">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="text-center py-12">Failed to load analytics data.</div>;
  }

  const { stats, enrollment_data, performance_data, course_engagement } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">Analytics</h1>
        <p className="text-muted-foreground">Track your teaching performance and student engagement</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Revenue', 
            value: formatCurrency(stats.total_revenue), 
            icon: DollarSign, 
            gradient: 'from-green-500 to-emerald-500', 
            change: '+23%' // Mock trend for now
          },
          { 
            label: 'Active Students', 
            value: stats.active_students, 
            icon: Users, 
            gradient: 'from-blue-500 to-cyan-500', 
            change: '+12%' // Mock trend
          },
          { 
            label: 'Avg. Rating', 
            value: stats.avg_rating, 
            icon: Star, 
            gradient: 'from-yellow-500 to-orange-500', 
            change: '+0.3' // Mock trend
          },
          { 
            label: 'Course Hours', 
            value: stats.course_hours + 'h', 
            icon: Clock, 
            gradient: 'from-purple-500 to-pink-500', 
            change: '+8h' // Mock trend
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <CardTitle className="dark:text-white">Revenue & Enrollment</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={enrollment_data}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Revenue (₦)" />
                  <Line yAxisId="right" type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} name="Students" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <CardTitle className="dark:text-white">Student Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={performance_data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performance_data.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <CardTitle className="dark:text-white">Student Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={course_engagement}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="value" fill="url(#colorBar)" />
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
