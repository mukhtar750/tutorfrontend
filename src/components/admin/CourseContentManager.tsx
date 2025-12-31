import { useState, useEffect } from 'react';
import axios from 'axios';
import { Course, Lesson } from '../../types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Plus, Edit, Trash2, Video, FileText, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

interface CourseContentManagerProps {
  course: Course;
}

export function CourseContentManager({ course }: CourseContentManagerProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLessonDialog, setShowLessonDialog] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    videoUrl: '',
    duration: 0,
    order: 0
  });

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await axios.get(`http://localhost:8000/api/courses/${course.id}/lessons`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Map backend response to frontend type
      const mappedLessons = response.data.map((l: any) => ({
        id: l.id.toString(),
        course_id: l.course_id.toString(),
        title: l.title,
        content: l.content || '',
        video_url: l.video_url || '',
        duration_minutes: l.duration_minutes || 0,
        lesson_order: l.lesson_order || 0,
        created_at: l.created_at,
        updated_at: l.updated_at
      }));
      
      setLessons(mappedLessons);
    } catch (error) {
      console.error('Failed to fetch lessons', error);
      toast.error('Failed to load lessons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [course.id]);

  const handleSaveLesson = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const payload = {
        title: formData.title,
        content: formData.content,
        video_url: formData.video_url,
        duration_minutes: formData.duration_minutes,
        lesson_order: formData.lesson_order || (lessons.length + 1)
      };

      if (editingLesson) {
        await axios.put(`http://localhost:8000/api/lessons/${editingLesson.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Lesson updated successfully');
      } else {
        await axios.post(`http://localhost:8000/api/courses/${course.id}/lessons`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Lesson created successfully');
      }

      setShowLessonDialog(false);
      fetchLessons();
    } catch (error) {
      console.error('Failed to save lesson', error);
      toast.error('Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      await axios.delete(`http://localhost:8000/api/lessons/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Lesson deleted successfully');
      fetchLessons();
    } catch (error) {
      console.error('Failed to delete lesson', error);
      toast.error('Failed to delete lesson');
    }
  };

  const openNewLessonDialog = () => {
    setEditingLesson(null);
    setFormData({
      title: '',
      content: '',
      video_url: '',
      duration_minutes: 0,
      lesson_order: lessons.length + 1
    });
    setShowLessonDialog(true);
  };

  const openEditLessonDialog = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      content: lesson.content,
      video_url: lesson.video_url || '',
      duration_minutes: lesson.duration_minutes,
      lesson_order: lesson.lesson_order
    });
    setShowLessonDialog(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold dark:text-white">Course Content</h3>
        <Button onClick={openNewLessonDialog} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Lesson
        </Button>
      </div>

      <div className="space-y-2">
        {lessons.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl">
            <p className="text-gray-500 dark:text-gray-400">No lessons yet. Add your first lesson!</p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="flex items-center gap-3 p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg group"
            >
              <div className="p-2 bg-gray-100 dark:bg-white/10 rounded">
                {lesson.video_url ? (
                  <Video className="w-4 h-4 text-blue-500" />
                ) : (
                  <FileText className="w-4 h-4 text-green-500" />
                )}
              </div>
              
              <div className="flex-1">
                <p className="font-medium dark:text-white">{lesson.title}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <span>{lesson.duration_minutes} mins</span>
                  <span>•</span>
                  <span className="truncate max-w-[200px]">{lesson.video_url ? 'Video Lesson' : 'Text Lesson'}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => openEditLessonDialog(lesson)}
                  className="h-8 w-8 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="h-8 w-8 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={showLessonDialog} onOpenChange={setShowLessonDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white">
              {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="dark:text-white">Lesson Title</Label>
              <Input 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Introduction to Algebra"
                className="dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-white">Video URL (Optional)</Label>
              <Input 
                value={formData.video_url}
                onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                placeholder="https://youtube.com/..."
                className="dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-white">Duration (minutes)</Label>
                <Input 
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value) || 0})}
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label className="dark:text-white">Order</Label>
                <Input 
                  type="number"
                  value={formData.lesson_order}
                  onChange={(e) => setFormData({...formData, lesson_order: parseInt(e.target.value) || 0})}
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-white">Content / Description</Label>
              <Textarea 
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Lesson content goes here..."
                rows={5}
                className="dark:bg-white/5 dark:border-white/10 dark:text-white"
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowLessonDialog(false)}
              className="dark:border-white/10"
            >
              Cancel
            </Button>
            <Button onClick={handleSaveLesson} className="bg-blue-600 hover:bg-blue-700">
              Save Lesson
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
