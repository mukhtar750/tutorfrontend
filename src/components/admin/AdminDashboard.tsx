import { useState } from 'react';
import { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  ShoppingCart,
  Activity,
  Award,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Crown,
  Sparkles,
  Zap,
  TrendingDown,
  ChevronRight,
  BarChart3,
  PieChart as PieChartIcon,
  FileText,
  Settings,
  Globe,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Shield
} from 'lucide-react';
import { mockAnalytics, mockCourses, mockUsers, mockPayments } from '../../lib/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';
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
  AreaChart,
  Area,
} from 'recharts';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  user: User;
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ user, onNavigate }: AdminDashboardProps) {
  // Mock revenue data
  const revenueData = [
    { month: 'Jun', revenue: 1200000, enrollments: 156, expenses: 480000 },
    { month: 'Jul', revenue: 1450000, enrollments: 189, expenses: 520000 },
    { month: 'Aug', revenue: 1680000, enrollments: 223, expenses: 550000 },
    { month: 'Sep', revenue: 1920000, enrollments: 267, expenses: 580000 },
    { month: 'Oct', revenue: 2150000, enrollments: 298, expenses: 610000 },
    { month: 'Nov', revenue: 2380000, enrollments: 342, expenses: 650000 },
  ];

  // Course category distribution
  const categoryData = [
    { name: 'Mathematics', value: 35, color: '#3b82f6' },
    { name: 'Science', value: 28, color: '#8b5cf6' },
    { name: 'English', value: 20, color: '#10b981' },
    { name: 'Technology', value: 12, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#6b7280' },
  ];

  // User growth data
  const userGrowthData = [
    { week: 'Week 1', students: 45, instructors: 5 },
    { week: 'Week 2', students: 62, instructors: 7 },
    { week: 'Week 3', students: 78, instructors: 9 },
    { week: 'Week 4', students: 95, instructors: 12 },
  ];

  // Top performing courses
  const topCourses = mockCourses
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount)
    .slice(0, 5);

  // Recent payments
  const recentPayments = mockPayments
    .filter(p => p.status === 'completed')
    .slice(0, 5);

  // System health metrics
  const systemHealth = {
    uptime: 99.9,
    apiLatency: 45,
    activeUsers: 1243,
    storage: 67
  };

  return (
    <div className="space-y-6">
      {/* Epic Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
              <Crown className="w-7 h-7 text-yellow-300" />
            </div>
            <div>
              <p className="text-purple-100 text-sm">System Administrator</p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome, {user.firstName}! 👑
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-purple-100 mb-6 max-w-2xl"
          >
            You're in control of Nigeria's leading learning platform. Here's your complete system overview.
          </motion.p>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Revenue', value: formatCurrency(mockAnalytics.totalRevenue), icon: DollarSign },
              { label: 'Total Students', value: mockAnalytics.totalStudents.toLocaleString(), icon: Users },
              { label: 'Active Courses', value: mockCourses.filter(c => c.isPublished).length, icon: BookOpen },
              { label: 'Completion Rate', value: `${mockAnalytics.completionRate}%`, icon: Award },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (index * 0.05) }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <stat.icon className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-purple-100">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Monthly Revenue',
            value: formatCurrency(2380000),
            change: '+23.5%',
            isPositive: true,
            icon: DollarSign,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10',
            detail: 'vs last month'
          },
          {
            label: 'New Students',
            value: '342',
            change: '+15.3%',
            isPositive: true,
            icon: UserPlus,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10',
            detail: 'this month'
          },
          {
            label: 'Course Engagement',
            value: '87%',
            change: '+8.2%',
            isPositive: true,
            icon: Activity,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            detail: 'active users'
          },
          {
            label: 'Pending Payments',
            value: '12',
            change: '-5 from yesterday',
            isPositive: true,
            icon: Clock,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10',
            detail: 'needs attention'
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
                  <Badge 
                    variant="outline" 
                    className={`bg-white/50 dark:bg-black/50 backdrop-blur-xl border-0 ${
                      stat.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {stat.isPositive ? <ArrowUp className="w-3 h-3 mr-1" /> : <ArrowDown className="w-3 h-3 mr-1" />}
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-3xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.detail}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Analytics Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue & Enrollment Chart */}
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
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="dark:text-white">Revenue & Enrollment Trends</CardTitle>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last 6 months performance</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="dark:border-white/10"
                  onClick={() => onNavigate('analytics')}
                >
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorEnrollments" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-white/10" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                      border: 'none', 
                      borderRadius: '12px',
                      color: 'white',
                      padding: '12px'
                    }} 
                    formatter={(value: any, name: string) => {
                      if (name === 'Revenue') return formatCurrency(value);
                      return value;
                    }}
                  />
                  <Legend />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                  <Area 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="enrollments" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorEnrollments)"
                    name="Enrollments"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Course Categories Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <PieChartIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="dark:text-white">Course Distribution</CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400">By category</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
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

      {/* Top Courses & Recent Payments */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performing Courses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Top Performing Courses</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onNavigate('courses')}
                  className="dark:text-gray-300 dark:hover:text-white"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + (index * 0.05) }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/30 cursor-pointer group"
                  onClick={() => onNavigate('courses')}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.category} • {course.instructorName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {course.enrollmentCount}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">students</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Recent Payments</CardTitle>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onNavigate('payments')}
                  className="dark:text-gray-300 dark:hover:text-white"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPayments.map((payment, index) => {
                const course = mockCourses.find(c => c.id === payment.courseId);
                const student = mockUsers.find(u => u.id === payment.studentId);
                
                return (
                  <motion.div
                    key={payment.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + (index * 0.05) }}
                    whileHover={{ scale: 1.02, x: -5 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10 border border-green-200 dark:border-green-500/30 cursor-pointer group"
                    onClick={() => onNavigate('payments')}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors truncate">
                          {student?.firstName} {student?.lastName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                          {course?.title}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(payment.amount)}
                      </p>
                      <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30">
                        {payment.paymentMethod}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* System Health & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="dark:text-white">System Health</CardTitle>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Real-time monitoring</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    label: 'Uptime',
                    value: `${systemHealth.uptime}%`,
                    icon: Wifi,
                    gradient: 'from-green-500 to-emerald-500',
                    status: 'Excellent',
                    progress: systemHealth.uptime
                  },
                  {
                    label: 'API Latency',
                    value: `${systemHealth.apiLatency}ms`,
                    icon: Zap,
                    gradient: 'from-yellow-500 to-orange-500',
                    status: 'Good',
                    progress: 100 - systemHealth.apiLatency
                  },
                  {
                    label: 'Active Users',
                    value: systemHealth.activeUsers,
                    icon: Users,
                    gradient: 'from-blue-500 to-cyan-500',
                    status: 'Online',
                    progress: 85
                  },
                  {
                    label: 'Storage',
                    value: `${systemHealth.storage}%`,
                    icon: HardDrive,
                    gradient: 'from-purple-500 to-pink-500',
                    status: 'Healthy',
                    progress: systemHealth.storage
                  },
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + (index * 0.05) }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${metric.gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                      <metric.icon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-2xl font-bold mb-1 dark:text-white">{metric.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{metric.label}</p>
                    <Badge 
                      variant="outline"
                      className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30 text-xs"
                    >
                      {metric.status}
                    </Badge>
                    <Progress value={metric.progress} className="mt-3 h-1" />
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="dark:text-white">Quick Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: 'Manage Users', icon: Users, page: 'users', gradient: 'from-blue-500 to-cyan-600' },
                { label: 'Manage Courses', icon: BookOpen, page: 'courses', gradient: 'from-purple-500 to-pink-600' },
                { label: 'View Payments', icon: ShoppingCart, page: 'payments', gradient: 'from-green-500 to-emerald-600' },
                { label: 'Analytics', icon: BarChart3, page: 'analytics', gradient: 'from-orange-500 to-red-600' },
                { label: 'Settings', icon: Settings, page: 'settings', gradient: 'from-gray-500 to-gray-600' },
              ].map((action, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + (index * 0.05) }}
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
      </div>

      {/* Platform Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        whileHover={{ scale: 1.01 }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-0 text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl" />
          
          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-10 h-10" />
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Platform Excellence</h3>
                    <p className="text-purple-100">Your LMS is performing at peak efficiency</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                    <p className="text-3xl font-bold mb-1">{mockUsers.length}</p>
                    <p className="text-sm text-purple-100">Total Users</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                    <p className="text-3xl font-bold mb-1">{mockCourses.length}</p>
                    <p className="text-sm text-purple-100">Total Courses</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20">
                    <p className="text-3xl font-bold mb-1">98.5%</p>
                    <p className="text-sm text-purple-100">Success Rate</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-xl"
                  onClick={() => onNavigate('analytics')}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  View Full Analytics
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
