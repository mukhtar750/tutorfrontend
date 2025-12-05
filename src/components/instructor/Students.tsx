import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
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
  Users,
  Search,
  Filter,
  MoreVertical,
  Mail,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../../types';

interface StudentsProps {
  user: User;
}

const mockStudents = [
  { id: '1', name: 'Chioma Okafor', email: 'chioma@student.com', course: 'Mathematics SS2', progress: 85, status: 'active', lastActive: '2 hours ago', grade: 'A' },
  { id: '2', name: 'Tunde Adeleke', email: 'tunde@student.com', course: 'Physics SS3', progress: 92, status: 'active', lastActive: '1 day ago', grade: 'A+' },
  { id: '3', name: 'Ngozi Eze', email: 'ngozi@student.com', course: 'Chemistry SS2', progress: 67, status: 'at-risk', lastActive: '5 days ago', grade: 'C' },
  { id: '4', name: 'Ibrahim Musa', email: 'ibrahim@student.com', course: 'English SS3', progress: 78, status: 'active', lastActive: '3 hours ago', grade: 'B+' },
  { id: '5', name: 'Ada Okonkwo', email: 'ada@student.com', course: 'Biology SS2', progress: 95, status: 'excellent', lastActive: '1 hour ago', grade: 'A+' },
];

export function Students({ user }: StudentsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'at-risk' | 'excellent'>('all');

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockStudents.length,
    active: mockStudents.filter(s => s.status === 'active').length,
    excellent: mockStudents.filter(s => s.status === 'excellent').length,
    atRisk: mockStudents.filter(s => s.status === 'at-risk').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">My Students</h1>
        <p className="text-muted-foreground">Track and manage your student performance</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Students', value: stats.total, icon: Users, gradient: 'from-blue-500 to-cyan-500', bgGradient: 'from-blue-500/10 to-cyan-500/10' },
          { label: 'Active', value: stats.active, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', bgGradient: 'from-green-500/10 to-emerald-500/10' },
          { label: 'Excellent', value: stats.excellent, icon: Award, gradient: 'from-purple-500 to-pink-500', bgGradient: 'from-purple-500/10 to-pink-500/10' },
          { label: 'At Risk', value: stats.atRisk, icon: AlertCircle, gradient: 'from-orange-500 to-red-500', bgGradient: 'from-orange-500/10 to-red-500/10' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
          >
            <Card className="relative overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-50`} />
              <CardContent className="p-6 relative z-10">
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

      {/* Filters */}
      <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-white/5 border-gray-200 dark:border-white/10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'active', 'excellent', 'at-risk'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status as any)}
                  className={filterStatus === status ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <CardTitle className="dark:text-white">All Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-white/5">
                    <TableHead className="dark:text-gray-300">Student</TableHead>
                    <TableHead className="dark:text-gray-300">Course</TableHead>
                    <TableHead className="dark:text-gray-300">Progress</TableHead>
                    <TableHead className="dark:text-gray-300">Grade</TableHead>
                    <TableHead className="dark:text-gray-300">Status</TableHead>
                    <TableHead className="dark:text-gray-300">Last Active</TableHead>
                    <TableHead className="dark:text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="dark:hover:bg-white/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold dark:text-white">{student.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{student.course}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                student.progress >= 80 ? 'bg-green-500' :
                                student.progress >= 60 ? 'bg-blue-500' :
                                'bg-orange-500'
                              }`}
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold dark:text-white w-10">{student.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`
                          ${student.grade.startsWith('A') ? 'bg-green-600' :
                            student.grade.startsWith('B') ? 'bg-blue-600' :
                            student.grade.startsWith('C') ? 'bg-orange-600' :
                            'bg-red-600'
                          } text-white border-0
                        `}>
                          {student.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            student.status === 'excellent'
                              ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30'
                              : student.status === 'active'
                              ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30'
                              : 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30'
                          }
                        >
                          {student.status === 'excellent' ? <Award className="w-3 h-3 mr-1" /> :
                           student.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> :
                           <AlertCircle className="w-3 h-3 mr-1" />}
                          {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {student.lastActive}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-white/10">
                            <DropdownMenuItem className="dark:hover:bg-white/5">
                              <Mail className="w-4 h-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:hover:bg-white/5">
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:hover:bg-white/5">
                              <Award className="w-4 h-4 mr-2" />
                              View Progress
                            </DropdownMenuItem>
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
    </div>
  );
}
