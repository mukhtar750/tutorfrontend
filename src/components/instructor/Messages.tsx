import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Archive
} from 'lucide-react';
import { motion } from 'motion/react';

const mockConversations = [
  { id: '1', student: 'Chioma Okafor', lastMessage: 'Thank you for the feedback on my assignment!', time: '10m ago', unread: 2, online: true },
  { id: '2', student: 'Tunde Adeleke', lastMessage: 'Could you explain question 5 from the quiz?', time: '1h ago', unread: 1, online: true },
  { id: '3', student: 'Ngozi Eze', lastMessage: 'When is the next live class?', time: '3h ago', unread: 0, online: false },
  { id: '4', student: 'Ibrahim Musa', lastMessage: 'I submitted my assignment', time: '1d ago', unread: 0, online: false },
];

const mockMessages = [
  { id: '1', sender: 'student', text: 'Good afternoon sir! I have a question about quadratic equations', time: '2:30 PM' },
  { id: '2', sender: 'instructor', text: 'Good afternoon! Sure, what would you like to know?', time: '2:32 PM' },
  { id: '3', sender: 'student', text: 'Could you explain how to find the roots when b² - 4ac is negative?', time: '2:35 PM' },
  { id: '4', sender: 'instructor', text: 'That\'s a great question! When the discriminant (b² - 4ac) is negative, we have complex roots...', time: '2:38 PM' },
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">Messages</h1>
        <p className="text-muted-foreground">Communicate with your students</p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
            <CardHeader>
              <CardTitle className="dark:text-white">Conversations</CardTitle>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-white/5 dark:border-white/10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
              {mockConversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedConversation.id === conv.id
                      ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 border-2 border-blue-200 dark:border-blue-500/50'
                      : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {conv.student.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold dark:text-white truncate">{conv.student}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{conv.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-blue-600 text-white border-0 w-6 h-6 rounded-full flex items-center justify-center p-0">
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
          className="lg:col-span-2"
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 h-[700px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b dark:border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {selectedConversation.student.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold dark:text-white">{selectedConversation.student}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedConversation.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Archive className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
              {mockMessages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex ${msg.sender === 'instructor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${msg.sender === 'instructor' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`p-4 rounded-2xl ${
                        msg.sender === 'instructor'
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                    <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${msg.sender === 'instructor' ? 'text-right' : 'text-left'}`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t dark:border-white/10">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="dark:border-white/10">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 dark:bg-white/5 dark:border-white/10"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      setMessage('');
                    }
                  }}
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
