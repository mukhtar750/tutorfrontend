import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { User, UserRole } from '../types';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  Shield, 
  Sparkles, 
  CheckCircle, 
  Star,
  Award,
  TrendingUp,
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Rocket
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'motion/react';
import axios from 'axios';

interface AuthPageProps {
  onLogin: (user: User) => void;
}
export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = async (role: UserRole, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/login', { email, password });
      const data = res.data;
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
      }
      const name: string = data.user?.name || '';
      const [firstName, lastName] = name.split(' ');
      const user: User = {
        id: String(data.user?.id ?? Date.now()),
        email: data.user?.email ?? email,
        firstName: firstName || '',
        lastName: lastName || '',
        role: (data.user?.role as UserRole) || role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        createdAt: new Date().toISOString(),
      };
      onLogin(user);
    } catch (e) {
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Mouse Follower */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      />

      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block space-y-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-9 h-9 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  My Tutor+
                </h1>
                <p className="text-gray-400">Excellence in Education</p>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-5xl font-bold leading-tight">
                <span className="block">Welcome to</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Your Future
                </span>
              </h2>
              <p className="text-xl text-gray-400 leading-relaxed">
                Join 10,000+ students transforming their academic journey. 
                Sign in to access world-class education.
              </p>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-6"
            >
              {[
                { value: '10K+', label: 'Students', gradient: 'from-blue-500 to-cyan-500' },
                { value: '98%', label: 'Pass Rate', gradient: 'from-green-500 to-emerald-500' },
                { value: '150+', label: 'Instructors', gradient: 'from-purple-500 to-pink-500' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="text-center"
                >
                  <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4"
            >
              {[
                {
                  icon: BookOpen,
                  title: 'Live & Recorded Classes',
                  description: 'Learn at your own pace with flexible scheduling',
                  gradient: 'from-blue-500/20 to-cyan-500/20'
                },
                {
                  icon: Award,
                  title: 'Expert Instructors',
                  description: 'Learn from qualified teachers with proven results',
                  gradient: 'from-purple-500/20 to-pink-500/20'
                },
                {
                  icon: TrendingUp,
                  title: 'Track Your Progress',
                  description: 'Real-time analytics and performance insights',
                  gradient: 'from-green-500/20 to-emerald-500/20'
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (i * 0.1) }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} backdrop-blur-xl border border-white/10`}
                >
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{feature.title}</p>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <motion.img 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                    alt="Student"
                    className="w-10 h-10 rounded-full border-2 border-black"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  Rated <span className="text-white font-semibold">4.9/5</span> by students
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-black/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden">
              <div className="relative">
                {/* Top Gradient Bar */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
                
                <CardContent className="p-8">
                  {/* Header */}
                  <div className="text-center mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                    >
                      <Rocket className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-gray-400">Sign in to continue your learning journey</p>
                  </div>

                  {/* Role Selector Tabs */}
                  <Tabs defaultValue="student" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10 p-1 mb-8">
                      <TabsTrigger 
                        value="student"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Student
                      </TabsTrigger>
                      <TabsTrigger 
                        value="instructor"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Instructor
                      </TabsTrigger>
                      <TabsTrigger 
                        value="admin"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="student">
                      <LoginForm role="student" onSubmit={handleLogin} isLoading={isLoading} />
                    </TabsContent>
                    
                    <TabsContent value="instructor">
                      <LoginForm role="instructor" onSubmit={handleLogin} isLoading={isLoading} />
                    </TabsContent>
                    
                    <TabsContent value="admin">
                      <LoginForm role="admin" onSubmit={handleLogin} isLoading={isLoading} />
                    </TabsContent>
                  </Tabs>


                </CardContent>
              </div>
            </Card>

            {/* Bottom Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                  Sign up now
                </button>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight],
              x: [null, Math.random() * window.innerWidth],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

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

function LoginForm({ 
  role, 
  onSubmit, 
  isLoading 
}: { 
  role: UserRole; 
  onSubmit: (role: UserRole, email: string, password: string) => void; 
  isLoading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const roleInfo = {
    student: {
      badge: 'Student Portal',
      color: 'from-blue-500 to-cyan-500',
      icon: Users,
      features: ['Access courses', 'Track progress', 'Submit assignments']
    },
    instructor: {
      badge: 'Instructor Portal',
      color: 'from-purple-500 to-pink-500',
      icon: GraduationCap,
      features: ['Manage courses', 'Grade assignments', 'View analytics']
    },
    admin: {
      badge: 'Admin Portal',
      color: 'from-orange-500 to-red-500',
      icon: Shield,
      features: ['Manage users', 'View analytics', 'System settings']
    }
  };

  const info = roleInfo[role];

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const email = String(formData.get('email') || '');
        const password = String(formData.get('password') || '');
        onSubmit(role, email, password);
      }} 
      className="space-y-6"
    >
      {/* Role Badge */}
      <div className="text-center">
        <Badge className={`bg-gradient-to-r ${info.color} border-0 text-white px-4 py-1`}>
          <info.icon className="w-3 h-3 mr-1" />
          {info.badge}
        </Badge>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor={`email-${role}`} className="text-gray-300">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id={`email-${role}`}
            type="email"
            placeholder="Enter your email"
            className="pl-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
            name="email"
            required
          />
        </div>
      </div>
      
      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor={`password-${role}`} className="text-gray-300">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            id={`password-${role}`}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pl-11 pr-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20"
            name="password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Class Level for Students */}
      {role === 'student' && (
        <div className="space-y-2">
          <Label htmlFor="class-level" className="text-gray-300">Class Level</Label>
          <Select defaultValue="SS2">
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Select your class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SS1">SS1</SelectItem>
              <SelectItem value="SS2">SS2</SelectItem>
              <SelectItem value="SS3">SS3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-white/20 bg-white/5" />
          <span className="text-gray-400">Remember me</span>
        </label>
        <button type="button" className="text-blue-400 hover:text-blue-300 transition-colors">
          Forgot password?
        </button>
      </div>
      
      {/* Submit Button */}
      <Button 
        type="submit" 
        className={`w-full h-12 bg-gradient-to-r ${info.color} hover:opacity-90 text-white shadow-lg shadow-blue-500/30 group relative overflow-hidden`}
        disabled={isLoading}
      >
        <span className="relative z-10 flex items-center justify-center">
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
      </Button>

      {/* Quick Access Info */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 mb-3">Quick access to:</p>
        <div className="grid grid-cols-3 gap-2">
          {info.features.map((feature, i) => (
            <div key={i} className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
              <span className="text-xs text-gray-400">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.form>
  );
}
