import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { 
  BookOpen, 
  Users, 
  Star,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  TrendingUp,
  Video,
  FileText,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { motion } from 'motion/react';
import { User } from '../../types';
import axios from 'axios';
import { toast } from 'sonner@2.0.3';

interface MyCoursesProps {
  user: User;
  onNavigate: (page: string) => void;
}

interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  level: string[];
  category: string;
  status: string;
  students: number;
  lessons: number;
  rating: number;
  price: number;
  created_at: string;
}

export function MyCourses({ user, onNavigate }: MyCoursesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:8000/api/instructor/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Failed to fetch courses', error);
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'published' && course.status === 'published') ||
                         (filterStatus === 'draft' && course.status !== 'published');
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    draft: courses.filter(c => c.status !== 'published').length,
    totalStudents: courses.reduce((acc, c) => acc + c.students, 0),
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold dark:text-white">My Courses</h1>
          <p className="text-muted-foreground">Manage and track your course portfolio</p>
        </div>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => onNavigate('create-course')}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Course
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Courses',
            value: stats.total,
            icon: BookOpen,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10'
          },
          {
            label: 'Published',
            value: stats.published,
            icon: CheckCircle,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10'
          },
          {
            label: 'Drafts',
            value: stats.draft,
            icon: Clock,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10'
          },
          {
            label: 'Total Students',
            value: stats.totalStudents,
            icon: Users,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10'
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className="relative overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'published', 'draft'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                  className={filterStatus === status ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -10 }}
          >
            <Card className="overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:shadow-2xl transition-all duration-300">
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&q=80'}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge 
                    variant="outline"
                    className={course.status === 'published'
                      ? 'bg-green-500/90 text-white border-0 backdrop-blur-xl' 
                      : 'bg-orange-500/90 text-white border-0 backdrop-blur-xl'
                    }
                  >
                    {course.status === 'published' ? 'Published' : 'Draft'}
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge className="bg-blue-600 text-white border-0">
                    {course.category}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {course.level.join(' • ')}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-500/10 dark:to-cyan-500/10">
                    <Users className="w-4 h-4 mx-auto mb-1 text-blue-600 dark:text-blue-400" />
                    <p className="text-lg font-bold dark:text-white">{course.enrollmentCount}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Students</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-500/10 dark:to-orange-500/10">
                    <Star className="w-4 h-4 mx-auto mb-1 text-yellow-600 dark:text-yellow-400 fill-yellow-600 dark:fill-yellow-400" />
                    <p className="text-lg font-bold dark:text-white">{course.rating}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-500/10 dark:to-emerald-500/10">
                    <TrendingUp className="w-4 h-4 mx-auto mb-1 text-green-600 dark:text-green-400" />
                    <p className="text-lg font-bold dark:text-white">{formatCurrency(course.price)}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Price</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 dark:border-white/10 dark:hover:bg-white/5"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="dark:border-white/10 dark:hover:bg-white/5"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-white/10">
                      <DropdownMenuItem className="dark:hover:bg-white/5">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem className="dark:hover:bg-white/5">
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="dark:hover:bg-white/5 text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/10 dark:to-purple-500/10 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2 dark:text-white">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery ? 'Try adjusting your search or filters' : 'Start creating your first course!'}
          </p>
          {!searchQuery && (
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600"
              onClick={() => onNavigate('create-course')}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Course
            </Button>
          )}
        </motion.div>
      )}
    </div>
  );
}
