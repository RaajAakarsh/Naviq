import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  MoreVertical, 
  Copy, 
  Heart, 
  HeartOff, 
  Video, 
  Users, 
  Lock, 
  Globe,
  Info,
  Settings,
  LogOut
} from 'lucide-react';
import { Room, UserPublic } from '@/lib/socket-contract';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { isGuestUser } from '@/data/mock-data';

interface RoomHeaderProps {
  room: Room;
  participants: UserPublic[];
}

export function RoomHeader({ room, participants }: RoomHeaderProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.code);
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

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/room/${room.code}`;
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link copied!",
        description: "Room link copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the room link manually.",
        variant: "destructive",
      });
    }
  };

  const handleSaveRoom = () => {
    if (user && isGuestUser(user.id)) {
      toast({
        title: "Sign in required",
        description: "Create an account to save rooms.",
        action: (
          <Button size="sm" onClick={() => navigate('/auth')}>
            Sign In
          </Button>
        ),
      });
      return;
    }

    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Room removed" : "Room saved",
      description: isSaved 
        ? "Room removed from your saved list." 
        : "Room added to your saved list.",
    });
  };

  const handleStartCall = () => {
    navigate(`/call?room=${room.code}`);
  };

  const handleLeaveRoom = () => {
    navigate('/');
    toast({
      title: "Left room",
      description: `You've left ${room.name || `Room ${room.code}`}`,
    });
  };

  return (
    <div className="border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between">
        {/* Room Info - Responsive */}
        <div className="flex items-center space-x-2 md:space-x-4 min-w-0 flex-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h1 className="text-lg md:text-xl font-semibold truncate">
                {room.name || `Room ${room.code}`}
              </h1>
              {!isMobile && (
                <Badge variant={room.privacy === 'private' ? "destructive" : "secondary"} className="text-xs flex-shrink-0">
                  {room.privacy === 'private' ? (
                    <><Lock className="w-3 h-3 mr-1" /> Private</>
                  ) : (
                    <><Globe className="w-3 h-3 mr-1" /> Public</>
                  )}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm text-muted-foreground">
              <span className="font-mono">{room.code}</span>
              {!isMobile && (
                <span className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {participants.length} participants
                </span>
              )}
              {isMobile && (
                <Badge variant={room.privacy === 'private' ? "destructive" : "secondary"} className="text-xs">
                  {room.privacy === 'private' ? 'Private' : 'Public'}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Actions - Responsive */}
        <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0 ml-2">
          {/* Mobile: Only essential buttons */}
          {isMobile ? (
            <>
              <Button size="sm" onClick={handleCopyCode} variant="outline" className="glass-button px-2">
                <Copy className="w-4 h-4" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-panel z-50 bg-background/95 backdrop-blur-sm">
                  <DropdownMenuItem onClick={handleStartCall}>
                    <Video className="w-4 h-4 mr-2" />
                    Start Call
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Room Link
                  </DropdownMenuItem>
                  
                  {user && !isGuestUser(user.id) && (
                    <DropdownMenuItem onClick={handleSaveRoom}>
                      {isSaved ? (
                        <><HeartOff className="w-4 h-4 mr-2" /> Remove from Saved</>
                      ) : (
                        <><Heart className="w-4 h-4 mr-2" /> Save Room</>
                      )}
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={() => setShowInfo(true)}>
                    <Info className="w-4 h-4 mr-2" />
                    Room Info
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLeaveRoom} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Room
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            /* Desktop: Full button layout */
            <>
              <Button size="sm" onClick={handleCopyCode} variant="outline" className="glass-button">
                <Copy className="w-4 h-4 mr-2" />
                Copy Code
              </Button>

              <Button size="sm" onClick={handleStartCall} className="neon-button">
                <Video className="w-4 h-4 mr-2" />
                Start Call
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-panel z-50 bg-background/95 backdrop-blur-sm">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Room Link
                  </DropdownMenuItem>
                  
                  {user && !isGuestUser(user.id) && (
                    <DropdownMenuItem onClick={handleSaveRoom}>
                      {isSaved ? (
                        <><HeartOff className="w-4 h-4 mr-2" /> Remove from Saved</>
                      ) : (
                        <><Heart className="w-4 h-4 mr-2" /> Save Room</>
                      )}
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={() => setShowInfo(true)}>
                    <Info className="w-4 h-4 mr-2" />
                    Room Info
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem onClick={handleLeaveRoom} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Room
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Room Info Dialog */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="glass-panel">
          <DialogHeader>
            <DialogTitle>Room Information</DialogTitle>
            <DialogDescription>
              Details about this chat room and its participants
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Room Code</p>
                <p className="font-mono text-lg">{room.code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Privacy</p>
                <Badge variant={room.privacy === 'private' ? "destructive" : "secondary"}>
                  {room.privacy}
                </Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Created</p>
              <p>{new Date(room.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-muted-foreground">Participants ({participants.length})</p>
              <div className="mt-2 space-y-1">
                {participants.map(participant => (
                  <div key={participant.id} className="text-sm">
                    {participant.name}
                    {participant.id === room.createdBy && (
                      <Badge variant="outline" className="ml-2 text-xs">Creator</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}