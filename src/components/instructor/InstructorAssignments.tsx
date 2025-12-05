import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Upload,
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { mockSubmissions } from '../../lib/mockData';

export function InstructorAssignments() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const handleGrade = (submissionId: string, grade: number) => {
    toast.success('Assignment graded!', {
      description: `Grade: ${grade}% has been submitted`,
    });
    setSelectedSubmission(null);
  };

  const stats = {
    total: 12,
    pending: mockSubmissions.filter(s => s.status === 'submitted').length,
    graded: mockSubmissions.filter(s => s.status === 'graded').length,
    overdue: 2,
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
          <h1 className="text-3xl font-bold dark:text-white">Assignments</h1>
          <p className="text-muted-foreground">Create and manage course assignments</p>
        </div>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Assignment
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Assignments', value: stats.total, icon: FileText, gradient: 'from-blue-500 to-cyan-500' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, gradient: 'from-orange-500 to-red-500' },
          { label: 'Graded', value: stats.graded, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
          { label: 'Overdue', value: stats.overdue, icon: AlertCircle, gradient: 'from-red-500 to-pink-500' },
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

      {/* Submissions to Review */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="dark:text-white">Pending Submissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSubmissions.filter(s => s.status === 'submitted').map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.05) }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border border-orange-200 dark:border-orange-500/30 cursor-pointer group"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending Review
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="font-semibold mb-1 dark:text-white">
                      Assignment Submission - Student {submission.studentId}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Assignment ID: {submission.assignmentId}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Grade Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Assignment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Create New Assignment</DialogTitle>
            <DialogDescription>
              Create an assignment for your students to complete
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="dark:text-gray-300">Assignment Title</Label>
              <Input
                id="title"
                placeholder="e.g., Quadratic Equations Practice"
                className="dark:bg-white/5 dark:border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the assignment..."
                rows={4}
                className="dark:bg-white/5 dark:border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="dark:text-gray-300">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  className="dark:bg-white/5 dark:border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="points" className="dark:text-gray-300">Total Points</Label>
                <Input
                  id="points"
                  type="number"
                  placeholder="100"
                  className="dark:bg-white/5 dark:border-white/10"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button 
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="dark:border-white/10"
              >
                Cancel
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => {
                  toast.success('Assignment created!');
                  setShowCreateDialog(false);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Grade Submission Dialog */}
      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Grade Submission</DialogTitle>
            <DialogDescription>
              Review and grade student submission
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Student ID</p>
                    <p className="font-semibold dark:text-white">{selectedSubmission.studentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Submitted</p>
                    <p className="font-semibold dark:text-white">
                      {new Date(selectedSubmission.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade" className="dark:text-gray-300">Grade (%)</Label>
                <Input
                  id="grade"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="85"
                  className="dark:bg-white/5 dark:border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback" className="dark:text-gray-300">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback to the student..."
                  rows={4}
                  className="dark:bg-white/5 dark:border-white/10"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline"
                  onClick={() => setSelectedSubmission(null)}
                  className="dark:border-white/10"
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                  onClick={() => handleGrade(selectedSubmission.id, 85)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Grade
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
