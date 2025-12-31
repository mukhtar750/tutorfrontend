import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
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
import { User } from '../../types';

interface MessagesProps {
  user: User;
  initialStudentId?: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  subject: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

export function Messages({ user, initialStudentId }: MessagesProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentMessages, setCurrentMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('http://localhost:8000/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
      processConversations(response.data);
    } catch (error) {
      console.error('Failed to fetch messages', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (initialStudentId && conversations.length > 0 && !selectedConversation) {
      const targetId = parseInt(initialStudentId);
      const conv = conversations.find(c => c.id === targetId);
      if (conv) {
        setSelectedConversation(conv);
      }
    }
  }, [initialStudentId, conversations]);

  useEffect(() => {
    if (selectedConversation) {
      const userId = Number(user.id);
      const conversationMessages = messages.filter(
        m => (m.sender_id === userId && m.receiver_id === selectedConversation.id) ||
             (m.sender_id === selectedConversation.id && m.receiver_id === userId)
      ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      
      setCurrentMessages(conversationMessages);
      scrollToBottom();
      
      // Mark as read
      const unreadIds = conversationMessages
        .filter(m => m.sender_id === selectedConversation.id && !m.is_read)
        .map(m => m.id);
        
      if (unreadIds.length > 0) {
        markAsRead(unreadIds[0]); 
        unreadIds.forEach(id => markAsRead(id));
      }
    }
  }, [selectedConversation, messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const processConversations = (msgs: Message[]) => {
    const userId = Number(user.id);
    const convMap = new Map<number, Conversation>();

    msgs.forEach(msg => {
      const isMe = msg.sender_id === userId;
      const otherUser = isMe ? msg.receiver : msg.sender;
      const otherId = Number(otherUser.id);

      if (!convMap.has(otherId)) {
        convMap.set(otherId, {
          id: otherId,
          name: otherUser.name,
          lastMessage: msg.content,
          time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: 0,
          online: false
        });
      }

      if (!isMe && !msg.is_read) {
        const conv = convMap.get(otherId)!;
        conv.unread += 1;
      }
    });

    setConversations(Array.from(convMap.values()));
    
    // Select first conversation if none selected AND no initialStudentId
    if (!selectedConversation && convMap.size > 0 && !initialStudentId) {
      setSelectedConversation(convMap.values().next().value);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(`http://localhost:8000/api/messages/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to mark message as read', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.post('http://localhost:8000/api/messages', {
        receiver_id: selectedConversation.id,
        subject: 'Message', // Default subject
        content: messageText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Add new message to state immediately
      const newMessage = response.data;
      setMessages(prev => [newMessage, ...prev]);
      setMessageText('');
      scrollToBottom();
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Failed to send message');
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
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  No conversations yet
                </div>
              ) : (
                conversations.map((conv, index) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedConversation?.id === conv.id
                      ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-500/20 dark:to-purple-500/20 border-2 border-blue-200 dark:border-blue-500/50'
                      : 'bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10'
                  }`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {conv.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold dark:text-white truncate">{conv.name}</p>
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
              )))}
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
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b dark:border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {selectedConversation.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold dark:text-white">{selectedConversation.name}</p>
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
                  {currentMessages.map((msg, index) => {
                    const isMe = msg.sender_id === Number(user.id);
                    return (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-4 rounded-2xl ${
                              isMe
                                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                                : 'bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                          </div>
                          <p className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  <div ref={scrollRef} />
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t dark:border-white/10">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="dark:border-white/10">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="flex-1 dark:bg-white/5 dark:border-white/10"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
