import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { 
  BookOpen,
  Upload,
  Save,
  Eye,
  Plus,
  X,
  Video,
  FileText,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

export function CreateCourse() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: [] as string[],
    price: '',
    duration: '',
    thumbnail: '',
  });

  const [modules, setModules] = useState<Array<{ title: string; lessons: string[] }>>([]);
  const [currentModule, setCurrentModule] = useState({ title: '', lessons: [''] });

  const categories = [
    'Mathematics',
    'English',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Economics',
    'Government'
  ];

  const levels = ['SS1', 'SS2', 'SS3'];

  const handleLevelToggle = (level: string) => {
    setCourseData(prev => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter(l => l !== level)
        : [...prev.level, level]
    }));
  };

  const handleAddModule = () => {
    if (currentModule.title && currentModule.lessons.some(l => l.trim())) {
      setModules([...modules, { ...currentModule, lessons: currentModule.lessons.filter(l => l.trim()) }]);
      setCurrentModule({ title: '', lessons: [''] });
      toast.success('Module added successfully!');
    }
  };

  const handleSaveDraft = () => {
    toast.success('Course saved as draft!', {
      description: 'You can continue editing later',
    });
  };

  const handlePublish = () => {
    toast.success('Course published successfully!', {
      description: 'Your course is now live and available to students',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Create New Course</h1>
          <p className="text-muted-foreground">Build an amazing learning experience for your students</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleSaveDraft}
            className="dark:border-white/10"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={handlePublish}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Publish Course
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Basic Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="dark:text-gray-300">Course Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Advanced Mathematics for SS3"
                    value={courseData.title}
                    onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what students will learn in this course..."
                    rows={5}
                    value={courseData.description}
                    onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="dark:text-gray-300">Category</Label>
                    <Select value={courseData.category} onValueChange={(value) => setCourseData({ ...courseData, category: value })}>
                      <SelectTrigger className="dark:bg-white/5 dark:border-white/10">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="dark:text-gray-300">Class Level</Label>
                    <div className="flex gap-2">
                      {levels.map((level) => (
                        <Button
                          key={level}
                          type="button"
                          variant={courseData.level.includes(level) ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleLevelToggle(level)}
                          className={courseData.level.includes(level) ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="dark:text-gray-300">Price (₦)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="15000"
                      value={courseData.price}
                      onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration" className="dark:text-gray-300">Duration (weeks)</Label>
                    <Input
                      id="duration"
                      type="number"
                      placeholder="12"
                      value={courseData.duration}
                      onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Thumbnail */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Course Thumbnail</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="dark:text-gray-300">Image URL</Label>
                  <Input
                    id="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    value={courseData.thumbnail}
                    onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.value })}
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                {courseData.thumbnail && (
                  <div className="relative group">
                    <img 
                      src={courseData.thumbnail}
                      alt="Thumbnail preview"
                      className="w-full aspect-video object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <Button size="sm" className="bg-white/20 backdrop-blur-xl">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </Button>
                    </div>
                  </div>
                )}

                {!courseData.thumbnail && (
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-12 text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload course thumbnail</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">Recommended: 1280x720px</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Modules */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Course Curriculum</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Existing Modules */}
                {modules.map((module, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/30">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold dark:text-white">Module {index + 1}: {module.title}</h4>
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {module.lessons.map((lesson, lIndex) => (
                        <div key={lIndex} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Video className="w-4 h-4" />
                          <span>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Add New Module */}
                <div className="space-y-4 p-4 rounded-xl border-2 border-dashed border-gray-300 dark:border-white/10">
                  <div className="space-y-2">
                    <Label className="dark:text-gray-300">Module Title</Label>
                    <Input
                      placeholder="e.g., Introduction to Quadratic Equations"
                      value={currentModule.title}
                      onChange={(e) => setCurrentModule({ ...currentModule, title: e.target.value })}
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="dark:text-gray-300">Lessons</Label>
                    {currentModule.lessons.map((lesson, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Lesson ${index + 1}`}
                          value={lesson}
                          onChange={(e) => {
                            const newLessons = [...currentModule.lessons];
                            newLessons[index] = e.target.value;
                            setCurrentModule({ ...currentModule, lessons: newLessons });
                          }}
                          className="dark:bg-white/5 dark:border-white/10"
                        />
                        {index === currentModule.lessons.length - 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentModule({ ...currentModule, lessons: [...currentModule.lessons, ''] })}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <Button 
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleAddModule}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Module
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 sticky top-6">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5" />
                  <CardTitle>Course Preview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="aspect-video bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden">
                  {courseData.thumbnail ? (
                    <img src={courseData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 dark:text-white">
                    {courseData.title || 'Course Title'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {courseData.description || 'Course description will appear here...'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {courseData.category && (
                    <Badge className="bg-blue-600 text-white">{courseData.category}</Badge>
                  )}
                  {courseData.level.map(level => (
                    <Badge key={level} variant="outline" className="dark:border-white/20">
                      {level}
                    </Badge>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t dark:border-white/10">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Price</p>
                    <p className="font-bold dark:text-white">
                      {courseData.price ? `₦${parseInt(courseData.price).toLocaleString()}` : '₦0'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                    <p className="font-bold dark:text-white">
                      {courseData.duration ? `${courseData.duration} weeks` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Modules</p>
                    <p className="font-bold dark:text-white">{modules.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Lessons</p>
                    <p className="font-bold dark:text-white">
                      {modules.reduce((acc, m) => acc + m.lessons.length, 0)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 dark:border-purple-500/30">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm dark:text-white mb-2">Pro Tips</p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Use clear, descriptive course titles</li>
                      <li>• Add high-quality thumbnail (1280x720)</li>
                      <li>• Structure content in logical modules</li>
                      <li>• Include learning outcomes</li>
                      <li>• Price competitively for your market</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
