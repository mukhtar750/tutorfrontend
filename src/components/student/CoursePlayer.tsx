import { useState, useEffect } from 'react';
import axios from 'axios';
import { Course, Lesson } from '../../types';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { 
  Play, 
  FileText, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface CoursePlayerProps {
  courseId: string;
  onNavigate: (page: string) => void;
}

interface PlayerLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'recorded' | 'reading';
  duration: number;
  order: number;
  videoUrl: string | null;
  resources: any[];
  isPublished: boolean;
}

export function CoursePlayer({ courseId, onNavigate }: CoursePlayerProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<PlayerLesson[]>([]);
  const [activeLesson, setActiveLesson] = useState<PlayerLesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('auth_token');
        
        // Fetch course details
        const courseRes = await axios.get(`http://localhost:8000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourse(courseRes.data);

        // Fetch lessons
        const lessonsRes = await axios.get(`http://localhost:8000/api/courses/${courseId}/lessons`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const mappedLessons = lessonsRes.data.map((l: any) => ({
          id: l.id.toString(),
          courseId: l.course_id.toString(),
          title: l.title,
          description: l.content || '',
          type: l.video_url ? 'recorded' : 'reading',
          duration: l.duration_minutes || 0,
          order: l.lesson_order || 0,
          videoUrl: l.video_url,
          resources: [],
          isPublished: true
        }));

        setLessons(mappedLessons);
        if (mappedLessons.length > 0) {
          setActiveLesson(mappedLessons[0]);
        }

        // Fetch progress (completed lessons)
        const progressRes = await axios.get(`http://localhost:8000/api/courses/${courseId}/progress`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ids = new Set<string>(progressRes.data.completed_lessons.map((id: number) => id.toString()));
        setCompletedIds(ids);
      } catch (error) {
        console.error('Failed to load course content', error);
        toast.error('Failed to load course content');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const handleCompleteLesson = async () => {
    if (!activeLesson) return;
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`http://localhost:8000/api/lessons/${activeLesson.id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const next = new Set(completedIds);
      next.add(activeLesson.id);
      setCompletedIds(next);
      toast.success('Marked as completed');
    } catch (error) {
      console.error('Failed to mark completed', error);
      toast.error('Failed to mark lesson as completed');
    }
  };

  const handleNextLesson = () => {
    if (!activeLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex < lessons.length - 1) {
      setActiveLesson(lessons[currentIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (!activeLesson) return;
    const currentIndex = lessons.findIndex(l => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setActiveLesson(lessons[currentIndex - 1]);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading course content...</div>;
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden absolute top-4 left-4 z-50"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('my-courses')}
              className="mb-4"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to My Courses
            </Button>

            {activeLesson ? (
              <div className="space-y-6">
                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                  {activeLesson.videoUrl ? (
                    <iframe 
                      src={activeLesson.videoUrl.replace('watch?v=', 'embed/')} 
                      className="w-full h-full"
                      allowFullScreen
                      title={activeLesson.title}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
                      <div className="text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-medium">Reading Lesson</h3>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h1 className="text-2xl font-bold mb-2 dark:text-white">{activeLesson.title}</h1>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="whitespace-pre-wrap">{activeLesson.description}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-500">Select a lesson to start learning</h3>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevLesson}
            disabled={!activeLesson || lessons.findIndex(l => l.id === activeLesson.id) === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant={activeLesson && completedIds.has(activeLesson.id) ? "default" : "secondary"}
              onClick={handleCompleteLesson}
              disabled={!activeLesson}
            >
              <CheckCircle className={`w-4 h-4 mr-2 ${activeLesson && completedIds.has(activeLesson.id) ? 'fill-current' : ''}`} />
              {activeLesson && completedIds.has(activeLesson.id) ? 'Completed' : 'Mark Completed'}
            </Button>
            <Button 
              onClick={handleNextLesson}
              disabled={!activeLesson || lessons.findIndex(l => l.id === activeLesson.id) === lessons.length - 1}
            >
              Next Lesson
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Lesson List */}
      <div className={`
        fixed inset-y-0 right-0 z-40 w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold truncate dark:text-white">{course?.title || 'Course Content'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {lessons.length} Lessons • {lessons.reduce((acc, l) => acc + l.duration, 0)} mins
            </p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-2">
              {lessons.map((lesson, index) => (
                <div 
                  key={lesson.id}
                  onClick={() => {
                    setActiveLesson(lesson);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-colors flex items-start gap-3
                    ${activeLesson?.id === lesson.id 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                  `}
                >
                  <div className="mt-1">
                    {activeLesson?.id === lesson.id ? (
                      <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                        <span className="text-[10px] text-gray-500">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${
                      activeLesson?.id === lesson.id ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {lesson.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        {lesson.videoUrl ? <Play className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                        {lesson.duration} min
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
