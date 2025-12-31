import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import axios from 'axios';
import { 
  GraduationCap, 
  BookOpen, 
  Video, 
  Award, 
  Users, 
  Clock,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
  Shield,
  Zap,
  Globe,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Sparkles,
  Target,
  Rocket,
  Brain,
  Trophy,
  BarChart,
  ChevronRight,
  Code,
  Flame
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';

interface LandingPageProps {
  onGetStarted: () => void;
}

interface HeroContent {
  headline: string;
  subheadline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImage: string;
  badgeText: string;
  stats: {
    students: string;
    passRate: string;
    rating: string;
  };
}

const defaultContent: HeroContent = {
  headline: 'Ace Your',
  subheadline: 'WAEC & NECO',
  description: 'Join the revolution in secondary education. Learn from expert instructors, attend live classes, and track your progress in real-time. Your success story starts here.',
  ctaPrimary: 'Start Learning Free',
  ctaSecondary: 'Watch Demo',
  heroImage: 'https://images.unsplash.com/photo-1760348082205-8bda5fbdd7b5',
  badgeText: "Nigeria's #1 Learning Platform",
  stats: {
    students: '10K+',
    passRate: '98%',
    rating: '4.9★'
  }
};

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/settings/hero');
        if (response.data) {
          // Ensure stats object exists and merge with defaults
          const fetchedData = response.data;
          setContent({
            ...defaultContent,
            ...fetchedData,
            stats: {
              ...defaultContent.stats,
              ...(fetchedData.stats || {})
            }
          });
        }
      } catch (error) {
        console.error('Failed to fetch hero content', error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Mouse Follower Effect */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30"
        animate={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-black/50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-75" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  My Tutor+
                </span>
                <p className="text-xs text-gray-400">Learn. Excel. Succeed.</p>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {['Features', 'Courses', 'Pricing', 'Success Stories'].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={onGetStarted}
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 shadow-lg shadow-blue-500/50"
                onClick={onGetStarted}
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <button 
              className="lg:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="lg:hidden backdrop-blur-xl bg-black/90 border-t border-white/10"
          >
            <div className="px-4 py-6 space-y-4">
              {['Features', 'Courses', 'Pricing', 'Success Stories'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`} 
                  className="block py-2 text-gray-300 hover:text-white"
                >
                  {item}
                </a>
              ))}
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-white"
                onClick={onGetStarted}
              >
                Sign In
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={onGetStarted}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-xl mb-6"
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{content.badgeText}</span>
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                    {content.stats.students} Students
                  </Badge>
                </motion.div>

                <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight">
                  <span className="block">{content.headline}</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {content.subheadline}
                  </span>
                  <span className="block">With Confidence</span>
                </h1>

                <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                  {content.description}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Button 
                  size="lg"
                  className="text-lg px-8 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 transition-all duration-300 group"
                  onClick={onGetStarted}
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  {content.ctaPrimary}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 h-14 border-white/20 hover:bg-white/10 backdrop-blur-xl group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  {content.ctaSecondary}
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-8 pt-4"
              >
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {content.stats.passRate}
                  </p>
                  <p className="text-sm text-gray-400">Pass Rate</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {content.stats.students}
                  </p>
                  <p className="text-sm text-gray-400">Active Students</p>
                </div>
                <div className="w-px h-12 bg-white/20" />
                <div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                    {content.stats.rating}
                  </p>
                  <p className="text-sm text-gray-400">Average Rating</p>
                </div>
              </motion.div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4"
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <motion.img 
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + (i * 0.1) }}
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt="Student"
                      className="w-12 h-12 rounded-full border-2 border-black"
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
                    <span className="text-white font-semibold">2,500+</span> students succeeded this year
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Floating Cards */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              {/* Main Image Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur-3xl opacity-50" />
                <div className="relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl">
                  <img 
                    src={content.heroImage}
                    alt="Students success"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
              </motion.div>

              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -top-8 -left-8 p-6 rounded-2xl bg-gradient-to-br from-green-500/90 to-emerald-600/90 backdrop-blur-xl border border-white/20 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">8 A's</p>
                    <p className="text-xs text-white/80">Average Score</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
                className="absolute top-1/3 -right-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/90 to-purple-600/90 backdrop-blur-xl border border-white/20 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">24</p>
                    <p className="text-xs text-white/80">Day Streak</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-8 left-1/4 p-6 rounded-2xl bg-gradient-to-br from-orange-500/90 to-pink-600/90 backdrop-blur-xl border border-white/20 shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">92%</p>
                    <p className="text-xs text-white/80">Completion</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-white/50 rounded-full"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Marquee Section */}
      <section className="py-16 border-y border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-8">
              {[
                'Mathematics Excellence',
                'English Mastery',
                'Science Innovation',
                'Tech Skills',
                'WAEC Preparation',
                'NECO Success',
                'Live Classes',
                'Expert Tutors',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span className="text-xl text-gray-300">{text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Features Section - Bento Grid */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white">
              Why Choose Us
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Everything You Need to
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Dominate Your Exams
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A comprehensive platform built for Nigerian students who refuse to settle for average
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Large Feature Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-2 lg:row-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-white/10 backdrop-blur-xl overflow-hidden group hover:border-blue-500/50 transition-all">
                <CardContent className="p-8 h-full flex flex-col justify-between">
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Live Interactive Classes</h3>
                    <p className="text-gray-400 text-lg mb-6">
                      Learn in real-time with expert instructors. Ask questions, collaborate with peers, 
                      and get instant feedback. Miss a class? Watch the recording anytime.
                    </p>
                  </div>
                  <div className="relative h-48 rounded-xl overflow-hidden">
                    <img 
                      src="https://images.unsplash.com/photo-1758270704534-fd9715bffc0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjbGFzc3Jvb20lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MzI1ODQ0NXww&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Live classes"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Smaller Feature Cards */}
            {[
              {
                icon: Brain,
                title: 'AI-Powered Learning',
                description: 'Personalized study paths that adapt to your pace',
                gradient: 'from-purple-500/10 to-pink-500/10',
                iconGradient: 'from-purple-500 to-pink-600'
              },
              {
                icon: Award,
                title: 'Track Progress',
                description: 'Real-time analytics of your performance',
                gradient: 'from-green-500/10 to-emerald-500/10',
                iconGradient: 'from-green-500 to-emerald-600'
              },
              {
                icon: Users,
                title: 'Expert Instructors',
                description: '150+ qualified teachers at your service',
                gradient: 'from-orange-500/10 to-red-500/10',
                iconGradient: 'from-orange-500 to-red-600'
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'Safe transactions with Paystack & Flutterwave',
                gradient: 'from-blue-500/10 to-cyan-500/10',
                iconGradient: 'from-blue-500 to-cyan-600'
              },
              {
                icon: Globe,
                title: 'Learn Anywhere',
                description: 'Access from any device, anytime',
                gradient: 'from-indigo-500/10 to-purple-500/10',
                iconGradient: 'from-indigo-500 to-purple-600'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized for speed and performance',
                gradient: 'from-yellow-500/10 to-orange-500/10',
                iconGradient: 'from-yellow-500 to-orange-600'
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className={`h-full bg-gradient-to-br ${feature.gradient} border-white/10 backdrop-blur-xl group hover:border-blue-500/50 transition-all`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
              Popular Categories
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Master Every Subject
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From Mathematics to Sciences, we've got you covered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Mathematics',
                courses: 45,
                students: '3.2K',
                image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80',
                gradient: 'from-blue-600 to-cyan-600',
                icon: BarChart
              },
              {
                title: 'English Language',
                courses: 38,
                students: '2.8K',
                image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80',
                gradient: 'from-purple-600 to-pink-600',
                icon: BookOpen
              },
              {
                title: 'Sciences',
                courses: 52,
                students: '2.5K',
                image: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&q=80',
                gradient: 'from-green-600 to-emerald-600',
                icon: Brain
              },
              {
                title: 'Computer Science',
                courses: 28,
                students: '1.9K',
                image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
                gradient: 'from-orange-600 to-red-600',
                icon: Code
              },
              {
                title: 'Commerce',
                courses: 25,
                students: '1.6K',
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
                gradient: 'from-indigo-600 to-purple-600',
                icon: TrendingUp
              },
              {
                title: 'All Subjects',
                courses: 200,
                students: '10K+',
                image: 'https://images.unsplash.com/photo-1703556311821-a4b69021b12f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjBpbm5vdmF0aW9ufGVufDF8fHx8MTc2MzM3NzY1OXww&ixlib=rb-4.1.0&q=80&w=1080',
                gradient: 'from-yellow-600 to-orange-600',
                icon: Sparkles
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden bg-black/40 border-white/10 backdrop-blur-xl hover:border-white/30 transition-all">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 mix-blend-multiply`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <category.icon className="w-16 h-16 text-white opacity-80" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{category.courses} courses</span>
                      <span>{category.students} students</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4 group-hover:bg-white/10"
                      onClick={onGetStarted}
                    >
                      Explore
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 border-0 text-white">
              Flexible Pricing
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Invest in Your Future
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose a plan that works for you. All plans include lifetime access.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '₦12,000',
                period: 'per course',
                description: 'Perfect for trying out',
                features: [
                  'Access to 1 course',
                  'Live & recorded classes',
                  'Basic assignments',
                  'Email support',
                  'Certificate',
                ],
                popular: false,
                gradient: 'from-gray-500/20 to-gray-600/20'
              },
              {
                name: 'Pro',
                price: '₦45,000',
                period: 'per term',
                description: 'Most popular choice',
                features: [
                  'Access to ALL courses',
                  'Live & recorded classes',
                  'All assignments & quizzes',
                  'Priority support',
                  'Analytics dashboard',
                  'Certificates',
                  'Study materials',
                ],
                popular: true,
                gradient: 'from-blue-500/20 to-purple-600/20'
              },
              {
                name: 'Elite',
                price: '₦120,000',
                period: 'per year',
                description: 'Ultimate success',
                features: [
                  'Everything in Pro',
                  'Save ₦15,000',
                  '1-on-1 tutoring',
                  'Personalized plan',
                  'Parent reports',
                  'Career guidance',
                  'VIP support',
                ],
                popular: false,
                gradient: 'from-yellow-500/20 to-orange-600/20'
              },
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white px-4 py-1">
                      🔥 Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`h-full bg-gradient-to-br ${plan.gradient} border-white/10 backdrop-blur-xl ${plan.popular ? 'border-blue-500/50 ring-2 ring-blue-500/20' : ''}`}>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                    <div className="mb-8">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                    <Button 
                      className={`w-full mb-8 h-12 ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                      onClick={onGetStarted}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <div className="space-y-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section id="success-stories" className="py-32 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-pink-500/5" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <Badge className="mb-4 bg-gradient-to-r from-pink-600 to-orange-600 border-0 text-white">
              Success Stories
            </Badge>
            <h2 className="text-5xl lg:text-6xl font-bold mb-6">
              Students Love Us
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of students who transformed their grades
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Chioma Okafor',
                class: 'SS3 Graduate',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma',
                text: 'I went from struggling with Math to scoring A1 in WAEC! The live classes and practice quizzes made all the difference. Best decision ever!',
                score: '8 A\'s',
                gradient: 'from-green-500/20 to-emerald-600/20'
              },
              {
                name: 'Tunde Adeleke',
                class: 'SS2 Student',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tunde',
                text: 'The instructors are incredible! They explain complex topics so clearly. My parents are amazed by my progress reports.',
                score: '95% Avg',
                gradient: 'from-blue-500/20 to-purple-600/20'
              },
              {
                name: 'Ngozi Eze',
                class: 'SS3 Graduate',
                image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ngozi',
                text: 'Thanks to My Tutor+, I got into my dream university! The platform is user-friendly and the support team is always there when you need them.',
                score: '9 A\'s',
                gradient: 'from-purple-500/20 to-pink-600/20'
              },
            ].map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className={`h-full bg-gradient-to-br ${story.gradient} border-white/10 backdrop-blur-xl hover:border-white/30 transition-all`}>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 leading-relaxed">"{story.text}"</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={story.image}
                          alt={story.name}
                          className="w-14 h-14 rounded-full border-2 border-white/20"
                        />
                        <div>
                          <p className="font-semibold">{story.name}</p>
                          <p className="text-sm text-gray-400">{story.class}</p>
                        </div>
                      </div>
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 border-0">
                        {story.score}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-30 absolute top-0 left-0" />
            <div className="w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-30 absolute bottom-0 right-0" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <Badge className="mb-6 bg-gradient-to-r from-yellow-600 to-orange-600 border-0 text-white text-lg px-6 py-2">
            🎓 Limited Time Offer
          </Badge>
          <h2 className="text-5xl lg:text-7xl font-bold mb-8">
            Your Success Story
            <span className="block bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Starts Today
            </span>
          </h2>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Join 10,000+ students who chose excellence. Start your free trial now and 
            see why we're Nigeria's #1 learning platform.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            <Button 
              size="lg"
              className="text-xl px-12 h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl shadow-blue-500/50 group"
              onClick={onGetStarted}
            >
              <Rocket className="w-6 h-6 mr-3 group-hover:animate-bounce" />
              Start Free Trial
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="text-xl px-12 h-16 border-white/30 hover:bg-white/10 backdrop-blur-xl"
            >
              <Phone className="w-6 h-6 mr-3" />
              Call Us: 0800 123 4567
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>14-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    My Tutor+
                  </span>
                  <p className="text-xs text-gray-400">Excellence in Education</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transforming education in Nigeria, one student at a time. 
                Join the revolution and unlock your full potential.
              </p>
              <div className="flex items-center gap-3">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full bg-white/5 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 flex items-center justify-center transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-3 text-sm">
                {['About', 'Courses', 'Instructors', 'Pricing', 'Blog'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-3 text-sm">
                {['Help Center', 'FAQs', 'Contact', 'Privacy', 'Terms'].map(item => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" />
                  <span>Lagos, Nigeria</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>0800 123 4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>hello@tutorplus.ng</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © 2024 My Tutor+. All rights reserved. Made with ❤️ in Nigeria 🇳🇬
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
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
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
