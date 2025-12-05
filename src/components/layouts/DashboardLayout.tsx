import { ReactNode, useState } from 'react';
import { User } from '../../types';
import { 
  GraduationCap, 
  Home, 
  BookOpen, 
  Calendar, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Settings, 
  Bell, 
  LogOut,
  Menu,
  X,
  Users,
  BarChart3,
  Video,
  Award,
  HelpCircle,
  Search,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getInitials } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { mockNotifications } from '../../lib/mockData';
import { useTheme } from '../../lib/theme-context';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardLayoutProps {
  user: User;
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function DashboardLayout({ user, children, currentPage, onNavigate, onLogout }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const unreadNotifications = mockNotifications.filter(n => !n.isRead && n.userId === user.id).length;

  const navigationItems = getNavigationItems(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black transition-colors duration-300">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30 dark:opacity-20">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Top Navigation */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 sticky top-0 z-40 transition-colors duration-300"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden dark:text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-75" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  My Tutor+
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400">Excellence in Education</p>
              </div>
            </motion.div>
          </div>

          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Search courses, lessons, assignments..."
                className="pl-10 bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 focus:border-blue-500 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="relative overflow-hidden group dark:text-white"
              >
                <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </motion.div>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="relative dark:text-white">
                    <Bell className="w-5 h-5" />
                    {unreadNotifications > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-xs text-white font-bold">{unreadNotifications}</span>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 dark:bg-gray-900 dark:border-white/10">
                <DropdownMenuLabel className="dark:text-white">
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadNotifications > 0 && (
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                        {unreadNotifications} new
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-white/10" />
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications
                    .filter(n => n.userId === user.id)
                    .slice(0, 5)
                    .map(notification => (
                      <DropdownMenuItem 
                        key={notification.id} 
                        className="flex flex-col items-start p-3 cursor-pointer dark:hover:bg-white/5"
                      >
                        <div className="flex items-start gap-2 w-full">
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${notification.isRead ? 'bg-gray-300' : 'bg-blue-500'}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium dark:text-white">{notification.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                </div>
                <DropdownMenuSeparator className="dark:bg-white/10" />
                <DropdownMenuItem className="text-center text-sm text-blue-600 dark:text-blue-400 dark:hover:bg-white/5">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Avatar className="w-9 h-9 border-2 border-blue-500/20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold dark:text-white">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                  </div>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 dark:bg-gray-900 dark:border-white/10">
                <DropdownMenuLabel className="dark:text-white">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-white/10" />
                <DropdownMenuItem className="dark:hover:bg-white/5 dark:text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="dark:hover:bg-white/5 dark:text-white">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Help & Support
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-white/10" />
                <DropdownMenuItem onClick={onLogout} className="dark:hover:bg-white/5 text-red-600 dark:text-red-400">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20 }}
              className={`
                fixed lg:sticky top-[57px] h-[calc(100vh-57px)] w-64 
                bg-white/80 dark:bg-black/80 backdrop-blur-xl 
                border-r border-gray-200 dark:border-white/10 
                z-30 overflow-y-auto transition-colors duration-300
                ${sidebarOpen ? 'block' : 'hidden lg:block'}
              `}
            >
              <nav className="p-4 space-y-2">
                {navigationItems.map((item, index) => {
                  const isActive = currentPage === item.id;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Button
                        variant={isActive ? 'default' : 'ghost'}
                        className={`
                          w-full justify-start gap-3 transition-all duration-200
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/50' 
                            : 'hover:bg-gray-100 dark:hover:bg-white/5 dark:text-gray-300'
                          }
                        `}
                        onClick={() => {
                          onNavigate(item.id);
                          setSidebarOpen(false);
                        }}
                      >
                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                        <span>{item.label}</span>
                        {item.badge && (
                          <Badge className="ml-auto bg-red-500 dark:bg-red-600 border-0">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Sidebar Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-0 left-0 right-0 p-4 space-y-3 border-t border-gray-200 dark:border-white/10"
              >
                {/* Upgrade Card */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 dark:border-blue-500/30">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">Upgrade to Pro</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Unlock premium features</p>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300"
                  onClick={onLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </Button>
              </motion.div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 lg:p-8 relative z-10"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

function getNavigationItems(role: string) {
  const studentItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'course-catalog', label: 'Browse Courses', icon: Video },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'assignments', label: 'Assignments', icon: FileText, badge: 3 },
    { id: 'grades', label: 'Grades', icon: Award },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: 2 },
  ];

  const instructorItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'my-courses', label: 'My Courses', icon: BookOpen },
    { id: 'create-course', label: 'Create Course', icon: Video },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  switch (role) {
    case 'student':
      return studentItems;
    case 'instructor':
      return instructorItems;
    case 'admin':
      return adminItems;
    default:
      return studentItems;
  }
}