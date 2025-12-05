import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Download, 
  CreditCard, 
  CheckCircle, 
  XCircle,
  Clock,
  Receipt,
  Filter
} from 'lucide-react';
import { mockPayments, mockCourses } from '../../lib/mockData';
import { formatCurrency, formatDateTime } from '../../lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface PaymentsPageProps {
  userId: string;
}

export function PaymentsPage({ userId }: PaymentsPageProps) {
  const userPayments = mockPayments.filter(p => p.studentId === userId);
  const completedPayments = userPayments.filter(p => p.status === 'completed');
  const totalSpent = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Payments & Receipts</h1>
        <p className="text-muted-foreground">View your payment history and download receipts</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl mt-2">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl mt-2">{completedPayments.length}</p>
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
                <p className="text-sm text-muted-foreground">Courses Purchased</p>
                <p className="text-2xl mt-2">{userPayments.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Payment History</CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              <PaymentList payments={userPayments} />
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 mt-4">
              <PaymentList payments={completedPayments} />
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 mt-4">
              <PaymentList payments={userPayments.filter(p => p.status === 'pending')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentList({ payments }: { payments: any[] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'refunded':
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
      refunded: 'outline',
    };
    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (payments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No payments found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments.map((payment) => {
        const course = mockCourses.find(c => c.id === payment.courseId);
        
        return (
          <div 
            key={payment.id} 
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p>{course?.title || 'Course'}</p>
                    <p className="text-sm text-muted-foreground">
                      Reference: {payment.reference}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {payment.paidAt ? formatDateTime(payment.paidAt) : 'Pending'}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {payment.paymentMethod}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xl">{formatCurrency(payment.amount)}</p>
                    <div className="mt-1">
                      {getStatusBadge(payment.status)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {payment.status === 'completed' && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => {
                  alert('Receipt downloaded!');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
