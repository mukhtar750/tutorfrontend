import { useEffect, useState } from 'react';
import { Course, ClassLevel } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Search, 
  Star, 
  Users, 
  Clock, 
  Filter,
  BookOpen,
  CreditCard,
  Play
} from 'lucide-react';
import { mockCourses, mockEnrollments } from '../../lib/mockData';
import axios from 'axios';
import { formatCurrency } from '../../lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface CourseCatalogProps {
  userId: string;
  onNavigate: (page: string) => void;
}

export function CourseCatalog({ userId, onNavigate }: CourseCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [courses, setCourses] = useState<Course[]>(mockCourses);

  const enrolledCourseIds = mockEnrollments
    .filter(e => e.studentId === userId)
    .map(e => e.courseId);

  const categories = ['all', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level.includes(selectedLevel as ClassLevel);
    return matchesSearch && matchesCategory && matchesLevel && course.isPublished;
  });

  const handleEnroll = (course: Course) => {
    setSelectedCourse(course);
    setShowPaymentDialog(true);
  };

  const handlePayment = async (method: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token || !selectedCourse) throw new Error('Missing auth or course');
      await axios.post('http://localhost:8000/api/enroll', {
        course_id: selectedCourse.id,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowPaymentDialog(false);
      onNavigate('my-courses');
    } catch (e) {
      setShowPaymentDialog(false);
      onNavigate('my-courses');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    axios.get('http://localhost:8000/api/courses', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => {
      // Backend returns { courses: { data: [...] }, stats: ... }
      const coursesData = res.data.courses ? res.data.courses.data : res.data;
      const apiCourses = (coursesData as any[]).map((c: any) => ({
        id: String(c.id),
        title: c.title,
        description: c.description || '',
        thumbnail: c.thumbnail || c.thumbnail_url || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
        instructorId: 'instructor-1', // Placeholder as backend might not send ID in transformed response
        instructorName: c.instructorName || 'Instructor',
        price: Number(c.price || 0),
        currency: 'NGN',
        category: c.category || c.subject || 'General',
        level: c.level ? (Array.isArray(c.level) ? c.level : [c.level]) : ['SS1'] as any,
        duration: c.duration || '10h',
        enrollmentCount: c.enrollmentCount || c.students || 0,
        rating: c.rating || 4.8,
        isPublished: c.isPublished ?? (c.status === 'published'),
        createdAt: c.created_at || new Date().toISOString(),
        updatedAt: c.lastUpdated || c.updated_at || new Date().toISOString(),
      }));
      setCourses(apiCourses);
    }).catch(() => {
      setCourses(mockCourses);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Course Catalog</h1>
        <p className="text-muted-foreground">Explore and enroll in courses</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Class Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="SS1">SS1</SelectItem>
                <SelectItem value="SS2">SS2</SelectItem>
                <SelectItem value="SS3">SS3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          
          return (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2">
                  {course.category}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                    alt={course.instructorName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{course.instructorName}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span>{course.enrollmentCount}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {course.level.map(level => (
                    <Badge key={level} variant="outline" className="text-xs">
                      {level}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <p className="text-xl">{formatCurrency(course.price)}</p>
                  {isEnrolled ? (
                    <Button onClick={() => onNavigate('my-courses')}>
                      <Play className="w-4 h-4 mr-2" />
                      Continue
                    </Button>
                  ) : (
                    <Button onClick={() => handleEnroll(course)}>
                      Enroll Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enroll in {selectedCourse?.title}</DialogTitle>
            <DialogDescription>
              Complete your payment to start learning
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <img 
                    src={selectedCourse?.thumbnail} 
                    alt={selectedCourse?.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p>{selectedCourse?.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCourse?.instructorName}
                    </p>
                    <p className="text-2xl mt-2">
                      {formatCurrency(selectedCourse?.price || 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <p className="mb-3">Select Payment Method</p>
              <Tabs defaultValue="paystack" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="paystack">Paystack</TabsTrigger>
                  <TabsTrigger value="flutterwave">Flutterwave</TabsTrigger>
                  <TabsTrigger value="stripe">Stripe</TabsTrigger>
                </TabsList>

                <TabsContent value="paystack" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Pay securely with Paystack - Cards, Bank Transfer, USSD
                      </p>
                      <Button 
                        className="w-full" 
                        onClick={() => handlePayment('Paystack')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay {formatCurrency(selectedCourse?.price || 0)} with Paystack
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="flutterwave" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Pay securely with Flutterwave - Multiple payment options
                      </p>
                      <Button 
                        className="w-full" 
                        onClick={() => handlePayment('Flutterwave')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay {formatCurrency(selectedCourse?.price || 0)} with Flutterwave
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="stripe" className="space-y-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Pay securely with Stripe - International cards accepted
                      </p>
                      <Button 
                        className="w-full" 
                        onClick={() => handlePayment('Stripe')}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Pay {formatCurrency(selectedCourse?.price || 0)} with Stripe
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="text-xs text-muted-foreground p-4 bg-gray-50 rounded-lg">
              <p>✓ Secure payment processing</p>
              <p>✓ 14-day money-back guarantee</p>
              <p>✓ Lifetime access to course materials</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
