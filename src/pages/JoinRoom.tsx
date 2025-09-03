import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Lock, Globe, AlertCircle, UserCheck } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getRoomByCode, getUserPublicById } from '@/data/mock-data';
import { Room } from '@/lib/socket-contract';

export default function JoinRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLookupRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode) return;
    
    setIsLoading(true);
    setError('');
    
    // Simulate room lookup
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const foundRoom = getRoomByCode(roomCode.toUpperCase());
    
    if (foundRoom) {
      setRoom(foundRoom);
    } else {
      setError('Room not found. Please check the code and try again.');
    }
    
    setIsLoading(false);
  };

  const handleJoinRoom = async () => {
    if (!room) return;
    
    setIsLoading(true);
    
    // Simulate joining room
    await new Promise(resolve => setTimeout(resolve, 500));
    
    toast({
      title: "Joined room!",
      description: `Welcome to ${room.name || `Room ${room.code}`}`,
    });
    
    navigate(`/room/${room.code}`);
  };

  const roomParticipants = room?.participants.map(id => getUserPublicById(id)).filter(Boolean) || [];

  return (
    <AppShell showSidebar={false}>
      <div className="h-full flex items-center justify-center p-6">
        <Card className="glass-panel max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Join Room</CardTitle>
            <CardDescription>
              Enter a room code to join an existing chat room
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Room Code Input */}
            <form onSubmit={handleLookupRoom} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-code">Room Code</Label>
                <Input
                  id="room-code"
                  type="text"
                  placeholder="Enter 6-character code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  className="bg-background/50 text-center text-lg font-mono tracking-wider"
                  maxLength={8}
                  required
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                type="submit" 
                className="w-full glass-button" 
                disabled={isLoading || !roomCode}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Look Up Room
              </Button>
            </form>

            {/* Room Preview */}
            {room && (
              <div className="space-y-4 p-4 bg-card/50 rounded-lg border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{room.name || `Room ${room.code}`}</h3>
                    <p className="text-sm text-muted-foreground">
                      Created by {getUserPublicById(room.createdBy)?.name || 'Unknown'}
                    </p>
                  </div>
                  <Badge variant={room.privacy === 'private' ? "destructive" : "secondary"}>
                    {room.privacy === 'private' ? (
                      <><Lock className="w-3 h-3 mr-1" /> Private</>
                    ) : (
                      <><Globe className="w-3 h-3 mr-1" /> Public</>
                    )}
                  </Badge>
                </div>

                {/* Participants Preview */}
                <div>
                  <Label className="text-sm text-muted-foreground">
                    Participants ({roomParticipants.length})
                  </Label>
                  <div className="flex items-center space-x-2 mt-2">
                    {roomParticipants.slice(0, 4).map((participant) => (
                      <Avatar key={participant.id} className="h-8 w-8">
                        <AvatarImage src={participant.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {participant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {roomParticipants.length > 4 && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">
                          +{roomParticipants.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Join Button */}
                <Button 
                  onClick={handleJoinRoom}
                  className="w-full neon-button"
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <UserCheck className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
              </div>
            )}

            {/* Quick Access */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Don't have a room code?</p>
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/create-room')}
                  className="glass-button"
                >
                  Create Room
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/')}
                  className="glass-button"
                >
                  Back Home
                </Button>
              </div>
            </div>

            {/* Demo Codes */}
            <div className="p-3 bg-secondary/10 rounded-lg border border-secondary/20">
              <p className="text-sm font-medium text-secondary mb-2">Try these demo codes:</p>
              <div className="flex flex-wrap gap-2">
                {['ABC123', 'XYZ789', 'DEF456'].map(code => (
                  <Button
                    key={code}
                    variant="ghost"
                    size="sm"
                    onClick={() => setRoomCode(code)}
                    className="h-6 px-2 text-xs font-mono bg-secondary/10 hover:bg-secondary/20"
                  >
                    {code}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}