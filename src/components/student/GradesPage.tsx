import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Award, 
  CheckCircle, 
  XCircle,
  Clock,
  Loader2,
  FileText
} from 'lucide-react';
import { formatDateTime } from '../../lib/utils';
import { toast } from 'react-hot-toast';

interface AssignmentSubmission {
  id: number;
  grade: number | null;
  feedback: string | null;
  submitted_at: string;
  graded_at: string | null;
  status: string;
}

interface Assignment {
  id: number;
  title: string;
  course: {
    title: string;
  };
  total_points: number;
  due_date: string;
  submissions: AssignmentSubmission[];
}

interface GradesPageProps {
  userId: string;
}

export function GradesPage({ userId }: GradesPageProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await axios.get('http://localhost:8000/api/my-assignments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAssignments(response.data);
      } catch (error) {
        console.error('Failed to fetch grades', error);
        toast.error('Failed to load grades');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const gradedAssignments = assignments.filter(
    a => a.submissions.length > 0 && a.submissions[0].status === 'graded'
  );
  
  const pendingAssignments = assignments.filter(
    a => a.submissions.length > 0 && a.submissions[0].status === 'submitted'
  );

  const calculateAverageGrade = () => {
    if (gradedAssignments.length === 0) return 0;
    const total = gradedAssignments.reduce((sum, a) => {
      const grade = a.submissions[0].grade || 0;
      const max = a.total_points || 100;
      return sum + (grade / max) * 100;
    }, 0);
    return Math.round(total / gradedAssignments.length);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Grades & Feedback</h1>
        <p className="text-muted-foreground">Track your academic performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Grade</p>
                <p className="text-2xl mt-2 font-bold">{calculateAverageGrade()}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Graded Assignments</p>
                <p className="text-2xl mt-2 font-bold">{gradedAssignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Grading</p>
                <p className="text-2xl mt-2 font-bold">{pendingAssignments.length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignment Grades</CardTitle>
        </CardHeader>
        <CardContent>
          {gradedAssignments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No graded assignments yet
            </div>
          ) : (
            <div className="space-y-4">
              {gradedAssignments.map((assignment) => {
                const submission = assignment.submissions[0];
                const percentage = Math.round(((submission.grade || 0) / assignment.total_points) * 100);
                
                return (
                  <div 
                    key={assignment.id} 
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.course.title}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-muted-foreground">
                          <span>Submitted: {formatDateTime(submission.submitted_at)}</span>
                          {submission.graded_at && (
                            <span>Graded: {formatDateTime(submission.graded_at)}</span>
                          )}
                        </div>

                        {submission.feedback && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                            <span className="font-medium text-gray-700">Feedback: </span>
                            {submission.feedback}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 md:flex-col md:items-end md:gap-1">
                      <div className="text-2xl font-bold text-primary">
                        {submission.grade} <span className="text-sm text-muted-foreground font-normal">/ {assignment.total_points}</span>
                      </div>
                      <Badge variant={percentage >= 70 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'}>
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
