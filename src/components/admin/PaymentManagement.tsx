import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MoreVertical,
  Download,
  Send,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  Users,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

interface Payment {
  id: string;
  studentName: string;
  studentEmail: string;
  courseName: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed';
  date: string;
  paymentMethod: string;
  reference: string;
}

const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    studentName: 'Chioma Okafor',
    studentEmail: 'chioma@student.com',
    courseName: 'Mathematics SS2',
    amount: 15000,
    status: 'pending',
    date: '2024-11-15',
    paymentMethod: 'Paystack',
    reference: 'PS-2024-001'
  },
  {
    id: 'PAY002',
    studentName: 'Tunde Adeleke',
    studentEmail: 'tunde@student.com',
    courseName: 'Physics SS3',
    amount: 18000,
    status: 'pending',
    date: '2024-11-16',
    paymentMethod: 'Flutterwave',
    reference: 'FW-2024-002'
  },
  {
    id: 'PAY003',
    studentName: 'Ngozi Eze',
    studentEmail: 'ngozi@student.com',
    courseName: 'Chemistry SS2',
    amount: 16000,
    status: 'paid',
    date: '2024-11-14',
    paymentMethod: 'Paystack',
    reference: 'PS-2024-003'
  },
  {
    id: 'PAY004',
    studentName: 'Ibrahim Musa',
    studentEmail: 'ibrahim@student.com',
    courseName: 'English SS3',
    amount: 12000,
    status: 'paid',
    date: '2024-11-13',
    paymentMethod: 'Stripe',
    reference: 'ST-2024-004'
  },
  {
    id: 'PAY005',
    studentName: 'Ada Okonkwo',
    studentEmail: 'ada@student.com',
    courseName: 'Biology SS2',
    amount: 17000,
    status: 'pending',
    date: '2024-11-17',
    paymentMethod: 'Flutterwave',
    reference: 'FW-2024-005'
  },
];

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'failed'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         payment.reference.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: payments.reduce((acc, p) => acc + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    paid: payments.filter(p => p.status === 'paid').length,
    students: new Set(payments.map(p => p.studentEmail)).size
  };

  const handleMarkAsPaid = (payment: Payment) => {
    setPayments(prev => prev.map(p => 
      p.id === payment.id ? { ...p, status: 'paid' as const } : p
    ));
    
    toast.success('Payment Confirmed!', {
      description: `${payment.studentName}'s payment has been marked as paid. Receipt sent to ${payment.studentEmail}`,
    });
    
    // Auto-show receipt
    setTimeout(() => {
      setSelectedPayment({ ...payment, status: 'paid' });
      setShowReceipt(true);
    }, 500);
  };

  const handleDownloadReceipt = (payment: Payment) => {
    toast.success('Receipt Downloaded!', {
      description: `Receipt for ${payment.reference} has been downloaded`,
    });
  };

  const handleSendReceipt = (payment: Payment) => {
    toast.success('Receipt Sent!', {
      description: `Receipt sent to ${payment.studentEmail}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">Payment Management</h1>
        <p className="text-muted-foreground">Manage and confirm student payments</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Revenue',
            value: `₦${stats.total.toLocaleString()}`,
            icon: DollarSign,
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10'
          },
          {
            label: 'Pending Payments',
            value: stats.pending,
            icon: Clock,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10'
          },
          {
            label: 'Confirmed Payments',
            value: stats.paid,
            icon: CheckCircle,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10'
          },
          {
            label: 'Total Students',
            value: stats.students,
            icon: Users,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10'
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by student name, course, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'paid', 'failed'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                  className={filterStatus === status ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="dark:text-white">All Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-white/5">
                    <TableHead className="dark:text-gray-300">Reference</TableHead>
                    <TableHead className="dark:text-gray-300">Student</TableHead>
                    <TableHead className="dark:text-gray-300">Course</TableHead>
                    <TableHead className="dark:text-gray-300">Amount</TableHead>
                    <TableHead className="dark:text-gray-300">Method</TableHead>
                    <TableHead className="dark:text-gray-300">Date</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                    <TableHead className="dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id} className="dark:hover:bg-white/5">
                      <TableCell className="font-mono text-sm dark:text-gray-300">
                        {payment.reference}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium dark:text-white">{payment.studentName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{payment.studentEmail}</p>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{payment.courseName}</TableCell>
                      <TableCell className="font-semibold dark:text-white">
                        ₦{payment.amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{payment.paymentMethod}</TableCell>
                      <TableCell className="dark:text-gray-300">{payment.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            payment.status === 'paid' 
                              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
                              : payment.status === 'pending'
                              ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
                              : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
                          }
                        >
                          {payment.status === 'paid' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {payment.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                          {payment.status === 'failed' && <XCircle className="w-3 h-3 mr-1" />}
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-white/10">
                            {payment.status === 'pending' && (
                              <DropdownMenuItem 
                                onClick={() => handleMarkAsPaid(payment)}
                                className="dark:hover:bg-white/5"
                              >
                                <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            {payment.status === 'paid' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedPayment(payment);
                                    setShowReceipt(true);
                                  }}
                                  className="dark:hover:bg-white/5"
                                >
                                  <FileText className="w-4 h-4 mr-2" />
                                  View Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDownloadReceipt(payment)}
                                  className="dark:hover:bg-white/5"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Receipt
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleSendReceipt(payment)}
                                  className="dark:hover:bg-white/5"
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send to Student
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-2xl dark:bg-gray-900 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Payment Receipt</DialogTitle>
            <DialogDescription>
              Official receipt for payment reference: {selectedPayment?.reference}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPayment && (
            <div className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center p-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl text-white">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Payment Confirmed</h3>
                <p className="text-blue-100">Thank you for your payment!</p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-4 p-6 bg-gray-50 dark:bg-white/5 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receipt Number</p>
                    <p className="font-semibold dark:text-white">{selectedPayment.reference}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="font-semibold dark:text-white">{selectedPayment.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Student Name</p>
                    <p className="font-semibold dark:text-white">{selectedPayment.studentName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold dark:text-white">{selectedPayment.studentEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Course</p>
                    <p className="font-semibold dark:text-white">{selectedPayment.courseName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                    <p className="font-semibold dark:text-white">{selectedPayment.paymentMethod}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold dark:text-white">Total Amount Paid</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ₦{selectedPayment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={() => handleDownloadReceipt(selectedPayment)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 dark:border-white/10"
                  onClick={() => handleSendReceipt(selectedPayment)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to Student
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
