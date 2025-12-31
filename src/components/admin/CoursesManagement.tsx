import { useEffect, useState } from 'react';
import { User, Course } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
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
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import axios from 'axios';
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

import { CourseContentManager } from './CourseContentManager';

interface CoursesManagementProps {
  user: User;
}

export function CoursesManagement({ user }: CoursesManagementProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showContentDialog, setShowContentDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: '',
    thumbnail: ''
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    averageRating: 0
  });

  const fetchCourses = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        search: searchQuery,
        category: categoryFilter,
        level: levelFilter,
        status: statusFilter,
        sort_by: sortField,
        sort_order: sortOrder
      });

      const res = await axios.get(`http://localhost:8000/api/courses?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.courses) {
        setCourses(res.data.courses.data);
        setTotalPages(res.data.courses.last_page);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      } else {
        // Fallback for array response
        setCourses(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch courses', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []); // Run once on mount

  // React to filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, levelFilter, statusFilter]);

  // React to page/sort changes
  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchQuery, categoryFilter, levelFilter, statusFilter, sortField, sortOrder]);

  // Handlers for sorting
  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    return sortOrder === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4 text-blue-500" /> : 
      <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  };
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredCourses = courses; // Filtering is handled by backend

  // Get unique categories (we can hardcode or fetch)
  const categories = ['Mathematics', 'Science', 'English', 'Technology', 'Arts'];

  const handleTogglePublish = async (courseId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      // Assuming endpoint exists for toggling status, otherwise update entire object
      const course = courses.find(c => c.id === courseId);
      if (!course) return;

      const newStatus = course.isPublished ? 'draft' : 'published';
      
      await axios.put(`http://localhost:8000/api/courses/${courseId}`, {
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Course status updated successfully');
      fetchCourses();
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update course status');
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;
    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`http://localhost:8000/api/courses/${selectedCourse.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course deleted successfully');
      setShowDeleteDialog(false);
      setSelectedCourse(null);
      fetchCourses();
    } catch (error) {
      console.error('Failed to delete course', error);
      toast.error('Failed to delete course');
    }
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

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      price: course.price.toString(),
      category: course.category,
      level: course.level[0] || '',
      thumbnail: course.thumbnail
    });
    setShowEditDialog(true);
  };

  const handleCreateClick = () => {
    setFormData({
      title: '',
      description: '',
      price: '',
      category: '',
      level: '',
      thumbnail: ''
    });
    setShowCreateDialog(true);
  };

  const handleCreateCourse = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      
      if (!formData.title || !formData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      await axios.post('http://localhost:8000/api/courses', {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        subject: formData.category,
        class_level: formData.level,
        thumbnail_url: formData.thumbnail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Course created successfully');
      setShowCreateDialog(false);
      fetchCourses();
    } catch (error) {
      console.error('Failed to create course', error);
      toast.error('Failed to create course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    if (!selectedCourse) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');

      if (!formData.title || !formData.price) {
        toast.error('Please fill in all required fields');
        return;
      }

      await axios.put(`http://localhost:8000/api/courses/${selectedCourse.id}`, {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        subject: formData.category,
        class_level: formData.level,
        thumbnail_url: formData.thumbnail
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Course updated successfully');
      setShowEditDialog(false);
      fetchCourses();
    } catch (error) {
      console.error('Failed to update course', error);
      toast.error('Failed to update course');
    } finally {
      setIsLoading(false);
    }
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
            value: stats.total > 0 ? Math.round(stats.totalEnrollments / stats.total) : 0,
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
                <Button 
                  onClick={handleCreateClick}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
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
                Showing <span className="font-semibold dark:text-white">{filteredCourses.length}</span> courses (Page {currentPage} of {totalPages})
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="dark:bg-white/5 dark:border-white/10"
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
                <Select value={sortField} onValueChange={(val) => setSortField(val)}>
                  <SelectTrigger className="w-[140px] dark:bg-white/5 dark:border-white/10 dark:text-white">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                    <SelectItem value="created_at">Date Created</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>

                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
                  <TabsList className="dark:bg-white/5">
                    <TabsTrigger value="grid" className="dark:text-white">Grid</TabsTrigger>
                    <TabsTrigger value="list" className="dark:text-white">List</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
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
                              <DropdownMenuItem 
                                className="dark:hover:bg-white/5 dark:text-white"
                                onClick={() => handleEditClick(course)}
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedCourse(course);
                                  setShowContentDialog(true);
                                }}
                                className="dark:hover:bg-white/5 dark:text-white"
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Manage Content
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
                                <DropdownMenuItem 
                                  className="dark:hover:bg-white/5 dark:text-white"
                                  onClick={() => handleEditClick(course)}
                                >
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

            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
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
            ) : (
              <div className="flex items-center justify-between mt-6 border-t pt-4 dark:border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="dark:border-white/10 dark:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  className="dark:border-white/10 dark:text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
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
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => {
                setShowDetailsDialog(false);
                if (selectedCourse) handleEditClick(selectedCourse);
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Course
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowDetailsDialog(false);
                setShowContentDialog(true);
              }}
              className="ml-2"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Manage Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Content Dialog */}
      <Dialog open={showContentDialog} onOpenChange={setShowContentDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10 max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Manage Course Content</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {selectedCourse?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto pr-2">
            {selectedCourse && <CourseContentManager course={selectedCourse} />}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit Course</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update course information
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="dark:text-white">Course Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="dark:text-white">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price" className="dark:text-white">Price (NGN)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category" className="dark:text-white">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="level" className="dark:text-white">Class Level</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(val) => setFormData({ ...formData, level: val })}
                >
                  <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                    <SelectItem value="SS1">SS1</SelectItem>
                    <SelectItem value="SS2">SS2</SelectItem>
                    <SelectItem value="SS3">SS3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="thumbnail" className="dark:text-white">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="dark:border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCourse}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Create Course Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Create New Course</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Add a new course to your platform
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-title" className="dark:text-white">Course Title</Label>
              <Input
                id="create-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Advanced Mathematics for SS3"
                className="dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="create-description" className="dark:text-white">Description</Label>
              <Textarea
                id="create-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Course overview and learning objectives..."
                className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-price" className="dark:text-white">Price (NGN)</Label>
                <Input
                  id="create-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="create-category" className="dark:text-white">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-level" className="dark:text-white">Class Level</Label>
                <Select 
                  value={formData.level} 
                  onValueChange={(val) => setFormData({ ...formData, level: val })}
                >
                  <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                    <SelectItem value="SS1">SS1</SelectItem>
                    <SelectItem value="SS2">SS2</SelectItem>
                    <SelectItem value="SS3">SS3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="create-thumbnail" className="dark:text-white">Thumbnail URL</Label>
                <Input
                  id="create-thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="dark:border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCourse}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {isLoading ? 'Creating...' : 'Create Course'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
