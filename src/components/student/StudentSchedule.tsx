import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  Users,
  ExternalLink,
  BookOpen,
  Bell,
  Download,
  CheckCircle,
  PlayCircle,
  MapPin
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { mockLiveSessions, mockCourses, getEnrolledCourses } from '../../lib/mockData';

interface StudentScheduleProps {
  userId: string;
}

export function StudentSchedule({ userId }: StudentScheduleProps) {
  const enrolledCourses = getEnrolledCourses(userId);
  const enrolledCourseIds = enrolledCourses.map(c => c.id);
  
  // Filter sessions for enrolled courses only
  const allSessions = mockLiveSessions.filter(session => 
    enrolledCourseIds.includes(session.courseId)
  );
  
  const upcomingSessions = allSessions.filter(s => new Date(s.scheduledAt) > new Date());
  const pastSessions = allSessions.filter(s => new Date(s.scheduledAt) <= new Date());

  const handleJoinClass = (meetingLink: string, title: string) => {
    toast.success(`Joining ${title}...`, {
      description: 'Opening Google Meet in new tab',
    });
    window.open(meetingLink, '_blank');
  };

  const handleSetReminder = (sessionTitle: string) => {
    toast.success('Reminder set!', {
      description: `You'll be notified before ${sessionTitle} starts`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">My Schedule</h1>
        <p className="text-muted-foreground">View your upcoming live classes and sessions</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Upcoming Classes', 
            value: upcomingSessions.length, 
            icon: CalendarIcon, 
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10'
          },
          { 
            label: 'This Week', 
            value: upcomingSessions.filter(s => {
              const sessionDate = new Date(s.scheduledAt);
              const weekFromNow = new Date();
              weekFromNow.setDate(weekFromNow.getDate() + 7);
              return sessionDate <= weekFromNow;
            }).length, 
            icon: Clock, 
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10'
          },
          { 
            label: 'Classes Attended', 
            value: pastSessions.filter(s => s.attendees.includes(userId)).length, 
            icon: CheckCircle, 
            gradient: 'from-green-500 to-emerald-500',
            bgGradient: 'from-green-500/10 to-emerald-500/10'
          },
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
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-3xl font-bold mb-1 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs for Upcoming/Past */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 dark:bg-white/5">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Sessions</TabsTrigger>
          </TabsList>

          {/* Upcoming Classes */}
          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingSessions.length === 0 ? (
              <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-500/10 dark:to-purple-500/10 flex items-center justify-center mx-auto mb-6">
                    <CalendarIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">No Upcoming Classes</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You don't have any scheduled live classes at the moment.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => {
                  const course = mockCourses.find(c => c.id === session.courseId);
                  const isToday = new Date(session.scheduledAt).toDateString() === new Date().toDateString();
                  const isSoon = new Date(session.scheduledAt).getTime() - new Date().getTime() < 3600000; // Within 1 hour
                  
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (index * 0.05) }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="overflow-hidden bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-0">
                          <div className="flex flex-col md:flex-row">
                            {/* Left: Date Badge */}
                            <div className={`w-full md:w-32 p-6 flex md:flex-col items-center justify-center gap-3 md:gap-2 ${
                              isToday 
                                ? 'bg-gradient-to-br from-red-500 to-pink-500' 
                                : 'bg-gradient-to-br from-blue-500 to-purple-600'
                            } text-white`}>
                              <div className="text-center">
                                <p className="text-3xl font-bold">
                                  {new Date(session.scheduledAt).getDate()}
                                </p>
                                <p className="text-sm opacity-90">
                                  {new Date(session.scheduledAt).toLocaleDateString('en-US', { month: 'short' })}
                                </p>
                              </div>
                              <div className="text-center md:mt-2">
                                <p className="text-lg font-semibold">
                                  {new Date(session.scheduledAt).toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </p>
                              </div>
                            </div>

                            {/* Right: Content */}
                            <div className="flex-1 p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    {isToday && (
                                      <Badge className="bg-red-600 text-white border-0 animate-pulse">
                                        TODAY
                                      </Badge>
                                    )}
                                    {isSoon && (
                                      <Badge className="bg-orange-600 text-white border-0 animate-pulse">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Starting Soon
                                      </Badge>
                                    )}
                                    <Badge variant="outline" className="bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30">
                                      <Video className="w-3 h-3 mr-1" />
                                      Live Class
                                    </Badge>
                                  </div>

                                  <h3 className="text-xl font-bold mb-2 dark:text-white">
                                    {session.title}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    <div className="flex items-center gap-1">
                                      <BookOpen className="w-4 h-4" />
                                      <span>{course?.title}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Users className="w-4 h-4" />
                                      <span>{session.attendees.length} students enrolled</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>Google Meet</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <Button 
                                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                      onClick={() => handleJoinClass(session.meetingLink, session.title)}
                                      disabled={!isSoon && !isToday}
                                    >
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      {isSoon ? 'Join Now' : 'Join Class'}
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleSetReminder(session.title)}
                                      className="dark:border-white/10"
                                    >
                                      <Bell className="w-4 h-4 mr-2" />
                                      Set Reminder
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      className="dark:border-white/10"
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Add to Calendar
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Past Sessions */}
          <TabsContent value="past" className="space-y-4 mt-6">
            {pastSessions.length === 0 ? (
              <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-500/10 dark:to-gray-600/10 flex items-center justify-center mx-auto mb-6">
                    <PlayCircle className="w-10 h-10 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">No Past Sessions</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your attended classes will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {pastSessions.map((session, index) => {
                  const course = mockCourses.find(c => c.id === session.courseId);
                  const attended = session.attendees.includes(userId);
                  
                  return (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 hover:shadow-lg transition-all">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <Badge 
                              variant="outline"
                              className={attended 
                                ? 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/30' 
                                : 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/30'
                              }
                            >
                              {attended ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Attended
                                </>
                              ) : (
                                'Missed'
                              )}
                            </Badge>
                          </div>

                          <h4 className="font-semibold mb-2 dark:text-white line-clamp-2">
                            {session.title}
                          </h4>

                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              <span className="line-clamp-1">{course?.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="w-4 h-4" />
                              <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(session.scheduledAt).toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}</span>
                            </div>
                          </div>

                          <Button 
                            variant="outline" 
                            size="sm"
                            className="w-full mt-4 dark:border-white/10"
                          >
                            <PlayCircle className="w-4 h-4 mr-2" />
                            View Recording
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 dark:border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm dark:text-white mb-2">Live Class Tips</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Join classes 5 minutes early to test your connection</li>
                  <li>• Keep your camera and microphone ready</li>
                  <li>• Have your course materials prepared</li>
                  <li>• Participate actively and ask questions</li>
                  <li>• Recordings will be available after the session</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
