import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Calendar as CalendarIcon,
  Video,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface StudentScheduleProps {
  userId: string;
}

interface LiveSession {
  id: string;
  title: string;
  course_id: number;
  start_time: string;
  end_time: string;
  meeting_link: string | null;
  course?: {
    title: string;
  };
}

export function StudentSchedule({ userId }: StudentScheduleProps) {
  const [upcomingSessions, setUpcomingSessions] = useState<LiveSession[]>([]);
  const [pastSessions, setPastSessions] = useState<LiveSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const [upcomingRes, historyRes] = await Promise.all([
          axios.get('http://localhost:8000/api/live-classes/upcoming', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/live-classes/history', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUpcomingSessions(upcomingRes.data);
        setPastSessions(historyRes.data);
      } catch (error) {
        console.error('Failed to fetch schedule', error);
        toast.error('Failed to load schedule');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const handleJoinClass = async (session: LiveSession) => {
    if (!session.meeting_link) return;
    
    try {
        const token = localStorage.getItem('auth_token');
        await axios.post(`http://localhost:8000/api/live-classes/${session.id}/attendance`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success(`Joining ${session.title}...`, {
        description: 'Opening Google Meet in new tab',
        });
        window.open(session.meeting_link, '_blank');
    } catch (error) {
        console.error('Failed to mark attendance', error);
        // Still open link even if attendance fails
        window.open(session.meeting_link, '_blank');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading schedule...</div>;
  }

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
              const sessionDate = new Date(s.start_time);
              const weekFromNow = new Date();
              weekFromNow.setDate(weekFromNow.getDate() + 7);
              return sessionDate <= weekFromNow;
            }).length, 
            icon: Clock, 
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-500/10 to-pink-500/10'
          },
          { 
            label: 'Past Classes', 
            value: pastSessions.length, 
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
                  const isToday = new Date(session.start_time).toDateString() === new Date().toDateString();
                  const isSoon = new Date(session.start_time).getTime() - new Date().getTime() < 3600000; // Within 1 hour
                  
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
                                  {new Date(session.start_time).getDate()}
                                </p>
                                <p className="text-sm opacity-90">
                                  {new Date(session.start_time).toLocaleDateString('en-US', { month: 'short' })}
                                </p>
                              </div>
                              <div className="text-center md:mt-2">
                                <p className="text-lg font-semibold">
                                  {new Date(session.start_time).toLocaleTimeString('en-US', { 
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
                                  <h3 className="text-xl font-bold dark:text-white mb-1">{session.title}</h3>
                                  <p className="text-gray-600 dark:text-gray-400">{session.course?.title}</p>
                                </div>
                                {session.meeting_link && (
                                  <Button 
                                    onClick={() => handleJoinClass(session)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30"
                                  >
                                    Join Now
                                  </Button>
                                )}
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
            {pastSessions.map((session) => (
               <Card key={session.id} className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 opacity-75">
                 <CardContent className="p-6 flex items-center justify-between">
                   <div>
                     <h3 className="font-semibold dark:text-white">{session.title}</h3>
                     <p className="text-sm text-gray-500">{session.course?.title}</p>
                     <p className="text-sm text-gray-400 mt-1">
                       {new Date(session.start_time).toLocaleDateString()} at {new Date(session.start_time).toLocaleTimeString()}
                     </p>
                   </div>
                   <Badge variant="secondary">Completed</Badge>
                 </CardContent>
               </Card>
            ))}
            {pastSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">No past sessions found.</div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
