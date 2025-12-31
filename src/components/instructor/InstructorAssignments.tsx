import { useEffect, useState } from 'react';
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
import axios from 'axios';

export function InstructorAssignments() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', points: 100, courseId: '' });
  const [gradeInput, setGradeInput] = useState('');
  const [feedbackInput, setFeedbackInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    axios.get('http://localhost:8000/api/assignments', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setAssignments(res.data || []);
    }).catch(() => {
      setAssignments([]);
    });
  }, []);

  const loadSubmissions = async (assignmentId: number) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    const res = await axios.get(`http://localhost:8000/api/assignments/${assignmentId}/submissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSubmissions(res.data || []);
  };

  const handleGrade = async () => {
    if (!selectedAssignment || !selectedSubmission) return;
    const grade = Number(gradeInput);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      toast.error('Please enter a valid grade between 0 and 100');
      return;
    }

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    try {
      await axios.post(`http://localhost:8000/api/assignments/${selectedAssignment.id}/grade`, {
        submission_id: selectedSubmission.id,
        grade,
        feedback: feedbackInput,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Assignment graded!', { description: `Grade: ${grade}% has been submitted` });
      setSelectedSubmission(null);
      setGradeInput('');
      setFeedbackInput('');
      await loadSubmissions(selectedAssignment.id);
    } catch (error) {
      console.error('Failed to grade assignment', error);
      toast.error('Failed to submit grade');
    }
  };

  const stats = {
    total: assignments.length,
    pending: submissions.filter(s => !s.grade).length,
    graded: submissions.filter(s => s.grade).length,
    overdue: 0,
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

      {/* Assignments List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="dark:text-white">Your Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.map((a, index) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (index * 0.05) }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/10 dark:to-purple-500/10 border border-blue-200 dark:border-blue-500/30 cursor-pointer"
                onClick={async () => { setSelectedAssignment(a); await loadSubmissions(a.id); }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 dark:text-white">{a.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{a.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{a.due_date ? new Date(a.due_date).toLocaleDateString() : 'No due date'}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{a.total_points ?? 100} pts</Badge>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {selectedAssignment && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <CardTitle className="dark:text-white">Submissions for {selectedAssignment.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {submissions.map((submission: any, index) => (
                <motion.div
                  key={submission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (index * 0.05) }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-500/10 dark:to-red-500/10 border border-orange-200 dark:border-orange-500/30 cursor-pointer group"
                  onClick={() => setSelectedSubmission(submission)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30">
                          <Clock className="w-3 h-3 mr-1" />
                          {submission.grade ? 'Graded' : 'Pending Review'}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Submitted {new Date(submission.submitted_at || submission.submittedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-1 dark:text-white">Student {submission.student?.id ?? submission.studentId}</h4>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity">Grade Now</Button>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      )}

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
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the assignment..."
                rows={4}
                className="dark:bg-white/5 dark:border-white/10"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="dark:text-gray-300">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                className="dark:bg-white/5 dark:border-white/10"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>

              <div className="space-y-2">
                <Label htmlFor="points" className="dark:text-gray-300">Total Points</Label>
              <Input
                id="points"
                type="number"
                placeholder="100"
                className="dark:bg-white/5 dark:border-white/10"
                value={String(form.points)}
                onChange={(e) => setForm({ ...form, points: Number(e.target.value) })}
              />
            </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseId" className="dark:text-gray-300">Course ID</Label>
              <Input
                id="courseId"
                placeholder="Enter course ID"
                className="dark:bg-white/5 dark:border-white/10"
                value={form.courseId}
                onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              />
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
                onClick={async () => {
                  const token = localStorage.getItem('auth_token');
                  if (!token) return;
                  await axios.post('http://localhost:8000/api/assignments', {
                    course_id: Number(form.courseId),
                    title: form.title,
                    description: form.description,
                    due_date: form.dueDate ? new Date(form.dueDate).toISOString() : null,
                    total_points: form.points,
                  }, {
                    headers: { Authorization: `Bearer ${token}` }
                  });
                  toast.success('Assignment created!');
                  setShowCreateDialog(false);
                  setForm({ title: '', description: '', dueDate: '', points: 100, courseId: '' });
                  const res = await axios.get('http://localhost:8000/api/assignments', { headers: { Authorization: `Bearer ${token}` } });
                  setAssignments(res.data || []);
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
                  value={gradeInput}
                  onChange={(e) => setGradeInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback" className="dark:text-gray-300">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide feedback to the student..."
                  rows={4}
                  className="dark:bg-white/5 dark:border-white/10"
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
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
                  onClick={handleGrade}
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
