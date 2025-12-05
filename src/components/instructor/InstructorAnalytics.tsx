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

const enrollmentData = [
  { month: 'Jan', students: 25, revenue: 375000 },
  { month: 'Feb', students: 38, revenue: 570000 },
  { month: 'Mar', students: 52, revenue: 780000 },
  { month: 'Apr', students: 67, revenue: 1005000 },
  { month: 'May', students: 85, revenue: 1275000 },
  { month: 'Jun', students: 95, revenue: 1425000 },
];

const courseEngagement = [
  { name: 'Videos Watched', value: 78 },
  { name: 'Assignments Done', value: 65 },
  { name: 'Live Classes', value: 92 },
  { name: 'Forum Activity', value: 45 },
];

const performanceData = [
  { name: 'Excellent', value: 35, color: '#10b981' },
  { name: 'Good', value: 45, color: '#3b82f6' },
  { name: 'Average', value: 15, color: '#f59e0b' },
  { name: 'Poor', value: 5, color: '#ef4444' },
];

export function InstructorAnalytics() {
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
          { label: 'Total Revenue', value: '₦1.4M', icon: DollarSign, gradient: 'from-green-500 to-emerald-500', change: '+23%' },
          { label: 'Active Students', value: '142', icon: Users, gradient: 'from-blue-500 to-cyan-500', change: '+12%' },
          { label: 'Avg. Rating', value: '4.8', icon: Star, gradient: 'from-yellow-500 to-orange-500', change: '+0.3' },
          { label: 'Course Hours', value: '48h', icon: Clock, gradient: 'from-purple-500 to-pink-500', change: '+8h' },
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
                <LineChart data={enrollmentData}>
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
                    data={performanceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {performanceData.map((entry, index) => (
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
                <BarChart data={courseEngagement}>
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
