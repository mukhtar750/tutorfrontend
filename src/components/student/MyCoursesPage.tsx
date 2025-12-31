import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Award,
  FileText,
  Calendar,
  Users,
  Star
} from 'lucide-react';
import { getEnrolledCourses } from '../../lib/mockData';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { formatCurrency } from '../../lib/utils';

interface MyCoursesPageProps {
  userId: string;
  onNavigate: (page: string) => void;
}

export function MyCoursesPage({ userId, onNavigate }: MyCoursesPageProps) {
  const [enrolledCourses, setEnrolledCourses] = useState(getEnrolledCourses(userId));

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    axios.get('http://localhost:8000/api/my-enrollments', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      const data = res.data as any[];
      const mapped = data.map((e: any) => ({
        id: String(e.course.id),
        title: e.course.title,
        description: e.course.description || '',
        thumbnail: e.course.thumbnail_url || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        instructorId: String(e.course.instructor_id || 'instructor-1'),
        instructorName: e.course.instructor?.name || 'Instructor',
        price: Number(e.course.price || 0),
        currency: 'NGN',
        category: e.course.subject || 'General',
        level: [e.course.class_level || 'SS1'] as any,
        duration: '10h',
        enrollmentCount: 0,
        rating: 4.7,
        isPublished: e.course.status === 'published',
        createdAt: e.course.created_at,
        updatedAt: e.course.updated_at,
        enrollment: { progress: 0 },
      }));
      setEnrolledCourses(mapped);
    }).catch(() => {
      setEnrolledCourses(getEnrolledCourses(userId));
    });
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">My Courses</h1>
          <p className="text-muted-foreground">Continue your learning journey</p>
        </div>
        <Button onClick={() => onNavigate('course-catalog')}>
          Browse Courses
        </Button>
      </div>

      {/* Course Grid */}
      {enrolledCourses.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your learning journey by enrolling in your first course
            </p>
            <Button onClick={() => onNavigate('course-catalog')}>
              Explore Courses
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3">
                  {course.category}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                    alt={course.instructorName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-muted-foreground">{course.instructorName}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{course.enrollment.progress}%</span>
                  </div>
                  <Progress value={course.enrollment.progress} />
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Clock className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">{course.duration}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Star className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">{course.rating}/5</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                      <Users className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-muted-foreground">{course.enrollmentCount}</p>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => onNavigate('course-player', course.id)}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Continue Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Learning Stats */}
      {enrolledCourses.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Learning Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">Enrolled Courses</span>
                </div>
                <p className="text-2xl">{enrolledCourses.length}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">Avg. Progress</span>
                </div>
                <p className="text-2xl">
                  {Math.round(enrolledCourses.reduce((acc, c) => acc + c.enrollment.progress, 0) / enrolledCourses.length)}%
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <span className="text-sm text-muted-foreground">Total Time</span>
                </div>
                <p className="text-2xl">24h</p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  <span className="text-sm text-muted-foreground">Completed Lessons</span>
                </div>
                <p className="text-2xl">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
