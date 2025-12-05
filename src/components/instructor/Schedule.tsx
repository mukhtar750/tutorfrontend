import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Calendar as CalendarIcon,
  Plus,
  Video,
  Clock,
  Users,
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { mockLiveSessions, mockCourses } from '../../lib/mockData';

export function Schedule() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [meetLink, setMeetLink] = useState('');

  const upcomingSessions = mockLiveSessions.filter(s => new Date(s.scheduledAt) > new Date());
  const pastSessions = mockLiveSessions.filter(s => new Date(s.scheduledAt) <= new Date());

  const handleCreateSession = () => {
    toast.success('Live class scheduled!', {
      description: 'Students will be notified via email',
    });
    setShowCreateDialog(false);
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
          <h1 className="text-3xl font-bold dark:text-white">Class Schedule</h1>
          <p className="text-muted-foreground">Manage your live class sessions</p>
        </div>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Schedule Live Class
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Upcoming Classes', value: upcomingSessions.length, icon: CalendarIcon, gradient: 'from-purple-500 to-pink-500' },
          { label: 'This Week', value: 5, icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Total Students', value: 142, icon: Users, gradient: 'from-green-500 to-emerald-500' },
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
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Classes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="dark:text-white">Upcoming Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.map((session, index) => {
              const course = mockCourses.find(c => c.id === session.courseId);
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.05) }}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                        <Video className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-1 dark:text-white">{session.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{course?.title}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(session.scheduledAt).toLocaleTimeString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{session.attendees.length} enrolled</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Start Class
                      </Button>
                      <Button variant="outline" size="sm" className="dark:border-white/10">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 dark:border-white/10">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {session.meetingLink && (
                    <div className="pt-3 border-t border-purple-200 dark:border-purple-500/30">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Google Meet Link:</p>
                      <a 
                        href={session.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-mono"
                      >
                        {session.meetingLink}
                      </a>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {upcomingSessions.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 font-semibold mb-2">No upcoming classes</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Schedule a live class to get started</p>
                <Button 
                  className="bg-gradient-to-r from-purple-600 to-pink-600"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Your First Class
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Session Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Schedule Live Class</DialogTitle>
            <DialogDescription>
              Create a new live class session with Google Meet integration
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sessionTitle" className="dark:text-gray-300">Class Title</Label>
              <Input
                id="sessionTitle"
                placeholder="e.g., Introduction to Calculus"
                className="dark:bg-white/5 dark:border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="dark:text-gray-300">Course</Label>
              <Select>
                <SelectTrigger className="dark:bg-white/5 dark:border-white/10">
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  {mockCourses.slice(0, 5).map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="dark:text-gray-300">Date</Label>
                <Input
                  id="date"
                  type="date"
                  className="dark:bg-white/5 dark:border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="dark:text-gray-300">Time</Label>
                <Input
                  id="time"
                  type="time"
                  className="dark:bg-white/5 dark:border-white/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="meetLink" className="dark:text-gray-300">
                Google Meet Link
                <Badge className="ml-2 bg-blue-600 text-white border-0">Required</Badge>
              </Label>
              <Input
                id="meetLink"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                className="dark:bg-white/5 dark:border-white/10"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Create a meeting at <a href="https://meet.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">meet.google.com</a> and paste the link here
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
              <Textarea
                id="description"
                placeholder="What will you cover in this class?"
                rows={3}
                className="dark:bg-white/5 dark:border-white/10"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="dark:border-white/10"
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-pink-600"
                onClick={handleCreateSession}
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Class
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
