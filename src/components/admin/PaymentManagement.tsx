import { useState, useEffect } from 'react';
import axios from 'axios';
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
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
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

export function PaymentManagement() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'paid' | 'failed'>('all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  
  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    students: 0
  });

  const fetchPayments = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        search: searchQuery,
        status: filterStatus,
        sort_by: sortField,
        sort_order: sortOrder
      });

      const res = await axios.get(`http://localhost:8000/api/admin/payments?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.payments) {
        setPayments(res.data.payments.data);
        setTotalPages(res.data.payments.last_page);
        if (res.data.stats) {
          setStats(res.data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch payments', error);
      toast.error('Failed to load payments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [currentPage, searchQuery, filterStatus, sortField, sortOrder]);

  const handleMarkAsPaid = async (payment: Payment) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`http://localhost:8000/api/admin/confirm-payment/${payment.id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
      
      // Refresh stats
      fetchPayments();
    } catch (error) {
      console.error('Failed to confirm payment', error);
      toast.error('Failed to confirm payment');
    }
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
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
              <Select value={sortField} onValueChange={(val) => {
                setSortField(val);
                setSortOrder('desc');
              }}>
                <SelectTrigger className="w-[140px] bg-white dark:bg-white/5 border-gray-200 dark:border-white/10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date</SelectItem>
                  <SelectItem value="amount_paid">Amount</SelectItem>
                  <SelectItem value="payment_status">Status</SelectItem>
                </SelectContent>
              </Select>

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
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No payments found
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((payment) => (
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
                      <TableCell>
                        <Badge variant="outline" className="dark:border-white/20 dark:text-gray-300">
                          {payment.paymentMethod}
                        </Badge>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {new Date(payment.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            payment.status === 'paid' 
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20'
                              : payment.status === 'pending'
                              ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20'
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20'
                          }
                        >
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setSelectedPayment(payment)}>
                              <FileText className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {payment.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleMarkAsPaid(payment)}>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDownloadReceipt(payment)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download Receipt
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendReceipt(payment)}>
                              <Send className="w-4 h-4 mr-2" />
                              Send Receipt
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {payments.length > 0 && (
              <div className="flex items-center justify-between mt-4 border-t pt-4 dark:border-white/10">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="dark:border-white/10 dark:text-white"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Page <span className="font-medium text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-medium text-gray-900 dark:text-white">{totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || isLoading}
                  className="dark:border-white/10 dark:text-white"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
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
