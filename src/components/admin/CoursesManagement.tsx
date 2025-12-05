import { useState } from 'react';
import { User, Course } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  CheckCircle,
  XCircle,
  Download,
  Upload,
  Play,
  Award,
  Clock,
  BarChart3,
  Globe,
  Lock,
  Zap,
  Target,
} from 'lucide-react';
import { mockCourses, mockEnrollments } from '../../lib/mockData';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface CoursesManagementProps {
  user: User;
}

export function CoursesManagement({ user }: CoursesManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter courses
  const filteredCourses = mockCourses.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesLevel = levelFilter === 'all' || course.level.includes(levelFilter as any);
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && course.isPublished) ||
      (statusFilter === 'draft' && !course.isPublished);

    return matchesSearch && matchesCategory && matchesLevel && matchesStatus;
  });

  // Statistics
  const stats = {
    total: mockCourses.length,
    published: mockCourses.filter(c => c.isPublished).length,
    draft: mockCourses.filter(c => !c.isPublished).length,
    totalEnrollments: mockCourses.reduce((sum, c) => sum + c.enrollmentCount, 0),
    totalRevenue: mockCourses.reduce((sum, c) => sum + (c.price * c.enrollmentCount), 0),
    averageRating: (mockCourses.reduce((sum, c) => sum + c.rating, 0) / mockCourses.length).toFixed(1),
  };

  // Get unique categories
  const categories = Array.from(new Set(mockCourses.map(c => c.category)));

  const handleTogglePublish = (courseId: string) => {
    toast.success('Course status updated successfully');
  };

  const handleDeleteCourse = () => {
    toast.success('Course deleted successfully');
    setShowDeleteDialog(false);
    setSelectedCourse(null);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Mathematics': 'from-blue-500 to-cyan-500',
      'Science': 'from-green-500 to-emerald-500',
      'English': 'from-purple-500 to-pink-500',
      'Technology': 'from-orange-500 to-red-500',
      'Arts': 'from-yellow-500 to-orange-500',
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Epic Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
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
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <p className="text-purple-100 text-sm">Course Management</p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Manage Courses
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-purple-100 mb-6 max-w-2xl"
          >
            Complete oversight of all courses, enrollments, and revenue across your learning platform.
          </motion.p>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Courses', value: stats.total.toLocaleString(), icon: BookOpen },
              { label: 'Published', value: stats.published.toLocaleString(), icon: Globe },
              { label: 'Total Enrollments', value: stats.totalEnrollments.toLocaleString(), icon: Users },
              { label: 'Total Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign },
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

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: 'Average Rating',
            value: `${stats.averageRating} ⭐`,
            icon: Star,
            gradient: 'from-yellow-500 to-orange-500',
            bgGradient: 'from-yellow-500/10 to-orange-500/10',
            detail: 'Across all courses'
          },
          {
            label: 'Avg Enrollment',
            value: Math.round(stats.totalEnrollments / stats.total),
            icon: TrendingUp,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10',
            detail: 'Per course'
          },
          {
            label: 'Draft Courses',
            value: stats.draft,
            icon: Edit,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10',
            detail: 'Awaiting publish'
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
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient}`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{stat.detail}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="dark:text-white">Search & Filter</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Course
                </Button>
                <Button variant="outline" className="dark:border-white/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" className="dark:border-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search courses, instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 dark:bg-white/5 dark:border-white/10 dark:text-white"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Level Filter */}
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="SS1">SS1</SelectItem>
                  <SelectItem value="SS2">SS2</SelectItem>
                  <SelectItem value="SS3">SS3</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold dark:text-white">{filteredCourses.length}</span> of <span className="font-semibold dark:text-white">{mockCourses.length}</span> courses
              </p>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
                <TabsList className="dark:bg-white/5">
                  <TabsTrigger value="grid" className="dark:text-white">Grid</TabsTrigger>
                  <TabsTrigger value="list" className="dark:text-white">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Courses Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              All Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <Card className="relative overflow-hidden bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300 h-full">
                      <div className="relative">
                        <ImageWithFallback
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 bg-white/90 dark:bg-black/90 backdrop-blur-xl hover:bg-white dark:hover:bg-black"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-white/10">
                              <DropdownMenuLabel className="dark:text-white">Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator className="dark:bg-white/10" />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowDetailsDialog(true);
                                }}
                                className="dark:hover:bg-white/5 dark:text-white"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="dark:hover:bg-white/5 dark:text-white">
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleTogglePublish(course.id)}
                                className="dark:hover:bg-white/5 dark:text-white"
                              >
                                {course.isPublished ? (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Globe className="w-4 h-4 mr-2" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="dark:bg-white/10" />
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-red-600 dark:text-red-400 dark:hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Course
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="absolute top-3 left-3 flex gap-2">
                          {course.isPublished ? (
                            <Badge className="bg-green-500 text-white border-0">
                              <Globe className="w-3 h-3 mr-1" />
                              Published
                            </Badge>
                          ) : (
                            <Badge className="bg-orange-500 text-white border-0">
                              <Lock className="w-3 h-3 mr-1" />
                              Draft
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <div className="flex items-start gap-2 mb-3">
                          <Badge
                            className={`bg-gradient-to-r ${getCategoryColor(course.category)} text-white border-0`}
                          >
                            {course.category}
                          </Badge>
                          <div className="flex items-center gap-1 ml-auto">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold dark:text-white">{course.rating}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-2">
                          {course.title}
                        </h3>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                          <Award className="w-4 h-4" />
                          <span className="truncate">{course.instructorName}</span>
                        </div>

                        <div className="flex items-center gap-3 mb-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4" />
                            <span>{course.enrollmentCount}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {course.level.map(level => (
                            <Badge
                              key={level}
                              variant="outline"
                              className="dark:border-white/20 dark:text-gray-300 text-xs"
                            >
                              {level}
                            </Badge>
                          ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(course.price)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Revenue: {formatCurrency(course.price * course.enrollmentCount)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowDetailsDialog(true);
                            }}
                            className="dark:border-white/10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ x: 5 }}
                  >
                    <Card className="bg-white dark:bg-gray-900/50 border-gray-200 dark:border-white/10 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                          <ImageWithFallback
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
                          />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <h3 className="font-bold text-lg dark:text-white flex-1 line-clamp-1">
                                {course.title}
                              </h3>
                              {course.isPublished ? (
                                <Badge className="bg-green-500 text-white border-0 flex-shrink-0">
                                  <Globe className="w-3 h-3 mr-1" />
                                  Published
                                </Badge>
                              ) : (
                                <Badge className="bg-orange-500 text-white border-0 flex-shrink-0">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Draft
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                              {course.description}
                            </p>

                            <div className="flex items-center gap-4 text-sm">
                              <Badge className={`bg-gradient-to-r ${getCategoryColor(course.category)} text-white border-0`}>
                                {course.category}
                              </Badge>
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Award className="w-4 h-4" />
                                <span>{course.instructorName}</span>
                              </div>
                              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                <Users className="w-4 h-4" />
                                <span>{course.enrollmentCount} students</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-semibold dark:text-white">{course.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                              {formatCurrency(course.price)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                              Revenue: {formatCurrency(course.price * course.enrollmentCount)}
                            </p>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="dark:border-white/10">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-white/10">
                                <DropdownMenuLabel className="dark:text-white">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="dark:bg-white/10" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCourse(course);
                                    setShowDetailsDialog(true);
                                  }}
                                  className="dark:hover:bg-white/5 dark:text-white"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="dark:hover:bg-white/5 dark:text-white">
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit Course
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleTogglePublish(course.id)}
                                  className="dark:hover:bg-white/5 dark:text-white"
                                >
                                  {course.isPublished ? (
                                    <>
                                      <Lock className="w-4 h-4 mr-2" />
                                      Unpublish
                                    </>
                                  ) : (
                                    <>
                                      <Globe className="w-4 h-4 mr-2" />
                                      Publish
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="dark:bg-white/10" />
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedCourse(course);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-600 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Course
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2 dark:text-white">No courses found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setCategoryFilter('all');
                    setLevelFilter('all');
                    setStatusFilter('all');
                  }}
                  className="dark:border-white/10"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Delete Course</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this course? This action cannot be undone and will affect all enrolled students.
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
                <ImageWithFallback
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold dark:text-white">{selectedCourse.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedCourse.enrollmentCount} students enrolled
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedCourse(null);
              }}
              className="dark:border-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Course Details Dialog (placeholder) */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Course Details</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Complete information about this course
            </DialogDescription>
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <ImageWithFallback
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title}
                  className="w-48 h-32 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{selectedCourse.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {selectedCourse.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className={`bg-gradient-to-r ${getCategoryColor(selectedCourse.category)} text-white border-0`}>
                      {selectedCourse.category}
                    </Badge>
                    {selectedCourse.isPublished ? (
                      <Badge className="bg-green-500 text-white border-0">Published</Badge>
                    ) : (
                      <Badge className="bg-orange-500 text-white border-0">Draft</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                  </div>
                  <p className="text-2xl font-bold dark:text-white">{selectedCourse.enrollmentCount}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(selectedCourse.price * selectedCourse.enrollmentCount)}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                  </div>
                  <p className="text-2xl font-bold dark:text-white">{selectedCourse.rating} ⭐</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                  </div>
                  <p className="text-lg font-bold dark:text-white">{selectedCourse.duration}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Instructor</p>
                  <p className="font-semibold dark:text-white">{selectedCourse.instructorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(selectedCourse.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Class Levels</p>
                  <div className="flex gap-2">
                    {selectedCourse.level.map(level => (
                      <Badge key={level} variant="outline" className="dark:border-white/20 dark:text-gray-300">
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
                  <p className="font-semibold dark:text-white">{formatDate(selectedCourse.updatedAt)}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDetailsDialog(false)}
              className="dark:border-white/10"
            >
              Close
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
