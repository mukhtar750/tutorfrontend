import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import {
  MessageSquare,
  Search,
  Send,
  Video,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface StudentMessagesProps {
  userId: string;
}

interface User {
  id: number;
  name: string;
  avatar: string | null;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  subject: string;
  content: string;
  read_at: string | null;
  created_at: string;
  sender: User;
  receiver: User;
}

interface Conversation {
  otherUser: User;
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
}

export function StudentMessages({ userId }: StudentMessagesProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await axios.get('http://localhost:8000/api/messages', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const messages: Message[] = response.data;
      const grouped = new Map<number, Conversation>();
      const currentUserId = parseInt(userId);

      messages.forEach(msg => {
        const otherUser = msg.sender_id === currentUserId ? msg.receiver : msg.sender;
        const otherUserId = otherUser.id;

        if (!grouped.has(otherUserId)) {
          grouped.set(otherUserId, {
            otherUser,
            messages: [],
            lastMessage: msg,
            unreadCount: 0
          });
        }

        const conv = grouped.get(otherUserId)!;
        conv.messages.push(msg);
        
        // Update last message if this one is newer
        if (new Date(msg.created_at) > new Date(conv.lastMessage.created_at)) {
            conv.lastMessage = msg;
        }

        if (msg.receiver_id === currentUserId && !msg.read_at) {
          conv.unreadCount++;
        }
      });

      const sortedConversations = Array.from(grouped.values()).sort((a, b) => 
        new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
      );

      setConversations(sortedConversations);
      
      // Select first conversation if none selected
      if (!selectedConversation && sortedConversations.length > 0) {
        setSelectedConversation(sortedConversations[0]);
      } else if (selectedConversation) {
          // Update selected conversation with new data
          const updated = sortedConversations.find(c => c.otherUser.id === selectedConversation.otherUser.id);
          if (updated) setSelectedConversation(updated);
      }

    } catch (error) {
      console.error('Failed to fetch messages', error);
      toast.error('Failed to load messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('http://localhost:8000/api/messages', {
        receiver_id: selectedConversation.otherUser.id,
        subject: 'Message', // Default subject
        content: messageText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessageText('');
      fetchMessages(); // Refresh messages
      toast.success('Message sent');
    } catch (error) {
      console.error('Failed to send message', error);
      toast.error('Failed to send message');
    }
  };

  const markAsRead = async (messageId: number) => {
      try {
        const token = localStorage.getItem('auth_token');
        await axios.post(`http://localhost:8000/api/messages/${messageId}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // We could optimistically update UI here, but fetching messages handles it
        fetchMessages();
      } catch (error) {
          console.error('Failed to mark as read', error);
      }
  };

  // Mark visible unread messages as read when viewing conversation
  useEffect(() => {
      if (selectedConversation) {
          const unreadMessages = selectedConversation.messages.filter(
              m => m.receiver_id === parseInt(userId) && !m.read_at
          );
          unreadMessages.forEach(m => markAsRead(m.id));
      }
  }, [selectedConversation, userId]);


  const totalUnread = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const filteredConversations = conversations.filter(c => 
    c.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center">Loading messages...</div>;
  }

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
            value: conversations.length, 
            icon: MessageSquare, 
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10'
          },
          { 
            label: 'Unread Messages', 
            value: totalUnread, 
            icon: Star, 
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10'
          },
          { 
            label: 'Active Chats', 
            value: conversations.length, // Simplified for now
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
      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <Card className="h-full bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="dark:text-white">Conversations</CardTitle>
                {totalUnread > 0 && (
                  <Badge className="bg-red-600 text-white border-0">
                    {totalUnread} new
                  </Badge>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-white/5 dark:border-white/10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.otherUser.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      selectedConversation?.otherUser.id === conv.otherUser.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>{getInitials(conv.otherUser.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={`font-medium truncate ${selectedConversation?.otherUser.id === conv.otherUser.id ? 'text-blue-700 dark:text-blue-300' : 'dark:text-white'}`}>
                            {conv.otherUser.name}
                          </h4>
                          <span className="text-xs text-gray-400">
                            {new Date(conv.lastMessage.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${conv.unreadCount > 0 ? 'font-semibold text-gray-900 dark:text-gray-100' : 'text-gray-500'}`}>
                          {conv.lastMessage.sender_id === parseInt(userId) ? 'You: ' : ''}{conv.lastMessage.content}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                      )}
                    </div>
                  </div>
                ))}
                {filteredConversations.length === 0 && (
                    <div className="p-4 text-center text-gray-500">
                        No conversations found.
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Window */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="h-full bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{getInitials(selectedConversation.otherUser.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold dark:text-white">{selectedConversation.otherUser.name}</h3>
                      <p className="text-xs text-gray-500">Online</p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((msg) => {
                    const isMe = msg.sender_id === parseInt(userId);
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl p-4 ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 dark:bg-white/5 dark:border-white/10"
                    />
                    <Button 
                        onClick={handleSendMessage} 
                        disabled={!messageText.trim()}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
