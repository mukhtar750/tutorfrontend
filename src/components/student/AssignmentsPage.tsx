import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { 
  FileText, 
  Clock, 
  Award, 
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download
} from 'lucide-react';
import { mockAssignments, mockCourses, mockEnrollments } from '../../lib/mockData';
import { formatDateTime, getDaysUntil, isOverdue } from '../../lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';

interface AssignmentsPageProps {
  userId: string;
}

export function AssignmentsPage({ userId }: AssignmentsPageProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [submissionText, setSubmissionText] = useState('');

  const enrolledCourseIds = mockEnrollments
    .filter(e => e.studentId === userId)
    .map(e => e.courseId);

  const userAssignments = mockAssignments.filter(a => 
    enrolledCourseIds.includes(a.courseId)
  );

  const pendingAssignments = userAssignments.filter(a => {
    const daysUntil = getDaysUntil(a.dueDate);
    return daysUntil >= 0;
  });

  const overdueAssignments = userAssignments.filter(a => isOverdue(a.dueDate));
  const completedAssignments = 0; // Mock - would come from submissions

  const handleSubmit = () => {
    console.log('Submitting assignment:', selectedAssignment.id);
    console.log('Submission:', submissionText);
    alert('Assignment submitted successfully!');
    setShowSubmitDialog(false);
    setSubmissionText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Assignments</h1>
        <p className="text-muted-foreground">Manage and submit your course assignments</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl mt-2">{userAssignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl mt-2">{pendingAssignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl mt-2">{overdueAssignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl mt-2">{completedAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="overdue">
                Overdue ({overdueAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedAssignments})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {pendingAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending assignments
                </div>
              ) : (
                pendingAssignments.map(assignment => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment}
                    onSubmit={() => {
                      setSelectedAssignment(assignment);
                      setShowSubmitDialog(true);
                    }}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="overdue" className="space-y-4 mt-4">
              {overdueAssignments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No overdue assignments
                </div>
              ) : (
                overdueAssignments.map(assignment => (
                  <AssignmentCard 
                    key={assignment.id} 
                    assignment={assignment}
                    isOverdue={true}
                    onSubmit={() => {
                      setSelectedAssignment(assignment);
                      setShowSubmitDialog(true);
                    }}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              <div className="text-center py-8 text-muted-foreground">
                No completed assignments yet
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Submit Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {selectedAssignment?.title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Course</span>
                    <span className="text-sm">
                      {mockCourses.find(c => c.id === selectedAssignment?.courseId)?.title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Due Date</span>
                    <span className="text-sm">
                      {selectedAssignment && formatDateTime(selectedAssignment.dueDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Points</span>
                    <span className="text-sm">{selectedAssignment?.totalPoints}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label>Your Submission</Label>
              <Textarea
                placeholder="Type your answer or describe your submission..."
                value={submissionText}
                onChange={(e) => setSubmissionText(e.target.value)}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Attachments (Optional)</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX up to 10MB
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Choose File
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                Submit Assignment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssignmentCard({ 
  assignment, 
  isOverdue = false,
  onSubmit 
}: { 
  assignment: any; 
  isOverdue?: boolean;
  onSubmit: () => void;
}) {
  const course = mockCourses.find(c => c.id === assignment.courseId);
  const daysUntil = getDaysUntil(assignment.dueDate);

  return (
    <div className={`p-4 border rounded-lg ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isOverdue ? 'bg-red-100' : 'bg-blue-100'
          }`}>
            <FileText className={`w-6 h-6 ${isOverdue ? 'text-red-600' : 'text-blue-600'}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h3 className="font-medium">{assignment.title}</h3>
                <p className="text-sm text-muted-foreground">{course?.title}</p>
              </div>
              {isOverdue && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Overdue
                </Badge>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-3">
              {assignment.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDateTime(assignment.dueDate)}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Award className="w-4 h-4" />
                <span>{assignment.totalPoints} points</span>
              </div>
              {!isOverdue && daysUntil <= 3 && (
                <Badge variant="secondary">
                  {daysUntil === 0 ? 'Due today' : `${daysUntil} days left`}
                </Badge>
              )}
            </div>

            {assignment.attachments && assignment.attachments.length > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Materials
                </Button>
              </div>
            )}
          </div>
        </div>

        <Button onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
}
