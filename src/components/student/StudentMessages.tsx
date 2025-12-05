import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  Phone,
  Video,
  Image as ImageIcon,
  Smile
} from 'lucide-react';
import { motion } from 'motion/react';
import { mockCourses, getEnrolledCourses } from '../../lib/mockData';

interface StudentMessagesProps {
  userId: string;
}

const mockInstructorConversations = [
  { 
    id: '1', 
    instructor: 'Dr. Adebayo Okonkwo', 
    course: 'Mathematics SS3',
    lastMessage: 'Great work on your last assignment! Keep it up.', 
    time: '10m ago', 
    unread: 0, 
    online: true 
  },
  { 
    id: '2', 
    instructor: 'Mrs. Chiamaka Nwosu', 
    course: 'English Literature',
    lastMessage: 'The essay deadline has been extended to Friday', 
    time: '1h ago', 
    unread: 2, 
    online: true 
  },
  { 
    id: '3', 
    instructor: 'Prof. Ibrahim Abdullahi', 
    course: 'Physics SS3',
    lastMessage: 'Please review chapter 5 before next class', 
    time: '3h ago', 
    unread: 0, 
    online: false 
  },
  { 
    id: '4', 
    instructor: 'Mr. Emeka Okafor', 
    course: 'Chemistry SS2',
    lastMessage: 'Your lab report was excellent!', 
    time: '1d ago', 
    unread: 0, 
    online: false 
  },
];

const mockInstructorMessages = [
  { 
    id: '1', 
    sender: 'student', 
    text: 'Good afternoon sir! I have a question about the quadratic equations homework.', 
    time: '2:30 PM',
    read: true 
  },
  { 
    id: '2', 
    sender: 'instructor', 
    text: 'Good afternoon! Of course, I\'m happy to help. What\'s your question?', 
    time: '2:32 PM',
    read: true 
  },
  { 
    id: '3', 
    sender: 'student', 
    text: 'I\'m having trouble with question 7. How do I find the roots when b² - 4ac is negative?', 
    time: '2:35 PM',
    read: true 
  },
  { 
    id: '4', 
    sender: 'instructor', 
    text: 'That\'s a great question! When the discriminant (b² - 4ac) is negative, we get complex roots. The roots will be in the form a ± bi, where i is the imaginary unit.', 
    time: '2:38 PM',
    read: true 
  },
  { 
    id: '5', 
    sender: 'instructor', 
    text: 'Would you like me to share a video explaining this concept? It might help clarify things.', 
    time: '2:39 PM',
    read: false 
  },
];

export function StudentMessages({ userId }: StudentMessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState(mockInstructorConversations[0]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = mockInstructorConversations.reduce((acc, conv) => acc + conv.unread, 0);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Toast or add message logic here
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">Messages</h1>
        <p className="text-muted-foreground">Communicate with your instructors</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            label: 'Total Conversations', 
            value: mockInstructorConversations.length, 
            icon: MessageSquare, 
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10'
          },
          { 
            label: 'Unread Messages', 
            value: unreadCount, 
            icon: Star, 
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10'
          },
          { 
            label: 'Active Chats', 
            value: mockInstructorConversations.filter(c => c.online).length, 
            icon: Video, 
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

      {/* Main Messages Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="dark:text-white">Instructors</CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-red-600 text-white border-0">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-white/5 dark:border-white/10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {mockInstructorConversations
                .filter(conv => 
                  conv.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  conv.course.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((conv, index) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (index * 0.05) }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`p-4 rounded-xl cursor-pointer transition-all ${
                      selectedConversation.id === conv.id
                        ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 border-2 border-blue-200 dark:border-blue-500/50'
                        : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border-2 border-transparent'
                    }`}
                    onClick={() => setSelectedConversation(conv)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {conv.instructor.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold dark:text-white truncate">{conv.instructor}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{conv.course}</p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">{conv.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge className="bg-blue-600 text-white border-0 w-6 h-6 rounded-full flex items-center justify-center p-0 flex-shrink-0">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Message Thread */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 h-[700px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b dark:border-white/10 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {selectedConversation.instructor.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold dark:text-white">{selectedConversation.instructor}</p>
                    <div className="flex items-center gap-2">
                      {selectedConversation.online && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="text-sm text-green-600 dark:text-green-400">Online</span>
                        </div>
                      )}
                      {!selectedConversation.online && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Offline</span>
                      )}
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{selectedConversation.course}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="dark:hover:bg-white/5">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="dark:hover:bg-white/5">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="dark:hover:bg-white/5">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="dark:hover:bg-white/5">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages Area */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Date Separator */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Today</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-white/10" />
              </div>

              {mockInstructorMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[75%] ${msg.sender === 'student' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {msg.sender === 'instructor' && (
                      <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs">
                          {selectedConversation.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          msg.sender === 'student'
                            ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-br-sm'
                            : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 px-1">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</span>
                        {msg.sender === 'student' && msg.read && (
                          <span className="text-xs text-blue-600 dark:text-blue-400">Read</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t dark:border-white/10 flex-shrink-0">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="dark:hover:bg-white/5"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="dark:hover:bg-white/5"
                >
                  <ImageIcon className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 dark:bg-white/5 dark:border-white/10"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="dark:hover:bg-white/5"
                >
                  <Smile className="w-4 h-4" />
                </Button>
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Press Enter to send • Shift + Enter for new line
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 dark:border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm dark:text-white mb-2">Messaging Tips</p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Be respectful and professional in all communications</li>
                  <li>• Clearly state your questions or concerns</li>
                  <li>• Include relevant course information for context</li>
                  <li>• Check for responses regularly</li>
                  <li>• Use proper grammar and complete sentences</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
