import { useState } from 'react';
import { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Award,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  Eye,
  Ban,
  ShieldCheck,
  TrendingUp,
  UserCheck,
  UserX,
  Zap,
  Crown,
  BookOpen
} from 'lucide-react';
import { mockUsers } from '../../lib/mockData';
import { formatDate, getInitials } from '../../lib/utils';
import { UserDetailsDialog } from './UserDetailsDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface UserManagementProps {
  user: User;
}

export function UserManagement({ user }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [classFilter, setClassFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter((u) => {
    const matchesSearch = 
      u.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesClass = classFilter === 'all' || u.classLevel === classFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && u.isActive !== false) ||
      (statusFilter === 'inactive' && u.isActive === false);

    return matchesSearch && matchesRole && matchesClass && matchesStatus;
  });

  // Statistics
  const stats = {
    total: mockUsers.length,
    students: mockUsers.filter(u => u.role === 'student').length,
    instructors: mockUsers.filter(u => u.role === 'instructor').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    active: mockUsers.filter(u => u.isActive !== false).length,
    ss1: mockUsers.filter(u => u.classLevel === 'SS1').length,
    ss2: mockUsers.filter(u => u.classLevel === 'SS2').length,
    ss3: mockUsers.filter(u => u.classLevel === 'SS3').length,
  };

  const handleToggleStatus = (userId: string) => {
    toast.success('User status updated successfully');
    // In real app, make API call to toggle user status
  };

  const handleDeleteUser = () => {
    toast.success('User deleted successfully');
    setShowDeleteDialog(false);
    setSelectedUser(null);
    // In real app, make API call to delete user
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0';
      case 'instructor':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0';
      case 'student':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return Crown;
      case 'instructor':
        return Award;
      case 'student':
        return GraduationCap;
      default:
        return Users;
    }
  };

  return (
    <div className="space-y-6">
      {/* Epic Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <p className="text-purple-100 text-sm">User Management</p>
              <h1 className="text-3xl md:text-4xl font-bold">
                Manage Users
              </h1>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-purple-100 mb-6 max-w-2xl"
          >
            Complete control over all students, instructors, and administrators in your learning platform.
          </motion.p>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: 'Total Users', value: stats.total.toLocaleString(), icon: Users },
              { label: 'Students', value: stats.students.toLocaleString(), icon: GraduationCap },
              { label: 'Instructors', value: stats.instructors.toLocaleString(), icon: Award },
              { label: 'Active Now', value: stats.active.toLocaleString(), icon: Zap },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (index * 0.05) }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20"
              >
                <stat.icon className="w-8 h-8 mb-3 opacity-80" />
                <p className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-purple-100">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Class Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'SS1 Students', value: stats.ss1, gradient: 'from-blue-500 to-cyan-500', icon: BookOpen },
          { label: 'SS2 Students', value: stats.ss2, gradient: 'from-purple-500 to-pink-500', icon: BookOpen },
          { label: 'SS3 Students', value: stats.ss3, gradient: 'from-green-500 to-emerald-500', icon: BookOpen },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Card className="relative overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10`} />
              <CardContent className="p-6 relative z-10">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-3xl font-bold mt-4 mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="dark:text-white">Search & Filter</CardTitle>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => setShowAddUserDialog(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
                <Button variant="outline" className="dark:border-white/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
                <Button variant="outline" className="dark:border-white/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by name, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 dark:bg-white/5 dark:border-white/10 dark:text-white"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="student">Students</SelectItem>
                  <SelectItem value="instructor">Instructors</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              {/* Class Filter */}
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue placeholder="Filter by class" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="SS1">SS1</SelectItem>
                  <SelectItem value="SS2">SS2</SelectItem>
                  <SelectItem value="SS3">SS3</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold dark:text-white">{filteredUsers.length}</span> of <span className="font-semibold dark:text-white">{mockUsers.length}</span> users
              </p>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="dark:text-gray-300"
                >
                  Clear search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="dark:text-white">All Users</CardTitle>
              </div>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'table')}>
                <TabsList className="dark:bg-white/5">
                  <TabsTrigger value="table" className="dark:text-white">Table</TabsTrigger>
                  <TabsTrigger value="grid" className="dark:text-white">Grid</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === 'table' ? (
              <div className="rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/5">
                      <TableHead className="dark:text-gray-300">User</TableHead>
                      <TableHead className="dark:text-gray-300">Role</TableHead>
                      <TableHead className="dark:text-gray-300">Class</TableHead>
                      <TableHead className="dark:text-gray-300">Contact</TableHead>
                      <TableHead className="dark:text-gray-300">Joined</TableHead>
                      <TableHead className="dark:text-gray-300">Status</TableHead>
                      <TableHead className="dark:text-gray-300 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((u, index) => {
                      const RoleIcon = getRoleIcon(u.role);
                      return (
                        <motion.tr
                          key={u.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10 border-2 border-blue-500/20">
                                <AvatarImage src={u.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                  {getInitials(u.firstName, u.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold dark:text-white">
                                  {u.firstName} {u.lastName}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {u.email}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(u.role)}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {u.classLevel ? (
                              <Badge variant="outline" className="dark:border-white/20 dark:text-gray-300">
                                {u.classLevel}
                              </Badge>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span className="truncate max-w-[150px]">{u.email}</span>
                              </div>
                              {u.phoneNumber && (
                                <div className="flex items-center gap-2 text-sm dark:text-gray-400">
                                  <Phone className="w-3 h-3 text-gray-400" />
                                  <span>{u.phoneNumber}</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {formatDate(u.createdAt)}
                            </div>
                          </TableCell>
                          <TableCell>
                            {u.isActive !== false ? (
                              <Badge className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30">
                                <XCircle className="w-3 h-3 mr-1" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="dark:text-white">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-white/10">
                                <DropdownMenuLabel className="dark:text-white">Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator className="dark:bg-white/10" />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowDetailsDialog(true);
                                  }}
                                  className="dark:hover:bg-white/5 dark:text-white"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowEditDialog(true);
                                  }}
                                  className="dark:hover:bg-white/5 dark:text-white"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleToggleStatus(u.id)}
                                  className="dark:hover:bg-white/5 dark:text-white"
                                >
                                  {u.isActive !== false ? (
                                    <>
                                      <Ban className="w-4 h-4 mr-2" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <ShieldCheck className="w-4 h-4 mr-2" />
                                      Activate
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="dark:bg-white/10" />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-600 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((u, index) => {
                  const RoleIcon = getRoleIcon(u.role);
                  return (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.05 * index }}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900/50 dark:to-gray-800/50 border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <Avatar className="w-16 h-16 border-2 border-blue-500/20">
                              <AvatarImage src={u.avatar} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                                {getInitials(u.firstName, u.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="dark:text-white">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="dark:bg-gray-900 dark:border-white/10">
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowDetailsDialog(true);
                                  }}
                                  className="dark:hover:bg-white/5 dark:text-white"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowEditDialog(true);
                                  }}
                                  className="dark:hover:bg-white/5 dark:text-white"
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="dark:bg-white/10" />
                                <DropdownMenuItem 
                                  onClick={() => {
                                    setSelectedUser(u);
                                    setShowDeleteDialog(true);
                                  }}
                                  className="text-red-600 dark:text-red-400 dark:hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <h3 className="font-bold text-lg mb-1 dark:text-white">
                            {u.firstName} {u.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 truncate">
                            {u.email}
                          </p>

                          <div className="flex items-center gap-2 mb-4">
                            <Badge className={getRoleBadgeColor(u.role)}>
                              <RoleIcon className="w-3 h-3 mr-1" />
                              {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                            </Badge>
                            {u.classLevel && (
                              <Badge variant="outline" className="dark:border-white/20 dark:text-gray-300">
                                {u.classLevel}
                              </Badge>
                            )}
                          </div>

                          <div className="space-y-2 mb-4">
                            {u.phoneNumber && (
                              <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span>{u.phoneNumber}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm dark:text-gray-300">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              {formatDate(u.createdAt)}
                            </div>
                          </div>

                          {u.isActive !== false ? (
                            <Badge className="w-full justify-center bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge className="w-full justify-center bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/30">
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <UserX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2 dark:text-white">No users found</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setRoleFilter('all');
                    setClassFilter('all');
                    setStatusFilter('all');
                  }}
                  className="dark:border-white/10"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Add User Dialog */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Add New User</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Create a new user account for the platform
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="dark:text-white">First Name</Label>
              <Input id="firstName" placeholder="Enter first name" className="dark:bg-white/5 dark:border-white/10 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="dark:text-white">Last Name</Label>
              <Input id="lastName" placeholder="Enter last name" className="dark:bg-white/5 dark:border-white/10 dark:text-white" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email" className="dark:text-white">Email</Label>
              <Input id="email" type="email" placeholder="user@example.com" className="dark:bg-white/5 dark:border-white/10 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="dark:text-white">Phone Number</Label>
              <Input id="phone" placeholder="+234 800 000 0000" className="dark:bg-white/5 dark:border-white/10 dark:text-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="dark:text-white">Role</Label>
              <Select defaultValue="student">
                <SelectTrigger id="role" className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="class" className="dark:text-white">Class Level (Students Only)</Label>
              <Select defaultValue="SS1">
                <SelectTrigger id="class" className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                  <SelectItem value="SS1">SS1</SelectItem>
                  <SelectItem value="SS2">SS2</SelectItem>
                  <SelectItem value="SS3">SS3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="password" className="dark:text-white">Temporary Password</Label>
              <Input id="password" type="password" placeholder="Enter temporary password" className="dark:bg-white/5 dark:border-white/10 dark:text-white" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddUserDialog(false)} className="dark:border-white/10">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast.success('User created successfully');
                setShowAddUserDialog(false);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Edit User</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Update user information
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editFirstName" className="dark:text-white">First Name</Label>
                <Input 
                  id="editFirstName" 
                  defaultValue={selectedUser.firstName} 
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editLastName" className="dark:text-white">Last Name</Label>
                <Input 
                  id="editLastName" 
                  defaultValue={selectedUser.lastName} 
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white" 
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="editEmail" className="dark:text-white">Email</Label>
                <Input 
                  id="editEmail" 
                  type="email" 
                  defaultValue={selectedUser.email} 
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editPhone" className="dark:text-white">Phone Number</Label>
                <Input 
                  id="editPhone" 
                  defaultValue={selectedUser.phoneNumber} 
                  className="dark:bg-white/5 dark:border-white/10 dark:text-white" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editRole" className="dark:text-white">Role</Label>
                <Select defaultValue={selectedUser.role}>
                  <SelectTrigger id="editRole" className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedUser.classLevel && (
                <div className="space-y-2">
                  <Label htmlFor="editClass" className="dark:text-white">Class Level</Label>
                  <Select defaultValue={selectedUser.classLevel}>
                    <SelectTrigger id="editClass" className="dark:bg-white/5 dark:border-white/10 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-900 dark:border-white/10">
                      <SelectItem value="SS1">SS1</SelectItem>
                      <SelectItem value="SS2">SS2</SelectItem>
                      <SelectItem value="SS3">SS3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="dark:border-white/10">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast.success('User updated successfully');
                setShowEditDialog(false);
                setSelectedUser(null);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="dark:bg-gray-900 dark:border-white/10">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Delete User</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(selectedUser.firstName, selectedUser.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold dark:text-white">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowDeleteDialog(false);
                setSelectedUser(null);
              }}
              className="dark:border-white/10"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      <UserDetailsDialog
        user={selectedUser}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />
    </div>
  );
}
