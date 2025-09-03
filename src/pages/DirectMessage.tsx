import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ChatWindow } from '@/components/ChatWindow';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  AlertCircle, 
  Phone, 
  Video, 
  MoreVertical,
  ArrowLeft,
  Clock
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getUserPublicById, getDirectMessages } from '@/data/mock-data';
import { Room as RoomType, Message, UserPublic } from '@/lib/socket-contract';
import { formatDistanceToNow } from 'date-fns';

export default function DirectMessage() {
  const { userId } = useParams<{ userId: string }>();
  const [otherUser, setOtherUser] = useState<UserPublic | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

// Create a virtual room for the direct message
  const virtualRoom: RoomType = {
    id: `dm_${user?.id || 'demo'}_${userId}`,
    code: 'DIRECT', 
    name: `Direct Message`,
    privacy: 'private',
    createdBy: user?.id || 'demo',
    createdAt: new Date().toISOString(),
    participants: [user?.id || 'demo', userId || ''],
    maxParticipants: 2,
    lastActivity: new Date().toISOString(),
  };

  useEffect(() => {
    // Skip validation for demo purposes - just load the user
    if (!userId) {
      setError('Invalid user ID');
      setIsLoading(false);
      return;
    }

    const loadDirectMessage = async () => {
      setIsLoading(true);
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const foundUser = getUserPublicById(userId);
      
      if (!foundUser) {
        setError('User not found.');
        setIsLoading(false);
        return;
      }

      // Skip self-check for demo
      setOtherUser(foundUser);
      
      // Filter messages for this direct conversation using the helper function
      const directMessages = getDirectMessages(user?.id || 'demo', userId);
      
      console.log('Loading messages for:', user?.id || 'demo', 'and', userId);
      console.log('Found messages:', directMessages.length);
      console.log('Messages:', directMessages);
      
      setMessages(directMessages);
      setIsLoading(false);
      
      toast({
        title: "Direct message opened",
        description: `Chatting with ${foundUser.name}`,
      });
    };

    loadDirectMessage();
  }, [userId, user, toast]);

  const handleCall = () => {
    navigate(`/call/direct/${userId}`);
  };

  const handleVideoCall = () => {
    navigate(`/call/direct/${userId}?video=true`);
  };

  if (isLoading) {
    return (
      <AppShell showSidebar={false}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading conversation...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !otherUser) {
    return (
      <AppShell showSidebar={false}>
        <div className="h-full flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="mb-4">
                {error}
              </AlertDescription>
            </Alert>
            <div className="flex space-x-3 mt-4">
              <Button onClick={() => navigate('/users')} variant="outline" className="flex-1">
                Back to Users
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1">
                Back Home
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="h-full flex flex-col">
        {/* Direct Message Header */}
        <Card className="glass-card rounded-none border-x-0 border-t-0">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/users')}
                  className="p-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherUser.avatarUrl} />
                  <AvatarFallback>
                    {otherUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{otherUser.name}</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${otherUser.isOnline ? 'bg-secondary' : 'bg-muted-foreground'}`} />
                    <span className="text-sm text-muted-foreground">
                      {otherUser.isOnline ? 'Online' : `Last active ${otherUser.lastActive ? formatDistanceToNow(new Date(otherUser.lastActive)) : 'recently'} ago`}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  className="glass-button"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVideoCall}
                  className="glass-button"
                >
                  <Video className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="glass-button"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        {/* Chat Area */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col">
            <ChatWindow 
              room={virtualRoom} 
              messages={messages} 
              onSendMessage={(message) => {
                // Optimistic UI update for direct messages
                const newMessage: Message = {
                  id: `temp_${Date.now()}`,
                  roomId: virtualRoom.id,
                  from: user?.id || 'demo',
                  text: message.text,
                  createdAt: new Date().toISOString(),
                  readBy: [user?.id || 'demo'],
                };
                
                // Add file if present
                if (message.file) {
                  newMessage.file = {
                    id: `file_${Date.now()}`,
                    name: message.file.name,
                    size: message.file.size,
                    mime: message.file.type,
                    storagePath: `files/${message.file.name}`,
                    downloadUrl: URL.createObjectURL(message.file),
                  };
                }
                
                setMessages(prev => [...prev, newMessage]);
                
                toast({
                  title: "Message sent",
                  description: "Your message has been delivered.",
                });
              }}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}