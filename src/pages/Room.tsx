import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppShell } from '@/components/AppShell';
import { ChatWindow } from '@/components/ChatWindow';
import { ParticipantsList } from '@/components/ParticipantsList';
import { RoomHeader } from '@/components/RoomHeader';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Loader2, AlertCircle, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { getRoomByCode, getMessagesByRoomId, getUserPublicById } from '@/data/mock-data';
import { Room as RoomType, Message, UserPublic } from '@/lib/socket-contract';

export default function Room() {
  const { code } = useParams<{ code: string }>();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<UserPublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showParticipants, setShowParticipants] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!code) {
      setError('No room code provided');
      setIsLoading(false);
      return;
    }

    const loadRoom = async () => {
      setIsLoading(true);
      
      // Simulate loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundRoom = getRoomByCode(code.toUpperCase());
      
      if (!foundRoom) {
        setError('Room not found. The room may have been deleted or the code is incorrect.');
        setIsLoading(false);
        return;
      }

      // Load room data
      setRoom(foundRoom);
      setMessages(getMessagesByRoomId(foundRoom.id));
      
      // Load participants
      const roomParticipants = foundRoom.participants
        .map(id => getUserPublicById(id))
        .filter(Boolean) as UserPublic[];
      setParticipants(roomParticipants);
      
      setIsLoading(false);
      
      toast({
        title: "Joined room",
        description: `Welcome to ${foundRoom.name || `Room ${foundRoom.code}`}`,
      });
    };

    loadRoom();
  }, [code, toast]);

  if (isLoading) {
    return (
      <AppShell showSidebar={false}>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading room...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (error || !room) {
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
              <Button onClick={() => navigate('/join-room')} variant="outline" className="flex-1">
                Try Another Code
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
        {/* Room Header with mobile participants trigger */}
        <div className="relative">
          <RoomHeader room={room} participants={participants} />
          
          {/* Mobile Participants Trigger */}
          {isMobile && (
            <Sheet open={showParticipants} onOpenChange={setShowParticipants}>
              <SheetTrigger asChild>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="absolute top-4 right-4 glass-button md:hidden"
                >
                  <Users className="w-4 h-4 mr-2" />
                  {participants.length}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <ParticipantsList 
                  participants={participants} 
                  room={room}
                  currentUser={user}
                />
              </SheetContent>
            </Sheet>
          )}
        </div>
        
        {/* Main Chat Area - Responsive Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Window - Always visible, takes full width on mobile */}
          <div className="flex-1 flex flex-col min-w-0">
            <ChatWindow 
              room={room} 
              messages={messages} 
              onSendMessage={(message) => {
                // Optimistic UI update
                const newMessage: Message = {
                  id: `temp_${Date.now()}`,
                  roomId: room.id,
                  from: user?.id || 'temp_user',
                  text: message.text,
                  createdAt: new Date().toISOString(),
                  readBy: [user?.id || 'temp_user'],
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
              }}
            />
          </div>
          
          {/* Desktop Participants Sidebar - Hidden on mobile */}
          {!isMobile && (
            <div className="w-80 border-l border-border bg-card/30 flex-shrink-0">
              <ParticipantsList 
                participants={participants} 
                room={room}
                currentUser={user}
              />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}