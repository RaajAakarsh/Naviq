import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, Lock, Globe, Copy, Check, Sparkles } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { generateRoomCode, isGuestUser } from '@/data/mock-data';

export default function CreateRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [roomCreated, setRoomCreated] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [saveRoom, setSaveRoom] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate room creation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    setRoomCreated(true);
    setIsLoading(false);
    
    toast({
      title: "Room created!",
      description: `Your room code is ${newRoomCode}. Share it with others to invite them.`,
    });
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Room code copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the room code manually.",
        variant: "destructive",
      });
    }
  };

  const handleJoinRoom = () => {
    navigate(`/room/${roomCode}`);
  };

  const getRoomLink = () => {
    return `${window.location.origin}/room/${roomCode}`;
  };

  if (roomCreated) {
    return (
      <AppShell>
        <div className="h-full flex items-center justify-center p-6">
          <Card className="glass-panel max-w-md w-full">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-glow">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle>Room Created Successfully!</CardTitle>
              <CardDescription>
                Share this code with others to invite them to your room
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Room Code Display */}
              <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                <Label className="text-sm text-muted-foreground">Room Code</Label>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <span className="text-3xl font-mono font-bold text-primary tracking-wider">
                    {roomCode}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopyCode}
                    className="h-8 w-8 p-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-secondary" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Room Details */}
              <div className="space-y-3">
                {roomName && (
                  <div>
                    <Label className="text-sm text-muted-foreground">Room Name</Label>
                    <p className="font-medium">{roomName}</p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label className="text-sm text-muted-foreground">Privacy</Label>
                  <Badge variant={isPrivate ? "destructive" : "secondary"} className="flex items-center space-x-1">
                    {isPrivate ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                    <span>{isPrivate ? 'Private' : 'Public'}</span>
                  </Badge>
                </div>
                
                {user && !isGuestUser(user.id) && saveRoom && (
                  <div className="flex items-center justify-between">
                    <Label className="text-sm text-muted-foreground">Saved to your rooms</Label>
                    <Check className="w-4 h-4 text-secondary" />
                  </div>
                )}
              </div>

              {/* Share Link */}
              <div className="p-3 bg-card/50 rounded-lg border">
                <Label className="text-sm text-muted-foreground">Share Link</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    value={getRoomLink()}
                    readOnly
                    className="bg-transparent border-none p-0 text-sm"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(getRoomLink());
                      toast({ title: "Link copied!" });
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <Button onClick={handleJoinRoom} className="flex-1 neon-button">
                  <Users className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="glass-button"
                >
                  Back Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell showSidebar={false}>
      <div className="h-full flex items-center justify-center p-6">
        <Card className="glass-panel max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <CardTitle>Create New Room</CardTitle>
            <CardDescription>
              Set up your room and get a unique code to share with others
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleCreateRoom} className="space-y-6">
              {/* Room Name */}
              <div className="space-y-2">
                <Label htmlFor="room-name">Room Name (Optional)</Label>
                <Input
                  id="room-name"
                  type="text"
                  placeholder="Team Standup, Game Night, etc."
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              {/* Privacy Setting */}
              <div className="space-y-3">
                <Label>Privacy Settings</Label>
                <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    {isPrivate ? (
                      <Lock className="w-5 h-5 text-accent" />
                    ) : (
                      <Globe className="w-5 h-5 text-secondary" />
                    )}
                    <div>
                      <p className="font-medium text-sm">
                        {isPrivate ? 'Private Room' : 'Public Room'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isPrivate 
                          ? 'Only people with the code can join' 
                          : 'Discoverable by other users'
                        }
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                </div>
              </div>

              {/* Save Room Option (Logged-in users only) */}
              {user && !isGuestUser(user.id) && (
                <div className="space-y-3">
                  <Label>Room Options</Label>
                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border">
                    <div>
                      <p className="font-medium text-sm">Save to My Rooms</p>
                      <p className="text-xs text-muted-foreground">
                        Keep this room in your sidebar for quick access
                      </p>
                    </div>
                    <Switch
                      checked={saveRoom}
                      onCheckedChange={setSaveRoom}
                    />
                  </div>
                </div>
              )}

              {/* Guest Notice */}
              {user && isGuestUser(user.id) && (
                <Alert>
                  <AlertDescription className="text-sm">
                    You're creating a room as a guest. 
                    <Button variant="link" className="h-auto p-0 ml-1" onClick={() => navigate('/auth')}>
                      Sign in
                    </Button>
                    {' '}to save rooms and access more features.
                  </AlertDescription>
                </Alert>
              )}

              {/* Create Button */}
              <Button 
                type="submit" 
                className="w-full neon-button" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Room
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}